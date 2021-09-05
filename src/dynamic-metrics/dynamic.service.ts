import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
// import { FlagService } from './flag/services/flag.service';
// import { GLOBAL } from './flag/const/global.const';
import { Project } from 'ts-morph';
import { Options } from '../core/models/options.model';
import { ensureDirAndCopy } from '../core/utils/file-system.util';
import { FlagService } from './flag/services/flag.service';

export class DynamicService {

    static async start(astModel: AstModel): Promise<void> {
        // console.log(chalk.magentaBright('DYNAMICCCCC'), astModel);
        const hasDynamicMetric = true; // TODO
        if (hasDynamicMetric) {
            this.createProject();
            this.createFlaggedProject();
            FlagService.start(astModel);
        }
    }


    private static createProject(): void {
        Options.project = new Project();
        const projectPath = `${Options.pathFolderToAnalyze}*.ts`;
        Options.project.addSourceFilesAtPaths(projectPath);
    }


    private static createFlaggedProject(): void {
        Options.flaggedProjectPath = `${Options.pathCommand}/dist/flags/`;
        ensureDirAndCopy(Options.pathFolderToAnalyze, Options.flaggedProjectPath);
        Options.flaggedProject = new Project();
        Options.flaggedProject.addSourceFilesAtPaths( `${Options.flaggedProjectPath}*.ts`);
    }
}
