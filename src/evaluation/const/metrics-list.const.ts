import { AbstractMetricService } from '../metrics/abstract-metric.service';
import { GeneseCpxService } from '../metrics/genese-cpx/genese-cpx.service';
import { LocService } from '../metrics/loc/loc.service';
import { IdentifiersService } from '../metrics/identifiers/identifiers.service';

export const METRIC_SERVICES: { [metricName: string]: AbstractMetricService } = {
    "genese-cpx": new GeneseCpxService(),
    "identifiers": new IdentifiersService(),
    "loc": new LocService(),
}

// import { MetricsList } from '../metrics/metrics-list.model';
// import { GENESE_WEIGHTS } from '../metrics/genese-cpx/const/genese-weights.const';
//
// export const METRICS_LIST: MetricsList = {
//     "genese-cpx": GENESE_WEIGHTS,
//     "identifiers": {identifiers: 1},
//     "loc": new LocService(),
//
// }
