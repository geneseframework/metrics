import { MetricWeights } from '../evaluation/metrics/models/metric-weights.model';

export class OptimizationFile {

    codeSnippetName: string = undefined;
    measureValue: number = undefined;
    metricWeights: MetricWeights = undefined;

    constructor(codeSnippetName: string, metricWeights: MetricWeights, measureValue: number) {
        this.codeSnippetName = codeSnippetName;
        this.metricWeights = metricWeights;
        this.measureValue = measureValue;
    }

}
