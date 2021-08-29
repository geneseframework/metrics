export class DataToCorrelate {

    measureValue: number = undefined;
    metricScore: number = undefined;

    constructor(measureValue: number, metricValue: number) {
        this.measureValue = measureValue;
        this.metricScore = metricValue;
    }
}
