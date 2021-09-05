#!/usr/bin/env node

import { Options } from './core/models/options.model';
import { createOutDir } from './core/utils/file-system.util';
import * as chalk from 'chalk';
import { JsonAstInterface } from './core/interfaces/json-ast/json-ast.interface';
import { JsonAstCreationService } from './json-ast-creation/json-ast-creation.service';
import { AstModel } from './core/models/ast-model/ast.model';
import { AstModelService } from './json-ast-to-ast-model/services/ast-model.service';
import { JsonReportInterface } from './core/interfaces/json-report/json-report.interface';
import { EvaluationService } from './evaluation/evaluation.service';
import { ReportService } from './report-generation/report.service';
import { Measure } from './report-generation/models/measure.model';
import { DatasetService } from './dataset-import/dataset.service';
import { OptimizationService } from './optimization/optimization.service';
import { CorrelationService } from './correlation/correlation.service';
import { DynamicService } from './dynamic-metrics/dynamic.service';


async function start(): Promise<void> {
    // const pathToAnalyse = `${process.cwd()}/src/core/mocks/code-snippets`;
    const pathToAnalyse = `${process.cwd()}/src/core/mocks/siegmund-2012`;
    Options.setOptions(pathToAnalyse, __dirname);
    createOutDir();
    console.log(chalk.yellowBright('Json AST generation...'));
    const jsonAst: JsonAstInterface = Options.generateJsonAst ? JsonAstCreationService.start(Options.pathFolderToAnalyze) : require(Options.jsonAstPath);
    console.log(chalk.yellowBright('Ast model generation...'));
    const astModel: AstModel = AstModelService.generate(jsonAst);
    console.log(chalk.yellowBright('Execute dynamic metrics...'));
    // await DynamicService.start(astModel);
    // console.log(chalk.yellowBright('Collect measures from dataset...'));
    const measures: Measure[] = DatasetService.getMeasures();
    console.log(chalk.yellowBright('Evaluation for each metric...'));
    let jsonReport: JsonReportInterface = Options.generateJsonReport ? EvaluationService.evaluate(astModel, measures) : require(Options.jsonReportPath);
    console.log(chalk.yellowBright('Optimization...'));
    // OptimizationService.optimize(astModel, jsonReport);
    // console.log(chalk.yellowBright('Correlation...'));
    // CorrelationService.setStats(jsonReport);
    console.log(chalk.yellowBright('Report generation...'));
    ReportService.start(jsonReport);
}


start().then(() => {
    console.log(chalk.greenBright('Report done.'));
});
