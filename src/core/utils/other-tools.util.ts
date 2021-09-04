



/**
 * Checks if a key is the last one of a given object
 * @param key       // The key of the object
 * @param obj       // The object
 */
export function isLastKey(key: string, obj: object): boolean {
    return (key === Object.keys(obj).slice(-1)[0]);
}


/**
 * Checks if a number is the last index of a given array
 * @param i         // The index
 * @param arr       // The array
 */
export function isLastIndex(i: number, arr: any[]): boolean {
    return (i === arr.length - 1);
}

export function randomString(length): string {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
