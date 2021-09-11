import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
import { Project } from 'ts-morph';
import { Options } from '../core/models/options.model';
import { ensureDirAndCopy } from '../core/utils/file-system.util';
import { FlagService } from './flag/services/flag.service';
import { ExecutionService } from './execution/execution.service';
import { ProcessTrace } from './flag/flagger/process-trace.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { AstLine } from '../core/models/ast-model/ast-line.model';
import { AstNode } from '../core/models/ast-model/ast-node.model';
import { SyntaxKind } from '../core/enum/syntax-kind.enum';

export class DynamicService {

    static async start(astModel: AstModel): Promise<void> {
        // console.log(chalk.magentaBright('DYNAMICCCCC'), astModel.astMetrics);
        const hasDynamicMetric = true; // TODO
        if (hasDynamicMetric) {
            this.createFlaggedProject();
            FlagService.start(astModel);
            const processTraces: ProcessTrace[] = ExecutionService.start(astModel);
            this.setDynamicAstLines(astModel, processTraces);
        }
    }


    private static createFlaggedProject(): void {
        ensureDirAndCopy(Options.pathFolderToAnalyze, Options.pathFlaggedFiles);
        Options.flaggedProject = new Project();
        Options.flaggedProject.addSourceFilesAtPaths( `${Options.pathFlaggedFiles}/*.ts`);
    }

    private static setDynamicAstLines(astModel: AstModel, processTraces: ProcessTrace[]): void {
        const astFiles: AstFile[] = [];
        for (const astFile of astModel.astFiles) {
            if (this.hasTraceFunction(astFile)) {
                astFiles.push(this.getAstFileWithDynamicCode(astFile, processTraces));
            } else {
                astFiles.push(astFile);
            }
        }
        for (const astMetric of astModel.astMetrics) {
            astMetric.astFiles = astFiles;
        }
    }

    private static getAstFileWithDynamicCode(astFile: AstFile, processTraces: ProcessTrace[]): AstFile {
        const dynamicAstFile = new AstFile(astFile.jsonAstFile);
        const astLines: AstLine[] = [];
        const processTrace: ProcessTrace = processTraces.find(p => p.fileName === astFile.name);
        for (const line of processTrace.lines) {
            const astLine: AstLine = astFile.astLines.find(a => a.issue === line);
            astLines.push(astLine);
        }
        dynamicAstFile.astLines = astLines;
        return dynamicAstFile;
    }

    static hasTraceFunction(astFile: AstFile): boolean {
        return !!astFile.astNode.children.find(c => c.kind === 'FunctionDeclaration' && c.name === Options.traceFunctionName);
    }
}
