import { MetricInterface } from '../interfaces/json-report/metric.interface';

export class Metric implements MetricInterface {

    id: string = undefined;
    name: string = undefined;

    constructor(metricInterface: MetricInterface) {
        this.id = metricInterface.id;
        this.name = metricInterface.name;
    }
}
