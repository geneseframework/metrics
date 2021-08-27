import { DivCode } from './div-code.model';
import { MetricSelect } from './metric-select.model';

export class DivCodeMetric {

    display: 'none' | 'block' = undefined;
    divCodes: DivCode[] = [];
    metricSelect: MetricSelect = undefined;

    constructor(metricSelect: MetricSelect) {
        this.metricSelect = metricSelect;
        this.display = metricSelect.isSelected ? 'block' : 'none';
    }

}
