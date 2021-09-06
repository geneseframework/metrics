import { ProcessTrace } from './process-trace.model';

export const processTraces: ProcessTrace[] = [];

export function flag(fileName: string, line: number) {
    console.log('FLAG LINE ', fileName, line);
    const fileProcess = processTraces.find(p => p.fileName === fileName);
    if (fileProcess) {
        fileProcess.lines.push(line);
    } else {
        processTraces.push(new ProcessTrace(fileName, line));
    }

}
