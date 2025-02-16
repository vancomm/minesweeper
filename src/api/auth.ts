import { validateFetcher } from 'api/common';
import { AuthError, AuthParams, Status } from 'api/entities';

import { API_PREFIX } from '@/constants';
import { Result } from '@/monad';

export const status = validateFetcher(Status, () => fetch(API_PREFIX + '/status', { credentials: 'include' }));

export const register = async (data: AuthParams): Promise<Result<null, AuthError>> => {
    const res = await fetch(API_PREFIX + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams(data),
    });
    if (res.ok) {
        return { success: true, data: null };
    }
    const errorText = await res.text();
    return {
        success: false,
        error: {
            statusCode: res.status,
            errorText,
        },
    };
};

export const login = async (data: AuthParams): Promise<Result<null, AuthError>> => {
    const res = await fetch(API_PREFIX + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams(data),
    });
    if (res.ok) {
        return { success: true, data: null };
    }
    const errorText = await res.text();
    return {
        success: false,
        error: {
            statusCode: res.status,
            errorText,
        },
    };
};

export const logout = () => fetch(API_PREFIX + '/logout', { method: 'POST', credentials: 'include' });
