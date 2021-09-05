import { AstLine } from '../../core/models/ast-model/ast-line.model';
import { isInInterval } from '../types/interval.type';
import { AstFile } from '../../core/models/ast-model/ast-file.model';

export class AstLineService {

    static setLines(astFile: AstFile): void {
        const codeSplit: string[] = astFile.text.split('\n');
        let linePos = 0;
        for (let i = 0; i < codeSplit.length; i++) {
            const astLine = new AstLine(codeSplit[i]);
            astLine.issue = i + 1;
            astLine.pos = linePos;
            astLine.end = astLine.pos + codeSplit[i].length;
            astLine.astNodes = astFile.descendants.filter(d => isInInterval(d.start, [linePos, astLine.end]));
            linePos += codeSplit[i].length + 1;
            astLine.setIdentifiersCpx();
            astFile.astLines.push(astLine);
        }
    }

}
