export class RowSnippet {

    fileName: string = undefined;
    hasMeasure = false;
    measureValue: number = undefined;
    scores: number[] = [];

    constructor(fileName: string, hasMeasure = false, measureValue?: number) {
        this.fileName = fileName;
        this.measureValue = measureValue;
        this.hasMeasure = hasMeasure;
    }

}
