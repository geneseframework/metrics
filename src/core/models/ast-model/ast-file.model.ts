import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { AstAbstract } from './ast-abstract.model';
import { MetricParamValues } from '../../../evaluation/metrics/models/metric-param-value.model';
import { AstLine } from './ast-line.model';

export class AstFile extends AstAbstract {

    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;
    metricParamValues: MetricParamValues = {};

    constructor(jsonAstFile: JsonAstFileInterface) {
        super(jsonAstFile.astNode, jsonAstFile.text);
        this.jsonAstFile = jsonAstFile;
    }

    get astLines(): AstLine[] {
        return this.astCode?.astLines;
    }

}
