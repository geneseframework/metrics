import { RowSnippet } from './row-snippet.model';
import { MetricSelect } from './metric-select.model';
import { CodeSnippetRow } from './code-snippet-row.model';
import { CorrelationRow } from './correlation-row.model';

export class HtmlReport {

    charLeft: any = undefined;
    charRight: any = undefined;
    codeSnippetsTable: CodeSnippetRow[] = [];
    correlations: CorrelationRow[] = [];
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
