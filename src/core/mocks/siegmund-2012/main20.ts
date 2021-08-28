
// 20. Decimal to binary
function main20(args: string[]): void {
    let i=14;
    let result="";

    while (i>0) {
        if (i%2 ==0)
            result="0"+result;
        else
            result="1"+result;
        i=i/2;
    }

    console.log(result);
}
