import { AbstractCorrelationService } from './abstract-correlation.service';
import { DataToCorrelate } from '../../report-generation/data-to-correlate.model';
import * as chalk from 'chalk';
import { sampleCorrelation } from 'simple-statistics';

export class PearsonService extends AbstractCorrelationService {

    calc(dataToCorrelate: DataToCorrelate[]): number {
        console.log(chalk.blueBright('DATA TO CORRELATEEEEE'), dataToCorrelate.map(d => [d.measureValue, d.metricScore]));
        const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
        const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
        const pearson: number = sampleCorrelation(measureValues, metricScores);
        console.log(chalk.blueBright('PEARSONNN'), pearson);
        return pearson;
    }

}
