
/**
 * Note: method names were changed from 'main' to main + their task number
 *       this allows the code to be compiled and analyzed by sonarqube
 */

// 1. Faculty
function main01(args: string[]): void {
    let result = 1;
    let x = 4;

    while (x > 1) {
        result = result * x;
        x--;
    }
    console.log(result);
}
