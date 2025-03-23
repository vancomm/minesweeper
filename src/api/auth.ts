import { wrapFetch } from 'api/common';
import { AuthParams } from 'api/entities';

import { API_PREFIX } from '@/constants';

export async function status() {
    return wrapFetch(() => fetch(API_PREFIX + '/status', { credentials: 'include' }))();
}

export async function register(data: AuthParams) {
    return wrapFetch(() =>
        fetch(API_PREFIX + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: new URLSearchParams(data),
        })
    )();
}

export async function login(data: AuthParams) {
    return wrapFetch(() =>
        fetch(API_PREFIX + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: new URLSearchParams(data),
        })
    )();
}

export async function logout() {
    return wrapFetch(() => fetch(API_PREFIX + '/logout', { method: 'POST', credentials: 'include' }))();
}
