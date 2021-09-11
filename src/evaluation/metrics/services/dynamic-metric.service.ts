import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class DynamicMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        "ifs": 0.5,
        "loops": 1,
        "nesting": 0.5,
        // "repetition": 0.8,
        "recursions": 2,
        "words": 9
    }

    parametersToOptimize = ['ifs', 'loops', 'nesting'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile.astLines, reportFile);
    }
}
