/**
 * The Complexity Factors
 */
import { round } from '../../../../../core/utils/numbers.util';

export class Cpx {

    aggregation: number = 0;                    // Aggregation Complexity
    context: number = 0;                        // Context Complexity
    depth: number = 0;                          // Depth Complexity
    nesting: number = 0;                        // Nesting Complexity
    recursion: number = 0;                      // Recursion Complexity
    structural: number = 0;                     // Structural Complexity
    typing: number = 0;                         // Typing Complexity
    use: number = 0;                            // Use Complexity
    words: number = 0;                         // Atomic Complexity


    /**
     * Returns the total of Complexity Factors (the Complexity Index)
     */
    get total(): number {
        let total = 0;
        for (const key of Object.keys(this)) {
            total += !isNaN(this[key]) ? this[key] : 0;
        }
        return round(total, 1);
    }

    get comments(): string {
        if (this.total === 0) {
            return '';
        }
        let text = `+ ${this.total} (`;
        for (const key of Object.keys(this)) {
            text = this[key] > 0 ? `${text}+${round(this[key], 1)} ${key}, ` : `${text}`;
        }
        return `${text.slice(0, -2)})`;
    }

}
