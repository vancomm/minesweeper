import { z } from 'zod'

const ServerError = z.object({
    rawError: z.string(),
    statusCode: z.number(),
    errors: z.record(z.string(), z.string()).optional(),
})

type ServerError = z.infer<typeof ServerError>

type ApiSuccess<Output> = {
    success: true
    data: Output
    error?: never
}

type ApiError = {
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

export const createApiMethod =
    <P extends RequestParams | undefined, T extends z.ZodTypeAny>(
        url: string,
        schema: T
    ) =>
    async (params: P): Promise<ApiReturnType<z.infer<T>>> => {
        if (params) {
            const query = createSearchParams(params).toString()
            url += '?' + query.toString()
        }
        const res = await fetch(url)
        if (!res.ok) {
            const rawBody = await res.json()
            const error = ServerError.parse(rawBody)
            return { success: false, error }
        }
        const rawBody = await res.json()
        const data = schema.parse(rawBody)
        return { success: true, data: data as z.infer<T> }
    }
