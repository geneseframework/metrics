import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
import { ReportModel } from '../report-generation/models/report.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstMetric } from '../core/models/ast-model/ast-metric.model';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { removeExtension } from '../core/utils/file-system.util';
import { METRIC_SERVICES } from './metrics/const/metric-services.const';
import { Metric } from '../core/models/metric.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { OptimizationService } from '../optimization/optimization.service';

export class EvaluationService {


    static evaluate(astModel: AstModel): JsonReportInterface {
        const reportModel = new ReportModel();
        // console.log(chalk.blueBright('AST MODELLLLL'), astModel);
        reportModel.measureName = astModel.measureName;
        for (const astMetric of astModel.astMetrics) {
            this.evaluateAstMetric(reportModel, astMetric);
        }
        console.log(chalk.yellowBright('Optimization...'));
        OptimizationService.optimize(astModel, reportModel);
        return reportModel;
    }

    private static evaluateAstMetric(reportModel: ReportModel, astMetric: AstMetric): void {
        try {
            const reportMetric = new ReportMetric(astMetric.metric.name);
            for (const astFile of astMetric.astFiles) {
                const reportSnippet = new ReportSnippet(removeExtension(astFile.name), astFile.text, astMetric.metric?.name);
                this.evaluateAstFileForMetric(astFile, reportSnippet, astMetric.metric);
                reportSnippet.measureValue = astFile.measureValue;
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

}
