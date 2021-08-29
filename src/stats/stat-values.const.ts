import { PearsonService } from './calc/pearson.service';
import { AbstractCalcService } from './calc/abstract-calc.service';

export const STAT_VALUES: { [key: string]: AbstractCalcService } = {
    "Pearson": new PearsonService()
}
