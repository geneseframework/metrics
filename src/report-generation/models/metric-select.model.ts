export class MetricSelect {

    codeSnippetNamesArray: string = undefined;
    isSelected: boolean = undefined;
    metricName: string = undefined;
    metricNamesArray: string = undefined;

    constructor(metricName: string, metricNamesArray: string, codeSnippetNamesArray: string) {
        this.metricName = metricName;
        this.metricNamesArray = metricNamesArray;
        this.codeSnippetNamesArray = codeSnippetNamesArray;
    }

}
