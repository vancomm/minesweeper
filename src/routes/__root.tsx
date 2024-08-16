import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '../components/Devtools'
import { Suspense } from 'react'

export const Route = createRootRoute({
    component: () => (
        <>
            <div>
                <div className="px-8 py-3 mb-4 text-3xl bg-neutral-800">
                    <Link to="/">Minesweeper</Link>
                </div>
            </div>
            <div className="px-8">
                <div className="flex gap-4 border border-neutral-300 w-fit p-3">
                    <nav className="p-2 pr-4 flex flex-col items-center gap-2 border-r border-neutral-500">
                        <Link
                            to="/game/$session_id"
                            params={{ session_id: 'new' }}
                            className="[&.active]:font-bold"
                        >
                            New Game
                        </Link>
                        <Link to="/about" className="[&.active]:font-bold">
                            About
                        </Link>
                    </nav>
                    <main>
                        <Outlet />
                    </main>
                    <Suspense>
                        <TanStackRouterDevtools />
                    </Suspense>
                </div>
            </div>
        </>
    ),
    notFoundComponent: () => <main className="p-32 text-3xl">Not found</main>,
})
