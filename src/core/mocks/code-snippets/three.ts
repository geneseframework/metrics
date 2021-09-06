function start(p: number) {
    let a = 3;
    const z = 5;
    for (let i = 0; i < 3; i++) {
        a = a + i;
    }
    return p + a + z;
}

export function trace() {
    start(2);
}

// class ZZZ {
//
//     b;
//
//     constructor(b: number) {
//         this.b = b;
//     }
// }
