import { Result, ResultAsync, err, ok } from 'neverthrow';
import { z } from 'zod';

import { coerceError } from '@/lib';

type NetworkError = { type: 'NETWORK_ERROR'; error: Error };
type TimeoutError = { type: 'TIMEOUT_ERROR' };
type HttpError = { type: 'HTTP_ERROR'; status: number };

export type FetchError = NetworkError | TimeoutError | HttpError;

type ValidationError = { type: 'VALIDATION_ERROR'; error: Error; zodError?: z.ZodError };

export type ValidatedFetchError = FetchError | ValidationError;

export function timeoutFetch(ms: number): typeof fetch {
    const controller = new AbortController();
    setTimeout(() => controller.abort('TIMEOUT'), ms);
    return (...[input, init]: Parameters<typeof fetch>) => fetch(input, { ...init, signal: controller.signal });
}

export function wrapFetch<A extends Array<unknown>>(fetchFn: (...args: A) => Promise<Response>) {
    return async function (...args: A): Promise<Result<Response, FetchError>> {
        const fetchRes = await ResultAsync.fromPromise(fetchFn(...args), (e) =>
            e === 'TIMEOUT'
                ? ({ type: 'TIMEOUT_ERROR' } satisfies TimeoutError)
                : ({
                      type: 'NETWORK_ERROR',
                      error: coerceError(e),
                  } satisfies NetworkError)
        );
        if (fetchRes.isErr()) {
            return err(fetchRes.error);
        }
        if (!fetchRes.value.ok) {
            return err({ type: 'HTTP_ERROR', status: fetchRes.value.status } satisfies HttpError);
        }
        return ok(fetchRes.value);
    };
}

export function validateFetch<A extends Array<unknown>, I, O, TValidator extends z.ZodType<O, z.ZodTypeDef, I>>(
    validator: TValidator,
    fetchFn: (...args: A) => Promise<Response>
) {
    return async function (...args: A): Promise<Result<z.infer<TValidator>, ValidatedFetchError>> {
        const fetchRes = await wrapFetch(fetchFn)(...args);
        if (fetchRes.isErr()) {
            return err(fetchRes.error);
        }

        const jsonRes = await ResultAsync.fromPromise(
            fetchRes.value.json(),
            (e) =>
                ({
                    type: 'VALIDATION_ERROR',
                    error: coerceError(e),
                }) satisfies ValidationError
        );
        if (jsonRes.isErr()) {
            return err(jsonRes.error);
        }

        const { success, data, error } = validator.safeParse(jsonRes.value);
        return success ? ok(data) : err({ type: 'VALIDATION_ERROR', error, zodError: error } satisfies ValidationError);
    };
}
