
// 23. Double entries of array
function start(args: string[]): void {
    let array = [ 1, 3, 11, 7, 4 ];

    for (let i = 0; i < array.length; i++) {
        array[i] = array[i] * 2;
    }
    for (let i = 0; i <= array.length - 1; i++) {
        console.log(array[i]);
    }
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}
