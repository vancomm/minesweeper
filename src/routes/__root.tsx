import React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import Dialog from '@mui/material/Dialog'
import Login from '@mui/icons-material/Login'
import Create from '@mui/icons-material/Create'

import { TanStackRouterDevtools } from '../components/Devtools'
import { DivProps } from '../types'
import Square from '../components/Square'
import { SquareState } from '../constants'
import { AuthParams } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import AuthDialog from '../components/AuthDialog'
import UserMenu from '../components/UserMenu'

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => <main className="p-32 text-3xl">Not found</main>,
})

function RootComponent() {
    const { player, register, login, logout } = useAuth()

    const [signupOpen, setSignupOpen] = React.useState(false)
    const [signupError, setSignupError] = React.useState<string | undefined>()

    const [loginOpen, setLoginOpen] = React.useState(false)
    const [loginError, setLoginError] = React.useState<string | undefined>()

    const handleSignupSubmit = async (data: AuthParams) => {
        const { success, error } = await register(data)
        if (!success) {
            const { statusCode, errorText } = error
            setSignupError(errorText || `unknown error ${statusCode}`)
        } else {
            setSignupOpen(false)
        }
    }

    const handleLoginSubmit = async (data: AuthParams) => {
        const { success, error } = await login(data)
        if (!success) {
            const { statusCode, errorText } = error
            setLoginError(errorText || `unknown error ${statusCode}`)
        } else {
            setLoginOpen(false)
        }
    }

    const handleLogout = async () => {
        await logout()
    }

    return (
        <>
            <div>
                <div className="mb-4 flex items-center justify-between bg-neutral-200 px-8 py-3 md:pr-12 lg:pr-32 dark:bg-neutral-800">
                    <Link to="/" className="text-3xl">
                        Minesweeper
                    </Link>
                    <div className="flex items-center gap-3">
                        {!player && (
                            <>
                                <button
                                    className="text-md flex cursor-pointer items-center gap-1 hover:underline"
                                    onClick={() => setSignupOpen(true)}
                                >
                                    <Create sx={{ fontSize: '18px' }} />
                                    <div className="pb-1">Sign up</div>
                                </button>
                                <button
                                    className="text-md flex cursor-pointer items-center gap-1 hover:underline"
                                    onClick={() => setLoginOpen(true)}
                                >
                                    <Login sx={{ fontSize: '20px' }} />
                                    <div className="pb-1">Log in</div>
                                </button>
                            </>
                        )}
                        {player && (
                            <UserMenu
                                username={player.username}
                                onLogout={handleLogout}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-auto flex-shrink-0 overflow-x-scroll px-8">
                <div className="flex w-fit gap-4 border border-neutral-300 p-3">
                    <nav className="flex w-28 flex-shrink-0 flex-col items-center gap-2 border-r border-neutral-500 p-2 pr-4">
                        <Link
                            to="/game/$session_id"
                            params={{ session_id: 'new' }}
                            className="[&.active]:font-bold"
                        >
                            New Game
                        </Link>
                        <Link to="/hiscores" className="[&.active]:font-bold">
                            Hi Scores
                        </Link>
                        {player && (
                            <Link
                                to="/myscores"
                                className="[&.active]:font-bold"
                            >
                                My Scores
                            </Link>
                        )}
                        <Link to="/about" className="[&.active]:font-bold">
                            About
                        </Link>
                    </nav>
                    <main className="overflow-x-scroll">
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer className="flex-shrink-0" />
            <Dialog
                open={signupOpen}
                onClose={() => setSignupOpen(false)}
                PaperComponent={() => (
                    <AuthDialog
                        title={'Sign up'}
                        onSubmit={handleSignupSubmit}
                        errorText={signupError}
                    />
                )}
            />
            <Dialog
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                PaperComponent={() => (
                    <AuthDialog
                        title={'Log in'}
                        onSubmit={handleLoginSubmit}
                        errorText={loginError}
                    />
                )}
            />
            <React.Suspense>
                <TanStackRouterDevtools />
            </React.Suspense>
        </>
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
