import { ProcessTrace } from './process-trace.model';

export const PROCESS_TRACES: ProcessTrace[] = [];
export let STARTED_TRACING = false;

export function flag(fileName: string, line: number) {
    console.log('FLAG LINE ', fileName, line);
    if (STARTED_TRACING) {
        console.log('IS TRACINGGGGG');
        const fileProcess = PROCESS_TRACES.find(p => p.fileName === fileName);
        if (fileProcess) {
            fileProcess.lines.push(line);
        } else {
            PROCESS_TRACES.push(new ProcessTrace(fileName, line));
        }

    }
}

export function startTrace(): void {
    console.log('STARTTTTTT');
    STARTED_TRACING = true;
}


export function endTrace(): void {
    console.log('ENDDDD');
    STARTED_TRACING = false;
}
