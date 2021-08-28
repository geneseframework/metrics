
// 18. Least common multiple
function main18(args: string[]): void {
    let number1 = 23;
    let number2 = 42;

    let max, min;
    let results = -1; // Note: a ";" had to be added here to allow compilation

    if (number1>number2) {
        max = number1; min = number2;
    } else {
        max = number2; min = number1;
    }
    for(let i=1; i<=min; i++) {
        if( (max*i)%min == 0 ) {
            results = i*max; break; // Note: result had to be renamed to results to allow compilation
        }
    }
    if(results != -1) // Note: result had to be renamed to results to allow compilation
        console.log(results);
    else
        console.log("Error!");
}
