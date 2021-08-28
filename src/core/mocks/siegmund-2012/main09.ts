

// 9. Prime test
function main09(args: string[]): void {
    let number = 11;
    let result = true;
    for(let i = 2; i < number; i++) {
        if(number % i == 0) {
            result = false;
            break;
        }
    }
    console.log(result);
}
