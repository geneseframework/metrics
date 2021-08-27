/**
 * Service managing Code objects
 */
import { AstCode } from '../models/ast-code.model';
import { Interval, isInInterval } from '../types/interval.type';
import { AstAbstract } from '../models/ast-abstract.model';
import { firstElement } from '../../core/utils/arrays.util';
import { AstLineService } from './ast-line.service';
import * as chalk from 'chalk';
import { AstFile } from '../models/ast-file.model';
import { SyntaxKind } from '../../core/enum/syntax-kind.enum';

export class AstCodeService {

    static generate(astAbstract: AstAbstract): AstCode {
        console.log(chalk.blueBright('AST ABSTRAAAA KINDDDD'), astAbstract.kind);
        if (astAbstract.kind === SyntaxKind.MethodDeclaration) {
            console.log(chalk.blueBright('AST ABSTRAAAA '), astAbstract);
        }
        const intervalsOutsideClassesAndFunctions: Interval[] = this.getComplementaryIntervals(astAbstract);
        const text: string = this.getText(astAbstract, intervalsOutsideClassesAndFunctions);
        if (astAbstract.kind === SyntaxKind.MethodDeclaration) {
            console.log(chalk.greenBright('INTERVVVVV OUTSIDE'), intervalsOutsideClassesAndFunctions);
            console.log(chalk.greenBright('TXTTTTTT '), text);
        }
        const astCode = new AstCode(astAbstract, text);
        this.generateAstClassOrFunctionCodes(astAbstract, astCode);
        astCode.linesOutsideClassesAndFunctions = AstLineService.generate(astCode);
        if (astAbstract.name === 'Cl') {
            console.log(chalk.cyanBright('LINES OUTSIDEEEE'), astCode);
            console.log(chalk.cyanBright('AST CODEEEEE CLASS'), astCode.astLines);
        }
        if (astAbstract instanceof AstFile) {
            // console.log(chalk.cyanBright('LINES OUTSIDEEEE'), astCode);
            // console.log(chalk.cyanBright('AST CODEEEEE FILE'), astCode.astLines);
        }
        return astCode;
    }

    private static getComplementaryIntervals(astAbstract: AstAbstract): Interval[] {
        if (astAbstract.length === 0) {
            return [[0, astAbstract.length]];
        }
        const nestedIntervals = astAbstract.astAbstracts.map(a => a.interval).sort((a, b) => a[0] - b[0]);
        let position = astAbstract.jsonAstNode.pos;
        let intervals: Interval[] = [];
        if (astAbstract instanceof AstFile) {
            console.log(chalk.magentaBright('NESTEDDDDD FILE'), nestedIntervals);
        }
        if (astAbstract.name === 'Cl') {
            console.log(chalk.magentaBright('NESTEDDDDD CLASS'), nestedIntervals);
        }
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
            // txt = `${txt}${astAbstract.text.slice(firstPos, lastPos)}\n`;
            if (astAbstract instanceof AstFile) {
                console.log(chalk.magentaBright('GET TXTTT INTV '), {zzz: txt});
            }
        }
        return txt;
    }

    private static generateAstClassOrFunctionCodes(astAbstract: AstAbstract, astCode: AstCode): void {
        for (const astAbs of astAbstract.astAbstracts) {
            astCode.astClassOrFunctionCodes.push(this.generate(astAbs));
        }
    }

}
