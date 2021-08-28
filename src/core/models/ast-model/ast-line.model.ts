/**
 * A line of a Code object
 */
import { AstNode } from './ast-node.model';
import { isIdentifier, isKeyword, isLiteral } from '../../utils/syntax-kind.util';

export class AstLine {

    astNodes?: AstNode[] = [];                              // The array of AstNodes corresponding to AST nodes in this line of code
    end ?= 0;                                               // The pos (in number of characters) of the end of the line
    identifiers: AstNode[] = [];
    issue ?= 0;                                             // The number of the line in its Code parentFunction (method)
    pos ?= 0;                                               // The absolute pos (in number of characters) of the line in the SourceFile
    text ?= '';                                             // The text of the line


    constructor(textLine: string, issue: number) {
        this.text = textLine;
        this.issue = issue;
    }

    get nbIdentifiers(): number {
        return this.identifiers.length;
    }

    get nbKeywords(): number {
        return this.astNodes.filter(a => isKeyword(a.kind)).length;
    }

    get nbLiterals(): number {
        return this.astNodes.filter(a => isLiteral(a.kind)).length;
    }

    get nbWords(): number {
        return this.nbIdentifiers + this.nbKeywords + this.nbLiterals;
    }

    setCpxParameters(): void {
        this.setIdentifiersCpx();
    }

    private setIdentifiersCpx(): void {
        this.identifiers = this.astNodes.filter(a => isIdentifier(a.kind));
    }
}
