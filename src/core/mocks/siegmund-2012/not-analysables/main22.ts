
// 22. Median on sorted data
function main22(args: string[]): void {
    let array=[1,2,4,5,6,10];

    array.sort(); // Note: this line had to me changed to allow compilation

    let b: number;
    if (array.length % 2==1)
        b=array[array.length /2];
    else
        b=(array[array.length/2-1]+array[array.length/2])/2;

    console.log(b);
}

