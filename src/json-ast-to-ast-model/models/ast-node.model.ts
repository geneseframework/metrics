import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';
import { AstNodeService } from '../services/ast-node.service';
import { Interval } from '../types/interval.type';
import * as chalk from 'chalk';

export class AstNode {

    astFileText: string = undefined;
    children: AstNode[] = [];
    jsonAstNode: JsonAstNodeInterface = undefined;

    constructor(jsonAstNode: JsonAstNodeInterface, astFileText: string) {
        this.jsonAstNode = jsonAstNode;
        this.astFileText = astFileText;
        this.setChildren();
    }

    get end(): number {
        return this.jsonAstNode.end;
    }

    get interval(): Interval {
        if (this.hasALineBreakBetweenPosAndStart()) {
            return [this.getPosAfterFirstLineBreak(), this.jsonAstNode.end];
        } else {
            return [this.jsonAstNode.pos, this.jsonAstNode.end];
        }
    }

    get kind(): string {
        return this.jsonAstNode.kind;
    }

    get name(): string {
        return this.jsonAstNode.name;
    }

    get descendants(): AstNode[] {
        const nodes: AstNode[] = [];
        for (const child of this.children) {
            nodes.push(child);
            nodes.push(...child.descendants);

        }
        return nodes;
    }

    get pos(): number {
        return this.jsonAstNode.pos;
    }

    get start(): number {
        return this.jsonAstNode.start;
    }

    get type(): string {
        return this.jsonAstNode.type;
    }

    private getPosAfterFirstLineBreak(): number {
        return undefined;
    }

    private hasALineBreakBetweenPosAndStart(): boolean {
        const textBeforeStart: string = this.astFileText.slice(this.pos, this.start);
        console.log(chalk.redBright('TEXT BEFORE STARTTTT'), textBeforeStart);
        return /\//.test(textBeforeStart);
    }

    private setChildren(): void {
        const children: JsonAstNodeInterface[] = this.jsonAstNode.children ?? [];
        for (const child of children) {
            this.children.push(AstNodeService.generate(child, this.astFileText));
        }
    }

}
