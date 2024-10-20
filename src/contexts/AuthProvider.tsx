import React from 'react'

import {
    login,
    logout,
    register,
    status,
} from 'api/auth'

import { AuthContext } from '@/contexts/AuthContext'
import { getJWTClaims } from '@/jwt'
import { AuthParams, PlayerInfo } from '@/api/entities'

type AuthProviderProps = {
    children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [player, setPlayer] = React.useState<PlayerInfo | undefined>(
        getJWTClaims()
    )

    const update = React.useCallback(async () => {
        console.log('update')
        await status()
        setPlayer(getJWTClaims())
    }, [setPlayer])

    const value = React.useMemo(
        () => ({
            player,
            register: async (data: AuthParams) => {
                const res = await register(data)
                await update()
                return res
            },
            login: async (data: AuthParams) => {
                const res = await login(data)
                await update()
                return res
            },
            logout: async () => {
                await logout()
                await update()
            },
            update,
        }),
        [player, update]
    )

    React.useEffect(() => {
        update().catch(console.error)
    }, [update])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
