import { SubstrateBlock } from "@subql/types";
import * as types from "../types";
import {
    generateGraphQlEntityName,
    getFieldTypeConversionFunctions,
    getFieldTypeNames,
    getTypeVariants,
} from "../codeGen/util";

let specVersion: types.SpecVersion;
export async function handleBlock(block: SubstrateBlock): Promise<void> {
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

    // create block instance
    let blockEntity = new types.Block(block.block.header.hash.toString());
    blockEntity.blockHeight = block.block.header.number.toBigInt();

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

    for (const [idx, evt] of events.entries()) {
        let event = evt.event;

        let section =
            event.section.charAt(0).toUpperCase() + event.section.slice(1);

        if (!section.startsWith("Encointer")) continue;

        // get event typename
        const eventEntityName = generateGraphQlEntityName(
            section,
            event.method
        );

        let record = new types[eventEntityName](
            `${block.block.header.number.toString()}-${idx}`
        );

        record.blockHeight = blockEntity.blockHeight;
        record.timestamp = blockEntity.timestamp;

        let events = getTypeVariants(
            api,
            (await api.rpc.state.getMetadata()).asV14.pallets
                .find((e) => e.name.eq(section))
                .events.toJSON()["type"]
        );
        let eventType = events.find((e) => e.name == event.method);
        const fields = getFieldTypeNames(eventType);

        // get conversion functions
        const conversions = getFieldTypeConversionFunctions(eventType);

        // record[typename] = convert(event.event.data[i]);
        for (let i = 0; i < fields.length; i++) {
            record[fields[i]] = conversions[i](event.data[i]);
        }
        await record.save();
    }
}
