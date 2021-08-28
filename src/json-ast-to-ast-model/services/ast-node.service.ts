import { AstNode } from '../../core/models/ast-model/ast-node.model';
import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';

export class AstNodeService {

    static generate(jsonAstNode: JsonAstNodeInterface, astFileText: string): AstNode {
        return new AstNode(jsonAstNode, astFileText);
    }
}
