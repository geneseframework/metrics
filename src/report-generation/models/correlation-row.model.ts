export class CorrelationRow {

    correlationName: string = undefined;
    values: number[] = [];

    constructor(correlationName: string) {
        this.correlationName = correlationName;
    }

}
