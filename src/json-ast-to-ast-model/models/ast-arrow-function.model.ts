import { AstAbstract } from './ast-abstract.model';
import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';

export class AstArrowFunction extends AstAbstract {


    constructor(jsonAstNode: JsonAstNodeInterface, astFileText: string) {
        super(jsonAstNode, astFileText);
    }
}
