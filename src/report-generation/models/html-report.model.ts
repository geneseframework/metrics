import { RowSnippet } from './row-snippet.model';
import { MetricSelect } from './metric-select.model';
import { DivFile } from './div-file.model';

export class HtmlReport {

    divFiles: DivFile[] = [];
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
