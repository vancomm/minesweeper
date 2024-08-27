import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { createGameApi, GameUpdate } from '../api/game'
import Game from '../components/Game'
import CircularProgress from '@mui/material/CircularProgress'
import { GAME_PRESETS } from '../constants'
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
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    component: RestoredGame,
    errorComponent: ErrorComponent,
})

function RestoredGame() {
    const update = Route.useLoaderData()
    return (
        <div className="overflow-x-scroll">
            <Game
                presets={GAME_PRESETS}
                defaultPresetName={'medium'}
                initialUpdate={update}
            />
        </div>
    )
}
