/**
 * Service managing Code objects
 */
import { AstCode } from '../../core/models/ast-model/ast-code.model';
import { Interval, isInInterval } from '../types/interval.type';
import { AstAbstract } from '../../core/models/ast-model/ast-abstract.model';
import { firstElement } from '../../core/utils/arrays.util';
import { AstLineService } from './ast-line.service';
import * as chalk from 'chalk';

export class AstCodeService {

    static generate(astAbstract: AstAbstract): AstCode {
        const intervalsOutsideClassesAndFunctions: Interval[] = this.getComplementaryIntervals(astAbstract);
        const text: string = this.getText(astAbstract, intervalsOutsideClassesAndFunctions);
        const astCode = new AstCode(astAbstract, text);
        // console.log(chalk.redBright('ABSTRRRRRR'), astAbstract);
        astCode.start = astAbstract.astNode.start;
        this.generateAstClassOrFunctionCodes(astAbstract, astCode);
        astCode.linesOutsideClassesAndFunctions = AstLineService.generate(astCode);
        return astCode;
    }

    private static getComplementaryIntervals(astAbstract: AstAbstract): Interval[] {
        if (astAbstract.length === 0) {
            return [[0, astAbstract.length]];
        }
        const nestedIntervals = astAbstract.astAbstracts.map(a => a.interval).sort((a, b) => a[0] - b[0]);
        let position = astAbstract.jsonAstNode.pos;
        let intervals: Interval[] = [];
        while (position < astAbstract.jsonAstNode.end) {
            const firstInterval: Interval = firstElement(nestedIntervals);
            if (isInInterval(position, firstInterval)) {
                position = firstInterval[1] + 1;
                nestedIntervals.shift();
            } else if (nestedIntervals.length > 0) {
                intervals.push([position, firstInterval[0] - 1]);
                position = firstInterval[1] + 1;
                nestedIntervals.shift();
            } else {
                intervals.push([position, astAbstract.jsonAstNode.end]);
                position = astAbstract.jsonAstNode.end;
            }
        }
        return intervals;
    }

    private static getText(astAbstract: AstAbstract, intervals: Interval[]): string {
        let txt = '';
        for (const interval of intervals) {
            const firstPos: number = interval[0] - astAbstract.jsonAstNode.pos;
            const lastPos: number = interval[1] - astAbstract.jsonAstNode.pos + 1;
            txt = `${txt}${astAbstract.text.slice(firstPos, lastPos)}`;
        }
        return txt;
    }

    private static generateAstClassOrFunctionCodes(astAbstract: AstAbstract, astCode: AstCode): void {
        for (const astAbs of astAbstract.astAbstracts) {
            astCode.astClassOrFunctionCodes.push(this.generate(astAbs));
        }
    }

}
