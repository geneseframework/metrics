import { ReportModel } from '../report-generation/models/report.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { CORRELATION_KINDS } from './correlation-kinds.const';
import { DataToCorrelate } from '../report-generation/data-to-correlate.model';
import { Correlation } from './correlation.model';

export class CorrelationService {

    static setStats(reportModel: ReportModel): void {
        for (const reportMetric of reportModel.reportMetrics) {
            this.setStatsMetric(reportMetric);
        }
    }

    private static setStatsMetric(reportMetric: ReportMetric): void {
        const dataToCorrelate: DataToCorrelate[] = reportMetric.reportSnippets.map(r => new DataToCorrelate(r.measureValue, r.score));
        for (const key of Object.keys(CORRELATION_KINDS)) {
            const correlation: number = CORRELATION_KINDS[key].calc(dataToCorrelate);
            reportMetric.correlations.push(new Correlation(key, correlation));
        }
    }
}
