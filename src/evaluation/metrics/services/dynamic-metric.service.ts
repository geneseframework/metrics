import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';

export class DynamicMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {
        // "identifiers": 2,
        "ifs": 1,
        // "loops": 5,
        // "nesting": 0.5,
        // "repetition": 0.8,
        // "recursions": 2,
        "words": 9
    }

    parametersToOptimize = ['words'];
    // parametersToOptimize = ['ifs', 'loops', 'nesting', 'repetition'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile.astLines, reportFile);
    }
}
