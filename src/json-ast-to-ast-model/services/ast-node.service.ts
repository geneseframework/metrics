import { AstNode } from '../models/ast-node.model';
import { JsonAstNodeInterface } from '../../core/interfaces/json-ast/json-ast-node.interface';

export class AstNodeService {

    static generate(jsonAstNode: JsonAstNodeInterface, astFileText: string): AstNode {
        const astNode = new AstNode(jsonAstNode, astFileText);
        return astNode;
    }
}
