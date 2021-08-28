import { MetricSelect } from './metric-select.model';

export class DivCodeValues {

    fileName: string = undefined;
    isSelected = false;
    metricName: string = undefined;
    metricNamesArray: string = undefined;
    value: number = undefined;

    constructor(fileName: string, metricSelect: MetricSelect, value: number, metricNamesArray: string) {
    // constructor(fileName: string, metricSelect: MetricSelect, isSelected: boolean, value: number, metricNamesArray: string) {
        this.fileName = fileName;
        this.metricName = metricSelect.metricName;
        this.metricNamesArray = metricNamesArray;
        this.isSelected = metricSelect.isSelected;
        this.value = value;
    }
}
