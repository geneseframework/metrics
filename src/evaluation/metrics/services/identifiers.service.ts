import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class IdentifiersService extends AbstractMetricService {

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        const metricWeights: MetricWeights = {
            "identifiers": 1
        }
        this.evaluateMetric(astFile, reportFile, metricWeights);
    }
}
