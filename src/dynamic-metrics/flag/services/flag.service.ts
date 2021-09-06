import { Options } from '../../../core/models/options.model';
import { SourceFile } from 'ts-morph';
import { AstModel } from '../../../core/models/ast-model/ast.model';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { addImportDeclaration } from '../utils/ast-imports.util';
import * as chalk from 'chalk';
import { copyFile } from '../../../core/utils/file-system.util';


export abstract class FlagService {


    static start(astModel: AstModel): void {
        this.copyFlagger();
        for (const astFile of astModel.astFiles) {
            this.flagAstFile(astFile);
        }
    }

    private static copyFlagger(): void {
        // const source = `${Options.pathCommand}/src/dynamic-metrics/flag/utils/flagger.util.js`;
        // const target = `${Options.pathFlaggedFiles}/flagger/flagger.util.js`;
        // copyFile(source, target);
        const source2 = `${Options.pathCommand}/src/dynamic-metrics/flag/utils/flagger.util.ts`;
        const target2 = `${Options.pathFlaggedFiles}/flagger/flagger.util.ts`;
        copyFile(source2, target2);

    }

    private static flagAstFile(astFile: AstFile): void {
        const sourceFile: SourceFile = Options.flaggedProject.getSourceFile(astFile.name);
        const astLinesInReverseOrder: AstLine[] = astFile.astLines.filter(a => a.astNodes.length > 0)
            .sort((a, b) => b.issue - a.issue);
        for (const astLine of astLinesInReverseOrder) {
            sourceFile.insertText(astLine.pos, `flag(${astLine.issue});\n`);
        }
        addImportDeclaration(sourceFile, 'flag', './flagger/flagger.util.js');
        // console.log(chalk.blueBright('FILE TXTTTTT'), sourceFile.getFullText());
        sourceFile.saveSync();
    }

}
