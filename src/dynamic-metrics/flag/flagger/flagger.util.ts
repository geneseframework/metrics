import { ProcessTrace } from './process-trace.model';

export const PROCESS_TRACES: ProcessTrace[] = [];

export function flag(fileName: string, line: number) {
    // console.log('FLAG LINE ', fileName, line);
    const fileProcess = PROCESS_TRACES.find(p => p.fileName === fileName);
    if (fileProcess) {
        fileProcess.lines.push(line);
    } else {
        PROCESS_TRACES.push(new ProcessTrace(fileName, line));
    }

}
