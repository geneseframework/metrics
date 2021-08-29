import { ReportModel } from '../report-generation/models/report.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import * as chalk from 'chalk';
import { STAT_VALUES } from './stat-values.const';
import { DataToCorrelate } from '../report-generation/data-to-correlate.model';

export class StatsService {

    static setStats(reportModel: ReportModel): void {
        for (const reportMetric of reportModel.reportMetrics) {
            this.setStatsMetric(reportMetric);
        }
    }

    private static setStatsMetric(reportMetric: ReportMetric): void {
        // console.log(chalk.greenBright('DATASET MEASURESSSS'), reportMetric);
        const dataToCorrelate: DataToCorrelate[] = reportMetric.reportSnippets.map(r => new DataToCorrelate(r.measureValue, r.score));
        for (const key of Object.keys(STAT_VALUES)) {
            STAT_VALUES[key].calc(dataToCorrelate);
        }
    }
}
