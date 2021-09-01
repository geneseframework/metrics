import { SyntaxKind } from '../enum/syntax-kind.enum';

export function isIdentifier(kind: string): boolean {
    return kind === SyntaxKind.Identifier;
}

export function isKeyword(kind: string): boolean {
    return [SyntaxKind.Keyword,
        SyntaxKind.NumberKeyword,
        SyntaxKind.VariableDeclaration,
    ].includes(kind as SyntaxKind);
}

export function isLiteral(kind: string): boolean {
    return kind === SyntaxKind.Literal;
}

export function isLoop(kind: string): boolean {
    return [SyntaxKind.ForInStatement,
        SyntaxKind.ForKeyword,
        SyntaxKind.ForOfStatement,
        SyntaxKind.ForStatement,
        SyntaxKind.WhileStatement
    ].includes(kind as SyntaxKind);
}

export function isIf(kind: string): boolean {
    return [SyntaxKind.IfStatement].includes(kind as SyntaxKind);
}

export function isStructuralNode(kind: string): boolean {
    return isLoop(kind) || isIf(kind) || isSwitch(kind);
}

export function isSwitch(kind: string): boolean {
    return [SyntaxKind.SwitchStatement].includes(kind as SyntaxKind);
}
