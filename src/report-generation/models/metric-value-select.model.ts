import { MetricSelect } from './metric-select.model';

export class MetricValueSelect {

    isSelected = false;
    metricName: string = undefined;
    metricNamesArray: string = undefined;
    value: number = undefined;

    constructor(metricSelect: MetricSelect, value: number, metricNamesArray: string) {
        this.metricName = metricSelect.metricName;
        this.metricNamesArray = metricNamesArray;
        this.isSelected = metricSelect.isSelected;
        this.value = value;
    }
}
