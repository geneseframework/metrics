import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';
import { Interval } from '../../../json-ast-to-ast-model/types/interval.type';
import { SyntaxKind } from '../../enum/syntax-kind.enum';
import {
    getFunctionOrMethodNode,
    isFunc,
    isIdentifier,
    isNestingRoot,
    isParameter,
    isStructuralNode
} from '../../utils/syntax-kind.util';
import * as chalk from 'chalk';

export class AstNode {

    astFileText: string = undefined;
    children: AstNode[] = [];
    isCallback = false;
    isRecursion = false;
    jsonAstNode: JsonAstNodeInterface = undefined;
    name: string = undefined;
    nesting: number = undefined;
    parent: AstNode = undefined;

    constructor(parentAstNode: AstNode, jsonAstNode: JsonAstNodeInterface, astFileText: string) {
        this.jsonAstNode = jsonAstNode;
        this.astFileText = astFileText;
        this.name = jsonAstNode.name;
        this.parent = parentAstNode;
        this.setChildren();
        this.setIsRecursionAndIsCallback();
    }

    get descendants(): AstNode[] {
        const nodes: AstNode[] = [];
        for (const child of this.children) {
            nodes.push(child);
            nodes.push(...child.descendants);

        }
        return nodes;
    }

    get end(): number {
        return this.jsonAstNode.end;
    }

    get interval(): Interval {
        return this.hasALineBreakBetweenPosAndStart() ? [this.getPosAfterFirstLineBreak(), this.jsonAstNode.end] : [this.jsonAstNode.pos, this.jsonAstNode.end];
    }

    get isNestingRoot(): boolean {
        return isNestingRoot(this.kind);
    }

    get isStructuralNode(): boolean {
        return isStructuralNode(this.kind);
    }

    get kind(): SyntaxKind {
        return this.jsonAstNode.kind as SyntaxKind;
    }

    get pos(): number {
        return this.jsonAstNode.pos;
    }

    get start(): number {
        return this.jsonAstNode.start;
    }

    get text(): string {
        return this.astFileText.slice(this.pos, this.end);
    }

    get textBetweenPosAndStart(): string {
        return this.astFileText.slice(this.pos, this.start);
    }

    get type(): string {
        return this.jsonAstNode.type;
    }

    private getPosAfterFirstLineBreak(): number {
        return this.pos + this.textBetweenPosAndStart.indexOf('\n') + 1;
    }

    private hasALineBreakBetweenPosAndStart(): boolean {
        return /\n/.test(this.textBetweenPosAndStart);
    }

    private setChildren(): void {
        const children: JsonAstNodeInterface[] = this.jsonAstNode.children ?? [];
        for (const child of children) {
            const newChild: AstNode = AstNodeService.generate(this, child, this.astFileText);
            this.children.push(newChild);
        }
        if (this.kind === SyntaxKind.CallExpression) {
            console.log(chalk.magentaBright('CHILDRRRRR'), this.name, this.kind, this.children.map(c => c.name));
        }
        // this.children.reverse();
    }

    private setIsRecursionAndIsCallback(): void {
        if (!isIdentifier(this.kind) || !this.parent || isFunc(this.parent.kind)) {
            return;
        }
        const funcNode: AstNode = getFunctionOrMethodNode(this);
        if (!funcNode) {
            return;
        }
        this.isRecursion = this.name === funcNode.name;
    }

    get isFirstSon(): boolean {
        return this === this.parent?.firstSon;
    }

    get firstSon(): AstNode {
        return this.children[0];
    }

    get identifierChild(): AstNode {
        return this.children.find(c => isIdentifier(c.kind));
    }

}
