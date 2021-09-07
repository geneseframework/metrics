import * as fs from 'fs-extra';
import { fileExists, getArrayOfPathsWithDotSlash, getPathWithSlash, } from '../utils/file-system.util';
import { MetricInterface } from '../interfaces/json-report/metric.interface';
import { Project } from 'ts-morph';

export var WINDOWS = false;

/**
 * The options used by genese-complexity
 * Some options can be override by command-line options or with geneseconfig.json
 */
export class Options {

    static flaggedProject: Project = undefined;
    static generateJsonAst = true;
    static generateJsonReport = true;
    static hasMeasures = true;
    static ignore: string[] = [];               // The paths of the files or folders to ignore
    static ignoreRegex: string = '';
    static jsonReportPath = './report.json';
    static measure = '';
    static metricToOptimize = 'dynamic';
    static metrics: MetricInterface[] = [];
    static pathCommand = process.cwd();                    // The path of the folder where the command-line was entered (can't be overridden)
    static pathDataset = '';
    static pathFlaggedFiles = '';
    static pathFolderToAnalyze = './';          // The path of the folder to analyse (can be overridden)
    static pathJsonAst = ``;
    static pathOutDir = '';                     // The path where the reports are created (can be overridden)
    static pathReport = '';                     // The path where the reports are created (can be overridden)
    static project: Project = undefined;
    static traceFunctionName = 'traceProcess';
    static typing = true;                       // True if we want to add a complexity weight for lacks of typing

    /**
     * Sets the options of genese-complexity module
     * @param pathFolderToAnalyze       // The path of the folder to analyse (can be overridden)
     */
    static setOptions(pathFolderToAnalyze: string): void {
        WINDOWS = process.platform === 'win32';
        const geneseConfigPath = `${this.pathCommand}/geneseconfig.json`;
        Options.pathFolderToAnalyze = getPathWithSlash(pathFolderToAnalyze);
        Options.pathOutDir = `${this.pathCommand}/dist`;
        Options.pathFlaggedFiles = `${this.pathOutDir}/flagged-files`;
        Options.pathReport = `${this.pathOutDir}/report`;
        Options.pathJsonAst = `${this.pathReport}/ast.json`;
        if (fs.existsSync(geneseConfigPath)) {
            Options.setOptionsFromConfig(geneseConfigPath, pathFolderToAnalyze);
        }
    }

    /**
     * Sets the options of genese-complexity module with geneseconfig.json options (higher priority than geneseconfig.json options)
     * @param geneseConfigPath  // The path of the geneseconfig.json file
     * @param pathFolderToAnalyze
     */
    static setOptionsFromConfig(geneseConfigPath: string, pathFolderToAnalyze: string): void {
        const config = require(geneseConfigPath);
        Options.ignore = this.filterIgnorePathsForDotSlash(config.complexity.ignore) ?? Options.ignore;
        Options.ignore.forEach((path, i) => {
            Options.ignoreRegex += i !== Options.ignore.length - 1 ? `${this.pathTransformator(path)}|` : `${this.pathTransformator(path)}`;
        });
        Options.pathFolderToAnalyze = config.complexity?.pathFolderToAnalyze ?? Options.pathFolderToAnalyze;
        Options.pathDataset = config.complexity?.pathDataset ?? `${pathFolderToAnalyze}/dataset.xlsx`;
        Options.hasMeasures = fileExists(Options.pathDataset);
        Options.ignore.push(Options.pathOutDir);
        Options.generateJsonAst = config.complexity.generateJsonAst === true || Options.generateJsonAst;
        Options.generateJsonReport = config.complexity.generateJsonReport === true || Options.generateJsonReport;
        Options.jsonReportPath = config.complexity.jsonReportPath ?? Options.jsonReportPath;
        Options.measure = config.complexity.measure ?? Options.measure;
        Options.metrics = config.complexity.metrics ?? Options.metrics;
        Options.typing = config.complexity.typing === true || Options.typing;
    }

    /**
     * Separate paths which needs to extractHooksAndArrowFunctions by "./" and others
     * @param ignorePaths
     * @returns {String[]}
     */
    static filterIgnorePathsForDotSlash(ignorePaths: string[]): string[] {
        if (!ignorePaths) {
            return [];
        }
        const ignorePathsToFormat = ignorePaths.filter(
            (x) => !x.startsWith('*.')
        );
        const ignorePathsToKeep = ignorePaths.filter((x) => x.startsWith('*.'));
        return getArrayOfPathsWithDotSlash(ignorePathsToFormat).concat(
            ignorePathsToKeep
        );
    }

    /**
     * Checks if a file or a folder is ignored in geneseconfig.json
     * @param path
     */
    static isIgnored(path: string): boolean {
        if (Options.ignoreRegex.length > 0) {
            return path.match(Options.ignoreRegex)?.length > 0;
        } else {
            return false;
        }
    }

    static pathTransformator(path: string) {
        const SEPARATED_PATH = path.split('/');
        let pathTester = '';
        SEPARATED_PATH.forEach((subPath, i) => {
            if (subPath.startsWith('*.')) {
                subPath = subPath.split('.').join('\\.');
                pathTester = subPath.replace('*\\.', '[a-z]*\\.');
            } else {
                if (subPath.match('([a-z].*)')) {
                    i !== SEPARATED_PATH.length - 1
                        ? (pathTester += `${subPath}\\/`)
                        : (pathTester += `${subPath}`);
                }

                if (subPath.match('(\\*\\*)') || subPath.match('(\\*)')) {
                    i !== SEPARATED_PATH.length - 1
                        ? (pathTester += '([a-z].*)\\/')
                        : (pathTester += '([a-z].*)');
                }

                if (subPath.match('(\\.$)')) {
                    i !== SEPARATED_PATH.length - 1
                        ? (pathTester += `${subPath}\\/`)
                        : (pathTester += subPath);
                }
            }
        });
        return pathTester;
    }
}
