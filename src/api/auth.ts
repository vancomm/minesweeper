import { z } from 'zod'

import { ENDPOINT } from 'api/constants'

import { Result } from '@/monad'

import { validateFetcher } from './common'

export type AuthError = {
    statusCode: number
    errorText: string
}

export type AuthParams = {
    username: string
    password: string
}

export const PlayerInfo = z.object({
    player_id: z.number(),
    username: z.string(),
})

export const Status = z.discriminatedUnion('logged_in', [
    z.object({
        logged_in: z.literal(false),
    }),
    z.object({
        logged_in: z.literal(true),
        player: PlayerInfo,
    }),
])

export type Status = z.infer<typeof Status>

export type PlayerInfo = z.infer<typeof PlayerInfo>

export const status = validateFetcher(Status, () =>
    fetch(ENDPOINT + '/status', { credentials: 'include' })
)

export const register = async (
    data: AuthParams
): Promise<Result<null, AuthError>> => {
    const res = await fetch(ENDPOINT + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams(data),
    })
    if (res.ok) {
        return { success: true, data: null }
    }
    const errorText = await res.text()
    return {
        success: false,
        error: {
            statusCode: res.status,
            errorText,
        },
    }
}

export const login = async (
    data: AuthParams
): Promise<Result<null, AuthError>> => {
    const res = await fetch(ENDPOINT + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams(data),
    })
    if (res.ok) {
        return { success: true, data: null }
    }
    const errorText = await res.text()
    return {
        success: false,
        error: {
            statusCode: res.status,
            errorText,
        },
    }
}

export const logout = () =>
    fetch(ENDPOINT + '/logout', { method: 'POST', credentials: 'include' })
