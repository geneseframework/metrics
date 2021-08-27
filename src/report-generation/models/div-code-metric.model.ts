import { DivCode } from './div-code.model';
import { MetricSelect } from './metric-select.model';

export class DivCodeMetric {

    divCodes: DivCode[] = [];
    metricSelect: MetricSelect = undefined;

    constructor(metricSelect: MetricSelect) {
        this.metricSelect = metricSelect;
    }

}
