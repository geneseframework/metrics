
// 21. Reverse entries of array
function start(args: string[]): void {
    let array = [1, 6, 4, 10, 2 ];

    for (let i = 0; i <= array.length/2-1; i++){
        let tmp=array[array.length-i-1];
        array[array.length-i-1] = array[i];
        array[i]=tmp;
    }

    for (let i = 0; i <= array.length - 1; i++) { // Note a "{" had to be added here to allow compilation
        console.log(array[i]);
    }
}
