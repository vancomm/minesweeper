import { Result, ResultAsync, err, ok } from 'neverthrow';
import { z } from 'zod';

import { coerceError } from '@/lib';

export type FetchError = { type: 'FETCH_ERROR'; error: Error } | { type: 'HTTP_ERROR'; status: number };

export type ValidatedFetchError = FetchError | { type: 'VALIDATION_ERROR'; error: z.ZodError };

export function wrapFetch<A extends Array<unknown>>(fetchFn: (...args: A) => Promise<Response>) {
    return async function (...args: A): Promise<Result<Response, FetchError>> {
        const fetchRes = await ResultAsync.fromPromise<Response, FetchError>(fetchFn(...args), (e) => ({
            type: 'FETCH_ERROR',
            error: coerceError(e),
        }));
        if (fetchRes.isErr()) {
            return err(fetchRes.error);
        }
        if (!fetchRes.value.ok) {
            return err({ type: 'HTTP_ERROR', status: fetchRes.value.status });
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

        const jsonRes = await ResultAsync.fromPromise<unknown, ValidatedFetchError>(fetchRes.value.json(), (e) => ({
            type: 'FETCH_ERROR',
            error: coerceError(e),
        }));
        if (jsonRes.isErr()) {
            return err(jsonRes.error);
        }

        const { success, data, error } = validator.safeParse(jsonRes.value);
        return success ? ok(data) : err({ type: 'VALIDATION_ERROR', error });
    };
}
