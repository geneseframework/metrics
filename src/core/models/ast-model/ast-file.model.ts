import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { AstAbstract } from './ast-abstract.model';
import { AstLine } from './ast-line.model';
import { AstNode } from './ast-node.model';

export class AstFile extends AstAbstract {

    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;

    constructor(jsonAstFile: JsonAstFileInterface) {
        super(jsonAstFile.astNode, jsonAstFile.text);
        this.jsonAstFile = jsonAstFile;
    }

    setComplexities(metricParameters: string[]): void {
        for (const metricParameter of metricParameters) {
            // switch (metricParameter) {
            //     case 'nesting':
            //         this.setNestingCpx();
            //         break;
            //     default:
                    this.setComplexity(metricParameter);
            // }
        }
    }

    private setComplexity(metricParameter: string): void {
        const astLines: AstLine[] = this.astCode.astLines;
        for (const astLine of astLines) {
            // astLine.setComplexity(metricParameter);
        }
    }

    // setComplexity(metricParameter: string): void {
    //     switch (metricParameter) {
    //         case 'nesting':
    //             this.setNestingCpx();
    //             break;
    //         default:
    //         // this[metricParameter] = this[metricParameter];
    //         // this.cpx[metricParameter] = this[metricParameter];
    //         // this.cpx[metricParameter] = round(this[metricParameter] * GENESE_WEIGHTS[metricParameter], 1);
    //     }
    // }
    //
    // private setNestingCpx(): void {
    //     const structuralNodes: AstNode[] = this.astNodes.filter(a => a.isStructuralNode);
    //     for (const structuralNode of structuralNodes) {
    //         this.setNestingCpxNode(structuralNode);
    //     }
    // }
    //
    // private setNestingCpxNode(structuralNode: AstNode): void {
    //     this.nesting += structuralNode.nesting - 1;
    //     // this.cpx.nesting += (structuralNode.nesting - 1) * GENESE_WEIGHTS.nesting;
    // }

}
