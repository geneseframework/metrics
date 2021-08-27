import { ReportLine } from '../models/report-line.model';

export class ReportCodeService {

    static getCode(reportLines: ReportLine[]): string {
        const maxLineLength: number = Math.max(...reportLines.map(r => r.text.length));
        let code = '';
        for (const reportLine of reportLines) {
            code = `${code}${reportLine.getTextWithComments(maxLineLength)}\n`;
        }
        return code;
    }

}
