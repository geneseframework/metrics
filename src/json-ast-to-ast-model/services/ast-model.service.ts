import { JsonAstInterface } from '../../core/interfaces/json-ast/json-ast.interface';
import { AstModel } from '../../core/models/ast-model/ast.model';
import { AstMetricService } from './ast-metric.service';
import { Metric } from '../../core/models/metric.model';
import { AstFile } from '../../core/models/ast-model/ast-file.model';
import { JsonAstFolderInterface } from '../../core/interfaces/json-ast/json-ast-folder.interface';
import { AstFileService } from './ast-file.service';

export class AstModelService {

    static generate(jsonAst: JsonAstInterface): AstModel {
        const astModel = new AstModel();
        astModel.measureName = jsonAst.measure;
        const astFiles: AstFile[] = this.createAstFiles(jsonAst.astFolder);
        for (const metric of jsonAst.metrics) {
            const astMetric = new Metric(metric);
            astModel.astMetrics.push(AstMetricService.generate(astMetric, astFiles));
        }
        return astModel;
    }

    private static createAstFiles(jsonAstFolder: JsonAstFolderInterface): AstFile[] {
        const astFiles: AstFile[] = [];
        for (const jsonAstFile of jsonAstFolder.astFiles) {
            astFiles.push(AstFileService.generate(jsonAstFile));
        }
        return astFiles;
    }
}
