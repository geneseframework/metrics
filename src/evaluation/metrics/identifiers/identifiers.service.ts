import { AbstractMetricService } from '../abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import * as chalk from 'chalk';

export class IdentifiersService extends AbstractMetricService {

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        // console.log(chalk.magentaBright('AST FILE IDENTIFIERSSSS'), astFile.astCode.astClassOrFunctionCodes[0]);
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const score: number = astLines[i].identifiers;
            const comments: string = score > 0 ? `+${score}` : '';
            const reportLine = new ReportLine(i, astLines[i].text, comments, score);
            // this.evaluateLine(astLines[i], reportLine);
            reportFile.lines.push(reportLine);
            reportFile.score += reportLine.score;
        }
    }

    // private evaluateLine(astLine: AstLine, reportLine: ReportLine): void {
    //     reportLine.score = astLine.identifiers;
    //     reportLine.comments = reportLine.score > 0 ? `+${reportLine.score}` : '';
    // }
}
