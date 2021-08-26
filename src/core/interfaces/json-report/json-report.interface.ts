import { ReportMetric } from '../../../report-generation/models/report-metric.model';

export interface JsonReportInterface {

    measure?: string;
    reportMetrics: ReportMetric[];

}
