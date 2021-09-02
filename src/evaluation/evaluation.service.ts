import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
import { ReportModel } from '../report-generation/models/report.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstMetric } from '../core/models/ast-model/ast-metric.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { Measure } from '../report-generation/models/measure.model';
import { removeExtension } from '../core/utils/file-system.util';
import { CorrelationService } from '../correlation/correlation.service';
import { Options } from '../core/models/options.model';
import { AbstractMetricService } from './metrics/abstract-metric.service';
import { unique } from '../core/utils/arrays.util';
import { METRIC_SERVICES } from './const/metrics-list.const';
import { Metric } from '../core/models/metric.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';

export class EvaluationService {

    static measures: Measure[] = [];

    static evaluate(astModel: AstModel, measures: Measure[]): JsonReportInterface {
        const reportModel = new ReportModel();
        // console.log(chalk.blueBright('AST MODELLLLL'), astModel.astMetrics[0].astFiles[0].astNode);
        reportModel.measureName = astModel.measure;
        this.measures = measures;
        const metricParameters: string[] = unique(astModel.astMetrics.map(a => a.metric?.name));
        for (const astMetric of astModel.astMetrics) {
            this.evaluateAstMetric(reportModel, astMetric, metricParameters);
        }
        if (Options.hasMeasures) {
            CorrelationService.setStats(reportModel);
        }
        // console.log(chalk.greenBright('REPORT MODELLLLL'), reportModel.reportMetrics[0]);
        return reportModel;
    }

    private static evaluateAstMetric(reportModel: ReportModel, astMetric: AstMetric, metricParameters: string[]): void {
        try {
            const reportMetric = new ReportMetric(astMetric.metric.name);
            for (const astFile of astMetric.astFiles) {
                astFile.setComplexities(metricParameters);
                const reportSnippet = new ReportSnippet(removeExtension(astFile.name), astFile.code, astMetric.metric?.name);
                this.evaluateAstFileForMetric(astFile, reportSnippet, astMetric.metric);
                this.setMeasure(reportSnippet);
                reportMetric.reportSnippets.push(reportSnippet);
            }
            reportModel.reportMetrics.push(reportMetric);
        } catch (err) {
            console.log(chalk.redBright('METRIC NOT FOUND'), err);
        }
    }

    private static evaluateAstFileForMetric(astFile: AstFile, reportFile: ReportSnippet, metric: Metric): void {
        METRIC_SERVICES[metric.id].evaluate(astFile, reportFile);
    }

    private static setMeasure(reportSnippet: ReportSnippet): void {
        reportSnippet.measureValue = this.measures.find(m => m.codeSnippetName === reportSnippet.codeSnippetName)?.measureValue;
    }
}
