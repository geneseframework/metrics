import { JsonAstFileInterface } from '../../core/interfaces/json-ast/json-ast-file.interface';
import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { AstLineService } from './ast-line.service';

export class AstFileService {

    static generate(jsonAstFile: JsonAstFileInterface): AstFile {
        const astFile = new AstFile(jsonAstFile);
        astFile.text = jsonAstFile.text;
        astFile.name = jsonAstFile.name;
        AstLineService.setLines(astFile);
        return astFile;
    }
}
