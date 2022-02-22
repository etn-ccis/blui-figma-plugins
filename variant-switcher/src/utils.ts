export const sanitizeText = (str: string): string => {
    return str.toLowerCase().replace(/[ \.,]/g, '');
};

/**
 * @param givenProperty "Property Name" as specified by the user
 * @param givenVariant "From Variant" or "To Variant" as specified by the user
 * @param givenPair The property-variant pair, as appears in the main component layer name
 */
export const blurredMatch = (givenProperty: string, givenVariant: string, givenPair: string) => {
    const newProperty = sanitizeText(givenProperty);
    const newVariant = sanitizeText(givenVariant);
    const instanceArray = givenPair.split('=');
    return sanitizeText(instanceArray[0]).includes(newProperty) && sanitizeText(instanceArray[1]).includes(newVariant);
};
