import { ReportMetric } from '../../../report-generation/models/report-metric.model';
import { Optimization } from '../../../optimization/optimization.model';
import { OptimizationFile } from '../../../optimization/optimization-file.model';

export interface JsonReportInterface {

    measureName?: string;
    optimizationFiles: OptimizationFile[];
    // optimization: Optimization;
    reportMetrics: ReportMetric[];

}
