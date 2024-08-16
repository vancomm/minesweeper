import { z } from 'zod'
import { Failure, Success } from '../types'

export type ServerError = { statusCode: number; errorText: string }

export type ApiResponse<Output> = Success<Output> | Failure<ServerError>

type RequestParams = Record<string, string | number | boolean>

const createSearchParams = (params: RequestParams): URLSearchParams =>
    new URLSearchParams(
        Object.entries(params).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v.toString() }),
            {}
        )
    )

export const createApiMethod =
    <P extends RequestParams | undefined = undefined>(
        methodUrl: string,
        init?: RequestInit
    ) =>
    <T extends z.ZodTypeAny>(responseSchema: T) =>
    async (
        ...params: P extends undefined ? [] : [P]
    ): Promise<ApiResponse<z.infer<T>>> => {
        let url = methodUrl
        if (params.length) {
            const query = createSearchParams(params[0]).toString()
            url += '?' + query.toString()
        }
        const res = await fetch(url, init)
        if (!res.ok) {
            const errorText = await res.text()
            return {
                success: false,
                error: { errorText, statusCode: res.status },
            }
        }
        const rawBody = await res.json()
        const data = responseSchema.parse(rawBody)
        return { success: true, data: data as z.infer<T> }
    }
