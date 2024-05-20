import { TypeDef } from "@polkadot/types-create/types";
import { getTypeConversion } from "./typeConversions";

import util from "util";
import { shortEventNameMap } from "./config";

export function inspect(message) {
    return util.inspect(message, {
        showHidden: false,
        depth: null,
        colors: true,
    });
}

export function getTypeByIndex(api, idx) {
    return api.registry.lookup.types[idx];
}

export function getTypeVariants(api, type: TypeDef[]) {
    return getTypeByIndex(api, type)?.type.def.asVariant.variants.toHuman();
}

export function formatTypeName(typeName) {
    return typeName.replace(/[\W_]+/g, "");
}

export const snakeToCamel = (str) =>
    str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) =>
            group.toUpperCase().replace("-", "").replace("_", "")
        );

export const snakeToPascal = (str) => {
    let camelCase = snakeToCamel(str);
    let pascalCase = camelCase[0].toUpperCase() + camelCase.substr(1);
    return pascalCase;
};

export const camelToSnake = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export function formatExtrinsicTypeName(typeName) {
    return snakeToPascal(typeName);
}

export function generateGraphQlEntityName(pallet, method) {
    // the name must be short becasue postgres relation and constraint names must be below 63 chars

    // // capitalize first letter
    // pallet = pallet.charAt(0).toUpperCase() + pallet.slice(1)

    // const prefix = pallet.substring(0,3)
    // return `${prefix}${method}`;

    return shortEventNameMap[method] || method;
}

export function getTypeNames(eventType) {
    let fields = eventType.fields.map((field) => field.typeName);
    return fields;
}

export function getGraphQlFieldNames(eventType) {
    return eventType.fields.map((field, idx) => `arg${idx}`);
}

export function getGraphQlFieldTypes(eventType) {
    return eventType.fields.map(
        (field) => getTypeConversion(field.typeName).graphQlTypeName
    );
}

export function getFieldTypeConversionFunctions(eventType) {
    return eventType.fields.map(
        (field) => getTypeConversion(field.typeName).convert
    );
}
