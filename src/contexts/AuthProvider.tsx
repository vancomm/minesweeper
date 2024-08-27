import React from 'react'
import { AuthContext } from './AuthContext'
import { AuthParams, login, logout, PlayerInfo, register } from '../api/auth'
import { getJWTClaims } from '../security/jwt'

type AuthProviderProps = {
    children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [player, setPlayer] = React.useState<PlayerInfo | undefined>(
        getJWTClaims()
    )

    const update = React.useCallback(() => {
        console.log('update')
        setPlayer(getJWTClaims())
    }, [setPlayer])

    const value = React.useMemo(
        () => ({
            player,
            register: async (data: AuthParams) => {
                const res = await register(data)
                update()
                return res
            },
            login: async (data: AuthParams) => {
                const res = await login(data)
                update()
                return res
            },
            logout: async () => {
                await logout()
                update()
            },
            update,
        }),
        [player, update]
    )

    React.useEffect(() => {
        update()
    }, [update])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
