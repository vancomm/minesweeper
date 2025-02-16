import Cookies from 'js-cookie';

import { PlayerInfo } from 'api/entities';

export const getJWTClaims = (): PlayerInfo | undefined => {
    const authCookie = Cookies.get('auth');
    if (!authCookie) {
        return undefined;
    }
    const parts = authCookie.split('.');
    if (parts.length != 2) {
        return undefined;
    }
    const [, b64Payload] = parts;
    const jsonPayload = atob(b64Payload);
    try {
        const obj = JSON.parse(jsonPayload);
        return PlayerInfo.parse(obj);
    } catch {
        return undefined;
    }
};
