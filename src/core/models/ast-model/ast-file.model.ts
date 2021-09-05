import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
// import { AstAbstract } from './ast-abstract.model';
import { MetricParamValues } from '../../../evaluation/metrics/models/metric-param-value.model';
import { AstLine } from './ast-line.model';
import { AstNode } from './ast-node.model';
import * as chalk from 'chalk';
// import { AstArrowFunction } from './ast-arrow-function.model';
// import { AstClass } from './ast-class.model';
// import { AstCode } from './ast-code.model';
// import { AstFunction } from './ast-function.model';
import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { Interval, isInInterval } from '../../../json-ast-to-ast-model/types/interval.type';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';

export class AstFile {


    astNode: AstNode = undefined;
    jsonAstNode: JsonAstNodeInterface = undefined;
    name = undefined;
    text = '';


    astLines: AstLine[] = [];
    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;
    metricParamValues: MetricParamValues = {};

    constructor(jsonAstFile: JsonAstFileInterface) {
        this.jsonAstFile = jsonAstFile;
        this.text = jsonAstFile.text;
        this.jsonAstNode = jsonAstFile.astNode;
        this.setAstNode();
        this.setNesting(this.astNode);
        this.setCallBacks();
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
    get kind(): string {
        return this.astNode.kind;
    }

    get length(): number {
        return this.jsonAstNode.end - this.jsonAstNode.pos ?? 0;
    }

    get lines(): AstLine[] {
        return this.astLines ?? [];
    }

    private setAstNode(): void {
        this.astNode = AstNodeService.generate(undefined, this.jsonAstNode, this.text);
    }

    private setNesting(astNode: AstNode): void {
        if (astNode.isNestingRoot) {
            astNode.nesting = 0;
        } else if (astNode.isStructuralNode) {
            astNode.nesting = astNode.parent.nesting + 1;
        } else {
            astNode.nesting = astNode.parent.nesting;
        }
        for (const child of astNode.children) {
            this.setNesting(child);
        }
    }

    private setCallBacks(): void {
        if (!this.astNode.isFunc) {
            return;
        }
        const callExpressionIdentifiers: AstNode[] = this.astNode.descendants.filter(d => d.isCallExpressionIdentifier);
        for (const callExpressionIdentifier of callExpressionIdentifiers) {
            const firstAncestorNodeOfKindFunctionOrMethod: AstNode = callExpressionIdentifier.firstAncestorNodeOfKindFunctionOrMethod;
            if (this.astNode !== firstAncestorNodeOfKindFunctionOrMethod) {
                return;
            }
            const parameterNames: string[] = this.astNode.parameters.map(p => p.name);
            if (!callExpressionIdentifier.isRecursion && parameterNames.includes(callExpressionIdentifier.name)) {
                callExpressionIdentifier.isCallback = true;
            }
        }
    }

}
