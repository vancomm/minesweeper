import { z } from 'zod'

export type ApiSuccess<Output> = {
    success: true
    data: Output
    error?: never
}

export type ServerError = { statusCode: number; errorText: string }

export type ApiError = {
    success: false
    error: ServerError
    data?: never
}

type ApiReturnType<Output> = ApiSuccess<Output> | ApiError

type RequestParams = Record<string, string | number | boolean>

const createSearchParams = (params: RequestParams): URLSearchParams =>
    new URLSearchParams(
        Object.entries(params).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v.toString() }),
            {}
        )
    )

// export const createApiMethod =
//     <P extends RequestParams | undefined, T extends z.ZodTypeAny>(
//         url: string,
//         schema: T,
//         init?: RequestInit
//     ) =>
//     async (params: P): Promise<ApiReturnType<z.infer<T>>> => {
//         if (params) {
//             const query = createSearchParams(params).toString()
//             url += '?' + query.toString()
//         }
//         const res = await fetch(url, init)
//         if (!res.ok) {
//             const rawBody = await res.json()
//             const error = ServerError.parse(rawBody)
//             return { success: false, error }
//         }
//         const rawBody = await res.json()
//         const data = schema.parse(rawBody)
//         return { success: true, data: data as z.infer<T> }
//     }

export const createApiMethod =
    <P extends RequestParams | undefined>(
        methodUrl: string,
        init?: RequestInit
    ) =>
    <T extends z.ZodTypeAny>(responseSchema: T) =>
    async (params: P): Promise<ApiReturnType<z.infer<T>>> => {
        console.log('params', params)
        let url = methodUrl
        if (params) {
            const query = createSearchParams(params).toString()
            url += '?' + query.toString()
        }
        console.log(`fetching ${url}`)
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
