import { PearsonService } from './correlation-algos/pearson.service';
import { AbstractCorrelationService } from './correlation-algos/abstract-correlation.service';

export const CORRELATION_KINDS: { [key: string]: AbstractCorrelationService } = {
    "Pearson": new PearsonService()
}
