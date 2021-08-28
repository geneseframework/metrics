export class DivCode {

    code: string = undefined;
    isDisplayed: boolean = undefined;
    fileName: string = undefined;
    metricName: string = undefined;

    constructor(fileName: string, metricName: string, isSelected: boolean) {
        this.fileName = fileName;
        this.metricName = metricName;
        this.isDisplayed = isSelected;
    }

}
