import { GeneseCpxService } from '../metrics/services/genese-cpx.service';
import { LocService } from '../metrics/services/loc.service';
import { IdentifiersService } from '../metrics/services/identifiers.service';
import { MetricServicesList } from '../metrics/models/metric-services-list.model';

export const METRIC_SERVICES = new MetricServicesList({
    "genese-cpx": new GeneseCpxService(),
    "identifiers": new IdentifiersService(),
    "loc": new LocService(),
});
