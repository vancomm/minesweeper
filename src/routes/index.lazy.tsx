import { createLazyFileRoute } from '@tanstack/react-router'

import Game from '../components/Game'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <main className="w-fit p-3 flex flex-col items-center">
            <Game />
        </main>
    )
}
