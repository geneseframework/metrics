
// 6. Sum from 1 to n
function main06 (args: string[]): void {
    let n = 4; // Note: a ";" had to be added here to allow compilation
    let result = 0;
    for (let i = 1; i <= n; i++)
        result = result + i;
    console.log(result);
}
