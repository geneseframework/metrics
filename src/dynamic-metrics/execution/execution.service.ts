import * as chalk from 'chalk';
import { AstModel } from '../../core/models/ast-model/ast.model';
import { Options } from '../../core/models/options.model';
import { exec, execFile, execSync } from 'child_process';

export class ExecutionService {

    static async start(astModel: AstModel) {
        // console.log(chalk.magentaBright('EXECCCCC'), astModel.astFileNames);
        for (const fileName of astModel.astFileNames) {
            this.execute(fileName);
        }
    }

    private static execute(fileName: string) {
        const zz = execSync(`tsc ${Options.pathOutDir}/**/*.ts`, {encoding: 'utf-8'});
        console.log(chalk.cyanBright('ZZZ'), zz);

        const flaggedFilePath = `${Options.pathFlaggedFiles}/${fileName}`;
        console.log(chalk.cyanBright('PATHHH'), flaggedFilePath);
        // const flaggedFile = require(flaggedFilePath);
        // console.log(chalk.blueBright('START FNNNN'), flaggedFile);
    }

}
