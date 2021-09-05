
/**
 * Sets in capitals the first letter of a text
 * @param text
 */
export function capitalize(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}


export function plural(word: string, quantity: number): string {
    if (!word || word.length === 0) {
        return '';
        ;    }
    if (quantity < 2) {
        return word;
    }
    if (word.slice(-1) === 'y') {
        return `${word.slice(0, -1)}ies`;
    }
    return `${word}s`;
}

