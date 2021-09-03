import * as fs from 'fs-extra';
import { fileExists, getArrayOfPathsWithDotSlash, getPathWithSlash, } from '../utils/file-system.util';
import { Complexity } from '../../html-generation/interfaces/complexity.interface';
import { ComplexityType } from '../../html-generation/enums/complexity-type.enum';
import { ChartColor } from '../../html-generation/enums/chart-color.enum';
import { ComplexitiesByStatus } from '../../html-generation/interfaces/complexities-by-status.interface';
import { Framework, isFramework } from '../types/framework.type';
import * as chalk from 'chalk';
import { MetricInterface } from '../interfaces/json-report/metric.interface';
import { COMPREHENSION_CPX, CYCLOMATIC_CPX } from '../const/metrics.const';

export var WINDOWS = false;

/**
 * The options used by genese-complexity
 * Some options can be override by command-line options or with geneseconfig.json
 */
export class Options {

    static cognitiveCpx: Complexity = {         // Options concerning the cognitive complexity
        errorThreshold: 20,                     // A complexity strictly greater than errorThreshold will be seen as error (can be overridden)
        type: ComplexityType.COGNITIVE,         // Sets the complexity type for this option (can't be overridden)
        warningThreshold: 10,                   // A complexity strictly greater than warning threshold and lower or equal than errorThreshold will be seen as warning (can be overridden)
    };
    static colors: ChartColor[] = [             // The colors of the charts
        ChartColor.CORRECT,
        ChartColor.WARNING,
        ChartColor.ERROR,
    ];
    static cyclomaticCpx: Complexity = {        // Options concerning the cognitive complexity
        errorThreshold: 10,                     // A complexity strictly greater than errorThreshold will be seen as error (can be overridden)
        type: ComplexityType.CYCLOMATIC,        // Sets the complexity type for this option (can't be overridden)
        warningThreshold: 5,                    // A complexity strictly greater than warning threshold and lower or equal than errorThreshold will be seen as warning (can be overridden)
    };
    static framework: Framework = undefined;    // The framework eventually specified
    static generateJsonAst = true;
    static generateJsonReport = true;
    static hasMeasures = true;
    static ignore: string[] = [];               // The paths of the files or folders to ignore
    static ignoreRegex: string = '';
    static jsonAstPath = `${process.cwd()}/report/ast.json`;
    static jsonReportPath = './report.json';
    static measure = '';
    static metricToOptimize = 'genese-cpx';
    static metrics: MetricInterface[] = [COMPREHENSION_CPX, CYCLOMATIC_CPX];
    static pathCommand = process.cwd();                    // The path of the folder where the command-line was entered (can't be overridden)
    static pathDataset = '';
    static pathFolderToAnalyze = './';          // The path of the folder to analyse (can be overridden)
    static pathGeneseNodeJs = '';               // The path of the node_module Genese in the nodejs user environment (can't be overridden)
    static pathOutDir = '';                     // The path where the reports are created (can be overridden)
    static typing = true;                       // True if we want to add a complexity weight for lacks of typing

    /**
     * Sets the options of genese-complexity module
     * @param pathFolderToAnalyze       // The path of the folder to analyse (can be overridden)
     * @param pathGeneseNodeJs          // The path of the node_module Genese in the nodejs user environment (can't be overridden)
     * @param framework                 // The framework eventually specified
     */
    static setOptions(pathFolderToAnalyze: string, pathGeneseNodeJs: string, framework?: Framework): void {
        if (isFramework(framework)) {
            Options.framework = framework;
        }
        WINDOWS = process.platform === 'win32';
        const geneseConfigPath = `${process.cwd()}/geneseconfig.json`;
        if (fs.existsSync(geneseConfigPath)) {
            Options.setOptionsFromConfig(geneseConfigPath, pathFolderToAnalyze);
        }
        Options.setOptionsFromCommandLine(
            pathFolderToAnalyze,
            pathGeneseNodeJs
        );
    }

    /**
     * Sets the options of genese-complexity module with command-line options (lower priority than geneseconfig.json options)
     * @param pathFolderToAnalyze       // The path of the folder to analyse (can be overridden)
     * @param pathGeneseNodeJs          // The path of the node_module Genese in the nodejs user environment (can't be overridden)
     */
    static setOptionsFromCommandLine(pathFolderToAnalyze: string, pathGeneseNodeJs: string): void {
        Options.pathFolderToAnalyze = getPathWithSlash(pathFolderToAnalyze);
        Options.pathGeneseNodeJs = pathGeneseNodeJs;
        Options.pathOutDir = `${process.cwd()}/genese/complexity/reports`;
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
        Options.pathOutDir = config.complexity?.pathReports ?? Options.pathOutDir;
        Options.ignore.push(Options.pathOutDir);
        Options.cognitiveCpx = config.complexity.cognitiveCpx ?? Options.cognitiveCpx;
        Options.cyclomaticCpx = config.complexity.cyclomaticCpx ?? Options.cyclomaticCpx;
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

    /**
     * Gets the different thresholds defined in Options class
     * @returns {ComplexitiesByStatus}
     */
    static getThresholds(): ComplexitiesByStatus {
        const cpxByStatus = new ComplexitiesByStatus();
        cpxByStatus.cognitive.warning = Options.cognitiveCpx.warningThreshold;
        cpxByStatus.cognitive.error = Options.cognitiveCpx.errorThreshold;
        cpxByStatus.cyclomatic.warning = Options.cyclomaticCpx.warningThreshold;
        cpxByStatus.cyclomatic.error = Options.cyclomaticCpx.errorThreshold;
        return cpxByStatus;
    }
}
