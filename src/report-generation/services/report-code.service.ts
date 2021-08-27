import { ReportLine } from '../models/report-line.model';
import * as chalk from 'chalk';

export class ReportCodeService {

    static getCode(reportLines: ReportLine[]): string {
        console.log(chalk.blueBright('REPORT LINEEEEEES'), reportLines);
        const maxLineLength: number = Math.max(...reportLines.map(r => r.text.length));
        let code = '';
        for (const reportLine of reportLines) {
            code = `${code}${reportLine.getTextWithComments(maxLineLength)}\n`;
        }
        console.log(chalk.blueBright('REPORT LINEEEEEES CODE'), code);
        return code;
    }

}
