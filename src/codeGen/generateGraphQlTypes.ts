import { ApiPromise, WsProvider } from "@polkadot/api";
const encointer_rpc_endpoint = "wss://kusama.api.encointer.org";

import {
    generateGraphQlEntityName,
    getGraphQlFieldNames,
    getGraphQlFieldTypes,
    getTypeNames,
    getTypeVariants,
    formatExtrinsicTypeName,
} from "./util";
import fs from "fs";
import { indexedTypes } from "./config";

const wsProvider = new WsProvider(encointer_rpc_endpoint);

function generateGraphQlEventCode(pallet, eventType) {
    const typeName = generateGraphQlEntityName(pallet, eventType.name);
    let types = getTypeNames(eventType);
    let graphQlFieldTypes = getGraphQlFieldTypes(eventType);
    let fields = getGraphQlFieldNames(eventType);

    const args = fields.map((field, idx) => {
        let argCode = `        ${field}: ${graphQlFieldTypes[idx]}!`;
        if (indexedTypes.includes(types[idx])) argCode += " @index";
        return argCode;
    });
    const argString = args.join("\n");

    const code = `type ${typeName} @entity {
        id: ID!
        blockHeight: BigInt! @index
        timestamp: BigInt! @index
${argString}
}`;
    return code;
}

function generateGraphQlExtrinsicCode(pallet, extrinsicName) {
    const typeName = generateGraphQlEntityName(pallet, formatExtrinsicTypeName(extrinsicName.name));
    let types = getTypeNames(extrinsicName);
    let graphQlFieldTypes = getGraphQlFieldTypes(extrinsicName);
    let fields = getGraphQlFieldNames(extrinsicName);

    const args = fields.map((field, idx) => {
        let argCode = `        ${field}: ${graphQlFieldTypes[idx]}`;
        if (indexedTypes.includes(types[idx])) argCode += " @index";
        return argCode;
    });
    const argString = args.join("\n");

    const code = `type ${typeName} @entity {
        id: ID!
        blockHeight: BigInt! @index
        timestamp: BigInt! @index
${argString}
}`;
    return code;
}

function generateGraphQlBlockCode() {
    return `type SpecVersion @entity {
        id: ID! #specVersion
        blockHeight: BigInt!
}
      
type Block @entity {
        id: ID!
        blockHeight: BigInt! @index
        timestamp: BigInt! @index
        cindex: Int!
        phase: String!
        nextPhaseTimestamp: BigInt!
        reputationLifetime: Int!
}`;
}

function generateGraphQlCode(api) {
    let codeParts = [];
    let pallets = api.runtimeMetadata.asV14.pallets;




    let extrinsics = getTypeVariants(
        api,
        pallets.find((e) => e.name.eq('EncointerCeremonies')).calls.toJSON()[
            "type"
        ]
    );

    console.log(extrinsics)


    codeParts.push(generateGraphQlBlockCode());
    for (let pallet of pallets) {
        if (
            !(
                pallet.name.toHuman().startsWith("Encointer") ||
                pallet.name.toHuman() === "PolkadotXcm"
            )
        )
            continue;
        let events = getTypeVariants(api, pallet.events.toHuman()?.type);
        if (events) {
            for (const event of events) {
                codeParts.push(
                    generateGraphQlEventCode(pallet.name.toHuman(), event)
                );
            }
        }
        let extrinsics = getTypeVariants(
            api,
            pallet.calls.toHuman()?.type
        );
        if (extrinsics) {
            for (const extrinsic of extrinsics) {
                codeParts.push(
                    generateGraphQlExtrinsicCode(pallet.name.toHuman(), extrinsic)
                );
            }
        }
    }
    return codeParts.join("\n\n");
}

ApiPromise.create({ provider: wsProvider }).then(async (api) => {
    const code = generateGraphQlCode(api);
    fs.writeFileSync("schema.graphql", code);
    process.exit(0);
});
