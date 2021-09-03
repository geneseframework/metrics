import { AbstractMetricService } from '../services/abstract-metric.service';
import { flat, unique } from '../../../core/utils/arrays.util';

export class MetricServicesList {

    metricServices: { [metricName: string]: AbstractMetricService }

    constructor(metricServices: { [metricName: string]: AbstractMetricService }) {
        this.metricServices = metricServices;
    }

    get metricParameters(): string[] {
        return unique(flat(Object.values(this.metricServices).map(m => Object.keys(m.metricWeights))));
    }
}
