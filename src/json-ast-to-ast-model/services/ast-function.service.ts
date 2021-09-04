import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { AstFunction } from '../../core/models/ast-model/ast-function.model';
import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';
import { SyntaxKind } from '../../core/enum/syntax-kind.enum';
import { AstFileOrClass, isAstFile } from '../../core/types/ast-file-or-class.type';
import { AstClass } from '../../core/models/ast-model/ast-class.model';
import { AstFuncOrArrowFuncService } from './ast-func-or-arrow-func.service';

export class AstFunctionService {

    static generate(astFile: AstFile): AstFunction[]
    static generate(astClass: AstClass): AstFunction[]
    static generate(astFileOrClass: AstFileOrClass): AstFunction[] {
        const jsonAstFunctions: JsonAstNodeInterface[] = this.getFunctionDeclarations(astFileOrClass);
        const astFunctions: AstFunction[] = [];
        for (const jsonAstFunction of jsonAstFunctions) {
            astFunctions.push(AstFuncOrArrowFuncService.create(jsonAstFunction, astFileOrClass.astFileText, astFileOrClass.jsonAstNode.pos));
        }
        return astFunctions;
    }

    protected static getFunctionDeclarations(astFileOrClass: AstFileOrClass): JsonAstNodeInterface[] {
        if (isAstFile(astFileOrClass)) {
            return astFileOrClass.jsonAstNode.children.filter(c => c.kind === SyntaxKind.FunctionDeclaration);
        } else {
            return astFileOrClass.jsonAstNode.children.filter(c => c.kind === SyntaxKind.MethodDeclaration);
        }
    }
}
