import React from 'react'
import { AuthError, AuthParams, PlayerInfo } from '../api/auth'
import { Option } from '../types'

export type AuthContext = {
    player: PlayerInfo | undefined
    register: (data: AuthParams) => Promise<Option<null, AuthError>>
    login: (data: AuthParams) => Promise<Option<null, AuthError>>
    logout: () => Promise<void>
    update: () => void
}

export const AuthContext = React.createContext<AuthContext>(null!)

export const useAuth = () => React.useContext(AuthContext)
