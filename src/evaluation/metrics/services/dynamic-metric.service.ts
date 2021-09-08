import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class DynamicMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        // "callbacks": 2,
        "identifiers": 2,
        // "ifs": 3,
        // "loops": 5,
        // "nesting": 0.5,
        // "repetition": 0.8,
        // "recursions": 2,
        // "switches": 1,
        "words": 1
    }

    parametersToOptimize = ['words'];
    // parametersToOptimize = ['ifs', 'loops', 'nesting', 'repetition'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile.astLines, reportFile);
    }
}
