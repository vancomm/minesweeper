import React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import Dialog from '@mui/material/Dialog'
import Login from '@mui/icons-material/Login'
import Create from '@mui/icons-material/Create'
import Collapse from '@mui/material/Collapse'
import { Menu } from '@mui/base/Menu'
import { Dropdown } from '@mui/base/Dropdown'
import { MenuButton } from '@mui/base/MenuButton'
import { MenuItem } from '@mui/base/MenuItem'
import Logout from '@mui/icons-material/Logout'
import Person from '@mui/icons-material/Person'

import { TanStackRouterDevtools } from '../components/Devtools'
import { DivProps } from '../types'
import Square from '../components/Square'
import { SquareState } from '../constants'
import { AuthParams } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import AuthDialog from '../components/AuthDialog'
import { useBreakpoint } from '../hooks/useBreakpoint'

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => <main className="p-32 text-3xl">Not found</main>,
})

type NavBarProps = {
    children?: React.ReactNode
}

const NavBar = ({ children }: NavBarProps) => {
    const { isMd } = useBreakpoint('md')
    const [expanded, setExpanded] = React.useState(false)

    return (
        <div className="flex flex-wrap items-center justify-between bg-neutral-200 p-4 dark:bg-neutral-800">
            <div className="mr-6 flex flex-shrink-0 items-center">
                <Link to="/" className="text-3xl font-semibold tracking-tight">
                    Minesweeper
                </Link>
            </div>
            <div className="block md:hidden">
                <button
                    className="flex items-center rounded border border-neutral-500 p-2 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-white dark:hover:text-white"
                    onClick={() => setExpanded((o) => !o)}
                >
                    <svg
                        className="h-3 w-3 fill-current"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
            <Collapse
                in={expanded || isMd}
                className="block w-full flex-grow md:flex md:w-auto"
            >
                {children}
            </Collapse>
        </div>
    )
}

function RootComponent() {
    const { isMd } = useBreakpoint('md')

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
            <NavBar>
                <div className="mt-2 flex flex-col gap-x-4 gap-y-2 md:m-0 md:flex-row">
                    {!player && (
                        <>
                            <button
                                className="text-md flex cursor-pointer items-center gap-0.5 hover:underline"
                                onClick={() => setSignupOpen(true)}
                            >
                                <Create
                                    sx={{
                                        translate: '0 .1rem',
                                        fontSize: '18px',
                                    }}
                                />
                                <div>Sign up</div>
                            </button>
                            <button
                                className="text-md flex cursor-pointer items-center gap-0.5 hover:underline"
                                onClick={() => setLoginOpen(true)}
                            >
                                <Login
                                    sx={{
                                        translate: '-.1rem .1rem',
                                        fontSize: '20px',
                                    }}
                                />
                                <div>Log in</div>
                            </button>
                        </>
                    )}
                    {player &&
                        (isMd ? (
                            <Dropdown>
                                <MenuButton className="flex items-center gap-1 font-bold hover:underline">
                                    <Person
                                        sx={{
                                            translate: '0 .1rem',
                                            fontSize: '22px',
                                        }}
                                    />
                                    <div>{player.username}</div>
                                </MenuButton>
                                <Menu className="border border-neutral-500 bg-neutral-200 p-1 dark:bg-neutral-600">
                                    <MenuItem
                                        className="text-md flex cursor-pointer items-center gap-1 p-1 hover:bg-white dark:hover:bg-neutral-500"
                                        onClick={() => void handleLogout()}
                                    >
                                        <Logout sx={{ fontSize: '20px' }} />
                                        <div className="pb-1">Sign out</div>
                                    </MenuItem>
                                </Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <div>
                                    <div className="mr-1.5 inline-block italic opacity-50">
                                        Signed in as
                                    </div>
                                    <div className="inline-block">
                                        {player.username}
                                    </div>
                                </div>
                                <button
                                    className="text-md flex cursor-pointer items-center gap-0.5 hover:underline"
                                    onClick={() => void handleLogout()}
                                >
                                    <Logout
                                        sx={{
                                            translate: '0 .1rem',
                                            fontSize: '20px',
                                        }}
                                    />
                                    <div>Sign out</div>
                                </button>
                            </>
                        ))}
                </div>
            </NavBar>
            <div className="flex-auto flex-shrink-0 overflow-x-scroll p-4">
                <div className="flex w-fit flex-col gap-2 border border-neutral-300 p-3 md:flex-row">
                    <div className="flex flex-shrink-0 items-center gap-x-4 gap-y-2 border-b border-neutral-500 p-2 pr-4 pt-0 md:w-28 md:flex-col md:border-b-0 md:border-r">
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
                    </div>
                    <main>
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
