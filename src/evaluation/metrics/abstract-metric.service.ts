import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../report-generation/models/report-snippet.model';
import { MetricWeights } from './metric-weights.model';
import { AstLine } from '../../core/models/ast-model/ast-line.model';
import { GeneseLine } from './genese-cpx/models/genese-line.model';
import { round } from '../../core/utils/numbers.util';
import { ReportLine } from '../../report-generation/models/report-line.model';
import { Metric } from '../../core/models/metric.model';
import { Cpx } from './genese-cpx/models/cpx-factor/cpx.model';
import { GENESE_WEIGHTS } from './genese-cpx/const/genese-weights.const';
import { AstNode } from '../../core/models/ast-model/ast-node.model';

export class AbstractMetricService {

    static metricWeights: MetricWeights;
    static reportLine: ReportLine;
    static cpx = new Cpx();

    // abstract evaluate(astFile: AstFile, reportFile: ReportSnippet): void;

    static evaluate(astFile: AstFile, reportFile: ReportSnippet, metric: Metric): void {
        // console.log(chalk.magentaBright('GENESE CPXXXX'), astFile);
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (const astLine of astLines) {
            // const geneseLine = this.reportLine(i, astLines[i]);
            // astLine.evaluate();
            const reportLine = new ReportLine(astLine.issue, astLine.text, astLine.comments, astLine.getScore(metric));
            reportFile.lines.push(reportLine);
            reportFile.score = round(reportFile.score + reportLine.score, 1);
        }
        // console.log(chalk.magentaBright('GENESE CPXXXX REPORT F'), reportFile);
    }


}
