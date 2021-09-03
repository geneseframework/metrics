import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import * as chalk from 'chalk';
import { MetricWeights } from '../evaluation/metrics/models/metric-weights.model';

export class OptimizationService {

    static start(jsonReport: JsonReportInterface): void {
        console.log(chalk.magentaBright('OPTIM FILESSSS'), jsonReport.optimizationFiles);
        for (const astFile of jsonReport.optimizationFiles) {

        }
    }

    private static fitnessFunction(initialValues: MetricWeights[]): void {
    // private static fitnessFunction(optimizationParams: string[]): void {

    }
}
