export function round(value: number, decimals: number): number {
    const m = Math.pow(10, decimals);
    return  Math.round(value * m) / m;
}
