import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { round } from '../../../core/utils/numbers.util';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import { capitalize } from '../../../core/utils/strings.util';
import { sum } from '../../../core/utils/arrays.util';
import * as chalk from 'chalk';

export abstract class AbstractMetricService {

    parametersToOptimize: string[] = [];

    abstract metricWeights: MetricWeights;

    abstract evaluate(astFile: AstFile, reportFile: ReportSnippet): void;

    protected evaluateMetric(astLines: AstLine[], reportFile: ReportSnippet): void {
        for (const astLine of astLines) {
            const reportLine = new ReportLine(astLine.issue, astLine.text, this.getComments(astLine), this.getLineScore(astLine));
            reportFile.lines.push(reportLine);
            reportFile.score = round(reportFile.score + reportLine.score, 1);
        }
    }

    getFileScore(astFile: AstFile): number {
        return sum(astFile.astLines.map(a => this.getLineScore(a)));
    }

    getLineScore(astLine: AstLine, ...args: any[]): number {
        let total = 0;
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight : 0;
        }
        astLine.score = total;
        return total;
    }

    getComments(astLine: AstLine): any {
        const score: number = round(astLine.score, 3);
        if (score === 0) {
            return '';
        }
        let text = `+ ${score} (`;
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            text = !isNaN(astLine[parameter]) && astLine[parameter] !== 0 ? `${text}${capitalize(parameter)}: +${round(astLine[parameter] * weight, 1)}, ` : `${text}`;
        }
        return `${text.slice(0, -2)})`;
    }

}
