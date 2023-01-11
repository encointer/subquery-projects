import { ApiPromise, WsProvider } from "@polkadot/api";
const encointer_rpc_endpoint = "wss://kusama.api.encointer.org";

import { formatTypeName, generateGraphQlEntityName, getFieldTypeNames, getGraphQlFieldTypes, getTypeVariants } from "./util";
import { getTypeConversion } from "./typeConversions";
import fs from 'fs'

const wsProvider = new WsProvider(encointer_rpc_endpoint);

// function formatTypeName(typeName) {
//     return typeName.replace(/[\W_]+/g, "");
// }

function generateGraphQlEventCode(pallet, eventType) {
    const typeName = generateGraphQlEntityName(pallet, eventType.name);
    let fields = getFieldTypeNames(eventType);
    let graphQlFieldTypes = getGraphQlFieldTypes(eventType);
    // TODO add indices for certain fields only
    const args = fields.map(
        (field, idx) => `        ${field}: ${graphQlFieldTypes[idx]}!`
    );
    const argString = args.join("\n");

    const code = `type ${typeName} @entity {
        id: ID!
        blockHeight: BigInt!
        timestamp: BigInt!
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
}`
}

function generateGraphQlCode(api) {
    let codeParts = []
    let pallets = api.runtimeMetadata.asV14.pallets;
    codeParts.push(generateGraphQlBlockCode())
    for (let pallet of pallets) {
        let events = getTypeVariants(api, pallet.events.toHuman()?.type);
        if (!events) continue;
        for (const event of events) {
            console.log(event.fields)
            codeParts.push(
                generateGraphQlEventCode(pallet.name.toHuman(), event)
            );
        }
    }
    return codeParts.join("\n\n")
}

ApiPromise.create({ provider: wsProvider }).then(async (api) => {
    const code = generateGraphQlCode(api);
    fs.writeFileSync('schema.graphql', code);
});
