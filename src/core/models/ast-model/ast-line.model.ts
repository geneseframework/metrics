import { AstNode } from './ast-node.model';
import { round } from '../../utils/numbers.util';
import { MetricWeights } from '../../../evaluation/metrics/models/metric-weights.model';
import { capitalize } from '../../utils/strings.util';
import { sum } from '../../utils/arrays.util';

export class AstLine {

    astNodes?: AstNode[] = [];                              // The array of AstNodes corresponding to AST nodes in this line of code
    comments: string = undefined;
    end ?= 0;                                               // The pos (in number of characters) of the end of the line
    astNodeIdentifiers: AstNode[] = [];
    issue ?= 0;                                             // The number of the line in its Code parentFunction (method)
    pos ?= 0;                                               // The absolute pos (in number of characters) of the line in the SourceFile
    text ?= '';                                             // The text of the line


    constructor(textLine: string) {
        this.text = textLine;
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

    get nesting(): number {
        return sum(this.astNodes.filter(n => n.isStructuralNode).map(a => a.nesting - 1));
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

    setIdentifiersCpx(): void {
        this.astNodeIdentifiers = this.astNodes.filter(a => a.isIdentifier);
    }

    private getNbElements(isKindOf: string): number {
        return this.astNodes.filter(a => a[isKindOf]).length;
    }

    getScore(metricWeights: MetricWeights): number {
        let total = 0;
        for (const [parameter, weight] of Object.entries(metricWeights)) {
            total += !isNaN(this[parameter]) ? this[parameter] * weight : 0;
        }
        return round(total, 1);
    }

    getComments(metricWeights: MetricWeights): any {
        const score: number = this.getScore(metricWeights);
        if (score === 0) {
            return '';
        }
        let text = `+ ${score} (`;
        for (const [parameter, weight] of Object.entries(metricWeights)) {
            text = this[parameter] > 0 ? `${text}${capitalize(parameter)}: +${round(this[parameter] * weight, 1)}, ` : `${text}`;
        }
        return `${text.slice(0, -2)})`;
    }
}
