import { createLazyFileRoute, ErrorComponent } from '@tanstack/react-router'
import Game from '../components/Game'
import CircularProgress from '@mui/material/CircularProgress'
import { GAME_PRESETS } from '../constants'

export const Route = createLazyFileRoute('/game/$session_id')({
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
