/**
 * A line of a Code object
 */
import { AstNode } from './ast-node.model';
import { Cpx } from '../../../evaluation/metrics/genese-cpx/models/cpx-factor/cpx.model';
import { round } from '../../utils/numbers.util';
import { GENESE_WEIGHTS } from '../../../evaluation/metrics/genese-cpx/const/genese-weights.const';
import { MetricWeights } from '../../../evaluation/metrics/metric-weights.model';
import { Metric } from '../metric.model';
import { capitalize } from '../../utils/strings.util';

export class AstLine {

    astNodes?: AstNode[] = [];                              // The array of AstNodes corresponding to AST nodes in this line of code
    comments: string = undefined;
    cpx = new Cpx();
    end ?= 0;                                               // The pos (in number of characters) of the end of the line
    astNodeIdentifiers: AstNode[] = [];
    issue ?= 0;                                             // The number of the line in its Code parentFunction (method)
    pos ?= 0;                                               // The absolute pos (in number of characters) of the line in the SourceFile
    // score: number = undefined;
    text ?= '';                                             // The text of the line


    constructor(textLine: string, issue: number) {
        this.text = textLine;
        this.issue = issue;
        // this.score = round(this.cpx.total, 1);
        this.comments = this.cpx.comments;
    }

    get callbacks(): number {
        return this.astNodes?.filter(a => a.isCallback).length;
    }

    get identifiers(): number {
        return this.astNodeIdentifiers.length;
    }

    get ifs(): number {
        return this.getNbElements('isIf');
    }

    get keywords(): number {
        return this.getNbElements('isKeyword');
    }

    get literals(): number {
        return this.getNbElements('isLiteral');
    }

    get loops(): number {
        return this.getNbElements('isLoop');
    }

    get recursions(): number {
        return this.astNodes?.filter(a => a.isRecursion).length;
    }

    get switches(): number {
        return this.getNbElements('isSwitch');
    }

    get words(): number {
        return this.identifiers + this.keywords + this.literals;
    }

    setCpxParameters(): void {
        this.setIdentifiersCpx();
    }

    private setIdentifiersCpx(): void {
        this.astNodeIdentifiers = this.astNodes.filter(a => a.isIdentifier);
    }

    private getNbElements(isKindOf: string): number {
        return this.astNodes.filter(a => a[isKindOf]).length;
    }

    evaluate(): void {
        // this.setComplexities();
        // this.score = round(this.cpx.total, 1);
        // this.comments = this.cpx.comments;
        // console.log(chalk.cyanBright('EVAL LINEEEEE'), this.issue, this.text,  this.astLine.astNodes.map(a => a.kind), this.cpx.words);
    }


    // setComplexities(metricParameter: string[]): void {
    //     for (const cpxName of Object.keys(GENESE_WEIGHTS)) {
    //         this.setComplexity(cpxName)
    //     }
    // }
    getScore(metric: Metric): number {
        let total = 0;
        for (const [parameter, weight] of Object.entries(metric.metricWeights)) {
            total += !isNaN(this[parameter]) ? this[parameter] * weight : 0;
        }
        return round(total, 1);
    }

    // get comments(): any {
    //     return 'zzzz';
        // if (this.total === 0) {
        //     return '';
        // }
        // let text = `+ ${this.total} (`;
        // for (const key of Object.keys(this)) {
        //     text = this[key] > 0 ? `${text}${capitalize(key)}: +${round(this[key], 1)}, ` : `${text}`;
        // }
        // return `${text.slice(0, -2)})`;
    // }

    // getScore(metric: Metric): number {
    //     let total = 0;
    //     for (const key of Object.keys(this)) {
    //         total += !isNaN(this[key]) ? this[key] : 0;
    //     }
    //     return round(total, 1);
    // }

    setComplexity(metricParameter: string): void {
        switch (metricParameter) {
            case 'nesting':
                this.setNestingCpx();
                break;
            default:
                this.cpx[metricParameter] = this[metricParameter];
            // this.cpx[metricParameter] = round(this[metricParameter] * GENESE_WEIGHTS[metricParameter], 1);
        }
    }

    private setNestingCpx(): void {
        const structuralNodes: AstNode[] = this.astNodes.filter(a => a.isStructuralNode);
        for (const structuralNode of structuralNodes) {
            this.setNestingCpxNode(structuralNode);
        }
    }

    private setNestingCpxNode(structuralNode: AstNode): void {
        this.cpx.nesting += structuralNode.nesting - 1;
        // this.cpx.nesting += (structuralNode.nesting - 1) * GENESE_WEIGHTS.nesting;
    }
}
