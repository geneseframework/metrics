
/**
 * Sets in capitals the first letter of a text
 * @param text
 */
export function capitalize(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}
