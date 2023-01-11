import bs58 from "bs58";
import { parseEncointerBalance } from "@encointer/types";

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
        graphQlTypeName: "Float",
        convert: (input) => parseEncointerBalance(input.bits),
    },
};

export function getTypeConversion(encointerTypeName) {
    const { graphQlTypeName, convert } = conversions[encointerTypeName] || {
        graphQlTypeName: "String",
        convert: (input) => input.toString(),
    };
    return { graphQlTypeName, convert };
}
