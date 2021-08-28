/**
 * A line of a Code object
 */
import { AstNode } from './ast-node.model';
import { SyntaxKind } from '../../enum/syntax-kind.enum';

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

    setCpxParameters(): void {
        this.setIdentifiersCpx();
    }

    private setIdentifiersCpx(): void {
        this.identifiers = this.astNodes.filter(a => a.kind === SyntaxKind.Identifier);
        // console.log(chalk.blueBright('NB IDDDDDD'), this.text, this.nbIdentifiers);
    }
}
