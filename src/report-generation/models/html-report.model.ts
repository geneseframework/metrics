import { RowSnippet } from './row-snippet.model';
import { DivCodeMetric } from './div-code-metric.model';
import { MetricSelect } from './metric-select.model';

export class HtmlReport {

    divCodeMetrics: DivCodeMetric[] = [];
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
