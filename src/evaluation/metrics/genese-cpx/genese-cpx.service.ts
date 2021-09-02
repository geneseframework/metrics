import { AbstractMetricService } from '../abstract-metric.service';
import { AstFile } from '../../../core/models/ast-model/ast-file.model';
import { ReportSnippet } from '../../../report-generation/models/report-snippet.model';
import { GENESE_WEIGHTS } from './const/genese-weights.const';

export class GeneseCpxService extends AbstractMetricService {

    evaluate(astFile: AstFile, reportFile: ReportSnippet): void {
        this.evaluateMetric(astFile, reportFile, GENESE_WEIGHTS);
    }
}
