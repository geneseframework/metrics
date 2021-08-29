export class RowSnippet {

    codeSnippetName: string = undefined;
    hasMeasure = false;
    measureValue: number = undefined;
    scores: number[] = [];

    constructor(codeSnippetName: string, hasMeasure = false, measureValue?: number) {
        this.codeSnippetName = codeSnippetName;
        this.measureValue = measureValue;
        this.hasMeasure = hasMeasure;
    }

}
