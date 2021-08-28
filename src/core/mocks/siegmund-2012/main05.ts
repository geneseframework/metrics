
// 5. Binary search
function main05(args: string[]): void {
    let array = [2, 4, 5, 6, 8, 10, 13];
    let key = 5;
    let index1 = 0;
    let index2 = array.length - 1;
    while (index1 <= index2) {
        let m = (index1 + index2) / 2;
        if (key < array[m])
            index2 = m - 1;
        else if (key > array[m])
            index1 = m + 1;
        else {
            console.log(m);
            break;
        }
    }
}
