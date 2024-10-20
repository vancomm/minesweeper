import CircularProgress from '@mui/material/CircularProgress'
import { createLazyFileRoute } from '@tanstack/react-router'

import ErrorComponent from 'components/ErrorComponent'
import Game from 'components/Game'
import LiveLeaderboard from 'components/LiveLeaderboard'

export const Route = createLazyFileRoute('/game/$session_id')({
    component: () => (
        <div className="overflow-x-scroll md:flex md:items-start md:gap-2">
            <Game />
            {/* TODO: LiveLeaderboardRow for small screens */}
            <LiveLeaderboard numRows={10} className="hidden md:block" />
        </div>
    ),
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    errorComponent: ErrorComponent,
})
