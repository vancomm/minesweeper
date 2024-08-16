import { createFileRoute } from '@tanstack/react-router'
import { createGameApi, GameUpdate } from '../api/game'
import Game from '../components/Game'

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({
        params: { session_id },
    }): Promise<GameUpdate | undefined> =>
        session_id === 'new'
            ? undefined
            : createGameApi(session_id)
                  .fetchGame()
                  .then(({ success, data }) => (success ? data : undefined)),

    component: RestoredGame,
})

function RestoredGame() {
    const update = Route.useLoaderData()
    return <Game initialUpdate={update} />
}
