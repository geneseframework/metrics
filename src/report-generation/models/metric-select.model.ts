export class MetricSelect {

    fileNamesArray: string = undefined;
    isSelected: boolean = undefined;
    metricName: string = undefined;
    metricNamesArray: string = undefined;

    constructor(metricName: string, metricNamesArray: string, fileNamesArray: string) {
        this.metricName = metricName;
        this.metricNamesArray = metricNamesArray;
        this.fileNamesArray = fileNamesArray;
    }

}
