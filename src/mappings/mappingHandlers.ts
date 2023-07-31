import { SubstrateBlock } from "@subql/types";
import * as types from "../types";
import {
    generateGraphQlEntityName,
    getFieldTypeConversionFunctions,
    getGraphQlFieldNames,
    getTypeVariants,
    inspect,
} from "../codeGen/util";


import { addFakeEvents } from "./additionalData/fakeEvents";

let specVersion: types.SpecVersion;

let metadata;


async function handleEvent(evt, idx, blockEntity, metadata) {
    let event = evt.event;

    let section =
        event.section.charAt(0).toUpperCase() + event.section.slice(1);

    if (!section.startsWith("Encointer")) return;

    // exclude rescue events
    if ([BigInt(818393), BigInt(1063138)].includes(blockEntity.blockHeight)) return;

    // get event typename
    const eventEntityName = generateGraphQlEntityName(section, event.method);

    let record = new types[eventEntityName](
        `${blockEntity.blockHeight.toString()}-${idx}`
    );

    record.blockHeight = blockEntity.blockHeight;
    record.timestamp = blockEntity.timestamp;

    let events = getTypeVariants(
        api,
        metadata.asV14.pallets.find((e) => e.name.eq(section)).events.toJSON()[
            "type"
        ]
    );
    let eventType = events.find((e) => e.name == event.method);
    const fields = getGraphQlFieldNames(eventType);

    // get conversion functions
    const conversions = getFieldTypeConversionFunctions(eventType);

    // record[typename] = convert(event.event.data[i]);
    for (let i = 0; i < fields.length; i++) {
        record[fields[i]] = conversions[i](event.data[i]);
    }
    await record.save();
}

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    if(!metadata){
        // first block after startup
        metadata = await api.rpc.state.getMetadata();
        // remove rescue events that were wrongly added
        store.remove('RewardsIssued', '818393-1')
        store.remove('RewardsIssued', '1063138-1')
    }
    // Initialise Spec Version
    if (!specVersion) {
        specVersion = await types.SpecVersion.get(block.specVersion.toString());
    }

    // Check for updates to Spec Version
    if (!specVersion || specVersion.id !== block.specVersion.toString()) {
        specVersion = new types.SpecVersion(block.specVersion.toString());
        specVersion.blockHeight = block.block.header.number.toBigInt();
        await specVersion.save();
    }

    const blockHash = block.block.header.hash.toString()
    // create block instance
    let blockEntity = new types.Block(blockHash);
    blockEntity.blockHeight = block.block.header.number.toBigInt();

    // in startblock, add fake data
    if(blockEntity.blockHeight == BigInt(508439)){
        addFakeEvents(api);
    }


    let [cindex, phase, nextPhaseTimestamp, reputationLifetime] = await api.queryMulti([
        [api.query.encointerScheduler.currentCeremonyIndex],
        [api.query.encointerScheduler.currentPhase],
        [api.query.encointerScheduler.nextPhaseTimestamp],
        [api.query.encointerCeremonies.reputationLifetime],
    ]);
    blockEntity.cindex = parseInt(cindex.toString());
    blockEntity.phase = phase.toString();
    blockEntity.nextPhaseTimestamp = BigInt(nextPhaseTimestamp.toString());
    blockEntity.reputationLifetime = parseInt(reputationLifetime.toString());


    for (const extrinsic of block.block.extrinsics) {
        if (
            extrinsic.method.section == "timestamp" &&
            extrinsic.method.method == "set"
        ) {
            blockEntity.timestamp = BigInt(extrinsic.args[0].toString());
            break;
        }
    }

    await blockEntity.save();

    // Process all events in block
    const events = block.events.filter(
        (evt) =>
            !(
                evt.event.section === "system" &&
                evt.event.method === "ExtrinsicSuccess"
            )
    );

    events.forEach((evt, idx) => handleEvent(evt, idx, blockEntity, metadata));
}
