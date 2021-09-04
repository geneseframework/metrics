import { DataToCorrelate } from '../../report-generation/models/data-to-correlate.model';

export abstract class AbstractCorrelationService {

    abstract calc(dataToCorrelate: DataToCorrelate[]): number;
}
