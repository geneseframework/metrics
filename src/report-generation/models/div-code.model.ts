import { MetricValue } from './metric-value.model';

export class DivCode {

    code: string = undefined;
    displayedMetric: string = undefined;
    fileName: string = undefined;
    metricValues: MetricValue[] = [];

    constructor(fileName: string, displayedMetric: string) {
        this.fileName = fileName;
        this.displayedMetric = displayedMetric;
    }

}
