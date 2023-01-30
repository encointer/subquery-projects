# SubQuery - Starter Package

The Starter Package is an example that you can use as a starting point for developing your SubQuery project.
A SubQuery package defines which data The SubQuery will index from the Substrate blockchain, and how it will store it.

## Preparation

#### Environment

- [Typescript](https://www.typescriptlang.org/) are required to compile project and define types.

- Both SubQuery CLI and generated Project have dependencies and require [Node](https://nodejs.org/en/).

#### Install the SubQuery CLI

Install SubQuery CLI globally on your terminal by using NPM:

```
npm install -g @subql/cli
```

Run help to see available commands and usage provide by CLI

```
subql help
```

## Initialize the starter package

Inside the directory in which you want to create the SubQuery project, simply replace `project-name` with your project name and run the command:

```
subql init --starter project-name
```

Then you should see a folder with your project name has been created inside the directory, you can use this as the start point of your project. And the files should be identical as in the [Directory Structure](https://doc.subquery.network/directory_structure.html).

Last, under the project directory, run following command to install all the dependency.

```
yarn install
```

## Configure your project

In the starter package, we have provided a simple example of project configuration. You will be mainly working on the following files:

- The Manifest in `project.yaml`
- The GraphQL Schema in `schema.graphql`
- The Mapping functions in `src/mappings/` directory

For more information on how to write the SubQuery,
check out our doc section on [Define the SubQuery](https://doc.subquery.network/define_a_subquery.html)

#### Code generation

In order to index your SubQuery project, it is mandatory to build your project first.
Run this command under the project directory.

```
yarn codegen
```

## Build the project

In order to deploy your SubQuery project to our hosted service, it is mandatory to pack your configuration before upload.
Run pack command from root directory of your project will automatically generate a `your-project-name.tgz` file.

```
yarn build
```

## Indexing and Query

#### Run required systems in docker

Under the project directory run following command:

```
docker-compose pull && docker-compose up
```

#### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.

For the `subql-starter` project, you can try to query with the following code to get a taste of how it works.

```graphql
{
  query {
    starterEntities(first: 10) {
      nodes {
        field1
        field2
        field3
      }
    }
  }
}
```


# Encointer specific setup

We built an extension to the subquery service that automatically created graphQL types and mapping handlers for all encointer events.
The graphQL types will look as follows:
```
type Transferred @entity {
        id: ID!
        blockHeight: BigInt! @index
        timestamp: BigInt! @index
        arg0: String! @index
        arg1: String! @index
        arg2: String! @index
        arg3: Float!
}
```

Where `arg0, arg1..` are simply the values of the arguments of the event.
There are no extra steps that need to be taken in order to generate those types. It is inclused in the `yarn codegen` command.


## Configuration
There is some extra configuration than can be made when generating the graphQL schema.

### Type conversions
Per default the arguments of the event will simply be parsed to a string using the `.toString()` method. Should there be a need to do some extra conversion between a Substrate type and the corresponding graphQL type this conversion can be defined in `src/codeGen/typeConversions.ts` by adding an entry to the `conversions` object, like in the example below

```
const conversions = {
    CommunityIdentifier: {
        graphQlTypeName: "String",
        convert: (input) => {
            let inp = input.toHuman();
            const geohash = inp["geohash"];
            const digest = inp["digest"];
            let buffer;
            if (digest.startsWith("0x")) {
                buffer = Buffer.from(input.toHuman()["digest"].slice(2), "hex");
            } else {
                buffer = Buffer.from(input.toHuman()["digest"], "utf-8");
            }

            return geohash + bs58.encode(Uint8Array.from(buffer));
        },
    },
};
```

The above example defines a conversion from the Encointer type `CommunityIdentifier` to the graphQL type `String` using a conversion function pasring the cid and converting to Encointer's custom Base58 cid format.

### Indexed types

In `src/codeGen/config.ts` there is a `indexedTypes` array. Event arguments of types that are contained in this array will receive an `@index` in the corresponding GraphQl schema for faster queries. For example `T::AccountId` is contained in the array, because we need to be able to effiecliently run queries like finding all transactions of a specific account. 


### shortEventNameMap
Also in `src/codeGen/config.ts` there is an object called `shortEventNameMap`. This is to map long event names to shorter ones as unfortunately in Postgres the length of a relation name is limited to 63 chars and with long event names this limit will be exeeded for constraint names, leading to trunctation of the relation name, which will lead to errors about duplicate relation names.