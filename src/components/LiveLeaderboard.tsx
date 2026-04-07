import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { capitalize } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';

import { fetchHighscores } from '@/api/game';
import { paramsToSeed } from '@/constants';
import { useGame } from '@/contexts/GameContext';
import { useLeaderboardRows } from '@/hooks/useLeaderboardRows';
import usePersistentState from '@/hooks/usePersistentState';
import { raise } from '@/lib';

import SingleRankedLeaderboard from './SingleRankedLeaderboard';

export interface LiveLeaderboardProps extends React.HTMLAttributes<HTMLDivElement> {
    numRows: number;
}

export default function LiveLeaderboard({ numRows, className, ...props }: LiveLeaderboardProps) {
    const game = useGame();

    const {
        data: world,
        error,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['records', game.seed],
        queryFn: () => fetchHighscores({ seed: game.seed }).then((res) => (res.isErr() ? raise(res.error) : res.value)),
        select: (data) => data.filter((r) => paramsToSeed(r) === game.seed),
    });

    const [hidden, setHidden] = usePersistentState('live-leaderboard-hidden', false);
    const { rows, bottomRows } = useLeaderboardRows(world ?? [], numRows);

    if (isError) {
        throw error;
    }

    if (isPending) {
        return null;
    }

    const title =
        game.presetName == 'custom'
            ? `${capitalize(game.presetName)} (${game.params.width}×${game.params.height}, ${game.params.mine_count})`
            : capitalize(game.presetName);

    return (
        <div
            className={twJoin(
                'relative w-fit min-w-48 rounded',
                hidden
                    ? 'p-1'
                    : 'border border-zinc-400 bg-zinc-100 p-2 shadow-md dark:border-zinc-600 dark:border-t-zinc-400 dark:bg-zinc-800 dark:shadow-none',
                className
            )}
            {...props}
        >
            <HideToggle hidden={hidden} onClick={() => setHidden(!hidden)} />
            <SingleRankedLeaderboard
                className={twJoin(hidden && 'hidden', 'w-full')}
                title={title}
                rows={rows}
                bottomRows={bottomRows}
            />
        </div>
    );
}

function HideToggle({ hidden, onClick }: { hidden: boolean; onClick: () => unknown }) {
    return (
        <button
            className={twJoin(
                hidden ? 'block' : 'absolute top-0 left-0 translate-x-1 translate-y-1',
                'opacity-30 transition-opacity hover:opacity-80'
            )}
            onClick={onClick}
            title={hidden ? 'Display live leaderboard' : 'Hide live leaderboard'}
        >
            {hidden ? (
                <div className="flex items-center gap-x-1">
                    <VisibilityIcon fontSize="small" />
                    Show leaderboard
                </div>
            ) : (
                <VisibilityOffIcon fontSize="small" sx={{ translate: '0 -.25rem' }} />
            )}
        </button>
    );
}
