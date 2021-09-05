import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { ReportLine } from '../../../report-generation/models/report-line.model';

export class LocService extends AbstractMetricService {

    metricWeights = {};

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        const astLines: AstLine[] = astFile.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const score = astLines[i].astNodes.length > 0 ? 1 : 0;
            const comments = astLines[i].astNodes.length > 0 ? '+1' : '';
            const reportLine = new ReportLine(i, astLines[i].text, comments, score);
            reportFile.lines.push(reportLine);
            reportFile.score += reportLine.score;
        }
    }
}
