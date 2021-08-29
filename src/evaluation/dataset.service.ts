import { Measure } from '../report-generation/models/measure.model';
import { MEASURES } from './const/measures.const';

const csv = require('csv-parser')
const fs = require('fs')

export class DatasetService {

    static async getMeasures(): Promise<Measure[]> {
        return MEASURES;
    }

    private static async getCsv(): Promise<any[]> {
        const results = [];
        const csvPath: string = `/genese/complexity/reports/cpx-report.csv`;
        return new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', reject);
        });
    }

}
