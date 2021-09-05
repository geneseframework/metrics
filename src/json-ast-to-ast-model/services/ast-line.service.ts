import { AstCode } from '../../core/models/ast-model/ast-code.model';
import { AstAbstract } from '../../core/models/ast-model/ast-abstract.model';
import { AstLine } from '../../core/models/ast-model/ast-line.model';
import { AstNode } from '../../core/models/ast-model/ast-node.model';
import { firstElement } from '../../core/utils/arrays.util';
import { Interval, isInInterval } from '../types/interval.type';
import * as chalk from 'chalk';
import { AstFile } from '../../core/models/ast-model/ast-file.model';

export class AstLineService {

    static setLines(astFile: AstFile): void {
        const codeSplit: string[] = astFile.text.split('\n');
        console.log(chalk.redBright('SETLPPPPPP'), astFile.text);
        console.log(chalk.yellowBright('SPLIT'), codeSplit);
        let linePos = 0;
        for (let i = 0; i < codeSplit.length; i++) {
            const astLine = new AstLine(codeSplit[i]);
            astLine.issue = i + 1;
            astLine.pos = linePos;
            astLine.end = astLine.pos + codeSplit[i].length;
            astLine.astNodes = astFile.descendants.filter(d => isInInterval(d.pos, [linePos, linePos + astLine.end]));
            console.log(chalk.blueBright('STLINNN'), astLine.astNodes);
            linePos += codeSplit[i].length + 1;
            astFile.astLines.push(astLine);
        }
        console.log(chalk.yellowBright('FFFFF'), astFile.descendants.map(d => d.kind));

    }


    static generate(astCode: AstCode): AstLine[] {
        if (!astCode?.textOutsideClassesAndFunctions) {
            return [];
        }
        let textLines: string[] = astCode.textOutsideClassesAndFunctions.split('\n');
        this.removeLastLineBreak(textLines);
        let issueOutsideClassesAndFunctions = 1;
        const astLines: AstLine[] = [];
        let position: number = astCode.astAbstract.interval[0];
        for (const textLine of textLines) {
            const astLine = new AstLine(textLine);
            // console.log(chalk.blueBright('TXTLINEEEEE'), textLine);
            astLine.pos = this.getLinePos(position, astCode.astAbstract, issueOutsideClassesAndFunctions);
            astLine.end = astLine.pos + textLine.length;
            astLine.astNodes = this.getAstNodes(astCode.astAbstract, astLine.pos, astLine.end);
            issueOutsideClassesAndFunctions++;
            position = this.getPositionAfterTextLineAndLineBreak(position, textLine);
            this.setLineIssue(astLine, astCode);
            // console.log(chalk.greenBright('TXTTTTTT'), astLine.issue, astLine.text);
            astLine.setIdentifiersCpx();
            astLines.push(astLine);
        }
        return astLines;
    }

    private static removeLastLineBreak(textLines: string[]): void {
        if (firstElement(textLines) === '') {
            textLines.shift();
        }
    }

    private static getAstNodes(astAbstract: AstAbstract, linePos: number, lineEnd: number): AstNode[] {
        return astAbstract.astNode.descendants.filter(d => d.start >= linePos && d.start < lineEnd);
    }

    private static getLinePos(position: number, astAbstract: AstAbstract, lineIssue: number): number {
        const posInterval: Interval = astAbstract.positionInterval(position);
        // const zzz = posInterval ? posInterval[1] + 1 : position + lineIssue - 2;
        const zzz = posInterval ? posInterval[1] + 1 : position + lineIssue - 1;
        // console.log(chalk.redBright('POSSSSSS'), position, astAbstract.name, posInterval, lineIssue);
        return zzz;
    }

    private static getPositionAfterTextLineAndLineBreak(position: number, textLine: string): number {
        return position + textLine.length + 1;
    }

    private static setLineIssue(astLine: AstLine, astCode: AstCode): void {
        const lineStart = astLine.astNodes[0]?.start;
        const fileText = astCode.astAbstract.astFileText;
        const lineBreaks = fileText.slice(0, lineStart).split('\n').length;
        astLine.issue = lineBreaks;
    }

    static setLinesPositions(astFile: AstFile): void {
        const codeSplit: string[] = astFile.text.split('\n');
        console.log(chalk.redBright('SETLPPPPPP'), astFile.text);
        console.log(chalk.yellowBright('SPLIT'), codeSplit);
        let linePos = 0;
        for (let i = 0; i < codeSplit.length; i++) {
            const lineIssue = i + 1;
            const astLine: AstLine = astFile.astLines.find(a => a.issue === lineIssue);
            if (astLine) {
                astLine.pos = linePos;
            }
            console.log(chalk.blueBright('STLINNN'), lineIssue, linePos, codeSplit[i].length, astLine?.text);
            linePos += codeSplit[i].length + 1;
        }
    }

}
