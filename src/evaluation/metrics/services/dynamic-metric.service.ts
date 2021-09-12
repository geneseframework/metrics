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
        "repetition": 0.4,
        "words": 0.1
    }

    parametersToOptimize = ['ifs', 'loops', 'nesting'];
    // parametersToOptimize = ['ifs', 'loops', 'nesting', 'repetition'];

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.astFile = astFile;
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


    getFileScore(astFile: AstFile): number {
        let score = 0;
        const linesRepetitions: LineRepetitions[] = astFile.astLines.map(a => {return {issue: a.issue, numberOfRepetitions: 0}});
        for (const astLine of astFile.astLines) {
            const lineRepetitions: LineRepetitions = linesRepetitions.find(l => l.issue === astLine.issue);
            score += this.getLineScore(astLine, lineRepetitions.numberOfRepetitions);
            lineRepetitions.numberOfRepetitions++;
        }
        return score;
    }

    getLineScore(astLine: AstLine, numberOfRepetitions: number): number {
        let total = 0;
        const absRepetition = Math.abs(this.metricWeights['repetition']);
        const repetitionCoefficient: number = Math.pow(absRepetition, numberOfRepetitions);
        for (const [parameter, weight] of Object.entries(this.metricWeights)) {
            total += !isNaN(astLine[parameter]) ? astLine[parameter] * weight * repetitionCoefficient : 0;
        }
        astLine.score = total;
        return total;
    }
}
