const conversions = {};

export function getTypeConversion(encointerTypeName) {
    const { graphQlTypeName, convert } = conversions[encointerTypeName] || {
        graphQlTypeName: "String",
        convert: (input) => input.toString(),
    };
    return { graphQlTypeName, convert }
}
