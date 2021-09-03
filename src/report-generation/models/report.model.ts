import { JsonReportInterface } from '../../core/interfaces/json-report/json-report.interface';
import { ReportMetric } from './report-metric.model';
import { OptimizationFile } from '../../optimization/optimization-file.model';

export class ReportModel implements JsonReportInterface {

    measureName: string = undefined;
    optimizationFiles: OptimizationFile[] = [];
    reportMetrics: ReportMetric[] = [];

}
