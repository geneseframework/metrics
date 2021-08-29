import { DataToCorrelate } from '../../report-generation/data-to-correlate.model';
import * as chalk from 'chalk';

export abstract class AbstractCorrelationService {

    abstract calc(dataToCorrelate: DataToCorrelate[]): number;
}
