import { capitalize } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';

import { fetchHighscores } from '@/api/game';
import { paramsToSeed } from '@/constants';
import { useGame } from '@/contexts/GameContext';
import { useLeaderboardRows } from '@/hooks/useLeaderboardRows';
import usePersistentState from '@/hooks/usePersistentState';
import { raise } from '@/lib';
// import { throwIfError } from '@/monad';
import { DivProps } from '@/props';

import HideToggle from './HideToggle';
import SingleRankedLeaderboard from './SingleRankedLeaderboard';

export type LiveLeaderboardProps = DivProps & {
    numRows: number;
};

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
                'relative min-h-8 w-fit border border-neutral-300 border-opacity-0',
                hidden ? 'p-1' : 'border-opacity-100 p-2',
                className
            )}
            {...props}
        >
            <HideToggle hidden={hidden} onClick={() => setHidden(!hidden)} />
            <SingleRankedLeaderboard
                className={twJoin(hidden && 'hidden')}
                title={title}
                rows={rows}
                bottomRows={bottomRows}
            />
        </div>
    );
}
