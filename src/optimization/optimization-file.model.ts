import { MetricParamValues } from '../evaluation/metrics/models/metric-param-value.model';

export class OptimizationFile {

    codeSnippetName: string = undefined;
    measureValue: number = undefined;
    metricParamValues: MetricParamValues = undefined;

    constructor(codeSnippetName: string, metricParamValues: MetricParamValues, measureValue: number) {
        this.codeSnippetName = codeSnippetName;
        this.metricParamValues = metricParamValues;
        this.measureValue = measureValue;
    }

}
