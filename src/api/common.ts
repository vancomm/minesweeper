import { z } from 'zod'

import { WS_URL } from '@/constants'
import { Errorable, isErrorable, newErrorable } from '@/errorable'
import { raise } from '@/lib'
import { Result } from '@/monad'

export const sessionIdToWS = (session_id: string) =>
    `${WS_URL}/game/${session_id}/connect`

export type ServerError = { statusCode: number; errorText: string }

export type ApiResponse<Output> = Result<Output, ServerError>

export type SearchParams = Record<string, string | number | boolean>

export const createSearchParams = (search?: SearchParams): URLSearchParams =>
    new URLSearchParams(
        Object.entries(search ?? {}).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v.toString() }),
            {}
        )
    )

export const validateFetcher =
    <
        A extends Array<unknown>,
        I,
        O,
        TValidator extends z.ZodType<O, z.ZodTypeDef, I>,
    >(
        validator: TValidator,
        fetchFn: (...args: A) => Promise<Response>
    ): ((...args: A) => Promise<Result<z.infer<TValidator>, Errorable>>) =>
    (...args: A) =>
        fetchFn(...args)
            .then((res) =>
                res.ok
                    ? res
                    : raise(newErrorable(`request error code ${res.status}`))
            )
            .then((res) => res.json())
            .then((json) => validator.safeParse(json))
            .then(({ success, data, error }) =>
                success
                    ? { success, data }
                    : (console.error(error),
                      raise(newErrorable('validation error')))
            )
            .catch((err) => ({
                success: false,
                error: isErrorable(err) ? err : newErrorable(`${err}`),
            }))
