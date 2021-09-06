
// 4. BubbleSort
function start(args: string[]): void {
    let array = [14,5,7];
    for (let counter1 = 0; counter1 < array.length; counter1++) {
        for (let counter2 = counter1; counter2 > 0; counter2--) {
            if (array[counter2 - 1] > array[counter2]) {
                let variable1 = array[counter2];
                array[counter2] = array[counter2 - 1];
                array[counter2 - 1] = variable1;
            }
        }
    }

    for (let counter3 = 0; counter3 < array.length; counter3++) {
        console.log(array[counter3]);
    }
}


export function traceProcess() {
    start([]);
}
const console = {log: (...args) => {}}
