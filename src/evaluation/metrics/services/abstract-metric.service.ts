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
        console.log(chalk.blueBright('FILE SCOREEEE'), reportFile.codeSnippetName, reportFile.score);
    }

    getFileScore(astFile: AstFile): number {
        return sum(astFile.astLines.map(a => this.getLineScore(a)));
    }

    getLineScore(astLine: AstLine): number {
        let total = 0;
        console.log(chalk.cyanBright('GET LINE SCORRRRR'), astLine.text, this.metricWeights);
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight : 0;
        }
        console.log(chalk.cyanBright('GET LINE SCORRRRR TOTAL'), total);
        return total;
        // return round(total, 1);
    }

    getComments(astLine: AstLine): any {
        const score: number = this.getLineScore(astLine);
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
