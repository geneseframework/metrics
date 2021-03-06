import { ReportModel } from '../report-generation/models/report.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { CORRELATION_KINDS } from './correlation-kinds.const';
import { DataToCorrelate } from '../report-generation/models/data-to-correlate.model';
import { Correlation } from './correlation.model';
import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { Options } from '../core/models/options.model';
import { Measure } from '../report-generation/models/measure.model';
import * as chalk from 'chalk';

export class CorrelationService {

    static setStats(jsonReport: JsonReportInterface): void {
        if (!Options.hasMeasures) {
        // if (!Options.hasMeasures || measures.length < 2) {
            return;
        }
        const reportModel = new ReportModel(jsonReport);
        for (const reportMetric of reportModel.reportMetrics) {
            this.setStatsMetric(reportMetric);
        }
    }

    private static setStatsMetric(reportMetric: ReportMetric): void {
        const dataToCorrelate: DataToCorrelate[] = reportMetric.reportSnippets.map(r => new DataToCorrelate(r.measureValue, r.score));
        if (dataToCorrelate?.length > 1) {
            for (const key of Object.keys(CORRELATION_KINDS)) {
                const correlation: number = CORRELATION_KINDS[key].calc(dataToCorrelate);
                reportMetric.correlations.push(new Correlation(key, correlation));
            }
        }
    }
}
