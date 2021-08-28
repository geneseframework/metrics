import { SyntaxKind } from '../enum/syntax-kind.enum';

export function isIdentifier(kind: string): boolean {
    return kind === SyntaxKind.Identifier;
}

export function isKeyword(kind: string): boolean {
    return [SyntaxKind.Keyword, SyntaxKind.NumberKeyword].includes(kind as SyntaxKind);
}

export function isLiteral(kind: string): boolean {
    return kind === SyntaxKind.Literal;
}
