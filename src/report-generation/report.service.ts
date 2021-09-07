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
import { CodeSnippetRow } from './models/code-snippet-row.model';
import { DivCodeValues } from './models/div-code-values.model';
import * as chalk from 'chalk';
import { CorrelationRow } from './models/correlation-row.model';
import { ChartMetric } from './models/chart-metric.model';
import { Dot } from './models/dot.model';
import { round } from '../core/utils/numbers.util';
import { ensureDirAndCopy } from '../core/utils/file-system.util';

export class ReportService {

    static codeSnippetNames: string[] = [];
    static codeSnippetNamesArray: string = '';
    static htmlReport = new HtmlReport();
    static metricNames: string[] = [];
    static metricNamesArray: string = '';
    static reportMetrics: ReportMetric[] = [];
    static selectedMetric = '';

    static start(jsonReport: JsonReportInterface): HtmlReport {
        console.log(chalk.greenBright('JSON REPORTTTTT '), jsonReport.reportMetrics[0].reportSnippets);
        this.reportMetrics = jsonReport.reportMetrics;
        this.htmlReport.measure = jsonReport.measureName;
        this.htmlReport.hasMeasures = Options.hasMeasures;
        this.codeSnippetNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.codeSnippetName))));
        this.metricNames = unique(flat(jsonReport.reportMetrics.map(r => r.reportSnippets.map(s => s.metricName))));
        this.selectedMetric = this.metricNames[0];
        this.metricNamesArray = this.setNamesArray(this.metricNames);
        this.codeSnippetNamesArray = this.setNamesArray(this.codeSnippetNames);
        this.copyTemplatesDir();
        this.setMetricSelects();
        this.generateRowSnippets();
        this.setCorrelations();
        this.generateDivFiles();
        this.setCharts();
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
            const metricSelect = new MetricSelect(this.reportMetrics[i].metricName, this.metricNamesArray, this.codeSnippetNamesArray);
            metricSelect.isSelected = i === 0;
            this.htmlReport.metricSelects.push(metricSelect);
        }
    }

    private static generateRowSnippets(): void {
        for (const codeSnippetName of this.codeSnippetNames) {
            const reportSnippets: ReportSnippet[] = flat(this.reportMetrics.map(r => r.reportSnippets));
            const reportSnippet: ReportSnippet = reportSnippets.find(r => r.codeSnippetName === codeSnippetName);
            if (reportSnippet) {
                this.generateRowSnippet(codeSnippetName, reportSnippet.measureValue, this.reportMetrics);
            } else {
                console.log(chalk.redBright('FILE NOT FOUND'), codeSnippetName);
            }
        }
    }

    private static generateRowSnippet(codeSnippetName: string, measureValue: number, reportMetrics: ReportMetric[]): void {
        const rowSnippet = new RowSnippet(codeSnippetName, Options.hasMeasures, measureValue);
        const fileReportSnippets: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets)).filter(s => s.codeSnippetName === codeSnippetName);
        rowSnippet.scores = fileReportSnippets.map(r => r?.score);
        this.htmlReport.rowSnippets.push(rowSnippet);
    }

    private static generateDivFiles(): void {
        for (const codeSnippetName of this.codeSnippetNames) {
            this.generateDivFileCodes(codeSnippetName);
        }
    }

    private static generateDivFileCodes(codeSnippetName: string): void {
        const codeSnippetRow = new CodeSnippetRow(codeSnippetName, this.selectedMetric);
        this.setMetricValues(codeSnippetRow, codeSnippetName);
        for (const metricName of this.metricNames) {
            this.generateDivCode(metricName, codeSnippetName, codeSnippetRow);
        }
        this.htmlReport.codeSnippetsTable.push(codeSnippetRow);
    }

    private static generateDivCode(metricName: string, codeSnippetName: string, divCodeMetric: CodeSnippetRow): void {
        const isSelected: boolean = metricName === this.selectedMetric;
        const divCode = new DivCode(codeSnippetName, metricName, isSelected);
        const reportSnippetForThisMetric: ReportSnippet = this.getReportSnippetForGivenMetric(metricName, codeSnippetName);
        divCode.code = ReportCodeService.getCode(reportSnippetForThisMetric.lines);
        divCodeMetric.divCodes.push(divCode);
    }

    private static getReportSnippetForGivenMetric(metricName: string, codeSnippetName: string): ReportSnippet {
        return flat(this.reportMetrics.map(r => r.reportSnippets)).find((s: ReportSnippet) => s.metricName === metricName && s.codeSnippetName === codeSnippetName);
    }

    private static setMetricValues(codeSnippetRow: CodeSnippetRow, codeSnippetName: string): void {
        for (const metricSelect of this.htmlReport.metricSelects) {
            this.setMetricValue(codeSnippetRow, codeSnippetName, metricSelect);
        }
    }

    private static setMetricValue(codeSnippetRow: CodeSnippetRow, codeSnippetName: string, metricSelect: MetricSelect): void {
        const reportSnippets: ReportSnippet[] = flat(this.reportMetrics.map(r => r.reportSnippets));
        const reportSnippetForThisFileAndThisMetric: ReportSnippet = reportSnippets.find(s => s.codeSnippetName === codeSnippetName && s.metricName === metricSelect.metricName);
        codeSnippetRow.divCodeValues.push(new DivCodeValues(codeSnippetName, metricSelect, reportSnippetForThisFileAndThisMetric?.score, this.metricNamesArray));
    }

    private static setCorrelations(): void {
        if (!Options.hasMeasures) {
            return;
        }
        const correlationNames: string[] = unique(flat(this.reportMetrics.map(r => r.correlations.map(c => c.name))));
        for (const correlationName of correlationNames) {
            const correlationRow = new CorrelationRow(correlationName);
            this.setMetricCorrelations(correlationRow);
            this.htmlReport.correlations.push(correlationRow);
        }
    }

    private static setMetricCorrelations(correlationRow: CorrelationRow): void {
        for (const metricName of this.metricNames) {
            this.setMetricCorrelation(correlationRow, metricName);
        }
    }

    private static setMetricCorrelation(correlationRow: CorrelationRow, metricName: string): void {
        correlationRow.values.push(this.reportMetrics.find(r => r.metricName === metricName)
            ?.correlations.find(c => c.name === correlationRow.correlationName)
            ?.value);
    }

    private static setCharts(): void {
        for (let i = 0; i < this.reportMetrics.length; i++) {
            this.setChartMetric(this.reportMetrics[i], i === this.reportMetrics.length - 1);
        }
    }

    private static setChartMetric(reportMetric: ReportMetric, isLastMetric: boolean): void {
        const chartMetric = new ChartMetric(reportMetric.metricName);
        const reportSnippetsSortByScore: ReportSnippet[] = reportMetric.reportSnippets.sort((a, b) => a.score - b.score);
        for (const reportSnippet of reportSnippetsSortByScore) {
            chartMetric.dots.push(new Dot(reportSnippet.score, reportSnippet.measureValue));
        }
        chartMetric.setLinearRegressionLine();
        chartMetric.width = round(100 / this.reportMetrics.length, 2);
        chartMetric.marginRight = isLastMetric ? 0 : 1;
        this.htmlReport.charts.push(chartMetric);
    }

    private static setTemplate(): HandlebarsTemplateDelegate {
        this.registerPartial("correlation", 'correlation');
        this.registerPartial("rowSnippet", 'row-snippet');
        this.registerPartial("divCode", 'div-code');
        this.registerPartial("codeSnippetRow", 'div-code-snippet-table');
        this.registerPartial("chart", 'chart');
        this.registerPartial("chartScript", 'chart-script');
        this.registerHelper();
        const reportTemplate = eol.auto(fs.readFileSync(`${Options.pathReport}/templates/handlebars/report.handlebars`, 'utf-8'));
        return Handlebars.compile(reportTemplate);
    }

    /**
     * Creates the file of the report
     */
    private static writeReport() {
        // console.log(chalk.cyanBright('HTML REPORTTTT'), this.htmlReport.rowSnippets);
        const template: HandlebarsTemplateDelegate = this.setTemplate();
        const content = template(this.htmlReport);
        const pathReport = `${Options.pathReport}/report.html`;
        fs.writeFileSync(pathReport, content, { encoding: 'utf-8' });
    }

    private static copyTemplatesDir(): void {
        const pathTemplates = `${Options.pathCommand}/src/report-generation/templates/`;
        ensureDirAndCopy(pathTemplates, `${Options.pathReport}/templates`);
    }

    /**
     * Registers a HandleBar's partial for a given partial's name and a given filename
     * @param partialName   // The name of the partial
     * @param filename      // The name of the file
     */
    private static registerPartial(partialName: string, filename: string): void {
        const partial = eol.auto(fs.readFileSync(`${Options.pathReport}/templates/handlebars/${filename}.handlebars`, 'utf-8'));
        Handlebars.registerPartial(partialName, partial);
    }

    private static registerHelper(): void {
        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
    }
}
