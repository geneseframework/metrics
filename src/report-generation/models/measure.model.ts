export class Measure {

    codeSnippetName: string = undefined;
    measureValue: number = undefined;

    constructor(codeSnippetName: string, measureValue: number) {
        this.codeSnippetName = codeSnippetName;
        this.measureValue = measureValue;
    }
}
