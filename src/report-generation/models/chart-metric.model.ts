import { DataToCorrelate } from '../data-to-correlate.model';

export class ChartMetric {

    measureName: string = 'Time';
    metricName: string = undefined;
    data: DataToCorrelate[] = [];

    constructor(metricName: string) {
        this.metricName = metricName;
    }

}
