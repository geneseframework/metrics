import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { round } from '../../../core/utils/numbers.util';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import { capitalize } from '../../../core/utils/strings.util';

export abstract class AbstractMetricService {

    parametersToOptimize: string[] = [];

    abstract metricWeights: MetricWeights;

    abstract evaluate(astFile: AstFile, reportFile: ReportSnippet): void;

    protected evaluateMetric(astLines: AstLine[], reportFile: ReportSnippet): void {
    // protected evaluateMetric(astFile: AstFile, reportFile: ReportSnippet): void {
    //     const astLines: AstLine[] = astFile.astLines;
        for (const astLine of astLines) {
            const reportLine = new ReportLine(astLine.issue, astLine.text, astLine.getComments(this.metricWeights), astLine.getScore(this.metricWeights));
            reportFile.lines.push(reportLine);
            reportFile.score = round(reportFile.score + reportLine.score, 1);
        }
    }

    getScore(astLine: AstLine): number {
        let total = 0;
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight : 0;
        }
        return round(total, 1);
    }

    getComments(astLine: AstLine): any {
        const score: number = this.getScore(astLine);
        if (score === 0) {
            return '';
        }
        let text = `+ ${score} (`;
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            text = this[parameter] > 0 ? `${text}${capitalize(parameter)}: +${round(this[parameter] * weight, 1)}, ` : `${text}`;
        }
        return `${text.slice(0, -2)})`;
    }

}
