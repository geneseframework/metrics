import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class DynamicMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        // "callbacks": 2,
        // "identifiers": 3,
        "ifs": 1,
        "loops": 1,
        "nesting": 0.5,
        "repetition": 0.8,
        // "recursions": 2,
        // "switches": 1,
        "words": 0.1
    }

    // parametersToOptimize = ['nesting', 'repetition'];
    parametersToOptimize = ['ifs', 'loops', 'nesting', 'repetition'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile.astLines, reportFile);
    }
}
