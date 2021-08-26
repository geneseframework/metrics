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
import { DivCodeMetric } from './models/div-code-metric.model';
import { ReportSnippet } from './models/report-snippet.model';
import { DivCode } from './models/div-code.model';
import { ReportCodeService } from './services/report-code.service';
import { MetricValue } from './models/metric-value.model';

export class ReportService {

    static async start(jsonReport: JsonReportInterface): Promise<any> {
        // console.log(chalk.greenBright('JSON REPORTTTTT '), jsonReport.reportMetrics.map(r => r.reportSnippets));
        this.createStyleFiles();
        const htmlReport = new HtmlReport();
        htmlReport.measure = jsonReport.measureName;
        htmlReport.metricNames = jsonReport.reportMetrics.map(r => r.metricName);
        this.generateRowSnippets(!!jsonReport.measureName, jsonReport.reportMetrics, htmlReport);
        this.generateDivCodeMetrics(jsonReport.reportMetrics, htmlReport);
        const template: HandlebarsTemplateDelegate = this.setTemplate();
        this.writeReport(htmlReport, template);
        return htmlReport;
    }

    private static generateRowSnippets(hasMeasure: boolean, reportMetrics: ReportMetric[], htmlReport: HtmlReport): void {
        const fileNames: string[] = flat(reportMetrics.map(r => r.reportSnippets.map(s => s.fileName)));
        for (const fileName of fileNames) {
            const reportSnippets: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets));
            const reportSnippet: ReportSnippet = reportSnippets.find(r => r.fileName === fileName);
            this.generateRowSnippet(fileName, hasMeasure, reportSnippet.measureValue, reportMetrics, htmlReport);
        }
    }

    private static generateRowSnippet(fileName: string, hasMeasure: boolean, measureValue: number, reportMetrics: ReportMetric[], htmlReport: HtmlReport): void {
        const rowSnippet = new RowSnippet(fileName, hasMeasure, measureValue);
        rowSnippet.scores = flat(reportMetrics.map(r => r.reportSnippets.map(r => r.score)));
        htmlReport.rowSnippets.push(rowSnippet);
    }

    private static generateDivCodeMetrics(reportMetrics: ReportMetric[], htmlReport: HtmlReport): void {
        for (const metricName of htmlReport.metricNames) {
            this.generateDivCodeMetric(metricName, reportMetrics, htmlReport);
        }
    }

    private static generateDivCodeMetric(metricName: string, reportMetrics: ReportMetric[], htmlReport: HtmlReport): void {
        const divCodeMetric = new DivCodeMetric(metricName);
        const fileNames: string[] = flat(reportMetrics.map(r => r.reportSnippets.map(r => r.fileName)));
        for (const fileName of fileNames) {
            this.generateDivCode(metricName, fileName, reportMetrics, htmlReport, divCodeMetric);
        }
        htmlReport.divCodeMetrics.push(divCodeMetric);
        // console.log(chalk.magentaBright('GEN DIV CODDDDD METRIC'), htmlReport.divCodeMetrics.map(d => d.divCodes));
    }

    /**
     * Generates the file's report
     */
    private static generateDivCode(metricName: string, fileName: string, reportMetrics: ReportMetric[], htmlReport: HtmlReport, divCodeMetric: DivCodeMetric): void {
        // console.log(chalk.blueBright('GEN DIV CODDDDD'), metricName, fileName);
        // console.log(chalk.blueBright('GEN DIV CODDDDD htmlReport'), htmlReport);
        const divCode = new DivCode(fileName, metricName);
        const reportSnippetForThisMetric: ReportSnippet = this.getReportSnippetForGivenMetric(metricName, reportMetrics);
        // console.log(chalk.blueBright('GEN DIV CODDDDD REPORT SNIPPPPPP'), reportSnippetForThisMetric);
        this.setMetricValues(divCode, fileName, reportMetrics);
        divCode.code = ReportCodeService.getCode(reportSnippetForThisMetric.lines);
        divCodeMetric.divCodes.push(divCode);
    }

    private static getReportSnippetForGivenMetric(metricName: string, reportMetrics: ReportMetric[]): ReportSnippet {
        return flat(reportMetrics.map(r => r.reportSnippets)).find((s: ReportSnippet) => s.metricName === metricName);
    }

    private static setMetricValues(divCode: DivCode, fileName: string, reportMetrics: ReportMetric[]): void {
        const metricNames: string[] = unique(reportMetrics.map(r => r.metricName));
        console.log(chalk.cyanBright('GEN DIV CODDDDD reportMetrics'), reportMetrics);
        console.log(chalk.cyanBright('GEN DIV CODDDDD snippp'), flat(reportMetrics.map(r => r.reportSnippets)));
        for (const metricName of metricNames) {
            this.setMetricValue(divCode, fileName, reportMetrics, metricName);
        }
        const reportSnippetsForThisFile: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets)).filter(s => s.fileName === fileName);
        console.log(chalk.magentaBright('REPRT FR FILEEEEEE'), reportSnippetsForThisFile);
    }

    private static setMetricValue(divCode: DivCode, fileName: string, reportMetrics: ReportMetric[], metricName: string): void {
        const reportSnippets: ReportSnippet[] = flat(reportMetrics.map(r => r.reportSnippets));
        const reportSnippetForThisFileAndThisMetric: ReportSnippet = reportSnippets.find(s => s.fileName === fileName && s.metricName === metricName);
        console.log(chalk.magentaBright('REPRT FR FILEEEEEE'), reportSnippetForThisFileAndThisMetric);
        divCode.metricValues.push(new MetricValue(metricName, reportSnippetForThisFileAndThisMetric.score));
    }

    /**
     * Generates the file's report
     */
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
    private static writeReport(htmlReport: HtmlReport, template: HandlebarsTemplateDelegate) {
        console.log(chalk.cyanBright('HTML REPORTTTT'), htmlReport.divCodeMetrics[0]);
        const content = template(htmlReport);
        // const template = this.template({
        //     colors: Options.colors,
        //     methods: this.methodReports,
        //     relativeRootReports: getPathWithDotSlash(this.relativeRootReports),
        //     stats: this.astFile.stats,
        //     thresholds: Options.getThresholds()
        // });
        // const filenameWithoutExtension = getFilenameWithoutExtension(
        //     this.astFile.name
        // );
        // const RELATIVE_PATH = constructLink(
        //     this.astFile.astFolder?.relativePath
        // );
        // const OUT_DIR = constructLink(Options.pathOutDir);
        const pathReport = `${Options.pathCommand}/report/report.html`;
        // let pathReport = `${deleteLastSlash(OUT_DIR)}/${deleteLastSlash(
        //     RELATIVE_PATH
        // )}/${filenameWithoutExtension}.html`;
        //
        //
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

    /**
     * Copy the css files, prism.js and chart.js to a subfolder of the outDir
     */
    private static createStyleFiles(): void {
        // createRelativeDir('reports-styles');
        // copyFile(`${Options.pathCommand}/src/report/templates/styles/report.css`, `${Options.pathOutDir}/reports-styles/report.css`);
        // copyFile(`${Options.pathCommand}/src/report/templates/styles/styles.css`, `${Options.pathOutDir}/reports-styles/styles.css`);
        // copyFile(`${Options.pathCommand}/src/report/templates/styles/prettify.css`, `${Options.pathOutDir}/reports-styles/prettify.css`);
        // copyFile(`${Options.pathCommand}/src/report/templates/styles/prism.css`, `${Options.pathOutDir}/reports-styles/prism.css`);
        // copyFile(`${Options.pathCommand}/src/report/templates/styles/prism.js`, `${Options.pathOutDir}/reports-styles/prism.js`);
        // copyFile(`${Options.pathCommand}/src/core/chartjs/Chart.js`, `${Options.pathOutDir}/reports-styles/Chart.js`);
    }
}
