/**
 * A line of a Code object
 */
import { AstNode } from './ast-node.model';

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

    get callbacks(): number {
        return this.astNodes?.filter(a => a.isCallback).length;
    }

    get identifiers(): number {
        return this.astNodeIdentifiers.length;
    }

    get ifs(): number {
        return this.getNbElements('isIf');
    }

    get keywords(): number {
        return this.getNbElements('isKeyword');
    }

    get literals(): number {
        return this.getNbElements('isLiteral');
    }

    get loops(): number {
        return this.getNbElements('isLoop');
    }

    get recursions(): number {
        return this.astNodes?.filter(a => a.isRecursion).length;
    }

    get switches(): number {
        return this.getNbElements('isSwitch');
    }

    get words(): number {
        return this.identifiers + this.keywords + this.literals;
    }

    setCpxParameters(): void {
        this.setIdentifiersCpx();
    }

    private setIdentifiersCpx(): void {
        this.astNodeIdentifiers = this.astNodes.filter(a => a.isIdentifier);
    }

    private getNbElements(isKindOf: string): number {
        return this.astNodes.filter(a => a[isKindOf]).length;
    }
}
