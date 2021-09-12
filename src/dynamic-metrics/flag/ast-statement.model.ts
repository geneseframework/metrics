import { Node, Statement, SyntaxKind } from 'ts-morph';

export function isStatement(node: Node): node is Statement {
    return [
        SyntaxKind.ForInStatement,
        SyntaxKind.ForOfStatement,
        SyntaxKind.ForStatement,
        SyntaxKind.FunctionDeclaration,
        SyntaxKind.IfStatement,
        SyntaxKind.ReturnStatement,
        SyntaxKind.VariableStatement,
    ].includes(node.getKind() as any);
}
