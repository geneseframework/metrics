import { AstModel } from '../core/models/ast-model/ast.model';
import * as chalk from 'chalk';
// import { FlagService } from './flag/services/flag.service';
// import { GLOBAL } from './flag/const/global.const';
import { Project } from 'ts-morph';
import { Options } from '../core/models/options.model';

export class DynamicService {

    static async start(astModel: AstModel): Promise<void> {
        console.log(chalk.magentaBright('DYNAMICCCCC'), astModel);
        const hasDynamicMetric = true; // TODO
        if (hasDynamicMetric) {
            this.createProject();
            // await FlagService.start();
        }
    }


    private static createProject(): void {
        Options.project = new Project();
        const projectPath = `${Options.pathFolderToAnalyze}*.ts`;
        console.log(chalk.blueBright('PATH PROJJJJ'), projectPath);
        Options.project.addSourceFilesAtPaths(projectPath);
        console.log(chalk.blueBright('PATH PROJJJJ NB'), Options.project.getSourceFiles().length);
    }


    // private static async createFlaggedProject(): Promise<void> {
    //     copySync(GLOBAL.configFilePath, kuzzyPath(GLOBAL.configFilePath));
    //     GLOBAL.flaggedProject = new Project({
    //         tsConfigFilePath: kuzzyPath(GLOBAL.configFilePath),
    //         skipFileDependencyResolution: true
    //     });
    // }
}
