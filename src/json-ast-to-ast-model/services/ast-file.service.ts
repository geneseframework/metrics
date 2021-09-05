import { JsonAstFileInterface } from '../../core/interfaces/json-ast/json-ast-file.interface';
import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { AstClassService } from './ast-class.service';
import { AstFunctionService } from './ast-function.service';
import { AstArrowFunctionService } from './ast-arrow-function.service';
import { AstCodeService } from './ast-code.service';
import * as chalk from 'chalk';
import { AstLineService } from './ast-line.service';

export class AstFileService {

    static generate(jsonAstFile: JsonAstFileInterface): AstFile {
        const astFile = new AstFile(jsonAstFile);
        astFile.text = jsonAstFile.text;
        // console.log(chalk.greenBright('AST FFF TXT'), astFile.text);
        astFile.name = jsonAstFile.name;
        // astFile.astClasses = AstClassService.generate(astFile);
        // astFile.astFunctions = AstFunctionService.generate(astFile);
        // astFile.astArrowFunctions = AstArrowFunctionService.generate(astFile);
        // astFile.astCode = AstCodeService.generate(astFile);
        AstLineService.setLines(astFile);
            console.log(chalk.yellowBright('NB LINNNN'), astFile.astLines?.length);
// for (const astLine of astFile.astLines) {
//             console.log(chalk.magentaBright('AST LINNNN'), astLine.pos, astLine.text);
//         }
        return astFile;
    }
}
