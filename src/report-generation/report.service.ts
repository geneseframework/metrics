import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';
import * as eol from 'eol';
import { Options } from '../core/models/options.model';
import * as Handlebars from 'handlebars';
import { ReportMetric } from './models/report-metric.model';
import { HtmlReport } from './models/html-report.model';
import { RowSnippet } from './models/row-snippet.model';
import { flat, unique } from '../core/utils/arrays.util';
import { DivFile } from './models/div-file.model';
import { ReportSnippet } from './models/report-snippet.model';
import { DivCode } from './models/div-code.model';
import { ReportCodeService } from './services/report-code.service';
import { MetricSelect } from './models/metric-select.model';
import { MetricValueSelect } from './models/metric-value-select.model';

export class ReportService {

    static fileNames: string[] = [];
    static htmlReport = new HtmlReport();
    static reportMetrics: ReportMetric[] = [];
    static metricNames: string[] = [];
    static selectedMetric = '';

    static async start(jsonReport: JsonReportInterface): Promise<any> {
        // console.log(chalk.greenBright('JSON REPORTTTTT '), jsonReport.reportMetrics);
        this.htmlReport.measure = jsonReport.measureName;
        this.fileNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.fileName))));
        this.metricNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.metricName))));
        this.selectedMetric = this.metricNames[0];
        this.reportMetrics = jsonReport.reportMetrics;
        const metricNamesArray: string = this.getMetricNamesArray();
        this.setMetricSelects(metricNamesArray);
        this.generateRowSnippets(!!jsonReport.measureName, jsonReport.reportMetrics);
        this.generateDivFiles(metricNamesArray);
        const template: HandlebarsTemplateDelegate = this.setTemplate();
        this.writeReport(template);
        return this.htmlReport;
    }

    private static getMetricNamesArray(): string {
        let metricNamesArray = '';
        for (const reportMetric of this.reportMetrics) {
            metricNamesArray = `${metricNamesArray}, '${reportMetric.metricName}'`;
        }
        return `[${metricNamesArray.slice(2)}]`;

    }

    private static setMetricSelects(metricNamesArray: string): void {
        for (let i = 0; i < this.reportMetrics.length; i++) {
            const metricSelect = new MetricSelect(this.reportMetrics[i].metricName, metricNamesArray);
            metricSelect.isSelected = i === 0;
            this.htmlReport.metricSelects.push(metricSelect);
            metricNamesArray = `${metricNamesArray}, '${this.reportMetrics[i].metricName}'`;
        }
    }

    private static generateRowSnippets(hasMeasure: boolean, reportMetrics: ReportMetric[]): void {
        for (const fileName of this.fileNames) {
            const reportSnippets: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets));
            const reportSnippet: ReportSnippet = reportSnippets.find(r => r.fileName === fileName);
            this.generateRowSnippet(fileName, hasMeasure, reportSnippet.measureValue, reportMetrics);
        }
    }

    private static generateRowSnippet(fileName: string, hasMeasure: boolean, measureValue: number, reportMetrics: ReportMetric[]): void {
        const rowSnippet = new RowSnippet(fileName, hasMeasure, measureValue);
        const fileReportSnippets: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets)).filter(s => s.fileName === fileName);
        rowSnippet.scores = fileReportSnippets.map(r => r.score);
        this.htmlReport.rowSnippets.push(rowSnippet);
    }

    private static generateDivFiles(metricNamesArray: string): void {
        for (const fileName of this.fileNames) {
            this.generateDivFile(fileName, metricNamesArray);
        }
    }

    private static generateDivFile(fileName: string, metricNamesArray: string): void {
        const divFile = new DivFile(fileName, this.selectedMetric);
        this.setMetricValues(divFile, fileName, metricNamesArray);
        for (const metricName of this.metricNames) {
            this.generateDivCode(metricName, fileName, divFile, metricNamesArray);
        }
        this.htmlReport.divFiles.push(divFile);
    }

    private static generateDivCode(metricName: string, fileName: string, divCodeMetric: DivFile, metricNamesArray: string): void {
        const divCode = new DivCode(fileName, metricName);
        const reportSnippetForThisMetric: ReportSnippet = this.getReportSnippetForGivenMetric(metricName, fileName);
        divCode.code = ReportCodeService.getCode(reportSnippetForThisMetric.lines);
        divCodeMetric.divCodes.push(divCode);
    }

    private static getReportSnippetForGivenMetric(metricName: string, fileName: string): ReportSnippet {
        return flat(this.reportMetrics.map(r => r.reportSnippets)).find((s: ReportSnippet) => s.metricName === metricName && s.fileName === fileName);
    }

    private static setMetricValues(divFile: DivFile, fileName: string, metricNamesArray: string): void {
        for (const metricSelect of this.htmlReport.metricSelects) {
            this.setMetricValue(divFile, fileName, metricSelect, metricNamesArray);
        }
    }

    private static setMetricValue(divFile: DivFile, fileName: string, metricSelect: MetricSelect, metricNamesArray: string): void {
        const reportSnippets: ReportSnippet[] = flat(this.reportMetrics.map(r => r.reportSnippets));
        const reportSnippetForThisFileAndThisMetric: ReportSnippet = reportSnippets.find(s => s.fileName === fileName && s.metricName === metricSelect.metricName);
        divFile.metricValues.push(new MetricValueSelect(metricSelect, reportSnippetForThisFileAndThisMetric.score, metricNamesArray));
    }

    private static setTemplate(): HandlebarsTemplateDelegate {
        this.registerPartial("rowSnippet", 'row-snippet');
        this.registerPartial("divCode", 'div-code');
        this.registerPartial("divCodeMetric", 'div-code-metric');
        const reportTemplate = eol.auto(fs.readFileSync(`${Options.pathCommand}/report/templates/handlebars/report.handlebars`, 'utf-8'));
        return Handlebars.compile(reportTemplate);
    }

    /**
     * Creates the file of the report
     */
    private static writeReport(template: HandlebarsTemplateDelegate) {
        console.log(chalk.cyanBright('HTML REPORTTTT'), this.htmlReport.divFiles);
        const content = template(this.htmlReport);
        const pathReport = `${Options.pathCommand}/report/report.html`;
        fs.writeFileSync(pathReport, content, { encoding: 'utf-8' });
    }

    /**
     * Registers a HandleBar's partial for a given partial's name and a given filename
     * @param partialName   // The name of the partial
     * @param filename      // The name of the file
     */
    private static registerPartial(partialName: string, filename: string): void {
        const partial = eol.auto(fs.readFileSync(`${Options.pathCommand}/report/templates/handlebars/${filename}.handlebars`, 'utf-8'));
        Handlebars.registerPartial(partialName, partial);
    }
}
