

// 8. Cross sum
function main08(args: string[]): void {
    let number = 323;
    let result = 0;

    while (number!= 0) {
        result = result + number % 10;
        number = number / 10;
    }
    console.log(result);
}
