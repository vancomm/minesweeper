import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem } from '@mui/base/MenuItem';
import Create from '@mui/icons-material/Create';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import { Link, Navigate, Outlet, createRootRouteWithContext, useRouter, useRouterState } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import AuthDialog from 'components/AuthDialog';
import Cell from 'components/Cell';
import TanStackRouterDevtools from 'components/Devtools';

import { AuthParams } from 'api/entities';

import { CellState } from '@/constants';
import { AuthContext, useAuth } from '@/contexts/AuthContext';
import { GameContext } from '@/contexts/GameContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { iterateDigits } from '@/lib';

interface RouterContext {
    auth: AuthContext;
    game: GameContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Layout,
    notFoundComponent: () => <Navigate to="/" replace />,
});

function Layout() {
    const { isMd } = useBreakpoint('md');

    const router = useRouter();
    const { player, ...auth } = useAuth();

    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [signupOpen, setSignupOpen] = React.useState(false);
    const [signupError, setSignupError] = React.useState<string | undefined>();

    const [loginOpen, setLoginOpen] = React.useState(false);
    const [loginError, setLoginError] = React.useState<string | undefined>();

    const handleSignupSubmit = async (data: AuthParams) => {
        setIsSubmitting(true);
        try {
            const res = await auth.register(data);
            if (res.isErr()) {
                setSignupError('registration failed'); // TODO improve error type
            } else {
                setSignupOpen(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginSubmit = async (data: AuthParams) => {
        setIsSubmitting(true);
        try {
            const res = await auth.login(data);
            if (res.isErr()) {
                setLoginError('login failed'); // TODO improve error type
            } else {
                setLoginOpen(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await auth.logout();
        await router.invalidate();
    };

    const isLoggingIn = isLoading || isSubmitting;

    return (
        <div className="flex min-h-screen flex-col bg-zinc-200 dark:bg-black">
            <Header>
                <div className="main-layout mt-2 grid gap-y-2 md:m-0 md:flex md:flex-row md:gap-x-4">
                    {!player && (
                        <>
                            <button
                                className="text-md col-start-[left-gutter] flex cursor-pointer items-center gap-0.5 hover:underline"
                                onClick={() => setSignupOpen(true)}
                            >
                                <Create sx={{ translate: '0 .1rem', fontSize: '20px' }} />
                                <div>Sign up</div>
                            </button>
                            <button
                                className="text-md col-start-[content-start] flex cursor-pointer items-center gap-0.5 hover:underline"
                                onClick={() => setLoginOpen(true)}
                            >
                                <Login sx={{ translate: '-.15rem .1rem', fontSize: '20px' }} />
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
                                <div className="col-start-[left-gutter]">
                                    <div className="mr-1.5 inline-block italic opacity-50">Signed in as</div>
                                    <div className="inline-block">{player.username}</div>
                                </div>
                                <button
                                    className="text-md col-start-[left-gutter] flex cursor-pointer items-center gap-0.5 hover:underline"
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
            </Header>

            <main className="main-layout mt-4 grid grow grid-rows-[auto_1fr] overflow-x-scroll">
                <aside className="col-[left-gutter] flex h-fit w-fit flex-row gap-x-3 gap-y-2 rounded p-2 text-lg shadow-md md:w-full md:flex-col dark:shadow-none">
                    <Link
                        to="/game/$session_id"
                        params={{ session_id: 'new' }}
                        className="min-w-fit hover:underline [&.active]:font-bold"
                    >
                        New Game
                    </Link>
                    <Link to="/hiscores" className="min-w-fit hover:underline [&.active]:font-bold">
                        Hi Scores
                    </Link>
                    {player && (
                        <Link to="/myscores" className="min-w-fit hover:underline [&.active]:font-bold">
                            My Scores
                        </Link>
                    )}
                    <Link to="/about" className="min-w-fit hover:underline [&.active]:font-bold">
                        About
                    </Link>
                </aside>
                {/* <div className="col-[content-start]"> */}
                <Outlet />
                {/* </div> */}
            </main>

            <Footer className="shrink-0" />
            <Dialog
                open={signupOpen}
                onClose={() => setSignupOpen(false)}
                PaperComponent={() => (
                    <AuthDialog
                        title={'Sign up'}
                        onSubmit={handleSignupSubmit}
                        errorText={signupError}
                        disabled={isLoggingIn}
                        submitText={isLoggingIn ? 'Loading...' : 'Submit'}
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
                        disabled={isLoggingIn}
                        submitText={isLoggingIn ? 'Loading...' : 'Submit'}
                    />
                )}
            />
            <React.Suspense>
                <TanStackRouterDevtools />
            </React.Suspense>
        </div>
    );
}

function Header({ children }: { children?: React.ReactNode }) {
    const { isMd } = useBreakpoint('md');
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className="main-layout bg-zinc-300 py-3 md:grid dark:bg-zinc-900">
            <div className="main-layout grid items-center justify-between md:col-[left-gutter/content-end] md:block">
                <div className="col-[left-gutter/content-end] flex shrink-0 items-center justify-between">
                    <Link to="/" className="text-3xl font-semibold tracking-tight">
                        Minesweeper
                    </Link>
                    <div className="block md:hidden">
                        <button
                            className="flex items-center rounded-sm border border-neutral-500 p-2 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-white dark:hover:text-white"
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
                </div>
            </div>
            <Collapse in={expanded || isMd} className="block items-center md:col-span-2 md:flex">
                {children}
            </Collapse>
        </div>
    );
}

function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <footer className={twMerge('m-auto flex items-center gap-2 p-2', className)} {...props}>
            <div className="pb-1 text-center leading-none">v{__APP_VERSION__}</div>
            <div className="pb-1 text-center leading-none">&bull;</div>
            <CurrentYear />
            <div className="pb-1 text-center leading-none">&bull;</div>
            <a
                className="cursor-pointer pb-1 text-center leading-none hover:underline"
                href="https://github.com/vancomm/minesweeper"
            >
                source
            </a>
        </footer>
    );
}

function CurrentYear() {
    return (
        <div className="flex items-center" aria-valuetext={new Date().getFullYear().toString()}>
            {[...iterateDigits(new Date().getFullYear())].map((digit, i) =>
                digit === 0 ? (
                    <Cell key={i} state={CellState.Mine} className="inline-block h-[18px] w-[18px] cursor-default" />
                ) : (
                    <Cell key={i} state={digit} className="inline-block h-[18px] w-[18px] cursor-default" />
                )
            )}
        </div>
    );
}
