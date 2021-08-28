import { AbstractMetricService } from '../../abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { AstLine } from '../../../core/models/ast-model/ast-line.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { GeneseLine } from './models/genese-line.model';
import * as chalk from 'chalk';
import { round } from '../../../core/utils/numbers.util';

export class GeneseCpxService extends AbstractMetricService {


    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        // console.log(chalk.magentaBright('GENESE CPXXXX'), astFile);
        const astLines: AstLine[] = astFile.astCode.astLines;
        for (let i = 0; i < astLines.length; i++) {
            const geneseLine = new GeneseLine(i, astLines[i]);
            geneseLine.evaluate();
            reportFile.lines.push(geneseLine);
            reportFile.score = round(reportFile.score + geneseLine.score, 1);
        }
    }
}
