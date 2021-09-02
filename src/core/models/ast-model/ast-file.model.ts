import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { AstAbstract } from './ast-abstract.model';
import { AstLine } from './ast-line.model';

export class AstFile extends AstAbstract {

    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;

    constructor(jsonAstFile: JsonAstFileInterface) {
        super(jsonAstFile.astNode, jsonAstFile.text);
        this.jsonAstFile = jsonAstFile;
    }

    setComplexities(metricParameters: string[]): void {
        for (const metricParameter of metricParameters) {
            this.setComplexity(metricParameter);
        }
    }

    private setComplexity(metricParameter: string): void {
        const astLines: AstLine[] = this.astCode.astLines;
        for (const astLine of astLines) {
            astLine.setComplexity(metricParameter);
        }
    }

}
