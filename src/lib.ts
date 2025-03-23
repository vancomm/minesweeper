import { Result } from 'neverthrow';

export function coerceError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export function raise(err: unknown): never {
    throw err;
}

export function unwrap<T>(res: Result<T, unknown>): T {
    return res.isErr() ? raise(res.error) : res.value;
}

export type SearchParams = Record<string, string | number | boolean>;

export function createURLSearchParams(search?: SearchParams): URLSearchParams {
    return new URLSearchParams(
        Object.entries(search ?? {}).reduce((acc, [k, v]) => ({ ...acc, [k]: v.toString() }), {})
    );
}

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export function bisectLeft<T>(arr: T[], el: T, cmp: (a: T, b: T) => number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
        const m = (lo + hi) >> 1;
        const c = cmp(el, arr[m]);
        if (c > 0) {
            lo = m + 1;
        } else if (c < 0) {
            hi = m;
        }
    }
    return lo;
}

export function* iterateDigits(num: number) {
    if (num === 0) {
        yield 0;
        return;
    }
    let powerOf10 = Math.floor(Math.log10(num));
    while (powerOf10 >= 0) {
        const digit = Math.floor(num / 10 ** powerOf10);
        yield digit;
        num %= 10 ** powerOf10;
        powerOf10--;
    }
}
