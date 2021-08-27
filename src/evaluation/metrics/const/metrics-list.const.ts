import { LocService } from '../loc/loc.service';
import { AbstractMetricService } from '../services/abstract-metric.service';
import { IdentifiersService } from '../identifiers/identifiers.service';

export const METRIC_SERVICES: { [metricName: string]: AbstractMetricService } = {
    "identifiers": new IdentifiersService(),
    "loc": new LocService(),
}

