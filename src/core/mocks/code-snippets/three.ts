function start(p: number) {
    let a = 3;
    const z = new ZZZ(5);
    return p + a + z.b;
}


class ZZZ {

    b;

    constructor(b: number) {
        this.b = b;
    }
}
