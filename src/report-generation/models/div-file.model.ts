import { DivCode } from './div-code.model';
import { DivCodeValues } from './div-code-values.model';

export class DivFile {

    divCodes: DivCode[] = [];
    divCodeValues: DivCodeValues[] = [];
    fileName: string = undefined;
    selectedMetric: string = undefined;

    constructor(fileName: string, displayedMetric: string) {
        this.fileName = fileName;
        this.selectedMetric = displayedMetric;
    }

}
