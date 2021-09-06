import { JsonReportInterface } from '../../core/interfaces/json-report/json-report.interface';
import { ReportMetric } from './report-metric.model';
import { OptimizationFile } from '../../optimization/optimization-file.model';
import { flat, unique } from '../../core/utils/arrays.util';

export class ReportModel implements JsonReportInterface {

    measureName: string = undefined;
    optimizationFiles: OptimizationFile[] = [];
    reportMetrics: ReportMetric[] = [];

    constructor(jsonReportInterface?: JsonReportInterface) {
        if (jsonReportInterface) {
            this.measureName = jsonReportInterface.measureName;
            this.optimizationFiles = jsonReportInterface.optimizationFiles;
            this.reportMetrics = jsonReportInterface.reportMetrics;
        }
    }

    get codeSnippetNames(): string[] {
        return unique(flat(this.reportMetrics.map(r => r.reportSnippets.map((s => s.codeSnippetName))))).sort();
    }
}
