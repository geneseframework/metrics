const b = 12;

function zzz(a) {
    if (a > 0) {
        a = 2;
    } else if (a < -1) {
        return 3;
    }
    return a;
}

export function traceProcess() {
    zzz(-2);
}

let a = 3;
