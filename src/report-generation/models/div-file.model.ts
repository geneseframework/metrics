import { DivCode } from './div-code.model';
import { MetricValueSelect } from './metric-value-select.model';

export class DivFile {

    divCodes: DivCode[] = [];
    fileName: string = undefined;
    metricValues: MetricValueSelect[] = [];
    selectedMetric: string = undefined;

    constructor(fileName: string, displayedMetric: string) {
        this.fileName = fileName;
        this.selectedMetric = displayedMetric;
    }

}
