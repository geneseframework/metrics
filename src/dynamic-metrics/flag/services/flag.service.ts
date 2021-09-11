import { Options } from '../../../core/models/options.model';
import { Block, FunctionDeclaration, SourceFile, SyntaxKind } from 'ts-morph';
import { AstModel } from '../../../core/models/ast-model/ast.model';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ensureDirAndCopy } from '../../../core/utils/file-system.util';
import { execSync } from 'child_process';
import * as chalk from 'chalk';


export abstract class FlagService {


    static start(astModel: AstModel): void {
        this.copyFlagger();
        for (const astFile of astModel.astFiles) {
            const sourceFile: SourceFile = Options.flaggedProject.getSourceFile(astFile.name);
            if (this.hasTraceFunction(astFile)) {
                this.flagAstFile(astFile, sourceFile);
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

    private static flagAstFile(astFile: AstFile, sourceFile: SourceFile): void {
        const astLinesInReverseOrder: AstLine[] = astFile.astLines.filter(a => a.astNodes.length > 0)
            .sort((a, b) => b.issue - a.issue);
        for (const astLine of astLinesInReverseOrder) {
            sourceFile.insertText(astLine.pos, `flag('${astFile.name}', ${astLine.issue});\n`);
        }
        sourceFile.addImportDeclaration({defaultImport: '{flag, startTrace}', moduleSpecifier: './flagger/flagger.util.js'});
        // addImportDeclaration(sourceFile, 'flag', './flagger/flagger.util.js');
        this.addStartTracingFunction(sourceFile);
        // console.log(chalk.blueBright('FILE TXTTTTT'), sourceFile.getFullText());
    }

    private static addStartTracingFunction(sourceFile: SourceFile): void {
        let traceProcessBlock: Block = this.getTraceProcessDeclaration(sourceFile);
        sourceFile.insertText(traceProcessBlock.getStart() + 1, '\nstartTrace();\n');
    }

    private static getTraceProcessDeclaration(sourceFile: SourceFile): Block {
        return sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
            .find(d => d.getName() === Options.traceFunctionName)
            .getChildrenOfKind(SyntaxKind.Block)[0];
    }

    private static transpile(): void {
        execSync(`tsc ${Options.pathOutDir}/**/*.ts`, {encoding: 'utf-8'});
        execSync(`tsc ${Options.pathOutDir}/flagged-files/flagger/*.ts`, {encoding: 'utf-8'});
    }

    private static addLocalModuleScopeInfo(sourceFile: SourceFile): void {
        sourceFile.insertText(0, 'export {}\n\n');
    }

}
