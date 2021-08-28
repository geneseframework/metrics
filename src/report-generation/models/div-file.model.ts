import { DivCode } from './div-code.model';
import { DivCodeValues } from './metric-value-select.model';

export class DivFile {

    divCodes: DivCode[] = [];
    fileName: string = undefined;
    metricValues: DivCodeValues[] = [];
    selectedMetric: string = undefined;

    constructor(fileName: string, displayedMetric: string) {
        this.fileName = fileName;
        this.selectedMetric = displayedMetric;
    }

}
