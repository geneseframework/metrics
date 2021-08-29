import { Measure } from '../report-generation/models/measure.model';
import { MEASURES } from '../evaluation/const/measures.const';
import { Options } from '../core/models/options.model';
import * as chalk from 'chalk';
import { CellAddress, CellObject, WorkBook, WorkSheet } from 'xlsx';

const XLSX = require('xlsx');

export class DatasetService {

    static async getMeasures(): Promise<Measure[]> {
        const dataSheet: WorkSheet = await this.getXlsx();
        console.log(chalk.cyanBright('DATASET DATAAAAA'), dataSheet);
        const measures: Measure[] = this.getDataFromWorkSheet(dataSheet);
        console.log(chalk.greenBright('DATASET MEASURESSSS'), measures);
        return measures;
        // return MEASURES;
    }

    private static async getXlsx(): Promise<WorkSheet> {
            const csvPath: string = Options.pathDataset;
            console.log(chalk.cyanBright('DATASET PATHHHH'), csvPath);
        const wb: WorkBook = XLSX.readFile(csvPath);
        return wb.Sheets[wb.SheetNames[0]];
    }

    private static getDataFromWorkSheet(dataSheet: WorkSheet): Measure[] {
        const topLeft: CellAddress = this.getTopLeftCell(dataSheet);
        console.log(chalk.magentaBright('TOPLEFTTTTT'), topLeft);
        let snippetIdCell: CellAddress = {c: topLeft.c, r: topLeft.r + 1};
        const measures: Measure[] = [];
        while (this.hasMeasure(dataSheet, snippetIdCell)) {
            measures.push(this.getMeasure(dataSheet, snippetIdCell));
            snippetIdCell = {c: snippetIdCell.c, r: snippetIdCell.r + 1};
        }
        return measures;
    }

    private static getTopLeftCell(dataSheet: WorkSheet): CellAddress {
        const key: string = Object.keys(dataSheet).find(k => dataSheet[k].v === 'snippet_id');
        return XLSX.utils.decode_cell(key);
    }

    private static hasMeasure(dataSheet: WorkSheet, snippetIdCellAddress: CellAddress): boolean {
        const snippetIdCoors: string = XLSX.utils.encode_cell(snippetIdCellAddress);
        const measureCellCoors: string = XLSX.utils.encode_cell({c: snippetIdCellAddress.c + 1, r: snippetIdCellAddress.r});
        const measureValue: any = dataSheet[measureCellCoors]?.v;
        const snippetId: string = dataSheet[snippetIdCoors]?.v;
        const measure: number = !isNaN(measureValue) ? +measureValue : undefined;
        return snippetId && !!measure;
    }

    private static getMeasure(dataSheet: WorkSheet, snippetIdCellAddress: CellAddress): Measure {
        const snippetIdCoors: string = XLSX.utils.encode_cell(snippetIdCellAddress);
        const measureCellCoors: string = XLSX.utils.encode_cell({c: snippetIdCellAddress.c + 1, r: snippetIdCellAddress.r});
        return new Measure(dataSheet[snippetIdCoors].v, dataSheet[measureCellCoors].v);
    }

}
