import { AbstractMetricService } from './abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { MetricWeights } from '../models/metric-weights.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import * as chalk from 'chalk';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import { round } from '../../../core/utils/numbers.util';
import { sum } from '../../../core/utils/arrays.util';
import { LineRepetitions } from '../types/line-repetitions.type';

export class DynamicMetricService extends AbstractMetricService {

    astFile: AstFile;

    metricWeights: MetricWeights = {
        "ifs": 0.5,
        "loops": 1,
        "nesting": 0.5,
        "repetition": 0.7,
        "recursions": 2,
        "words": 9
    }

    parametersToOptimize = ['ifs', 'loops', 'nesting'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.astFile = astFile;
        // this.evaluateMetric(astFile.astLines, reportFile);
        const linesRepetitions: LineRepetitions[] = astFile.astLines.map(a => {return {issue: a.issue, numberOfRepetitions: 0}});
        for (const astLine of astFile.astLines) {
            const lineRepetitions: LineRepetitions = linesRepetitions.find(l => l.issue === astLine.issue);
            const lineScore: number = this.getLineScore(astLine, lineRepetitions.numberOfRepetitions);
            lineRepetitions.numberOfRepetitions++;
            const reportLine = new ReportLine(astLine.issue, astLine.text, this.getComments(astLine), lineScore);
            reportFile.lines.push(reportLine);
            reportFile.score = round(reportFile.score + reportLine.score, 1);
        }
    }

    // getNumberOfRepetitions(astLine: AstLine, lineRepetitions: LineRepetitions[]): number {
    //     return lineRepetitions.find(l => l.issue === astLine.issue);
    // }

    addRepetition(astLine: AstLine, lineRepetitions: LineRepetitions[]): void {
        const previousLineRepetition: LineRepetitions = lineRepetitions.find(l => l.issue === astLine.issue);
        if (previousLineRepetition) {
            previousLineRepetition.numberOfRepetitions ++;
        } else {
            lineRepetitions.push({issue: astLine.issue, numberOfRepetitions: 1});
        }
    }

    // getFileScore(astFile: AstFile): number {
    //     let score = 0;
    //     for (const astLine of astFile.astLines) {
    //         score += super.getLineScore(astLine) * this.metricWeights['repetition'];
    //     }
    // console.log(chalk.blueBright('GET F SCORRRR'), astFile.name, score);
    //     return score;
    // }

    getLineScore(astLine: AstLine, numberOfRepetitions: number): number {
        let total = 0;
        if (this.astFile.name === 'three.ts') {
            console.log(chalk.blueBright('GET L SCORRRRR'), this.astFile.name, astLine.issue, astLine.text);
        }
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight : 0;
        }
        return total;
    }

    setLineScore(astLine: AstLine): void {
        if (this.astFile.name === 'three.ts') {
            console.log(chalk.blueBright('GET L SCORRRRR'), this.astFile.name, astLine.issue, astLine.text);
        }
        let total = 0;
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight : 0;
        }
        astLine.score = total;
    }
}
