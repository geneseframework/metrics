
// 2. Count same chars at same positions in String
function start(args: string[]): void {
    let string1 = "Magdeburg";
    let string2 = "Hamburg";

    let length;
    if (string1.length < string2.length)
        length = string1.length;
    else length = string2.length;

    let counter=0;

    for (let i = 0; i < length; i++) {
        if (string1.charAt(i) == string2.charAt(i)) {
            counter++;
        }
    }
    console.log(counter);
}
