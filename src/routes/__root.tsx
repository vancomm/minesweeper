import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '../components/Devtools'
import { Suspense } from 'react'
import { DivProps } from '../types'
import { twMerge } from 'tailwind-merge'
import Square from '../components/Square'
import { SquareState } from '../constants'

export const Route = createRootRoute({
    component: () => (
        <>
            <Header />
            <div className="flex-auto flex-shrink-0 px-8">
                <div className="flex w-fit gap-4 border border-neutral-300 p-3">
                    <nav className="flex w-28 flex-shrink-0 flex-col items-center gap-2 border-r border-neutral-500 p-2 pr-4">
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
                </div>
            </div>
            <Footer className="flex-shrink-0" />
            <Suspense>
                <TanStackRouterDevtools />
            </Suspense>
        </>
    ),
    notFoundComponent: () => <main className="p-32 text-3xl">Not found</main>,
})

function Header({ ...props }: DivProps) {
    return (
        <header {...props}>
            <div className="mb-4 bg-neutral-200 px-8 py-3 text-3xl dark:bg-neutral-800">
                <Link to="/">Minesweeper</Link>
            </div>
        </header>
    )
}

const TwentyTwentyFour = () => (
    <div className="flex items-center" aria-valuetext="2024">
        {[2, SquareState.Mine, 2, 4].map((state, i) => (
            <Square
                key={i}
                state={state}
                className="inline-block h-[18px] w-[18px] cursor-default"
            />
        ))}
    </div>
)

function Footer({ className, ...props }: DivProps) {
    return (
        <footer
            className={twMerge('m-auto flex items-center gap-2 p-2', className)}
            {...props}
        >
            <div className="pb-1 text-center leading-none">
                v{__APP_VERSION__}
            </div>
            <div className="pb-1 text-center leading-none">&bull;</div>
            <TwentyTwentyFour />
            <div className="pb-1 text-center leading-none">&bull;</div>
            <a
                className="cursor-pointer pb-1 text-center leading-none hover:underline"
                href="https://github.com/vancomm/minesweeper"
            >
                source
            </a>
        </footer>
    )
}
