import { OptimizationFile } from './optimization-file.model';

export class Optimization {

    metricName: string = undefined;
    optimizationFiles: OptimizationFile[] = [];

    constructor(metricName: string, optimizationFiles: OptimizationFile[]) {
        this.metricName = metricName;
        this.optimizationFiles = optimizationFiles;
    }
}
