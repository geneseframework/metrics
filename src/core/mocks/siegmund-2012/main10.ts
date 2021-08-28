

// 10. Find middle number of three numbers
function main10(args: string[]): void {
    let num1 = 5;
    let num2 = 3;
    let num3 = 10;

    if (num1 > num2 && num1 > num3)
        console.log(num1);
    else if (num2 > num1 && num2 > num3)
        console.log(num2);
    else if (num3 > num1 && num3 > num2)
        console.log(num3);
}
