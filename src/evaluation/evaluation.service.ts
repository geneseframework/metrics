import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { AstModel } from '../json-ast-to-ast-model/models/ast.model';
import * as chalk from 'chalk';
import { Metric } from '../core/models/metric.model';
import { ReportModel } from '../report-generation/models/report.model';
import { METRIC_SERVICES } from './metrics/const/metrics-list.const';
import { AstFile } from '../json-ast-to-ast-model/models/ast-file.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstMetric } from '../json-ast-to-ast-model/models/ast-metric.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { Measure } from '../report-generation/models/measure.model';
import { MEASURES } from './metrics/const/measures.const';

export class EvaluationService {

    static evaluate(astModel: AstModel): JsonReportInterface {
        const reportModel = new ReportModel();
        console.log(chalk.blueBright('AST MODELLLLL'), astModel.astMetrics[0].astFiles[0].astCode.astClassOrFunctionCodes[0]);
        reportModel.measureName = astModel.measure;
        for (const astMetric of astModel.astMetrics) {
            this.evaluateAstMetric(reportModel, astMetric);
        }
        // console.log(chalk.greenBright('REPORT MODELLLLL'), reportModel.reportMetrics[0].reportSnippets[0]);
        return reportModel;
    }

    private static evaluateAstMetric(reportModel: ReportModel, astMetric: AstMetric): void {
        try {
            const reportMetric = new ReportMetric(astMetric.metric.name);
            for (const astFile of astMetric.astFiles) {
                const reportSnippet = new ReportSnippet(astFile.name, astFile.code, astMetric.metric?.name);
                this.evaluateAstFileForMetric(astFile, reportSnippet, astMetric.metric);
                this.setMeasure(reportSnippet, astMetric);
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

    private static setMeasure(reportSnippet: ReportSnippet, astMetric: AstMetric): void {
        // TODO: replace by getting measures from dataset.csv or xlsx
        const measures: Measure[] = MEASURES;
        reportSnippet.measureValue = measures.find(m => m.fileName === reportSnippet.fileName)?.measureValue;
    }
}
