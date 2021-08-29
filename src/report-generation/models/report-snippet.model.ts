import { JsonReportSnippetInterface } from '../../core/interfaces/json-report/json-report-snippet.interface';
import { ReportLine } from './report-line.model';

export class ReportSnippet implements JsonReportSnippetInterface {

    codeSnippetName: string = undefined;
    lines: ReportLine[] = [];
    measureValue: number = undefined;
    metricName: string = undefined;
    score = 0;
    text: string = undefined;

    constructor(fileName: string, text: string, metricName: string) {
        this.codeSnippetName = fileName;
        this.text = text;
        this.metricName = metricName;
    }

}
