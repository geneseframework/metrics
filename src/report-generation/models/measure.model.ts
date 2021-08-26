export class Measure {

    fileName: string = undefined;
    measureValue: number = undefined;

    constructor(fileName: string, measureValue: number) {
        this.fileName = fileName;
        this.measureValue = measureValue;
    }
}
