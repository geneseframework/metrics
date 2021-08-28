import { AstLine } from '../../../../core/models/ast-model/ast-line.model';
import { ReportLine } from '../../../../report-generation/models/report-line.model';
import * as chalk from 'chalk';
import { Cpx } from './cpx-factor/cpx.model';

export class GeneseLine extends ReportLine {

    astLine: AstLine = undefined;
    cpx = new Cpx();

    constructor(issue: number, astLine: AstLine) {
        super(issue, astLine.text);
        this.astLine = astLine;
    }

    evaluate(): void {
        console.log(chalk.cyanBright('EVAL LINEEEEE'), this.issue, this.text,  this.astLine.astNodes.map(a => a.kind));
        this.setAtomicCpx();
    }

    private setAtomicCpx(): void {

    }

}
