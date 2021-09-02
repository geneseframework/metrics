import { AbstractMetricService } from '../abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { ReportLine } from '../../../report-generation/models/report-line.model';

export class IdentifiersService extends AbstractMetricService {

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const score: number = astLines[i].identifiers;
            const comments: string = score > 0 ? `+${score}` : '';
            const reportLine = new ReportLine(i, astLines[i].text, comments, score);
            reportFile.lines.push(reportLine);
            reportFile.score += reportLine.score;
        }
    }
}
