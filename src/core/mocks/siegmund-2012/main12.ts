
// 12. Check palindrom
function main12(args: string[]): void {
    let word = "otto";
    let result = true;
    for (let i = 0, j = word.length - 1; i < word.length/2; i++, // Note: "int" before j had to be removed to allow compilation
        j--) {
        if (word.charAt(i) != word.charAt(j)) {
            result = false;
            break;
        }
    }
    console.log(result);
}
