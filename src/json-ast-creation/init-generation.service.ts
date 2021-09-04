import * as fs from 'fs-extra';
import { getFileExtension, platformPath } from '../core/utils/file-system.util';
import { Options } from '../core/models/options.model';
import { JsonAstFolderInterface } from '../core/interfaces/json-ast/json-ast-folder.interface';
import { JsonAstInterface } from '../core/interfaces/json-ast/json-ast.interface';
import { DEV_MOCK, LIMIT_GENERATIONS } from './globals.const';
import { AstFileGenerationService } from './ts/services/ast-file-generation.service';

/**
 * - AstFolders generation from Abstract Syntax Tree (AST) of its files (including files in subfolders)
 * - Conversion in JsonAst format
 */
export class InitGenerationService {

    /**
     * Generates the AstFolder for a given folder
     * The tree is generated according to the Abstract Syntax TreeNode (AST) of the folder
     * @param  {string} path    // The path of the folder
     * @returns JsonAstInterface
     */
    generateAll(path: string): JsonAstInterface {
        if (!path) {
            console.log('ERROR: no path.');
            return undefined;
        }
        return {
            metrics: Options.metrics,
            astFolder: this.generateAstFolder(path),
        };
    }

    /**
     * Generates the AstFolder for the given source code
     * @param sourceCode
     * @returns {{astFolder: {path: string, astFiles: AstFileInterface[]}}}
     */
    generateAstFolderFromString(sourceCode: string): JsonAstInterface {
        sourceCode = `${sourceCode}\n`
        const astFileGenerationService = new AstFileGenerationService();
        return {
            metrics: Options.metrics,
            astFolder: {
                path: '',
                astFiles: [
                    astFileGenerationService.generateFromString(sourceCode)
                ]
            },
        }
    }

    /**
     * Generates the AstFolder corresponding to a given path and to its potential AstFolder parent
     * @param  {string} path              // The path of the AstFolder
     * @returns JsonAstFolderInterface
     */
    private generateAstFolder(path: string): JsonAstFolderInterface {
        let astFolder: JsonAstFolderInterface = {
            path: platformPath(path),
            astFiles: []
        };
        let initService;
                initService = new AstFileGenerationService();
        const filesOrDirs = fs.readdirSync(path);
        let currentFile = undefined;
        try {
            filesOrDirs.forEach((elementName: string) => {
                const pathElement = path + elementName;
                currentFile = pathElement;
                if (!Options.isIgnored(pathElement) && this.hasLanguageExtension(pathElement)) {
                    if (fs.statSync(pathElement).isDirectory() && !LIMIT_GENERATIONS) {
                        astFolder.children = astFolder.children ?? [];
                        astFolder.children.push(this.generateAstFolder(`${pathElement}/`));
                    } else if (this.isFileToGenerate(pathElement)) {
                        astFolder.astFiles.push(initService.generate(pathElement, astFolder));
                    }
                }
            });
        } catch (e) {
            const [err, lines] = e.message.split('!!!');
            if (lines) {
                console.log(`Error in file: ${currentFile}\nAt line ${lines}`);
            }
            const error = new Error(err);
            error.stack = e.stack;
            throw error;
        }
        return astFolder;
    }

    private hasLanguageExtension(filePath: string): boolean {
        return getFileExtension(filePath) === 'ts';
    }

    /**
     * Returns true if a path corresponds to a file to generate in JsonAst
     * @param  {string} path  // The path of the file
     * @returns boolean
     */
    private isFileToGenerate(path: string): boolean {
        return (getFileExtension(path) === 'ts' && !LIMIT_GENERATIONS) || path === DEV_MOCK;
    }
}
