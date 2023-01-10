import { getTypeConversion } from "./typeConversions";

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

export function generateGraphQlEntityName(pallet, event) {
    // the name must not be longer than 63 chars after CamelCase to snake_case conversion
    // becasue the will be issues with defining constraints in Postgres otherwise

    //const prefix = pallet.includes('Encointer') ? "EC" : "";
    const prefix = pallet.substring(0,3)
    return `${prefix}${event.name}`;
}

export function getFieldTypeNames(event) {
    let fields = event.fields.map((field) => formatTypeName(field.typeName));
    return deDupTypeNames(fields);
}

export function getGraphQlFieldTypes(event) {
    return event.fields.map(
        (field) => getTypeConversion(field.typeName).graphQlTypeName
    );
}

export function getFieldTypeConversionFunctions(event) {
    return event.fields.map(
        (field) => getTypeConversion(field.typeName).convert
    );
}
