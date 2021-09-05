import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
import { ReportModel } from '../report-generation/models/report.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstMetric } from '../core/models/ast-model/ast-metric.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { Measure } from '../report-generation/models/measure.model';
import { removeExtension } from '../core/utils/file-system.util';
import { sum } from '../core/utils/arrays.util';
import { METRIC_SERVICES } from './metrics/const/metric-services.const';
import { Metric } from '../core/models/metric.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { OptimizationFile } from '../optimization/optimization-file.model';

export class EvaluationService {

    static measures: Measure[] = [];

    static evaluate(astModel: AstModel, measures: Measure[]): JsonReportInterface {
        const reportModel = new ReportModel();
        console.log(chalk.blueBright('AST MODELLLLL'), astModel);
        reportModel.measureName = astModel.measure;
        this.measures = measures;
        for (const astMetric of astModel.astMetrics) {
            this.evaluateAstMetric(reportModel, astMetric);
        }
        this.setMetricParamValues(reportModel, astModel);
        return reportModel;
    }

    private static evaluateAstMetric(reportModel: ReportModel, astMetric: AstMetric): void {
        try {
            const reportMetric = new ReportMetric(astMetric.metric.name);
            for (const astFile of astMetric.astFiles) {
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
        METRIC_SERVICES.metricServices[metric.id].evaluate(astFile, reportFile);
    }

    private static setMetricParamValues(reportModel: ReportModel, astModel: AstModel): void {
        for (const astFile of astModel.astFiles) {
            this.setMetricParamValuesForAstFile(reportModel, astFile);
        }
    }

    private static setMetricParamValuesForAstFile(reportModel: ReportModel, astFile: AstFile): void {
        for (const metricParameter of METRIC_SERVICES.metricParameters) {
            astFile.metricParamValues[metricParameter] = sum(astFile.astLines?.map(a => a[metricParameter]));
        }
        const measureValue: number = this.getMeasure(removeExtension(astFile.name));
        reportModel.optimizationFiles.push(new OptimizationFile(removeExtension(astFile.name), astFile.metricParamValues, measureValue));
    }

    private static setMeasure(reportSnippet: ReportSnippet): void {
        reportSnippet.measureValue = this.getMeasure(reportSnippet.codeSnippetName);
    }

    private static getMeasure(codeSnippetName): number {
        return this.measures.find(m => m.codeSnippetName === codeSnippetName)?.measureValue;
    }
}
