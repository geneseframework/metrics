#!/usr/bin/env node

import { Options } from './core/models/options.model';
import { createOutDir } from './core/utils/file-system.util';
import * as chalk from 'chalk';
import { JsonAstInterface } from './core/interfaces/json-ast/json-ast.interface';
import { JsonAstCreationService } from './json-ast-creation/json-ast-creation.service';
import { Language } from './core/enum/language.enum';
import { AstModel } from './core/models/ast-model/ast.model';
import { AstModelService } from './json-ast-to-ast-model/services/ast-model.service';
import { JsonReportInterface } from './core/interfaces/json-report/json-report.interface';
import { EvaluationService } from './evaluation/evaluation.service';
import { ReportService } from './report-generation/report.service';
import { HtmlGenerationService } from './html-generation/html-generation.service';
import { Measure } from './report-generation/models/measure.model';
import { DatasetService } from './dataset-import/dataset.service';

const LANGUAGE = 'ts';

async function start(): Promise<void> {
    const pathToAnalyse = `${process.cwd()}/src/core/mocks/siegmund-2012`;
    Options.setOptions(process.cwd(), pathToAnalyse, __dirname);
    createOutDir();
    console.log(chalk.yellowBright('Json AST generation...'));
    const jsonAst: JsonAstInterface = Options.generateJsonAst ? JsonAstCreationService.start(Options.pathFolderToAnalyze, LANGUAGE as Language) : require(Options.jsonAstPath);
    console.log(chalk.yellowBright('Ast model generation...'));
    const astModel: AstModel = AstModelService.generate(jsonAst);
    console.log(chalk.yellowBright('Collect measures from dataset...'));
    const measures: Measure[] = await DatasetService.getMeasures();
    console.log(chalk.yellowBright('Evaluation for each metric...'));
    const jsonReport: JsonReportInterface = Options.generateJsonReport ? EvaluationService.evaluate(astModel, measures) : require(Options.jsonReportPath);
    console.log(chalk.yellowBright('Report generation...'));
    ReportService.start(jsonReport);
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

start().then(() => {
    console.log(chalk.greenBright('Report done.'));
});
