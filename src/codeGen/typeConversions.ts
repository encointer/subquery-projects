import bs58 from "bs58";
import { parseEncointerBalance, parseDegree } from "@encointer/types";
import { inspect } from "./util";
import { BN } from "bn.js";


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

    BalanceType: {
        graphQlTypeName: "String",
        convert: (input) => {
            let inp = input.toHuman();
            logger.info(inspect(inp))
            return parseEncointerBalance(input.bits).toString()
        },
    },
};

export function getTypeConversion(encointerTypeName) {
    const { graphQlTypeName, convert } = conversions[encointerTypeName] || {
        graphQlTypeName: "String",
        convert: (input) => input.toString(),
    };
    return { graphQlTypeName, convert };
}
