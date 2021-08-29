import { ReportSnippet } from './report-snippet.model';
import { Correlation } from '../../correlation/correlation.model';

export class ReportMetric {

    correlations: Correlation[] = [];
    metricName: string = undefined;
    reportSnippets: ReportSnippet[] = [];

    constructor(metricName: string) {
        this.metricName = metricName;
    }
}
