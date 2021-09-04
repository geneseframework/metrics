import { LinearEquation } from './linear-equation.model';
import { Dot } from './dot.model';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

export class ChartMetric {

    dots: Dot[] = [];
    linearRegression: LinearEquation = undefined;
    linearRegressionLine: Dot[] = [];
    marginRight: number = undefined;
    measureName: string = 'Time';
    metricName: string = undefined;
    width: number = undefined;

    constructor(metricName: string) {
        this.metricName = metricName;
    }

    setLinearRegressionLine(): void {
        this.linearRegression = linearRegression(this.dots.map(d => [d.x, d.y]));
        const abscissas: number[] = this.dots.map(d => d.x);
        for (const abscissa of abscissas) {
            this.linearRegressionLine.push(new Dot(abscissa, this.getPredictedValue(abscissa)));
        }
    }

    private getPredictedValue(abscissa: number): number {
        return linearRegressionLine(this.linearRegression)(abscissa);
    }

}
