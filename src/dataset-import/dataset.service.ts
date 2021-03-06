import { Measure } from '../report-generation/models/measure.model';
import { Options } from '../core/models/options.model';
import { CellAddress, WorkBook, WorkSheet } from 'xlsx';
import { round } from '../core/utils/numbers.util';
import { AstModel } from '../core/models/ast-model/ast.model';
import { AstFile } from '../core/models/ast-model/ast-file.model';
import { removeExtension } from '../core/utils/file-system.util';

const XLSX = require('xlsx');

export class DatasetService {

    static setMeasures(astModel: AstModel): void {
        if (!Options.hasMeasures) {
            return;
        }
        const wb: WorkBook = XLSX.readFile(Options.pathDataset);
        const dataSheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
        const measures: Measure[] = this.getDataFromWorkSheet(dataSheet);
        this.setMeasuresToAstModel(astModel, measures);
    }

    private static getDataFromWorkSheet(dataSheet: WorkSheet): Measure[] {
        const topLeft: CellAddress = this.getTopLeftCell(dataSheet);
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
        const hasMeasureValue: boolean = !isNaN(dataSheet[measureCellCoors]?.v);
        const hasSnippetId: boolean = !!dataSheet[snippetIdCoors]?.v;
        return hasSnippetId && !!hasMeasureValue;
    }

    private static getMeasure(dataSheet: WorkSheet, snippetIdCellAddress: CellAddress): Measure {
        const snippetIdCoors: string = XLSX.utils.encode_cell(snippetIdCellAddress);
        const measureCellCoors: string = XLSX.utils.encode_cell({c: snippetIdCellAddress.c + 1, r: snippetIdCellAddress.r});
        return new Measure(dataSheet[snippetIdCoors].v, round(dataSheet[measureCellCoors].v, 3));
    }

    private static setMeasuresToAstModel(astModel: AstModel, measures: Measure[]) {
        for (const measure of measures) {
            const astFile: AstFile = astModel.astFiles.find(a => removeExtension(a.name) === measure.codeSnippetName);
            astFile.measureValue = measure.measureValue;
        }
    }

}
