import CircularProgress from '@mui/material/CircularProgress';
import { createLazyFileRoute } from '@tanstack/react-router';

import ErrorComponent from 'components/ErrorComponent';
import Game from 'components/Game';
import LiveLeaderboard from 'components/LiveLeaderboard';

export const Route = createLazyFileRoute('/game/$session_id')({
    component: GameLayout,
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    errorComponent: ErrorComponent,
});

function GameLayout() {
    return (
        <div>
            <Game />
            <LiveLeaderboard numRows={10} className="mt-4 hidden md:block" />
        </div>
    );
}
