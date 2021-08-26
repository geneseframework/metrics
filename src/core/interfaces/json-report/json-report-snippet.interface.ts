import { JsonReportLineInterface } from './json-report-line.interface';

export interface JsonReportSnippetInterface {

    fileName: string;
    lines: JsonReportLineInterface[];
    measureValue?: number;
    metricName: string;
    score?: number;

}
