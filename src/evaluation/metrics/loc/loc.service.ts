import { AbstractMetricService } from '../../abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import * as chalk from 'chalk';

export class LocService extends AbstractMetricService {

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        // console.log(chalk.magentaBright('AST FILE EEEE'), astFile.astCode.astClassOrFunctionCodes[0]);
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const reportLine = new ReportLine(i, astLines[i].text);
            this.evaluateLine(astLines[i], reportLine);
            reportFile.lines.push(reportLine);
            reportFile.score += reportLine.score;
        }
    }

    private evaluateLine(astLine: AstLine, reportLine: ReportLine): void {
        // console.log(chalk.cyanBright('EVAL LINEEEEE'), reportLine.issue, reportLine.text,  astLine.astNodes.map(a => a.kind));
        reportLine.score = astLine.astNodes.length > 0 ? 1 : 0;
        reportLine.comments = astLine.astNodes.length > 0 ? '+1' : '';
    }
}
