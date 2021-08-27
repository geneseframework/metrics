import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';
import { AstFunction } from '../models/ast-function.model';
import { AstArrowFunction } from '../models/ast-arrow-function.model';
import { AstFunctionService } from './ast-function.service';
import { AstArrowFunctionService } from './ast-arrow-function.service';

export class AstFuncOrArrowFuncService {


    static create(jsonAstNodeInterface: JsonAstNodeInterface, astFileText: string, astClassPos: number, isArrowFunc = false): AstFunction {
        const astFunc = isArrowFunc ? new AstFunction(jsonAstNodeInterface, astFileText) : new AstArrowFunction(jsonAstNodeInterface, astFileText);
        astFunc.name = jsonAstNodeInterface.name;
        astFunc.astFunctions = AstFunctionService.generate(astFunc);
        astFunc.astArrowFunctions = AstArrowFunctionService.generate(astFunc);
        astFunc.text = astFileText.slice(jsonAstNodeInterface.pos, jsonAstNodeInterface.end);
        return astFunc;
    }


}
