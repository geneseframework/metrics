import { MetricInterface } from '../../core/interfaces/json-report/metric.interface';
import { AstMetric } from '../../core/models/ast-model/ast-metric.model';
import { AstFile } from '../../core/models/ast-model/ast-file.model';

export class AstMetricService {

    static generate(metric: MetricInterface, astFiles: AstFile[]): AstMetric {
        const astMetric = new AstMetric(metric);
        for (const jsonAstFile of astFiles) {
            astMetric.astFiles = astFiles;
        }
        // console.log(chalk.cyanBright('AST METRICCCC = '), astMetric);
        return astMetric;
    }
}
