import { Measure } from '../report-generation/models/measure.model';
import { MEASURES } from './const/measures.const';
import { Options } from '../core/models/options.model';
import * as chalk from 'chalk';

const csv = require('csv-parser')
const fs = require('fs')

export class DatasetService {

    static async getMeasures(): Promise<Measure[]> {
        const measures: Measure[] = await this.getCsv();
        return MEASURES;
    }

    private static async getCsv(): Promise<Measure[]> {
        const results = [];
        const csvPath: string = Options.pathDataset;
        console.log(chalk.cyanBright('DATASET PATHHHH'), csvPath);
        return;
        // return new Promise((resolve, reject) => {
        //     fs.createReadStream(csvPath)
        //         .pipe(csv())
        //         .on('data', (data) => results.push(data))
        //         .on('end', () => {
        //             resolve(results);
        //         })
        //         .on('error', reject);
        // });
    }

}
