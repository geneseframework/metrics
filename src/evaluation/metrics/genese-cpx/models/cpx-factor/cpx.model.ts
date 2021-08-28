import { capitalize } from '../../../../../core/utils/strings.util';

/**
 * The Complexity Factors
 */
export class Cpx {

    aggregation: number = 0;                    // Aggregation Complexity
    atomic: number = 0;                         // Atomic Complexity
    context: number = 0;                        // Context Complexity
    depth: number = 0;                          // Depth Complexity
    nesting: number = 0;                        // Nesting Complexity
    recursion: number = 0;                      // Recursion Complexity
    structural: number = 0;                     // Structural Complexity
    typing: number = 0;                         // Typing Complexity
    use: number = 0;                            // Use Complexity



    // ---------------------------------------------------------------------------------
    //                                Getters and setters
    // ---------------------------------------------------------------------------------


    /**
     * Returns the total of Complexity Factors (the Complexity Index)
     */
    get total(): number {
        let total = 0;
        for (const key of Object.keys(this)) {
            total += this[`total${capitalize(key)}`] ?? 0;
        }
        return +total.toFixed(1);
    }

}
