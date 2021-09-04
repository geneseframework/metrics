import { InitGenerationService } from './init-generation.service';
import { JsonService } from './json.service';
import { createFile } from '../core/utils/file-system.util';
import { JsonAstInterface } from '../core/interfaces/json-ast/json-ast.interface';
import { project } from './globals.const';
import { Options } from '../core/models/options.model';
import * as chalk from 'chalk';

/**
 * Main process of the parsing to JsonAst format
 */
export class JsonAstCreationService {

    /**
     * Starts the parsing to Json Ast format and returns JsonAst object
     * @param  {string} pathToAnalyze           // The path of the folder to analyse
     * @returns void
     */
    static start(pathToAnalyze: string): JsonAstInterface {
        let jsonAst: JsonAstInterface;
        project.addSourceFilesAtPaths(`${pathToAnalyze}**/*.ts`);
        project.addSourceFilesAtPaths(`${pathToAnalyze}**/*.tsx`);
        project.addSourceFilesAtPaths(`${pathToAnalyze}**/*.js`);
        project.addSourceFilesAtPaths(`${pathToAnalyze}**/*.jsx`);
        jsonAst = JsonAstCreationService.generateFromFiles(pathToAnalyze);
        createFile(Options.jsonAstPath, JsonService.prettifyJson(jsonAst));
        return jsonAst;
    }

    /**
     * Generate AST for Ts or Java files
     * @param  {string} pathToAnalyze
     * @returns JsonAstInterface
     */
    private static generateFromFiles(pathToAnalyze: string): JsonAstInterface {
        const jsonAst: JsonAstInterface = {
            astFolder: undefined,
            measure: Options.measure,
            metrics: Options.metrics,
        };
        let astFolder = new InitGenerationService().generateAll(pathToAnalyze).astFolder as any;
        astFolder = JsonService.astPropertyNames(astFolder);
        jsonAst.astFolder = astFolder;
        return jsonAst;
    }

}
