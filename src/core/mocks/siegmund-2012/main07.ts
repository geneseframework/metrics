

// 7. Find max in list of numbers
function start(args: string[]): void {
    let array = [2, 19, 5, 17];
    let result = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > result) {
            result = array[i];
        }
    }
    console.log(result);
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}


