export class ProcessTrace {

    fileName: string = undefined;
    lines: number[] = [];

    constructor(fileName: string, line: number) {
        this.fileName = fileName;
        this.lines = [line];
    }
}
