import { z } from 'zod'
import { Failure, Success } from '../types'

export type ServerError = { statusCode: number; errorText: string }

export type ApiResponse<Output> = Success<Output> | Failure<ServerError>

type SearchParams = Record<string, string | number | boolean>

const createSearchParams = (search: SearchParams): URLSearchParams =>
    new URLSearchParams(
        Object.entries(search).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v.toString() }),
            {}
        )
    )

export const createApiMethod =
    <S extends SearchParams | undefined = undefined>(
        methodUrl: string,
        init?: RequestInit
    ) =>
    <T extends z.ZodTypeAny>(responseSchema: T) =>
    async (
        // ...params: P extends undefined ? [R?] : [P, R?]
        params: S extends undefined ? RequestInit : { search: S } & RequestInit
    ): Promise<ApiResponse<z.infer<T>>> => {
        let url = methodUrl
        if (params && 'search' in params) {
            const query = createSearchParams(params.search).toString()
            url += '?' + query.toString()
        }
        const res = await fetch(url, { ...init, ...params })
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
