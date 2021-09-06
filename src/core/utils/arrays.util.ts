/**
 * Returns a flatten array from a given array
 * @param array     // The array to flat
 */
export function flat(array: any[]): any[] {
    if (!array || array.length === 0) {
        return [];
    }
    else if (Array.isArray(array[0])) {
        return flat(array[0]).concat(flat(array.slice(1)));
    }
    else {
        return [array[0]].concat(flat(array.slice(1)));
    }
}


/**
 * Returns the last element of an array of numbers
 * @param array     The array to check
 */
export function firstElement<T>(array: T[]): T {
    return Array.isArray(array) && array.length > 0 ? array[0] : undefined;
}

/**
 * Returns the last element of an array of numbers
 * @param array     The array to check
 */
export function lastElement<T>(array: T[]): T {
    return Array.isArray(array) && array.length > 0 ? array[array.length - 1] : undefined;
}

/**
 * Checks if a number is the last index of a given array
 * @param i         // The index
 * @param arr       // The array
 */
export function isLastIndex(i: number, arr: any[]): boolean {
    return (i === arr.length - 1);
}

export function haveSameElements(array1: any[] = [], array2: any[] = []): boolean {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Removes duplicates from array
 * @param arr
 */
export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

/**
 * Returns the average of an array of numbers
 * @param array
 */
export function sum(array: number[]): number {
    return Array.isArray(array) ? array.reduce((a, b) => a + b, 0) : undefined;
}
