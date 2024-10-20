import { validateFetcher } from 'api/common'
import { ENDPOINT } from 'api/constants'
import { AuthError, AuthParams, Status } from 'api/entities'

import { Result } from '@/monad'

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
