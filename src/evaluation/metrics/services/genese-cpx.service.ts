import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class GeneseCpxService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        "callbacks": 2,
        "ifs": 1,
        "loops": 1,
        "nesting": 0.5,
        "recursions": 2,
        "switches": 1,
        "identifiers": 1,
        // "words": 0.1
    }

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile, reportFile, this.metricWeights);
    }
}
