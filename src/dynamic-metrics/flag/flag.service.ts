import { Options } from '../../core/models/options.model';
import { Block, FunctionDeclaration, Node, SourceFile, Statement, SyntaxKind } from 'ts-morph';
import { AstModel } from '../../core/models/ast-model/ast.model';
import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { ensureDirAndCopy } from '../../core/utils/file-system.util';
import { execSync } from 'child_process';
import { Interval, isInInterval } from '../../json-ast-to-ast-model/types/interval.type';
import { TextToInsert } from './text-to-insert.type';


export abstract class FlagService {


    static start(astModel: AstModel): void {
        this.copyFlagger();
        for (const astFile of astModel.astFiles) {
            const sourceFile: SourceFile = Options.flaggedProject.getSourceFile(astFile.name);
            if (this.hasTraceFunction(astFile)) {
                this.flagSourceFile(sourceFile);
            }
            this.addLocalModuleScopeInfo(sourceFile);
            sourceFile.saveSync();
        }
        this.transpile();
    }

    private static hasTraceFunction(astFile: AstFile): boolean {
        return !!astFile.descendants.find(d => d.kind === 'FunctionDeclaration' && d.name === Options.traceFunctionName);
    }

    private static copyFlagger(): void {
        const source2 = `${Options.pathCommand}/src/dynamic-metrics/flag/flagger`;
        const target2 = `${Options.pathFlaggedFiles}/flagger`;
        ensureDirAndCopy(source2, target2);
    }

    private static flagSourceFile(sourceFile: SourceFile): void {
        this.flagStatements(sourceFile);
        sourceFile.addImportDeclaration({defaultImport: '{flag, startTrace, endTrace}', moduleSpecifier: './flagger/flagger.util.js'});
        this.addStartTracingFunction(sourceFile);
    }

    private static flagStatements(sourceFile: SourceFile): void {
        const statements: Statement[] = sourceFile.getStatements().sort((a, b) => b.getPos() - a.getPos());
        const flagsToInsert: TextToInsert[] = [];
        for (const statement of statements) {
            flagsToInsert.push(...this.getFlagsToInsert(sourceFile, statement));
        }
        this.insertFlags(sourceFile, flagsToInsert);
    }

    private static getFlagsToInsert(sourceFile: SourceFile, node: Node): TextToInsert[] {
        const flagsToInsert: TextToInsert[] = [];
        if (this.isInTraceProcessBlock(sourceFile, node)) {
            return [];
        }
        switch (node.getKind()) {
            case SyntaxKind.FunctionDeclaration:
                flagsToInsert.push(this.getFlagToInsertForFunctionDeclaration(node as FunctionDeclaration));
                break;
            case SyntaxKind.ExpressionStatement:
            case SyntaxKind.ForInStatement:
            case SyntaxKind.ForOfStatement:
            case SyntaxKind.ForStatement:
            case SyntaxKind.IfStatement:
            case SyntaxKind.ReturnStatement:
            case SyntaxKind.VariableStatement:
                flagsToInsert.push({position: node.getPos(), text: `\nflag('${sourceFile.getBaseName()}', ${node.getStartLineNumber()});`, sortPosition: node.getPos()});
                break;
        }
        for (const child of node.getChildren()) {
            flagsToInsert.push(...this.getFlagsToInsert(sourceFile, child));
        }
        return flagsToInsert;
    }

    private static getFlagToInsertForFunctionDeclaration(functionDeclaration: FunctionDeclaration): TextToInsert {
        const block: Block = functionDeclaration.getFirstChildByKind(SyntaxKind.Block);
        return {position: block.getStart() + 1, text: `\nflag('${functionDeclaration.getSourceFile().getBaseName()}', ${functionDeclaration.getStartLineNumber()});`, sortPosition: block.getStart() - 0.5};
    }

    private static insertFlags(sourceFile: SourceFile, flagsToInsert: TextToInsert[]): void {
        flagsToInsert = flagsToInsert.sort((a, b) => b.sortPosition - a.sortPosition);
        for (const flagToInsert of flagsToInsert) {
            sourceFile.insertText(flagToInsert.position, flagToInsert.text);
        }
    }

    private static isInTraceProcessBlock(sourceFile: SourceFile, node: Node): boolean {
        let traceProcessBlock: FunctionDeclaration = this.getTraceProcessDeclaration(sourceFile);
        const interval: Interval = [traceProcessBlock.getPos(), traceProcessBlock.getEnd()];
        return isInInterval(node.getStart(), interval);
    }

    private static addStartTracingFunction(sourceFile: SourceFile): void {
        let traceProcessBlock: Block = this.getTraceProcessBlock(sourceFile);
        sourceFile.insertText(traceProcessBlock.getEnd() - 1, '\n    endTrace();\n');
        traceProcessBlock = this.getTraceProcessBlock(sourceFile);
        sourceFile.insertText(traceProcessBlock.getStart() + 1, '\n    startTrace();\n');
    }

    private static getTraceProcessBlock(sourceFile: SourceFile): Block {
        return sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
            .find(d => d.getName() === Options.traceFunctionName)
            .getChildrenOfKind(SyntaxKind.Block)[0];
    }

    private static getTraceProcessDeclaration(sourceFile: SourceFile): FunctionDeclaration {
        return sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
            .find(d => d.getName() === Options.traceFunctionName);
    }

    private static transpile(): void {
        execSync(`tsc ${Options.pathOutDir}/**/*.ts`, {encoding: 'utf-8'});
        execSync(`tsc ${Options.pathOutDir}/flagged-files/flagger/*.ts`, {encoding: 'utf-8'});
    }

    private static addLocalModuleScopeInfo(sourceFile: SourceFile): void {
        sourceFile.insertText(0, 'export {}\n\n');
    }

}
