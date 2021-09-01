import { AstNode } from './ast-node.model';
import { AstNodeService } from '../../../json-ast-to-ast-model/services/ast-node.service';
import { JsonAstNodeInterface } from '../../interfaces/json-ast/json-ast-node.interface';
import { AstCode } from './ast-code.model';
import { Interval, isInInterval } from '../../../json-ast-to-ast-model/types/interval.type';
import { AstArrowFunction } from './ast-arrow-function.model';
import { AstClass } from './ast-class.model';
import { AstFunction } from './ast-function.model';
import { AstLine } from './ast-line.model';
import { SyntaxKind } from '../../enum/syntax-kind.enum';
import { isIf, isStructuralNode } from '../../utils/syntax-kind.util';
import * as chalk from 'chalk';

export abstract class AstAbstract {

    astArrowFunctions: AstArrowFunction[] = [];
    astClasses: AstClass[] = [];
    astCode: AstCode = undefined;
    astFileText: string = undefined;
    astFunctions: AstFunction[] = [];
    astNode: AstNode = undefined;
    jsonAstNode: JsonAstNodeInterface = undefined;
    name = undefined;
    text = '';

    protected constructor(jsonAstNode: JsonAstNodeInterface, astFileText: string) {
        this.astFileText = astFileText;
        this.jsonAstNode = jsonAstNode;
        this.setAstNode();
        this.setNesting(this.astNode);
    }

    get astAbstracts(): AstAbstract[] {
        return this.astArrowFunctions.concat(this.astFunctions).concat(this.astClasses);
    }

    get code(): string {
        return this.lines.map(l => l.text).join('\n');
    }

    get interval(): Interval {
        return this.astNode.interval;
    }

    get classesAndFunctionsIntervals(): Interval[] {
        return this.astAbstracts.map(a => a.interval);
    }

    get kind(): string {
        return this.astNode.kind;
    }

    get length(): number {
        return this.jsonAstNode.end - this.jsonAstNode.pos ?? 0;
    }

    get lines(): AstLine[] {
        return this.astCode?.astLines ?? [];
    }

    positionInterval(position: number): Interval {
        return this.classesAndFunctionsIntervals.find(i => isInInterval(position, i));
    }

    private setAstNode(): void {
        this.astNode = AstNodeService.generate(undefined, this.jsonAstNode, this.astFileText);
    }

    private setNesting(astNode: AstNode): void {
        if (astNode.isNestingRoot) {
            astNode.nesting = 0;
        } else if (isStructuralNode(astNode.kind)) {
            astNode.nesting = astNode.parent.nesting + 1;
        } else {
            astNode.nesting = astNode.parent.nesting;
        }
        // console.log(chalk.magentaBright('KINDDDD'), astNode.parent?.kind, astNode.kind, astNode.text, astNode.nesting);
        for (const child of astNode.children) {
            this.setNesting(child);
        }
    }
}
