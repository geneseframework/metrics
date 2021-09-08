import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import { MetricWeights } from '../evaluation/metrics/models/metric-weights.model';
import { sampleCorrelation } from 'simple-statistics';
import { DataToCorrelate } from '../report-generation/models/data-to-correlate.model';
import { METRIC_SERVICES } from '../evaluation/metrics/const/metric-services.const';
import { Options } from '../core/models/options.model';
import { OptimizationFile } from './optimization-file.model';
import { nelderMead } from 'fmin';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstModel } from '../core/models/ast-model/ast.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { removeExtension } from '../core/utils/file-system.util';
import { AbstractMetricService } from '../evaluation/metrics/services/abstract-metric.service';
import * as chalk from 'chalk';
import { ReportModel } from '../report-generation/models/report.model';

export class OptimizationService {

    static astModel: AstModel = undefined;
    static dataToCorrelate: DataToCorrelate[] = [];
    static metricService: AbstractMetricService = undefined;

    static optimize(astModel: AstModel, reportModel: ReportModel): void {
        console.log(chalk.magentaBright('OPTIM FILESSSS'), reportModel);
        // console.log(chalk.cyan('OPTIM FILESSSS'), astModel.astFiles.map(a => a.measureValue));
        this.astModel = astModel;
        this.metricService = METRIC_SERVICES.metricServices[Options.metricToOptimize];
        const initialValues: number[] = this.getInitialValues();
        this.applyFitnessFunctionAndOptimizeMetricWeights(initialValues);
        const reportOptimizedMetric = this.getReportOptimizedMetric(astModel, reportModel);
        reportModel.reportMetrics.push(reportOptimizedMetric);
    }

    private static getInitialValues(): number[] {
        const initialValues: number[] = [];
        for (const parameterToOptimize of this.metricService.parametersToOptimize) {
            initialValues.push(this.metricService.metricWeights[parameterToOptimize]);
        }
        return initialValues;
    }

    private static applyFitnessFunctionAndOptimizeMetricWeights(initialValues: number[]): void {
        const solution = nelderMead(this.fitnessFunction.bind(this), initialValues, {maxIterations: 2});
        console.log(chalk.magentaBright('SOLUTION : '), solution);
        console.log(chalk.magentaBright('OPTIMIZED METRIC : '), this.metricService.metricWeights);
        console.log(chalk.magentaBright('PEARSON : '), 1 - solution.fx);
    }

    private static fitnessFunction(initialValues: number[]): number {
        this.modifyOriginalMetricWeights(initialValues);
        const dataToCorrelate: DataToCorrelate[] = this.getDataToCorrelate();
        console.log(chalk.redBright('DATAAAAAAA'), dataToCorrelate.map(d => [d.measureValue, d.metricScore]));
        const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
        const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
        const pearson: number = sampleCorrelation(measureValues, metricScores);
        const valueToMinimize: number = 1 - pearson;
        return valueToMinimize;
    }

    private static modifyOriginalMetricWeights(values: number[]): MetricWeights {
        return Object.assign(this.metricService.metricWeights, this.getOptimizedMetricWeights(values));
    }

    private static getOptimizedMetricWeights(values: number[]): MetricWeights {
        const metricWeights: MetricWeights = {};
        for (let i = 0; i < values.length; i++) {
            metricWeights[this.metricService.parametersToOptimize[i]] = values[i];
        }
        return metricWeights;
    }

    private static getDataToCorrelate(): DataToCorrelate[] {
        const dataToCorrelate: DataToCorrelate[] = [];
        for (const astFile of this.astModel.astFiles) {
            console.log(chalk.blueBright('MWEIGHTTTTTT'), this.metricService.metricWeights);
            const score: number = this.metricService.getFileScore(astFile);
            // const score: number = this.getLineScore(astFile.metricWeights);
            dataToCorrelate.push(new DataToCorrelate(astFile.measureValue, score));
        }
        // console.log(chalk.magentaBright('DATAAAA'), dataToCorrelate);
        return dataToCorrelate;
    }

    private static getScore(metricWeights: MetricWeights): number {
        let total = 0;
        // for (const astLine of )
        for (const [parameter, weight] of Object.entries(this.metricService.metricWeights)) {
            total += !isNaN(metricWeights[parameter]) ? metricWeights[parameter] * weight : 0;
        }
        return total;
    }

    private static getReportOptimizedMetric(astModel: AstModel, jsonReport: JsonReportInterface): ReportMetric {
        const reportMetric = new ReportMetric('optimized');
        const originalReportMetric: ReportMetric = jsonReport.reportMetrics.find(r => r.metricName === Options.metricToOptimize);
        for (const reportSnippet of originalReportMetric.reportSnippets) {
            const optimizedReportSnippet = new ReportSnippet(reportSnippet.codeSnippetName, reportSnippet.text, reportMetric.metricName);
            optimizedReportSnippet.measureValue = reportSnippet.measureValue;
            reportMetric.reportSnippets.push(optimizedReportSnippet);
            const astFile: AstFile = astModel.astFiles.find(a => removeExtension(a.name) === reportSnippet.codeSnippetName);
            this.metricService.evaluate(astFile, optimizedReportSnippet);
        }
        return reportMetric;
    }
}
