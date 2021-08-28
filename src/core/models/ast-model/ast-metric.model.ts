import { JsonAstFolderInterface } from '../../interfaces/json-ast/json-ast-folder.interface';
import { AstFile } from './ast-file.model';
import { MetricInterface } from '../../interfaces/json-report/metric.interface';
import { Metric } from '../metric.model';

export class AstMetric {

    astFiles: AstFile[] = [];
    jsonAstFolder: JsonAstFolderInterface = undefined;
    metric: Metric = undefined;

    constructor(jsonAstFolder: JsonAstFolderInterface, metric: MetricInterface) {
        this.jsonAstFolder = jsonAstFolder;
        this.metric = new Metric(metric);
    }

    get path(): string {
        return this.jsonAstFolder.path;
    }
}
