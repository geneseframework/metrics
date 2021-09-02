import { SyntaxKind } from '../enum/syntax-kind.enum';
import { AstNode } from '../models/ast-model/ast-node.model';

export function getFunctionOrMethodNode(astNode: AstNode): AstNode {
    if (isFunc(astNode.kind)) {
        return astNode;
    }
    return astNode.parent ? getFunctionOrMethodNode(astNode.parent) : undefined;
}

export function isCallExpressionIdentifier(astNode: AstNode): boolean {
    return isIdentifier(astNode.kind) && astNode.parent?.kind === SyntaxKind.CallExpression && astNode.isFirstSon;
}

export function isFunc(kind: SyntaxKind): boolean {
    return includes([SyntaxKind.FunctionDeclaration, SyntaxKind.MethodDeclaration], kind);
}

export function isIdentifier(kind: SyntaxKind): boolean {
    return kind === SyntaxKind.Identifier;
}

export function isIf(kind: SyntaxKind): boolean {
    return kind === SyntaxKind.IfStatement;
}

export function isKeyword(kind: SyntaxKind): boolean {
    return includes([SyntaxKind.Keyword, SyntaxKind.NumberKeyword, SyntaxKind.VariableDeclaration], kind);
}

export function isLiteral(kind: SyntaxKind): boolean {
    return kind === SyntaxKind.Literal;
}

export function isLoop(kind: SyntaxKind): boolean {
    return includes([SyntaxKind.ForInStatement, SyntaxKind.ForKeyword, SyntaxKind.ForOfStatement, SyntaxKind.ForStatement, SyntaxKind.WhileStatement], kind);
}

export function isNestingRoot(kind: SyntaxKind): boolean {
    return includes([SyntaxKind.SourceFile, SyntaxKind.ClassDeclaration, SyntaxKind.MethodDeclaration, SyntaxKind.FunctionDeclaration], kind);
}

export function isParameter(kind: SyntaxKind): boolean {
    return kind === SyntaxKind.Parameter;
}

export function isStructuralNode(kind: SyntaxKind): boolean {
    return isLoop(kind) || isIf(kind) || isSwitch(kind);
}

export function isSwitch(kind: SyntaxKind): boolean {
    return kind === SyntaxKind.SwitchStatement;
}

export function includes(syntaxKinds: any[], kind: SyntaxKind): boolean {
    return syntaxKinds.includes(kind);
}
