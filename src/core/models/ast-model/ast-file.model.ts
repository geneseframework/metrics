import { JsonAstFileInterface } from '../../interfaces/json-ast/json-ast-file.interface';
import { AstAbstract } from './ast-abstract.model';

export class AstFile extends AstAbstract {

    jsonAstFile: JsonAstFileInterface = undefined;
    measureValue: number;

    constructor(jsonAstFile: JsonAstFileInterface) {
        super(jsonAstFile.astNode, jsonAstFile.text);
        this.jsonAstFile = jsonAstFile;
    }

}
