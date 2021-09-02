import { MetricInterface } from '../interfaces/json-report/metric.interface';
import { Options } from './options.model';
import { MetricWeights } from '../../evaluation/metrics/metric-weights.model';
import { GENESE_WEIGHTS } from '../../evaluation/metrics/genese-cpx/const/genese-weights.const';

export class Metric implements MetricInterface {

    // folderPath: string = undefined;
    id: string = undefined;
    metricWeights: MetricWeights = undefined;
    name: string = undefined;

    constructor(metricInterface: MetricInterface) {
        this.id = metricInterface.id;
        this.name = metricInterface.name;
        this.metricWeights = GENESE_WEIGHTS; // TODO
        // this.folderPath = metricInterface.folderPath ?? `${Options.pathCommand}/src/evaluation/metrics/${metricInterface.id}.metric.ts`;
    }
}
