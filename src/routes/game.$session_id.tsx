import { createFileRoute } from '@tanstack/react-router'
import { createGameApi, GameUpdate } from '../api/game'
import { status } from '../api/auth'

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({
        params: { session_id },
    }): Promise<GameUpdate | undefined> => {
        if (session_id === 'new') {
            const ok = await status()
            if (!ok) {
                throw new Error('api unavailable')
            }
            return undefined
        } else {
            const { success, data, error } = await createGameApi(
                session_id
            ).fetchGame({})
            if (!success) {
                console.error(error)
                throw new Error('api unavailable')
            }
            return data
        }
    },
})
