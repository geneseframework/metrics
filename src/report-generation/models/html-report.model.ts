import { RowSnippet } from './row-snippet.model';
import { MetricSelect } from './metric-select.model';
import { CodeSnippetRow } from './code-snippet-row.model';
import { CorrelationRow } from './correlation-row.model';
import { ChartMetric } from './chart-metric.model';

export class HtmlReport {

    charts: ChartMetric[] = [];
    codeSnippetsTable: CodeSnippetRow[] = [];
    correlations: CorrelationRow[] = [];
    hasMeasures: boolean = true;
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
