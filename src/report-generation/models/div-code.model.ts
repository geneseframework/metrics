import { MetricValueSelect } from './metric-value-select.model';

export class DivCode {

    code: string = undefined;
    displayedMetric: string = undefined;
    fileName: string = undefined;
    metricValues: MetricValueSelect[] = [];

    constructor(fileName: string, displayedMetric: string) {
        this.fileName = fileName;
        this.displayedMetric = displayedMetric;
    }

}
