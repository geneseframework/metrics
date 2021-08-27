export class DivCode {

    code: string = undefined;
    display: 'none' | 'block' = undefined;
    fileName: string = undefined;
    metricName: string = undefined;

    constructor(fileName: string, metricName: string) {
        this.fileName = fileName;
        this.metricName = metricName;
        // this.display = metricSelect.isSelected ? 'block' : 'none';
    }

}
