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
        return [];
    }

    private static getTopLeftCell(dataSheet: WorkSheet): CellAddress {
        const key: string = Object.keys(dataSheet).find(k => dataSheet[k].v === 'snippet_id');
        return XLSX.utils.decode_cell(key);
    }

}
