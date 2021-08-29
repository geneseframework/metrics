import { RowSnippet } from './row-snippet.model';
import { MetricSelect } from './metric-select.model';
import { codeSnippetRow } from './code-snippet-row.model';

export class HtmlReport {

    codeSnippetsTable: codeSnippetRow[] = [];
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
