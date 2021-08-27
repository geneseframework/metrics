export class MetricSelect {

    isSelected: boolean = undefined;
    metricName: string = undefined;
    metricNamesArray: string = undefined;

    constructor(metricName: string, metricNamesArray: string) {
        this.metricName = metricName;
        this.metricNamesArray = metricNamesArray;
    }

}
