import { AstFile } from '../models/ast-model/ast-file.model';
import { AstClass } from '../models/ast-model/ast-class.model';

export type AstFileOrClass = AstFile | AstClass;


export function isAstFile(value: any): value is AstFile {
    return value instanceof AstFile;
}
