import { JsonReportInterface } from '../core/interfaces/json-report/json-report.interface';
import * as fs from 'fs-extra';
import * as eol from 'eol';
import { Options } from '../core/models/options.model';
import * as Handlebars from 'handlebars';
import { ReportMetric } from './models/report-metric.model';
import { HtmlReport } from './models/html-report.model';
import { RowSnippet } from './models/row-snippet.model';
import { flat, unique } from '../core/utils/arrays.util';
import { ReportSnippet } from './models/report-snippet.model';
import { DivCode } from './models/div-code.model';
import { ReportCodeService } from './services/report-code.service';
import { MetricSelect } from './models/metric-select.model';
import { DivFile } from './models/div-file.model';
import { DivCodeValues } from './models/div-code-values.model';
import * as chalk from 'chalk';

export class ReportService {

    static fileNames: string[] = [];
    static fileNamesArray: string = '';
    static htmlReport = new HtmlReport();
    static reportMetrics: ReportMetric[] = [];
    static metricNames: string[] = [];
    static metricNamesArray: string = '';
    static selectedMetric = '';

    static start(jsonReport: JsonReportInterface): HtmlReport {
        console.log(chalk.greenBright('JSON REPORTTTTT '), jsonReport.reportMetrics[0].reportSnippets);
        this.htmlReport.measure = jsonReport.measureName;
        this.fileNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.fileName))));
        this.metricNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.metricName))));
        this.selectedMetric = this.metricNames[0];
        this.reportMetrics = jsonReport.reportMetrics;
        this.metricNamesArray = this.setNamesArray(this.metricNames);
        this.fileNamesArray = this.setNamesArray(this.fileNames);
        this.setMetricSelects();
        this.generateRowSnippets(!!jsonReport.measureName, jsonReport.reportMetrics);
        this.generateDivFiles();
        this.writeReport();
        return this.htmlReport;
    }

    private static setNamesArray(names: string[]): string {
        let namesArray = '';
        for (const name of names) {
            namesArray = `${namesArray}, '${name}'`;
        }
        return `[${namesArray.slice(2)}]`;

    }

    private static setMetricSelects(): void {
        for (let i = 0; i < this.reportMetrics.length; i++) {
            const metricSelect = new MetricSelect(this.reportMetrics[i].metricName, this.metricNamesArray, this.fileNamesArray);
            metricSelect.isSelected = i === 0;
            this.htmlReport.metricSelects.push(metricSelect);
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

    private static generateDivFiles(): void {
        for (const fileName of this.fileNames) {
            this.generateDivFile(fileName);
        }
    }

    private static generateDivFile(fileName: string): void {
        const divFile = new DivFile(fileName, this.selectedMetric);
        this.setMetricValues(divFile, fileName);
        for (const metricName of this.metricNames) {
            this.generateDivCode(metricName, fileName, divFile);
        }
        this.htmlReport.divFiles.push(divFile);
    }

    private static generateDivCode(metricName: string, fileName: string, divCodeMetric: DivFile): void {
        const isSelected: boolean = metricName === this.selectedMetric;
        const divCode = new DivCode(fileName, metricName, isSelected);
        const reportSnippetForThisMetric: ReportSnippet = this.getReportSnippetForGivenMetric(metricName, fileName);
        divCode.code = ReportCodeService.getCode(reportSnippetForThisMetric.lines);
        divCodeMetric.divCodes.push(divCode);
    }

    private static getReportSnippetForGivenMetric(metricName: string, fileName: string): ReportSnippet {
        return flat(this.reportMetrics.map(r => r.reportSnippets)).find((s: ReportSnippet) => s.metricName === metricName && s.fileName === fileName);
    }

    private static setMetricValues(divFile: DivFile, fileName: string): void {
        for (const metricSelect of this.htmlReport.metricSelects) {
            this.setMetricValue(divFile, fileName, metricSelect);
        }
    }

    private static setMetricValue(divFile: DivFile, fileName: string, metricSelect: MetricSelect): void {
        const reportSnippets: ReportSnippet[] = flat(this.reportMetrics.map(r => r.reportSnippets));
        const reportSnippetForThisFileAndThisMetric: ReportSnippet = reportSnippets.find(s => s.fileName === fileName && s.metricName === metricSelect.metricName);
        divFile.divCodeValues.push(new DivCodeValues(fileName, metricSelect, reportSnippetForThisFileAndThisMetric.score, this.metricNamesArray));
    }

    private static setTemplate(): HandlebarsTemplateDelegate {
        this.registerPartial("rowSnippet", 'row-snippet');
        this.registerPartial("divCode", 'div-code');
        this.registerPartial("divFile", 'div-file');
        const reportTemplate = eol.auto(fs.readFileSync(`${Options.pathCommand}/report/templates/handlebars/report.handlebars`, 'utf-8'));
        return Handlebars.compile(reportTemplate);
    }

    /**
     * Creates the file of the report
     */
    private static writeReport() {
        // console.log(chalk.cyanBright('HTML REPORTTTT'), this.htmlReport);
        const template: HandlebarsTemplateDelegate = this.setTemplate();
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
