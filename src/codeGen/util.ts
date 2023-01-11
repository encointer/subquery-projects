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

function deDupTypeNames(typeNames) {
    for (let i = 0; i < typeNames.length - 1; i++) {
        let counter = 0;
        let modified = false;
        for (let j = i + 1; j < typeNames.length; j++) {
            if (typeNames[i] === typeNames[j]) {
                typeNames[j] = `${typeNames[j]}${++counter}`;
                modified = true;
            }
        }
        if (modified) typeNames[i] = `${typeNames[i]}${0}`;
    }
    return typeNames;
}

export function formatTypeName(typeName) {
    return typeName.replace(/[\W_]+/g, "");
}

export function generateGraphQlEntityName(pallet, method) {
    // the name must be short becasue postgres relation and constraint names must be below 63 chars

    // // capitalize first letter
    // pallet = pallet.charAt(0).toUpperCase() + pallet.slice(1)

    // const prefix = pallet.substring(0,3)
    // return `${prefix}${method}`;

    return shortEventNameMap[method] || method;
}

function getTypeName(t) {
    return t.typeName;
}

export function getFieldTypeNames(eventType) {
    let fields = eventType.fields.map((field) =>
        formatTypeName(getTypeName(field))
    );
    return deDupTypeNames(fields);
}

export function getFieldTypeNamesRaw(eventType) {
    let fields = eventType.fields.map((field) =>
        formatTypeName(getTypeName(field))
    );
    return fields;
}

export function getGraphQlFieldTypes(eventType) {
    return eventType.fields.map(
        (field) => getTypeConversion(getTypeName(field)).graphQlTypeName
    );
}

export function getFieldTypeConversionFunctions(eventType) {
    return eventType.fields.map(
        (field) => getTypeConversion(getTypeName(field)).convert
    );
}
