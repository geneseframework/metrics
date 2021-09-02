import { AstFile } from './ast-file.model';
import { MetricInterface } from '../../interfaces/json-report/metric.interface';
import { Metric } from '../metric.model';

export class AstMetric {

    astFiles: AstFile[] = [];
    metric: Metric = undefined;

    constructor(metric: MetricInterface) {
        this.metric = new Metric(metric);
    }
}
