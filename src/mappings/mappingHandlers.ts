import { EventRecord } from "@polkadot/types/interfaces";
import {
    SubstrateExtrinsic,
    SubstrateBlock,
    SubstrateEvent,
} from "@subql/types";
import * as types from "../types";
import {
    generateGraphQlEntityName,
    getFieldTypeConversionFunctions,
    getFieldTypeNames,
    getTypeByIndex,
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

    await blockEntity.save()

    // Process all events in block
    const events = block.events.filter(
        (evt) =>
            !(
                evt.event.section === "system" &&
                evt.event.method === "ExtrinsicSuccess"
            )
    );

    for (const [idx, evt] of events.entries()) {
        let event = evt.event
        // get event typename
        const eventEntityName = generateGraphQlEntityName(
            event.section,
            event.method
        )

        // init type dynamically, record = new .....()
        let record = new types[eventEntityName](
            `${block.block.header.number.toString()}-${idx}`
        );

        //logger.info(inspect(Object.keys(record)));
        record.blockHeight = blockEntity.blockHeight;
        record.timestamp = blockEntity.timestamp;
        //record.txHash = event.extrinsic.extrinsic.hash.toString();
        // get all event fields typenames

        let fieldTypes = event.typeDef.map(t => getTypeByIndex(api, t.lookupIndex)?.type.def.toHuman())
        //logger.info(inspect(fieldTypes))

        // let dataTypes = event.data.typeDef.map(t => getTypeByIndex(api, t.lookupIndex)?.type.toHuman())

        // logger.info(event.Type.index)
          
        // logger.info(event.section)


        let section = event.section.charAt(0).toUpperCase() + event.section.slice(1)


        // APPROACH WE HAVE to go over the metadata because in metadata there it is T::AccountId and in Event it is AccountId32
        //logger.info(inspect((await api.rpc.state.getMetadata()).asV14.pallets.find(e => e.name.eq(section)).events[parseInt(event.index.toString())]))
        //logger.info(inspect(getTypeVariants(api, (await api.rpc.state.getMetadata()).asV14.pallets.find(e => e.name.eq(section)).events.toHuman())))
        
        //let events = (await api.rpc.state.getMetadata()).asV14.pallets.find(e => e.name.eq(section)).events.toJSON()['type']
        let events = getTypeVariants(api, (await api.rpc.state.getMetadata()).asV14.pallets.find(e => e.name.eq(section)).events.toJSON()['type'])
        let eventType = events.find(e => e.name == event.method)
        // logger.info(inspect(events))
        // logger.info(parseInt(event.index.toString()))
        // logger.info(inspect(event.toHuman()))
        // logger.info(inspect(eventType))
        // throw Error()


        // logger.info(inspect(getTypeByIndex(api, parseInt(event.Type.index))?.type.toHuman()))
        const fields = getFieldTypeNames(eventType);



        // get conversion functions
       const conversions = getFieldTypeConversionFunctions(eventType);

        // record[typename] = convert(event.event.data[i]);
        for (let i = 0; i < fields.length; i++) {
            record[fields[i]] = conversions[i](event.data[i]);
        }
        await record.save()
    }

    // .map((evt, idx) =>
    //   handleEvent(block.block.header.number.toString(), idx, evt)
    // );

    // // Process all calls in block
    // const calls = wrapExtrinsics(block).map((ext, idx) =>
    //   handleCall(`${block.block.header.number.toString()}-${idx}`, ext)
    // );

    // // Save all data
    // await Promise.all([
    //   store.bulkCreate("Event", events),
    //   store.bulkCreate("Extrinsic", calls),
    // ]);
}

// function handleEvent(
//   blockNumber: string,
//   eventIdx: number,
//   event: EventRecord
// ): Event {

// }

// function handleCall(idx: string, extrinsic: SubstrateExtrinsic): Extrinsic {
//   const newExtrinsic = new Extrinsic(idx);
//   newExtrinsic.txHash = extrinsic.extrinsic.hash.toString();
//   newExtrinsic.module = extrinsic.extrinsic.method.section;
//   newExtrinsic.call = extrinsic.extrinsic.method.method;
//   newExtrinsic.blockHeight = extrinsic.block.block.header.number.toBigInt();
//   newExtrinsic.success = extrinsic.success;
//   newExtrinsic.isSigned = extrinsic.extrinsic.isSigned;
//   return newExtrinsic;
// }

// function wrapExtrinsics(wrappedBlock: SubstrateBlock): SubstrateExtrinsic[] {
//   return wrappedBlock.block.extrinsics.map((extrinsic, idx) => {
//     const events = wrappedBlock.events.filter(
//       ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eqn(idx)
//     );
//     return {
//       idx,
//       extrinsic,
//       block: wrappedBlock,
//       events,
//       success:
//         events.findIndex((evt) => evt.event.method === "ExtrinsicSuccess") > -1,
//     };
//   });
// }

// export async function handleEncointerTransfer(event: SubstrateEvent, blockNumber: string, timestamp: BigInt): Promise<void> {
//   let record = new EncointerTransfer(`${event.block.block.header.number.toString()}-${event.idx}`);

//   for(const extrinsic of event.block.block.extrinsics) {
//     if(extrinsic.method.section == 'timestamp' && extrinsic.method.method == 'set') {
//       record.timestamp = BigInt(extrinsic.args[0].toString())
//       break
//     }
//   }

//   record.txHash = event.extrinsic.extrinsic.hash.toString();
//   record.blockHeight = event.block.block.header.number.toBigInt();
//   record.from = event.event.data[1].toString();
//   record.to = event.event.data[2].toString();
//   record.amount = event.event.data[3]['bits'].toString();
//   const cid = event.event.data[0];
//   record.cid = cid['geohash'] + cid['digest']

//   await record.save();
// }
