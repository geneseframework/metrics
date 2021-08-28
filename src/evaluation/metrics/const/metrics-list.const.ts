import { LocService } from '../loc/loc.service';
import { AbstractMetricService } from '../services/abstract-metric.service';
import { GeneseCpxService } from '../genese-cpx/genese-cpx.service';
import { IdentifiersService } from '../identifiers/identifiers.service';

export const METRIC_SERVICES: { [metricName: string]: AbstractMetricService } = {
    "genese-cpx": new GeneseCpxService(),
    "identifiers": new IdentifiersService(),
    "loc": new LocService(),
}

