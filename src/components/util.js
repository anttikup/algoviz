export function isNumber(obj) {
    return (typeof param === 'number');
}

export function isNumericString(obj) {
    return (String(Number(obj)) === obj);
}

function isArray(obj) {
    return typeof obj === "object" && obj.length !== undefined;
}

function isObject(obj) {
    return typeof obj === "object";
}

export function readParams(params, defaults) {
    const parsed = defaults;

    while ( params.length > 0 ) {
        const param = params.shift();
        if ( isNumber(param) ) {
            parsed.size = param;
        } else if ( isArray(param) ) {
            parsed.items = param;
        } else if ( isObject(param) ) {
            parsed.options = param;
        }
    }

    console.log("Parsed:", parsed);
    return parsed;
};
