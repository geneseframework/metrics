

// 8. Cross sum
function start(args: string[]): void {
    let number = 323;
    let result = 0;

    while (number!= 0) {
        result = result + number % 10;
        number = Math.floor(number / 10) // originally number = number / 10 in Java;
    }
    console.log(result);
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}
