import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { checkGameApi, createGameApi, GameUpdate } from '../api/game'
import Game from '../components/Game'
import CircularProgress from '@mui/material/CircularProgress'

const raise = (error: unknown): never => {
    throw error
}

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({
        params: { session_id },
    }): Promise<GameUpdate | undefined> =>
        session_id === 'new'
            ? checkGameApi({})
                  .then(({ success }) =>
                      success ? undefined : raise(new Error('api unavailable'))
                  )
                  .catch(() => raise(new Error('api unavailable')))
            : createGameApi(session_id)
                  .fetchGame({})
                  .then(({ success, data }) => (success ? data : undefined)),
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
    return <Game initialUpdate={update} />
}
