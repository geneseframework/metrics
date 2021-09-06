import * as chalk from 'chalk';
import { AstModel } from '../../core/models/ast-model/ast.model';
import { Options } from '../../core/models/options.model';
import { execSync } from 'child_process';
import { removeExtension } from '../../core/utils/file-system.util';

export class ExecutionService {

    static start(astModel: AstModel) {
        // console.log(chalk.magentaBright('EXECCCCC'), astModel.astFileNames);
        for (const fileName of astModel.astFileNames) {
            this.execute(fileName);
        }
    }

    private static execute(fileName: string) {
        execSync(`tsc ${Options.pathOutDir}/**/*.ts`, {encoding: 'utf-8'});
        execSync(`tsc ${Options.pathOutDir}/flagged-files/flagger/*.ts`, {encoding: 'utf-8'});
        const jsFileName = `${removeExtension(fileName)}.js`;
        const flaggedFilePath = `${Options.pathFlaggedFiles}/${jsFileName}`;
        console.log(chalk.cyanBright('PATHHH'), flaggedFilePath);
        const flaggedFile = require(flaggedFilePath);
        console.log(chalk.blueBright('START FNNNN'), flaggedFile);
        flaggedFile.main();
    }

}
