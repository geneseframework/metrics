/**
 * A line of a Code object
 */
import { AstNode } from './ast-node.model';
import { isIdentifier, isKeyword, isLiteral, isLoop } from '../../utils/syntax-kind.util';
import { SyntaxKind } from '../../enum/syntax-kind.enum';

export class AstLine {

    astNodes?: AstNode[] = [];                              // The array of AstNodes corresponding to AST nodes in this line of code
    end ?= 0;                                               // The pos (in number of characters) of the end of the line
    astNodeIdentifiers: AstNode[] = [];
    issue ?= 0;                                             // The number of the line in its Code parentFunction (method)
    pos ?= 0;                                               // The absolute pos (in number of characters) of the line in the SourceFile
    text ?= '';                                             // The text of the line


    constructor(textLine: string, issue: number) {
        this.text = textLine;
        this.issue = issue;
    }

    get identifiers(): number {
        return this.astNodeIdentifiers.length;
    }

    get keywords(): number {
        return this.getNbElements(isKeyword);
    }

    get literals(): number {
        return this.getNbElements(isLiteral);
    }

    get loops(): number {
        return this.getNbElements(isLoop);
    }

    get words(): number {
        return this.identifiers + this.keywords + this.literals;
    }

    setCpxParameters(): void {
        this.setIdentifiersCpx();
    }

    private setIdentifiersCpx(): void {
        this.astNodeIdentifiers = this.astNodes.filter(a => isIdentifier(a.kind));
    }

    private getNbElements(isKindOf: (kind: string) => boolean): number {
        return this.astNodes.filter(a => isKindOf(a.kind as SyntaxKind)).length;
    }
}
