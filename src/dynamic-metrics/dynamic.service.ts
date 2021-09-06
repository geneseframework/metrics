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
        console.log(chalk.magentaBright('DYNAMICCCCC'), astModel.astMetrics);
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
        console.log(chalk.magentaBright('TRACESSSS'), processTraces);
        const astFiles: AstFile[] = [];
        for (const astFile of astModel.astFiles) {
            astFiles.push(this.getAstFileWithDynamicCode(astFile, processTraces));
        }
        for (const astMetric of astModel.astMetrics) {
            astMetric.astFiles = astFiles;
        }
    }

    private static getAstFileWithDynamicCode(astFile: AstFile, processTraces: ProcessTrace[]): AstFile {
        const dynamicAstFile = new AstFile(astFile.jsonAstFile);
        const astLines: AstLine[] = [];
        const processTrace: ProcessTrace = processTraces.find(p => p.fileName === astFile.name);
        console.log(chalk.cyanBright('TRACEEEEE'), processTrace);
        let hasCalledStartMethod = false;
        for (const line of processTrace.lines) {
            const astLine: AstLine = astFile.astLines.find(a => a.issue === line);
            console.log(chalk.cyanBright('LINEEEE'), astLine.text);
            if (hasCalledStartMethod) {
                console.log(chalk.greenBright('LINEEEE'), astLine.text);
                astLines.push(astLine);
            } else {
                hasCalledStartMethod = this.hasCalledStartMethod(astLine);
            }
        }
        dynamicAstFile.astLines = astLines;
        console.log(chalk.cyanBright('DYN LINEEEE'), astLines);
        return dynamicAstFile;
    }

    private static hasCalledStartMethod(astLine: AstLine): boolean {
        const callExpression: AstNode = astLine.astNodes.find(a => a.kind === SyntaxKind.CallExpression);
        return callExpression?.children[0]?.name === 'start';
    }
}
