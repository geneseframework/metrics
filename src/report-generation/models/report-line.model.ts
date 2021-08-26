import { JsonReportLineInterface } from '../../core/interfaces/json-report/json-report-line.interface';
import * as chalk from 'chalk';

export class ReportLine implements JsonReportLineInterface {

    comments: string = undefined;
    issue: number = undefined;
    score: number = undefined;
    text: string = undefined;

    constructor(issue: number, text: string) {
        this.issue = issue;
        this.text = text;
    }

    getTextWithComments(maxLineLength: number): string {
        if (this.text?.length === 0) {
            return '';
        }
        const txt = `${this.text} // `;
        console.log(chalk.blueBright('TXTTTTT'), txt);
        return this.comments ? `${txt.padEnd(maxLineLength + 10, '-')} ${this.comments}` : this.text;
    }

}
