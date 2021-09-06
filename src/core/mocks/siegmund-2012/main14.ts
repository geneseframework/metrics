
// 14. Reverse string
function start(args: string[]): void {
    let word = "Hello";
    let result = new String();

    for ( let j = word.length - 1; j >= 0; j-- ) {
        result += word.charAt(j);
    }
    console.log(word);
}
