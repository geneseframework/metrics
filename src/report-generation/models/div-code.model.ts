export class DivCode {

    code: string = undefined;
    codeSnippetName: string = undefined;
    isDisplayed: boolean = undefined;
    metricName: string = undefined;

    constructor(codeSnippetName: string, metricName: string, isSelected: boolean) {
        this.codeSnippetName = codeSnippetName;
        this.metricName = metricName;
        this.isDisplayed = isSelected;
    }

}
