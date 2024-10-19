export const raise = (err: unknown) => {
    throw err
}

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n)
    }
}

export function bisectLeft<T>(
    arr: T[],
    el: T,
    cmp: (a: T, b: T) => number
): number {
    let lo = 0
    let hi = arr.length
    while (lo < hi) {
        const m = (lo + hi) >> 1
        const c = cmp(el, arr[m])
        if (c > 0) {
            lo = m + 1
        } else if (c < 0) {
            hi = m
        }
    }
    return lo
}
