import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
import { Project } from 'ts-morph';
import { Options } from '../core/models/options.model';
import { ensureDirAndCopy } from '../core/utils/file-system.util';
import { FlagService } from './flag/services/flag.service';
import { ExecutionService } from './execution/execution.service';

export class DynamicService {

    static async start(astModel: AstModel): Promise<void> {
        // console.log(chalk.magentaBright('DYNAMICCCCC'), astModel);
        const hasDynamicMetric = true; // TODO
        if (hasDynamicMetric) {
            this.createFlaggedProject();
            FlagService.start(astModel);
            ExecutionService.start(astModel);
        }
    }


    private static createFlaggedProject(): void {
        ensureDirAndCopy(Options.pathFolderToAnalyze, Options.pathFlaggedFiles);
        Options.flaggedProject = new Project();
        Options.flaggedProject.addSourceFilesAtPaths( `${Options.pathFlaggedFiles}/*.ts`);
    }
}
