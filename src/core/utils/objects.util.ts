
/**
 * clone object with deep copy
 * @param model
 */

export function clone<T>(model: T): T {
    if (!model) {
        return model;
    }
    let response: any;
    if (Array.isArray(model)) {
        const newArray = [];
        model.forEach((item) => newArray.push(clone(item)));
        response = newArray;
    } else if (typeof model === 'object') {
        const newObject = {};
        Object.keys(model).forEach((key) => (newObject[key] = clone(model[key])));
        response = newObject;
    } else {
        response = model;
    }
    return response;
}


/**
 * Checks if a key is the last one of a given object
 * @param key       // The key of the object
 * @param obj       // The object
 */
export function isLastKey(key: string, obj: object): boolean {
    return (key === Object.keys(obj).slice(-1)[0]);
}
