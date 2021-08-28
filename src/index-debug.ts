#!/usr/bin/env node

import { Options } from './core/models/options.model';
import { createOutDir } from './core/utils/file-system.util';
import * as chalk from 'chalk';
import { Language } from './core/enum/language.enum';
import { JsonAstCreationService } from './json-ast-creation/json-ast-creation.service';
import { Framework } from './core/types/framework.type';
import { HtmlGenerationService } from './html-generation/html-generation.service';
import { ReportService } from './report-generation/report.service';
import { JsonAstInterface } from './core/interfaces/json-ast/json-ast.interface';
import { JsonReportInterface } from './core/interfaces/json-report/json-report.interface';
import { AstModel } from './core/models/ast-model/ast.model';
import { AstModelService } from './json-ast-to-ast-model/services/ast-model.service';
import { EvaluationService } from './evaluation/evaluation.service';
import { ReportModel } from './report-generation/models/report.model';

const ARGS: string[] = process.argv.slice(2);
const LANGUAGE = ARGS[1] ?? 'ts';
let FRAMEWORK = ARGS[5] ?? undefined;

export async function startDebug(): Promise<number> {
    const pathToAnalyse = `${process.cwd()}/src/core/mocks/code-snippets`;
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
    return undefined;
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
