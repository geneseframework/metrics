import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { METRIC_PARAMS } from '../const/metric-params.enum';
import { MetricWeights } from '../models/metric-weights.model';

// TODO: This service is a generalization of genese_cpx. Remove it if it is not necessary
export class AstMetricService extends AbstractMetricService {

    metricWeights: MetricWeights = {};

    parametersToOptimize = ['identifiers'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.setMetricWeights();
        this.evaluateMetric(astFile.astLines, reportFile);
    }

    setMetricWeights(): void {
        for (const param of METRIC_PARAMS) {
            this.metricWeights[param] = 1;
        }
    }

}
