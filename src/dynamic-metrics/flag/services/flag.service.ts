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
import { Expression, SourceFile, Statement, SyntaxKind } from 'ts-morph';
import * as chalk from 'chalk';

const FORCE_CLONE = false;

export abstract class FlagService {


    static start(): void {
        // await EnumService.createEnumerableFiles();
        if (FORCE_CLONE) {
            // await this.resetFlags();
        }
        // console.log(chalk.yellowBright(`Flag ${GLOBAL.fileUtsToFlag.length} ${plural('file', GLOBAL.fileUtsToFlag.length)}...`));
        for (const sourceFile of Options.project.getSourceFiles()) {
            this.flagSourceFile(sourceFile);
        }
    }


    static flagSourceFile(sourceFile: SourceFile): void {
        this.addImportDeclarations(sourceFile);
        this.flagStatements(sourceFile);
        // this.flagInterfaces(sourceFile);
        // const enumsImports: ImportDeclaration[] = enumImports(getOriginalSourceFile(sourceFile));
        // if (enumsImports.length > 0) {
        //     EnumService.setKuzzyEnumGetters(sourceFile, enumsImports);
        // }
        sourceFile.saveSync();
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
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'CreateInstance', '/frontend/flag/decorators/create-instance.decorator.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'Flash', '/frontend/flag/decorators/flash.decorator.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'parse', '/frontend/utils/coverage.util.ts');
        // addImportDeclarationFromRelativeOriginalPath(sourceFile, 'ClassEnum', '/frontend/flag/models/class-enum.model.ts');
    }

    private static flagStatements(sourceFile: SourceFile): void {
        const statements: (Statement | Expression)[] = sourceFile.getDescendantStatements();
        // console.log(chalk.greenBright('STATEMENTTTTSSSS'), statements);
        for (const statement of statements) {
            this.flagStatement(statement);
        }
    }

    private static flagStatement(statement: (Statement | Expression)): void {
        console.log(chalk.blueBright('STATEMENTTTT'), statement.getKindName());
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
