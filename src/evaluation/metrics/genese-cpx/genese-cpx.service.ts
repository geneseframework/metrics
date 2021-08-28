import { AbstractMetricService } from '../services/abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { ReportLine } from '../../../report-generation/models/report-line.model';
import * as chalk from 'chalk';
import { CpxFactors } from './models/cpx-factor/cpx-factors.model';

export class GeneseCpxService extends AbstractMetricService {

    cpxFactors: CpxFactors = undefined;

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        console.log(chalk.magentaBright('AST FILE GENESE CPXXXX'), astFile.astCode.linesOutsideClassesAndFunctions.map(l => l.astNodes));
        this.cpxFactors = new CpxFactors();
        // const methodsAndOutsideNodes: AstMethodOrOutsideNode[] = (this.astMethods as AstMethodOrOutsideNode[]).concat(this.astOutsideNodes);
        // for (const methodOrOutsideNode of methodsAndOutsideNodes) {
        //     this.evaluateMethodOrOutsideNode(methodOrOutsideNode);
        // }
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const reportLine = new ReportLine(i, astLines[i].text);
            this.evaluateLine(astLines[i], reportLine);
            reportFile.lines.push(reportLine);
            reportFile.score += reportLine.score;
        }
    }

    private evaluateLine(astLine: AstLine, reportLine: ReportLine): void {
        // console.log(chalk.cyanBright('EVAL LINEEEEE'), reportLine.issue, reportLine.text,  astLine.astNodes.map(a => a.kind));
        reportLine.score = astLine.astNodes.length > 0 ? 3 : 0;
        reportLine.comments = astLine.astNodes.length > 0 ? '+3' : '';
    }
}
