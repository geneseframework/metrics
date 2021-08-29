import { DataToCorrelate } from '../../report-generation/data-to-correlate.model';
import * as chalk from 'chalk';

export abstract class AbstractCalcService {

    calc(dataToCorrelate: DataToCorrelate[]): number {
        console.log(chalk.magentaBright('DATA TO CORRELATE'), dataToCorrelate);
        return undefined;
    }
}
