import { MetricSelect } from './metric-select.model';

export class MetricValueSelect {

    isSelected = false;
    metricName: string = undefined;
    value: number = undefined;

    constructor(metricSelect: MetricSelect, value: number) {
        this.metricName = metricSelect.metricName;
        this.isSelected = metricSelect.isSelected;
        this.value = value;
    }
}
