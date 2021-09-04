import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { METRIC_PARAMS } from '../enums/ast-metric.enum';
import { MetricWeights } from '../models/metric-weights.model';

export class AstMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {};

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.setMetricWeights();
        this.evaluateMetric(astFile, reportFile, this.metricWeights);
    }

    setMetricWeights(): void {
        for (const param of METRIC_PARAMS) {
            this.metricWeights[param] = 1;
        }
    }

}
