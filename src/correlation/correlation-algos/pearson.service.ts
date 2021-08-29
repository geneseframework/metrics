import { AbstractCorrelationService } from './abstract-correlation.service';
import { DataToCorrelate } from '../../report-generation/data-to-correlate.model';
import { sampleCorrelation } from 'simple-statistics';
import { round } from '../../core/utils/numbers.util';

export class PearsonService extends AbstractCorrelationService {

    calc(dataToCorrelate: DataToCorrelate[]): number {
        const measureValues: number[] = dataToCorrelate.map(d => d.measureValue);
        const metricScores: number[] = dataToCorrelate.map(d => d.metricScore);
        return round(sampleCorrelation(measureValues, metricScores), 5);
    }

}
