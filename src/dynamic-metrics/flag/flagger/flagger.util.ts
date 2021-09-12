import { ProcessTrace } from './process-trace.model';

export const PROCESS_TRACES: ProcessTrace[] = [];
export let STARTED_TRACING = false;

export function flag(fileName: string, line: number) {
    if (STARTED_TRACING) {
        console.log('TRACE ', fileName, line);
        const fileProcess = PROCESS_TRACES.find(p => p.fileName === fileName);
        if (fileProcess) {
            fileProcess.lines.push(line);
        } else {
            PROCESS_TRACES.push(new ProcessTrace(fileName, line));
        }

    }
}

export function startTrace(): void {
    STARTED_TRACING = true;
}

export function endTrace(): void {
    STARTED_TRACING = false;
}
