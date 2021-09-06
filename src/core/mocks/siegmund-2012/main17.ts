
// 17. Check whether substring is contained
function start(args: string[]): void {
    let word = "Programming in Java";
    let key1 = "Java";
    let key2 = "Pascal";

    let index1 = word.indexOf(key1);
    let index2 = word.indexOf(key2);

    if (index1 != -1) {
        console.log("Substring is contained: " + key1);
    } else {
        console.log("Substring is not contained: " + key1);
    }
    if (index2 != -1) {
        console.log("Substring is contained: " + key2);
    } else {
        console.log("Substring is not contained: " + key2);
    }
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}
