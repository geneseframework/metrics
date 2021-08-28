import { AbstractMetricService } from '../services/abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { CpxFactors } from './models/cpx-factor/cpx-factors.model';
import { GeneseLine } from './models/genese-line.model';

export class GeneseCpxService extends AbstractMetricService {

    cpxFactors: CpxFactors = undefined;

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        // console.log(chalk.magentaBright('AST FILE GENESE CPXXXX'), astFile);
        // console.log(chalk.magentaBright('AST FILE GENESE CPXXXX'), astFile.astCode.linesOutsideClassesAndFunctions.map(l => l.astNodes));
        // this.cpxFactors = new CpxFactors();
        // for (const astClass of astFile.astClasses) {
        //     GeneseClassService.evaluate(astClass, reportFile);
        // }
        // const methodsAndOutsideNodes: AstMethodOrOutsideNode[] = (this.astMethods as AstMethodOrOutsideNode[]).concat(this.astOutsideNodes);
        // for (const methodOrOutsideNode of methodsAndOutsideNodes) {
        //     this.evaluateMethodOrOutsideNode(methodOrOutsideNode);
        // }
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            // const reportLine = new ReportLine(i, astLines[i].text);
            const geneseLine = new GeneseLine(i, astLines[i]);
            geneseLine.evaluate();
            reportFile.lines.push(geneseLine);
            reportFile.score += geneseLine.score;
        }
    }
}
