#!/usr/bin/env node

import { Options } from './core/models/options.model';
import { createOutDir } from './core/utils/file-system.util';
import * as chalk from 'chalk';
import { Framework } from './core/types/framework.type';
import { JsonAstInterface } from './core/interfaces/json-ast/json-ast.interface';
import { JsonAstCreationService } from './json-ast-creation/json-ast-creation.service';
import { Language } from './core/enum/language.enum';
import { AstModel } from './core/models/ast-model/ast.model';
import { AstModelService } from './json-ast-to-ast-model/services/ast-model.service';
import { JsonReportInterface } from './core/interfaces/json-report/json-report.interface';
import { EvaluationService } from './evaluation/evaluation.service';
import { ReportModel } from './report-generation/models/report.model';
import { ReportService } from './report-generation/report.service';
import { HtmlGenerationService } from './html-generation/html-generation.service';

const ora = require('ora');
const path = require('path');

const spinner = ora();

const ARGS: string[] = process.argv.slice(2);
const PATH_TO_ANALYSE = ARGS[0] ?? '.';
const LANGUAGE = ARGS[1] ?? 'ts';
let FRAMEWORK = ARGS[5] ?? undefined;

let pathToAnalyse: string;
if (path.isAbsolute(PATH_TO_ANALYSE)) {
    pathToAnalyse = PATH_TO_ANALYSE;
} else {
    pathToAnalyse = `${process.cwd()}/${PATH_TO_ANALYSE}`.split('/').filter(e => e !== '.').join('/');
}


start()
    .then(exitCode => {
        process.exit(exitCode)
    })
    .catch(err => {
        spinner.fail();
        console.log(err);
    })

async function start(): Promise<number> {
    const pathToAnalyse = `${process.cwd()}/src/core/mocks/siegmund-2012`;
    // const pathToAnalyse = `${process.cwd()}/src/core/mocks/code-snippets`;
    FRAMEWORK = 'react';
    Options.setOptions(process.cwd(), pathToAnalyse, __dirname);
    createOutDir();
    console.log(chalk.yellowBright('Json AST generation...'));
    Options.setOptions(process.cwd(), pathToAnalyse, __dirname, FRAMEWORK as Framework);
    const jsonAst: JsonAstInterface = Options.generateJsonAst ? JsonAstCreationService.start(Options.pathFolderToAnalyze, LANGUAGE as Language) : require(Options.jsonAstPath);
    // console.log(chalk.magentaBright('JSON ASTTTT'), jsonAst);
    console.log(chalk.yellowBright('Ast model generation...'));
    const astModel: AstModel = AstModelService.generate(jsonAst);
    console.log(chalk.yellowBright('Evaluation for each metric...'));
    const jsonReport: JsonReportInterface = Options.generateJsonReport ? EvaluationService.evaluate(astModel) : require(Options.jsonReportPath);
    console.log(chalk.yellowBright('Report generation...'));
    const reportModel: ReportModel = Options.generateJsonReport ? await ReportService.start(jsonReport) : require(Options.jsonReportPath);
    // return logResults(reportModel);
    return 0;
}

function logReport(reportResult: any[]): void {
    if (reportResult?.length > 0) {
        console.log();
        if (typeof reportResult === 'object') {
            console.table(reportResult, ['filename', 'methodName', 'cpxIndex']);
        } else {
            const stats: any = HtmlGenerationService.astFolder['_stats'];
            console.log(chalk.blueBright('Code snippets : '), stats.numberOfFiles);
            console.log(chalk.blueBright('Methods : '), stats.numberOfMethods);
            console.log(chalk.blueBright('Comprehension Complexity : '), stats.totalCognitiveComplexity);
            console.log(chalk.blueBright('Cyclomatic Complexity : '), stats.totalCyclomaticComplexity);
            console.log(reportResult);
        }
    }
}
