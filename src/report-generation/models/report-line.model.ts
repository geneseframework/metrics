import { JsonReportLineInterface } from '../../core/interfaces/json-report/json-report-line.interface';

export class ReportLine implements JsonReportLineInterface {

    comments: string = undefined;
    issue: number = undefined;
    score: number = undefined;
    text: string = undefined;

    constructor(issue: number, text: string, comments: string, score: number) {
        this.issue = issue;
        this.text = text;
        this.comments = comments;
        this.score = score;
    }

    getTextWithComments(maxLineLength: number): string {
        if (this.text?.length === 0) {
            return '';
        }
        const txt = `${this.text} // `;
        return this.comments ? `${txt.padEnd(maxLineLength + 10, '-')} ${this.comments}` : this.text;
    }

}
