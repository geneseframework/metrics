function zzz(a: number, f?: (elt: number) => number): number {
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
            return zzz(a);
        case 2:
            return f(a);
        default:
            return 2;
    }
}
class Cl {

    zMethod(arr: number[]) {
        let t = 0;
        for (const a of arr) {
            t = t + a;
        }
        return t;
    }
}

let b;
b = b + 1;
