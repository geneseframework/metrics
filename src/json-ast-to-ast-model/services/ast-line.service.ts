import { AstCode } from '../../core/models/ast-model/ast-code.model';
import { AstAbstract } from '../../core/models/ast-model/ast-abstract.model';
import { AstLine } from '../../core/models/ast-model/ast-line.model';
import { AstNode } from '../../core/models/ast-model/ast-node.model';
import { firstElement } from '../../core/utils/arrays.util';
import { Interval } from '../types/interval.type';
import * as chalk from 'chalk';

export class AstLineService {

    static generate(astCode: AstCode): AstLine[] {
        if (!astCode?.textOutsideClassesAndFunctions) {
            return [];
        }
        let textLines: string[] = astCode.textOutsideClassesAndFunctions.split('\n');
        this.removeLastLineBreak(textLines);
        let issue = 1;
        const astLines: AstLine[] = [];
        let position: number = astCode.astAbstract.interval[0];
        for (const textLine of textLines) {
            const astLine = new AstLine(textLine, issue);
            astLine.pos = this.getLinePos(position, astCode.astAbstract, issue);
            astLine.end = astLine.pos + textLine.length;
            astLine.astNodes = this.getAstNodes(astCode.astAbstract, astLine.pos, astLine.end);issue++;
            position = this.getPositionAfterTextLineAndLineBreak(position, textLine);
            this.setLineIssue(astLine, astCode);
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
        return posInterval ? posInterval[1] + 1 : position + lineIssue - 1;
    }

    private static getPositionAfterTextLineAndLineBreak(position: number, textLine: string): number {
        return position + textLine.length + 1;
    }

    private static setLineIssue(astLine: AstLine, astCode: AstCode): void {
        const lineStart = astLine.astNodes[0]?.start;
        const fileText = astCode.astAbstract.astFileText;
        const lineBreaks = fileText.slice(0, lineStart).split('\n').length;
        astLine.issue = lineBreaks;
        // console.log(chalk.blueBright('AST CODE STARTTTT'), astCode.start, lineStart, lineBreaks);
    }

}
