

// 9. Prime test
function start(args: string[]): void {
    let number = 11;
    let result = true;
    for(let i = 2; i < number; i++) {
        if(number % i == 0) {
            result = false;
            break;
        }
    }
    console.log(result);
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}
