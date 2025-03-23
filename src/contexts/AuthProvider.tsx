import React from 'react';

import * as auth from 'api/auth';
import { AuthParams, PlayerInfo } from 'api/entities';

import { AuthContext } from '@/contexts/AuthContext';
import { getJWTClaims } from '@/jwt';

type AuthProviderProps = {
    children?: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
    const [player, setPlayer] = React.useState<PlayerInfo | undefined>(getJWTClaims());

    const update = React.useCallback(async () => {
        console.log('update');
        await auth.status();
        setPlayer(getJWTClaims());
    }, [setPlayer]);

    const value = React.useMemo(
        () => ({
            player,
            register: async (data: AuthParams) => {
                const res = await auth.register(data);
                await update();
                return res;
            },
            login: async (data: AuthParams) => {
                const res = await auth.login(data);
                await update();
                return res;
            },
            logout: async () => {
                await auth.logout();
                await update();
            },
            update,
        }),
        [player, update]
    );

    React.useEffect(() => {
        update().catch(console.error);
    }, [update]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
