import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';
import { Interval } from '../../../json-ast-to-ast-model/types/interval.type';

export class AstNode {

    astFileText: string = undefined;
    children: AstNode[] = [];
    jsonAstNode: JsonAstNodeInterface = undefined;

    constructor(jsonAstNode: JsonAstNodeInterface, astFileText: string) {
        this.jsonAstNode = jsonAstNode;
        this.astFileText = astFileText;
        this.setChildren();
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

    get kind(): string {
        return this.jsonAstNode.kind;
    }

    get name(): string {
        return this.jsonAstNode.name;
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
            this.children.push(AstNodeService.generate(child, this.astFileText));
        }
    }

}