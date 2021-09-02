import { SyntaxKind } from '../enum/syntax-kind.enum';


export function includes(syntaxKinds: any[], kind: SyntaxKind): boolean {
    return syntaxKinds.includes(kind);
}
