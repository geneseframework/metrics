import { MetricSelect } from './metric-select.model';

export class DivCodeValues {

    codeSnippetName: string = undefined;
    isSelected = false;
    metricName: string = undefined;
    metricNamesArray: string = undefined;
    value: number = undefined;

    constructor(codeSnippetName: string, metricSelect: MetricSelect, value: number, metricNamesArray: string) {
        this.codeSnippetName = codeSnippetName;
        this.metricName = metricSelect.metricName;
        this.metricNamesArray = metricNamesArray;
        this.isSelected = metricSelect.isSelected;
        this.value = value;
    }
}
