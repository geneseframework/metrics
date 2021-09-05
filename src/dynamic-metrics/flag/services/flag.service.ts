// import * as chalk from 'chalk';
// import { ImportDeclaration, InterfaceDeclaration, MethodSignature, SourceFile } from 'ts-morph';
// import { EnumService } from './enum.service';
// import { KzFilePathService } from './kz-filepath.service';
// import { FlagStatementsService } from './flag-statements.service';
// import { FlagMethodsService } from './flag-methods.service';
// import { CallerInformations } from '../models/caller-informations.model';
// import { GLOBAL } from '../const/global.const';
// import { copyToKuzzyFolder } from '../utils/kuzzy-folder.util';
// import { getExtension, removeFiles } from '../utils/file-system.util';
// import { plural } from '../../../core/utils/strings.util';
// import { InitService } from './init.service';
// import { getOriginalSourceFile, hasStatements } from '../utils/ast-statements.util';
// import { addImportDeclarationFromRelativeOriginalPath, enumImports } from '../utils/ast-imports.util';

import { Options } from '../../../core/models/options.model';
import {
    Expression,
    SourceFile,
    Node,
    Statement,
    StatementedNode,
    SyntaxKind,
    SyntaxList,
    ClassDeclaration
} from 'ts-morph';
import * as chalk from 'chalk';
import { unique } from '../../../core/utils/arrays.util';
import { AstModel } from '../../../core/models/ast-model/ast.model';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';

const FORCE_CLONE = false;

export abstract class FlagService {


    static start(astModel: AstModel): void {
        // await EnumService.createEnumerableFiles();
        if (FORCE_CLONE) {
            // await this.resetFlags();
        }
        for (const astFile of astModel.astFiles) {
            // console.log(chalk.greenBright('AST FILLL'), astFile.astLines.filter(a => a.astNodes.length > 0));
            // console.log(chalk.greenBright('AST FILLL'), astFile.astLines.map(a => a.pos));
            this.flagAstFile(astFile);
        }
        // for (const sourceFile of Options.project.getSourceFiles()) {
        //     this.flagSourceFile(sourceFile);
        // }
    }


    static flagAstFile(astFile: AstFile): void {
        const sourceFile: SourceFile = Options.project.getSourceFile(astFile.name);
        // console.log(chalk.greenBright('TXTTTTTTT'), sourceFile.getFullText());
        // console.log(chalk.magentaBright('SRCFFFFF'), sourceFile?.getBaseName());
        const astLines: AstLine[] = astFile.astLines.filter(a => a.astNodes.length > 0).sort((a, b) => b.issue - a.issue);
        for (const astLine of astLines) {
            // console.log(chalk.cyanBright('LINESSSS ISSUE'), astLine.issue, astLine.pos);
            // sourceFile.insertText(astLine.pos, `flag(${astLine.issue});\n`);
        }
        // console.log(chalk.greenBright('TXTTTTTTT'), sourceFile.getFullText());
    }

    static flagSourceFile(sourceFile: SourceFile): void {
        this.addImportDeclarations(sourceFile);
        this.flagStatements(sourceFile);
        // const enumsImports: ImportDeclaration[] = enumImports(getOriginalSourceFile(sourceFile));
        // if (enumsImports.length > 0) {
        //     EnumService.setKuzzyEnumGetters(sourceFile, enumsImports);
        // }
        // console.log(chalk.blueBright('TXTTTTT'), sourceFile.getFullText());
        // TODO : save flagged file
        // sourceFile.saveSync();
    }

//
//     private static async resetFlags(): Promise<void> {
//         await removeFiles(GLOBAL.flaggedProject.getSourceFiles().map(s => s.getFilePath()));
//         await copyToKuzzyFolder(GLOBAL.project.getSourceFiles().map(s => s.getFilePath()));
//         await InitService.resetFlaggedProject();
//         GLOBAL.fileUtsToFlag = GLOBAL.flaggedProject.getSourceFiles();
//     }

    private static addImportDeclarations(sourceFile: SourceFile): void {
        this.addImports(sourceFile);
        // KzFilePathService.addConstants(sourceFile);
    }

    private static addImports(sourceFile: SourceFile): void {
        // ts.has
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'CreateInstance', '/frontend/flag/decorators/create-instance.decorator.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'Flash', '/frontend/flag/decorators/flash.decorator.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'parse', '/frontend/utils/coverage.util.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'ClassEnum', '/frontend/flag/models/class-enum.model.ts');
    }


    private static flagStatements(sourceFile: SourceFile): void {
    // private static flagStatements(sourceFile: Node | SourceFile): void {
        const zzz = sourceFile.getStartLineNumber();
        console.log(chalk.magentaBright('zzz'), zzz);
        const firstNodes: Node[] = sourceFile.getDescendants().filter(d => d.isFirstNodeOnLine());
        const starts: number[] = unique(firstNodes.map(f => f.getStart()).reverse());
        console.log(chalk.magentaBright('STRTTTT'), starts);
        for (const start of starts) {
            console.log(chalk.greenBright('start'), start);
            sourceFile.insertText(start, `// Flag\n`);
        }

        console.log(chalk.blueBright('TXTTTTT'), sourceFile.getFullText());
    }

    // private static flagStatements(sourceFile: SourceFile): void {
    //     let statements: (Statement | Expression)[] = sourceFile.getDescendantStatements();
    //     statements = statements.sort((a, b) => b.getStart() - a.getStart());
    //     // console.log(chalk.greenBright('STATEMENTTTTSSSS'), statements);
    //     const starts: number[] = statements.map(s => s.getStart());
    //     console.log(chalk.magentaBright('STATEMENTTTT'), starts);
    //     for (const statement of statements) {
    //         this.flagStatement(statement, sourceFile);
    //     }
    // }

    private static flagStatement(statement: Statement | Expression, sourceFile: SourceFile): void {
        console.log(chalk.blueBright('STATEMENTTTT'), statement.getKindName(), statement.getStart());
        // const stt = statement as StatementedNode<any>;
        sourceFile.insertStatements(0, `// Flaggggg\n`);
    }


//     private static flagInterfaces(sourceFile: SourceFile): void {
//         const interfaceDeclarations: InterfaceDeclaration[] = sourceFile.getInterfaces();
//         for (const interfaceDeclaration of interfaceDeclarations) {
//             this.addParameterToMethodSignaturesInInterfaces(interfaceDeclaration.getMethods());
//         }
//     }
//
//
//     private static addParameterToMethodSignaturesInInterfaces(methodSignatures: MethodSignature[]): void {
//         for (const methodSignature of methodSignatures) {
//             methodSignature.addParameter({ name: 'callingInstancePath', type: 'any' });
//         }
//     }
}
