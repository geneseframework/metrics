import { DivCode } from './div-code.model';
import { DivCodeValues } from './div-code-values.model';

export class codeSnippetRow {

    codeSnippetName: string = undefined;
    divCodes: DivCode[] = [];
    divCodeValues: DivCodeValues[] = [];
    selectedMetric: string = undefined;

    constructor(codeSnippetName: string, displayedMetric: string) {
        this.codeSnippetName = codeSnippetName;
        this.selectedMetric = displayedMetric;
    }

}
