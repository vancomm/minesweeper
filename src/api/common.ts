import { z } from 'zod'
import { Failure, Success } from '../types'

export const ENDPOINT = __API_URL__
export const WS_ENDPOINT = __WS_URL__

export const sessionIdToWS = (session_id: string) =>
    `${WS_ENDPOINT}/game/${session_id}/connect`

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
    <I, O, TValidator extends z.ZodType<O, z.ZodTypeDef, I>>(
        responseSchema: TValidator
    ) =>
    async (
        // ...params: P extends undefined ? [R?] : [P, R?]
        params: S extends undefined ? RequestInit : { search: S } & RequestInit
    ): Promise<ApiResponse<z.infer<TValidator>>> => {
        let url = methodUrl
        if (params && 'search' in params) {
            const query = createSearchParams(params.search).toString()
            url += '?' + query.toString()
        }
        const res = await fetch(url, {
            ...init,
            ...params,
            credentials: 'include',
        })
        if (!res.ok) {
            const errorText = await res.text()
            return {
                success: false,
                error: { errorText, statusCode: res.status },
            }
        }
        const data = responseSchema.parse(await res.json())
        return { success: true, data: data as z.infer<TValidator> }
    }
