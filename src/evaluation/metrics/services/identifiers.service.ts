import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class IdentifiersService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        "identifiers": 1
    }

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile, reportFile, this.metricWeights);
    }
}
