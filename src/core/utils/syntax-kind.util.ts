import { SyntaxKind } from '../enum/syntax-kind.enum';

export function isIdentifier(kind: string): boolean {
    return kind === SyntaxKind.Identifier;
}

// TODO : fix bug with keyword Class not detected
export function isKeyword(kind: string): boolean {
    return [SyntaxKind.Keyword,
        SyntaxKind.NumberKeyword,
        SyntaxKind.ClassDeclaration,
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

export function isNewBranch(kind: string): boolean {
    return [SyntaxKind.ForInStatement,
        SyntaxKind.ForKeyword,
        SyntaxKind.ForOfStatement,
        SyntaxKind.ForStatement,
        SyntaxKind.WhileStatement
    ].includes(kind as SyntaxKind);
}
