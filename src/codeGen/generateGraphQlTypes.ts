import { ApiPromise, WsProvider } from "@polkadot/api";
const encointer_rpc_endpoint = "wss://kusama.api.encointer.org";

import {
    generateGraphQlEntityName,
    getGraphQlFieldNames,
    getGraphQlFieldTypes,
    getTypeNames,
    getTypeVariants,
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

function generateGraphQlBlockCode() {
    return `type SpecVersion @entity {
        id: ID! #specVersion
        blockHeight: BigInt!
}
      
type Block @entity {
        id: ID!
        blockHeight: BigInt!
        timestamp: BigInt!
        cindex: Int!
        phase: String!
        nextPhaseTimestamp: BigInt!
        reputationLifetime: Int!
}`;
}

function generateGraphQlCode(api) {
    let codeParts = [];
    let pallets = api.runtimeMetadata.asV14.pallets;
    codeParts.push(generateGraphQlBlockCode());
    for (let pallet of pallets) {
        if (!pallet.name.toHuman().startsWith("Encointer")) continue;
        let events = getTypeVariants(api, pallet.events.toHuman()?.type);
        if (!events) continue;
        for (const event of events) {
            codeParts.push(
                generateGraphQlEventCode(pallet.name.toHuman(), event)
            );
        }
    }
    return codeParts.join("\n\n");
}

ApiPromise.create({ provider: wsProvider }).then(async (api) => {
    const code = generateGraphQlCode(api);
    fs.writeFileSync("schema.graphql", code);
    process.exit(0);
});
