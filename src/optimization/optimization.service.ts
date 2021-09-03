import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import * as chalk from 'chalk';
import { MetricWeights } from '../evaluation/metrics/models/metric-weights.model';
import { MetricParamValues } from '../evaluation/metrics/models/metric-param-value.model';
import { sampleCorrelation } from 'simple-statistics';
import { DataToCorrelate } from '../report-generation/data-to-correlate.model';
import { METRIC_SERVICES } from '../evaluation/const/metrics-list.const';
import { Options } from '../core/models/options.model';
import { OptimizationFile } from './optimization-file.model';
import { nelderMead } from 'fmin';
import { ReportMetric } from '../report-generation/models/report-metric.model';
import { ReportSnippet } from '../report-generation/models/report-snippet.model';
import { AstModel } from '../core/models/ast-model/ast.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { removeExtension } from '../core/utils/file-system.util';

export class OptimizationService {

    static dataToCorrelate: DataToCorrelate[] = [];
    static optimizationFiles: OptimizationFile[] = [];
    static originalMetricWeights: MetricWeights = undefined;
    static parametersToOptimize: string[] = ['identifiers'];

    static optimize(astModel: AstModel, jsonReport: JsonReportInterface): void {
        // console.log(chalk.magentaBright('OPTIM FILESSSS'), jsonReport.optimizationFiles);
        this.optimizationFiles = jsonReport.optimizationFiles;
        this.originalMetricWeights = METRIC_SERVICES.metricServices[Options.metricToOptimize].metricWeights;
        // console.log(chalk.magentaBright('INITIAL SCORESSSS'), this.optimizationFiles.map(o => [o.codeSnippetName, this.getScore(o.metricParamValues, this.originalMetricWeights)]));
        const initialValues: number[] = this.getInitialValues();
        console.log(chalk.magentaBright('INITIAL VALUESSSS'), initialValues);
        // console.log(chalk.magentaBright('INITIAL VALUESSSS'), this.testFn([2.5, -0.5]));
        const solution = nelderMead(this.fitnessFunction.bind(this), [1], {maxIterations: 100});
        console.log(chalk.magentaBright('SOLUTIONNNN'), solution);
        const zzz = this.getReportOptimizedMetric(astModel, jsonReport);
        console.log(chalk.magentaBright('OPTI REPORTTTTT'), zzz);
        jsonReport.reportMetrics.push(this.getReportOptimizedMetric(astModel, jsonReport));
    }

    private static getInitialValues(): number[] {
        const initialValues: number[] = [];
        for (const parameterToOptimize of this.parametersToOptimize) {
            initialValues.push(this.originalMetricWeights[parameterToOptimize]);
        }
        return initialValues;
    }

    private static fitnessFunction(initialValues: number[]): number {
        const metricWeights: MetricWeights = this.getNewMetricWeights(initialValues);
        const dataToCorrelate: DataToCorrelate[] = this.getDataToCorrelate(metricWeights);
        const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
        const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
        const pearson: number = sampleCorrelation(measureValues, metricScores);
        // console.log(chalk.cyanBright('METR WWWWWW'), initialValues, pearson, metricWeights.identifiers);
        const valueToMinimize: number = 1 - pearson;
        return valueToMinimize;
    }

    private static getNewMetricWeights(values: number[]): MetricWeights {
        return Object.assign(this.originalMetricWeights, this.getOptimizedMetricWeights(values));
    }

    private static getOptimizedMetricWeights(values: number[]): MetricWeights {
        const metricWeights = new MetricWeights();
        for (let i = 0; i < values.length; i++) {
            metricWeights[this.parametersToOptimize[i]] = values[i];
        }
        return metricWeights;
    }

    private static getDataToCorrelate(metricWeights: MetricWeights): DataToCorrelate[] {
        const dataToCorrelate: DataToCorrelate[] = [];
        for (const optimizationFile of this.optimizationFiles) {
            const score: number = this.getScore(optimizationFile.metricParamValues, metricWeights);
            dataToCorrelate.push(new DataToCorrelate(optimizationFile.measureValue, score));
        }
        return dataToCorrelate;
    }

    private static getScore(metricParamValues: MetricParamValues, metricWeights: MetricWeights): number {
        let total = 0;
        for (const [parameter, weight] of Object.entries(metricWeights)) {
            total += !isNaN(metricParamValues[parameter]) ? metricParamValues[parameter] * weight : 0;
        }
        return total;
    }

    private static getReportOptimizedMetric(astModel: AstModel, jsonReport: JsonReportInterface): ReportMetric {
        const reportMetric = new ReportMetric('optimized');
        const originalReportMetric: ReportMetric = jsonReport.reportMetrics.find(r => r.metricName === Options.metricToOptimize);
        for (const reportSnippet of originalReportMetric.reportSnippets) {
            const optimizedReportSnippet = new ReportSnippet(reportSnippet.codeSnippetName, reportSnippet.text, reportMetric.metricName);
            optimizedReportSnippet.lines = reportSnippet.lines;
            optimizedReportSnippet.measureValue = reportSnippet.measureValue;
            reportMetric.reportSnippets.push(optimizedReportSnippet);
            const astFile: AstFile = astModel.astFiles.find(a => removeExtension(a.name) === reportSnippet.codeSnippetName);
            // console.log(chalk.blueBright('AST FILESSSSSS'), astFile?.name);
            // console.log(chalk.blueBright('AST FILESSSSSS MPV'), astFile?.metricParamValues);
            METRIC_SERVICES.metricServices[Options.metricToOptimize].evaluate(astFile, optimizedReportSnippet);
        }
        return reportMetric;
    }
}
