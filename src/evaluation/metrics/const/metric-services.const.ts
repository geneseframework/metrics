import { GeneseCpxService } from '../services/genese-cpx.service';
import { LocService } from '../services/loc.service';
import { IdentifiersService } from '../services/identifiers.service';
import { MetricServicesList } from '../models/metric-services-list.model';
import { AstMetricService } from '../services/ast-metric.service';
import { DynamicMetricService } from '../services/dynamic-metric.service';

export const METRIC_SERVICES = new MetricServicesList({
    "ast": new AstMetricService(),
    "dynamic": new DynamicMetricService(),
    "genese-cpx": new GeneseCpxService(),
    "identifiers": new IdentifiersService(),
    "loc": new LocService(),
});
