import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';
import { Interval } from '../../../json-ast-to-ast-model/types/interval.type';
import { SyntaxKind } from '../../enum/syntax-kind.enum';
import { getFunctionOrMethodNode, includes, isFunc, isIdentifier, isParameter } from '../../utils/syntax-kind.util';

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
        this.setIsRecursion();
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

    get firstAncestorNodeOfKindFunctionOrMethod(): AstNode {
        if (isFunc(this.kind)) {
            return this;
        }
        return this.parent ? this.parent.firstAncestorNodeOfKindFunctionOrMethod : undefined;
    }

    get firstSon(): AstNode {
        return this.children[0];
    }

    get interval(): Interval {
        return this.hasALineBreakBetweenPosAndStart() ? [this.getPosAfterFirstLineBreak(), this.jsonAstNode.end] : [this.jsonAstNode.pos, this.jsonAstNode.end];
    }

    get isCallExpressionIdentifier(): boolean {
        return isIdentifier(this.kind) && this.parent?.kind === SyntaxKind.CallExpression && this.isFirstSon;
    }

    get isFirstSon(): boolean {
        return this === this.parent?.firstSon;
    }

    get isFunc(): boolean {
        return includes([SyntaxKind.FunctionDeclaration, SyntaxKind.MethodDeclaration], this.kind);
    }

    get isIdentifier(): boolean {
        return this.kind === SyntaxKind.Identifier;
    }

    get isIf(): boolean {
        return this.kind === SyntaxKind.IfStatement;
    }

    get isKeyword(): boolean {
        return includes([SyntaxKind.Keyword, SyntaxKind.NumberKeyword, SyntaxKind.VariableDeclaration], this.kind);
    }

    get isLiteral(): boolean {
        return this.kind === SyntaxKind.Literal;
    }

    get isLoop(): boolean {
        return includes([SyntaxKind.ForInStatement, SyntaxKind.ForKeyword, SyntaxKind.ForOfStatement, SyntaxKind.ForStatement, SyntaxKind.WhileStatement], this.kind);
    }

    get isNestingRoot(): boolean {
        return includes([SyntaxKind.SourceFile, SyntaxKind.ClassDeclaration, SyntaxKind.MethodDeclaration, SyntaxKind.FunctionDeclaration], this.kind);
    }

    get isParameter(): boolean {
        return this.kind === SyntaxKind.Parameter;
    }

    get isStructuralNode(): boolean {
        return this.isLoop || this.isIf || this.isSwitch;
    }

    get isSwitch(): boolean {
        return this.kind === SyntaxKind.SwitchStatement;
    }

    get kind(): SyntaxKind {
        return this.jsonAstNode.kind as SyntaxKind;
    }

    get parameters(): AstNode[] {
        return isFunc(this.kind) ? this.children.filter(c => isParameter(c.kind)) : [];
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
    }

    private setIsRecursion(): void {
        if (!isIdentifier(this.kind) || !this.parent || isFunc(this.parent.kind)) {
            return;
        }
        const funcNode: AstNode = getFunctionOrMethodNode(this);
        if (!funcNode) {
            return;
        }
        this.isRecursion = this.name === funcNode.name;
    }

}
