import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { AstAbstract } from './ast-abstract.model';
import { MetricParamValues } from '../../../evaluation/metrics/models/metric-param-value.model';
import { AstLine } from './ast-line.model';
import { AstNode } from './ast-node.model';
import * as chalk from 'chalk';

export class AstFile extends AstAbstract {

    astLines: AstLine[] = [];
    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;
    metricParamValues: MetricParamValues = {};

    constructor(jsonAstFile: JsonAstFileInterface) {
        super(jsonAstFile.astNode, jsonAstFile.text);
        this.jsonAstFile = jsonAstFile;
    }

    get descendants(): AstNode[] {
        return this.getDescendants(this.astNode);
    }

    getDescendants(parent: AstNode): AstNode[] {
        const descendants: AstNode[] = [];
        for (const child of parent.children) {
            descendants.push(child);
            descendants.push(...this.getDescendants(child));
        }
        return descendants;
    }

}
