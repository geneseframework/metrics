
// 15. Matrix multiplication
function main15(args: string[]): void {
    let array = [[5,6,7],[4,8,9]];
    let array1 = [[6,4],[5,7],[1,1]];
    let array2 = [3][3];

    let x = array.length;
    let y = array1.length;

    for(let i = 0; i < x; i++) {
        for(let j = 0; j < y-1; j++) {
            for(let k = 0; k < y; k++){
                array2[i][j] += array[i][k]*array1[k][j];
            }
        }
    }

    for(let i = 0; i < x; i++) {
        for(let j = 0; j < y-1; j++) {
            console.log(" "+array2[i][j]);
        }
    }
}
