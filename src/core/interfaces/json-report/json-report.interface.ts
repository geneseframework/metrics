import { ReportMetric } from '../../../report-generation/models/report-metric.model';

export interface JsonReportInterface {

    measureName?: string;
    reportMetrics: ReportMetric[];

}
