import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { round } from '../../../core/utils/numbers.util';
import { ReportLine } from '../../../report-generation/models/report-line.model';

export abstract class AbstractMetricService {

    abstract metricWeights: MetricWeights;

    abstract evaluate(astFile: AstFile, reportFile: ReportSnippet): void;

    protected evaluateMetric(astFile: AstFile, reportFile: ReportSnippet, metricWeights: MetricWeights): void {
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (const astLine of astLines) {
            const reportLine = new ReportLine(astLine.issue, astLine.text, astLine.getComments(metricWeights), astLine.getScore(metricWeights));
            reportFile.lines.push(reportLine);
            reportFile.score = round(reportFile.score + reportLine.score, 1);
        }
    }


}
