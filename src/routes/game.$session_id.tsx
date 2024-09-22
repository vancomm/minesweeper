import { createFileRoute } from '@tanstack/react-router'

import { status } from 'api/auth'
import { createGameApi } from 'api/game'

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({
        params: { session_id },
        context: {
            game: { dispatch },
        },
    }) => {
        if (session_id === 'new') {
            const ok = await status()
            if (!ok) {
                throw new Error('api unavailable')
            }
            return
        }

        const {
            success,
            data: update,
            error,
        } = await createGameApi(session_id).fetchGame({})

        if (!success) {
            console.error(error)
            throw new Error('api unavailable')
        }

        dispatch({ type: 'gameInit', update })
    },
})
