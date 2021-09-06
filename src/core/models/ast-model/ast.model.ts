import { AstMetric } from './ast-metric.model';
import { AstFile } from './ast-file.model';
import { flat, unique } from '../../utils/arrays.util';

export class AstModel {

    astMetrics: AstMetric[] = [];
    measure: string = undefined;

    get astFiles(): AstFile[] {
        return unique(flat(this.astMetrics.map(a => a.astFiles)));
    }

    get astFileNames(): string[] {
        return this.astFiles.map(a => a.name).sort();
    }

    get metricParameters(): string[] {
        return unique(this.astMetrics.map(a => a.metric?.name));
    }

}
