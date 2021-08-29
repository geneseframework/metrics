import { ReportSnippet } from './report-snippet.model';
import { Stat } from './stat.model';

export class ReportMetric {

    metricName: string = undefined;
    reportSnippets: ReportSnippet[] = [];
    stats: Stat[] = [];

    constructor(metricName: string) {
        this.metricName = metricName;
    }
}
