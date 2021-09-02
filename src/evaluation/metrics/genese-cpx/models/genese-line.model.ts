import { AstLine } from '../../../../core/models/ast-model/ast-line.model';
import { ReportLine } from '../../../../report-generation/models/report-line.model';
import * as chalk from 'chalk';
import { Cpx } from './cpx-factor/cpx.model';
import { GENESE_WEIGHTS } from '../const/genese-weights.const';
import { round } from '../../../../core/utils/numbers.util';
import { AstNode } from '../../../../core/models/ast-model/ast-node.model';

export class GeneseLine extends ReportLine {

    astLine: AstLine = undefined;
    cpx = new Cpx();

    constructor(issue: number, astLine: AstLine) {
        super(issue, astLine.text);
        this.astLine = astLine;
    }

    evaluate(): void {
        this.setComplexities();
        this.score = round(this.cpx.total, 1);
        this.comments = this.cpx.comments;
        // console.log(chalk.cyanBright('EVAL LINEEEEE'), this.issue, this.text,  this.astLine.astNodes.map(a => a.kind), this.cpx.words);
    }

    private setComplexities(): void {
        for (const cpxName of Object.keys(GENESE_WEIGHTS)) {
            this.setComplexity(cpxName)
        }
    }

    private setComplexity(cpxName: string): void {
        switch (cpxName) {
            case 'nesting':
                this.setNestingCpx();
                break;
            default:
                this.cpx[cpxName] = round(this.astLine[cpxName] * GENESE_WEIGHTS[cpxName], 1);
        }
    }

    private setNestingCpx(): void {
        const structuralNodes: AstNode[] = this.astLine.astNodes.filter(a => a.isStructuralNode);
        for (const structuralNode of structuralNodes) {
            this.setNestingCpxNode(structuralNode);
        }
    }

    private setNestingCpxNode(structuralNode: AstNode): void {
        this.cpx.nesting += (structuralNode.nesting - 1) * GENESE_WEIGHTS.nesting;
    }
}
