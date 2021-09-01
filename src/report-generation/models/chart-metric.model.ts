import { LinearRegression } from './linear-regression.model';
import { Dot } from './dot.model';
import { linearRegression, linearRegressionLine } from 'simple-statistics';
import * as chalk from 'chalk';

export class ChartMetric {

    linearRegression: LinearRegression = undefined;
    linearRegressionLine: Dot[] = [];
    measureName: string = 'Time';
    metricName: string = undefined;
    dots: Dot[] = [];

    constructor(metricName: string) {
        this.metricName = metricName;
    }

    setLinearRegressionLine(): void {
        this.linearRegression = linearRegression(this.dots.map(d => [d.x, d.y]));
        const abscissas: number[] = this.dots.map(d => d.x);
        for (const abscissa of abscissas) {
            this.linearRegressionLine.push(new Dot(abscissa, this.getPredictedValue(abscissa)));
        }
        // console.log(chalk.blueBright('LINEAR REGRRRRR'), this.linearRegression);
    }

    private getPredictedValue(abscissa: number): number {
        return linearRegressionLine(this.linearRegression)(abscissa);
    }

}
