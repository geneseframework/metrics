
// 3. Greatest common divisor
// Note: To allow compilation, number1 and number2 had to be defined
function main03(number1: number, number2: number) {
    let temp; // Note: a ";" had to be added here to allow compilation
    do {
        if (number1 < number2) {
            temp = number1;
            number1 = number2;
            number2 = temp;
        }
        temp = number1 % number2;
        if (temp != 0) {
            number1 = number2;
            number2 = temp;
        }
    } while (temp != 0);
    console.log(number2);
}
