import * as chalk from 'chalk';
import { AstModel } from '../../core/models/ast-model/ast.model';
import { Options } from '../../core/models/options.model';
import { removeExtension } from '../../core/utils/file-system.util';
import { ProcessTrace } from '../flag/flagger/process-trace.model';
import { DynamicService } from '../dynamic.service';

export class ExecutionService {

    static start(astModel: AstModel): ProcessTrace[] {
        const filesWithTraceFunction: string[] = astModel.astFiles.filter(a => DynamicService.hasTraceFunction(a)).map(f => f.jsonAstFile.name);
        for (const fileName of filesWithTraceFunction) {
            this.execute(fileName);
        }
        return require(`${Options.pathFlaggedFiles}/flagger/flagger.util.js`)['PROCESS_TRACES'];
    }

    private static execute(fileName: string) {
        const jsFileName = `${removeExtension(fileName)}.js`;
        const flaggedFilePath = `${Options.pathFlaggedFiles}/${jsFileName}`;
        const flaggedFile = require(flaggedFilePath);
        console.log(chalk.blueBright('REQUIREDDDD'));
        flaggedFile[Options.traceFunctionName]();
    }

}
