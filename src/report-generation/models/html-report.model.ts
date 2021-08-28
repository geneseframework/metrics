import { RowSnippet } from './row-snippet.model';
import { DivFile } from './div-file.model';
import { MetricSelect } from './metric-select.model';

export class HtmlReport {

    divFiles: DivFile[] = [];
    rowSnippets: RowSnippet[] = [];
    measure: string = undefined;
    metricSelects: MetricSelect[] = [];

}
