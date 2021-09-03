import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import * as chalk from 'chalk';
import * as fmin from 'fmin';
import { MetricWeights } from '../evaluation/metrics/models/metric-weights.model';
import { MetricParamValues } from '../evaluation/metrics/models/metric-param-value.model';
import { round } from '../core/utils/numbers.util';
import { sampleCorrelation } from 'simple-statistics';
import { DataToCorrelate } from '../report-generation/data-to-correlate.model';
import { METRIC_SERVICES } from '../evaluation/const/metrics-list.const';
import { Options } from '../core/models/options.model';
import { OptimizationFile } from './optimization-file.model';
import { sum } from '../core/utils/arrays.util';
// const fmin = require('fmin')
// import { fmin } from 'fmin';

export class OptimizationService {

    static dataToCorrelate: DataToCorrelate[] = [];
    static optimizationFiles: OptimizationFile[] = [];
    static originalMetricWeights: MetricWeights = undefined;
    static parametersToOptimize: string[] = ['identifiers'];

    static start(jsonReport: JsonReportInterface): void {
        console.log(chalk.magentaBright('OPTIM FILESSSS'), jsonReport.optimizationFiles);
        this.optimizationFiles = jsonReport.optimizationFiles;
        this.originalMetricWeights = METRIC_SERVICES.metricServices[Options.metricToOptimize].metricWeights;
        for (const opt of this.optimizationFiles) {
            console.log(chalk.magentaBright('INITIAL SCOREEE'), opt.codeSnippetName,  this.getScore(opt.metricParamValues, this.originalMetricWeights));
        }
        const initialValues: number[] = this.getInitialValues();
        console.log(chalk.magentaBright('INITIAL VALUESSSS'), initialValues);
        // console.log(chalk.magentaBright('INITIAL VALUESSSS'), this.testFn([2.5, -0.5]));
        // const solution = fmin.nelderMead(this.testFn.bind(this), [1, 2], {maxIterations: 50});
        const solution = fmin.nelderMead(this.fitnessFunction.bind(this), [1], {maxIterations: 200});
        console.log(chalk.magentaBright('SOLUTIONNNN'), solution);
        // this.loop();
    }

    private static loop() {
        for (let i = 0; i <= 4.1; i = i + 0.1) {
            const metricWeights: MetricWeights = this.getNewMetricWeights([i]);
            console.log(chalk.blueBright('MWWWWW'), metricWeights.identifiers);
            const dataToCorrelate: DataToCorrelate[] = this.getDataToCorrelate(metricWeights);
            console.log(chalk.greenBright('DATAAAAA'), dataToCorrelate);
            const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
            const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
            const pearson: number = sampleCorrelation(measureValues, metricScores);
            console.log(chalk.greenBright('PEARSONNN'), pearson);
        }

    }

    private static getInitialValues(): number[] {
        const initialValues: number[] = [];
        for (const parameterToOptimize of this.parametersToOptimize) {
            initialValues.push(this.originalMetricWeights[parameterToOptimize]);
        }
        return initialValues;
    }

    private static testFn([a, b]): number {
        const zzz = Math.pow(a + b - 2, 2) + Math.pow(3 * a + b - 7, 2);
        console.log(chalk.greenBright('TESTFNNNN'), a, b, zzz);
        // throw Error()
        return zzz;
    }

    private static fitnessFunction(initialValues: number[]): number {
        const metricWeights: MetricWeights = this.getNewMetricWeights(initialValues);
        const dataToCorrelate: DataToCorrelate[] = this.getDataToCorrelate(metricWeights);
        console.log(chalk.green('INITIAL VALSSSSS'), initialValues);
        console.log(chalk.greenBright('DATAAAAA'), dataToCorrelate);
        const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
        const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
        const pearson: number = sampleCorrelation(measureValues, metricScores);
        // const valueToMinimize: number = sum(dataToCorrelate.map(d => Math.pow(d.measureValue - d.metricScore, 2)));
        console.log(chalk.cyanBright('METR WWWWWW'), initialValues, pearson, metricWeights.identifiers);
        const valueToMinimize: number = 1 - pearson;
        return valueToMinimize;
    }

    private static getNewMetricWeights(values: number[]): MetricWeights {
        const optimizedMetricWeights: MetricWeights = this.getOptimizedMetricWeights(values);
        const newMetricWeights: MetricWeights = Object.assign(this.originalMetricWeights, optimizedMetricWeights);
        return newMetricWeights;
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
            // console.log(chalk.blueBright('OPT FILEEEE'), optimizationFile.codeSnippetName, score);
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
}
