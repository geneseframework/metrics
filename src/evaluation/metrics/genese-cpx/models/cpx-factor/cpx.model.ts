/**
 * The Complexity Factors
 */
import { round } from '../../../../../core/utils/numbers.util';
import { capitalize } from '../../../../../core/utils/strings.util';

export class Cpx {

    [param: string]: number;

    constructor() {
    }
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

    get comments(): any {
        if (this.total === 0) {
            return '';
        }
        let text = `+ ${this.total} (`;
        for (const key of Object.keys(this)) {
            text = this[key] > 0 ? `${text}${capitalize(key)}: +${round(this[key], 1)}, ` : `${text}`;
        }
        return `${text.slice(0, -2)})`;
    }

}
