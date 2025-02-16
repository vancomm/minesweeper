import React from 'react';

import { AuthError, AuthParams, PlayerInfo } from 'api/entities';

import { Result } from '@/monad';

export type AuthContext = {
    player: PlayerInfo | undefined;
    register: (data: AuthParams) => Promise<Result<null, AuthError>>;
    login: (data: AuthParams) => Promise<Result<null, AuthError>>;
    logout: () => Promise<void>;
    update: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContext>(null!);

export const useAuth = () => React.useContext(AuthContext);
