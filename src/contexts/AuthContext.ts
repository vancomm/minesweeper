import { Result } from 'neverthrow';
import React from 'react';

import { AuthParams, PlayerInfo } from 'api/entities';

import { ValidatedFetchError } from '@/api/common';

export type AuthContext = {
    player: PlayerInfo | undefined;
    register: (data: AuthParams) => Promise<Result<unknown, ValidatedFetchError>>;
    login: (data: AuthParams) => Promise<Result<unknown, ValidatedFetchError>>;
    logout: () => Promise<void>;
    update: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContext>(null!);

export const useAuth = () => React.useContext(AuthContext);
