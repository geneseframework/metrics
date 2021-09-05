import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { MetricParamValues } from '../../../evaluation/metrics/models/metric-param-value.model';
import { AstLine } from './ast-line.model';
import { AstNode } from './ast-node.model';
import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';

export class AstFile {

    astLines: AstLine[] = [];
    astNode: AstNode = undefined;
    jsonAstFile: JsonAstFileInterface = undefined;
    jsonAstNode: JsonAstNodeInterface = undefined;
    measureValue: number;
    metricParamValues: MetricParamValues = {};
    name = undefined;
    text = '';

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

    // TODO: re-implement ?
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
