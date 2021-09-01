function zzz(a: number): number {
    if (a > 0) {
        a = a + 1;
        if (a > - 2) {
            a = a - 1;
        }
    } else {
        a = a - 1;
    }
    switch (a) {
        case 1:
            return;
        case 2:
            return 3;
        default:
            return 2;
    }
}
let a;
a = a + 1;
