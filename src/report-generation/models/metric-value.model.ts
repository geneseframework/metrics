export class MetricValue {

    name: string = undefined;
    value: number = undefined;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}
