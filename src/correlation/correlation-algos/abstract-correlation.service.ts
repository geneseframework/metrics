import { DataToCorrelate } from '../../report-generation/data-to-correlate.model';

export abstract class AbstractCorrelationService {

    abstract calc(dataToCorrelate: DataToCorrelate[]): number;
}
