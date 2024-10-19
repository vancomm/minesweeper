import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { capitalize } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { twJoin } from 'tailwind-merge'

import { getRecords } from '@/api/game'
import { paramsToSeed } from '@/constants'
import { useGame } from '@/contexts/GameContext'
import { useLeaderboardRows } from '@/hooks/useLeaderboardRows'
import usePersistentState from '@/hooks/usePersistentState'
import { throwIfError } from '@/monad'
import { DivProps } from '@/props'

import { SingleRankedLeaderboard } from './Leaderboard'

type HideToggleProps = {
    hidden: boolean
    onClick: () => unknown
}

const HideToggle = ({ hidden, onClick }: HideToggleProps) => (
    <button
        className={twJoin(
            hidden
                ? 'block'
                : 'absolute left-0 top-0 translate-x-1 translate-y-1',
            'opacity-30 transition-opacity hover:opacity-80'
        )}
        onClick={onClick}
        title={hidden ? 'Display live leaderboard' : 'Hide live leaderboard'}
    >
        {hidden ? (
            <VisibilityIcon fontSize="small" sx={{ translate: '0 -.25rem' }} />
        ) : (
            <VisibilityOffIcon
                fontSize="small"
                sx={{ translate: '0 -.25rem' }}
            />
        )}
    </button>
)

export type LiveLeaderboardProps = DivProps & {
    numRows?: number
}

export default function LiveLeaderboard({
    numRows = 10,
    className,
    ...props
}: LiveLeaderboardProps) {
    const game = useGame()

    const {
        data: world,
        error,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['records', game.seed],
        queryFn: () => getRecords({ seed: game.seed }).then(throwIfError),
        select: (data) => data.filter((r) => paramsToSeed(r) === game.seed),
    })

    const [hidden, setMinified] = usePersistentState(
        'live-leaderboard-hidden',
        false
    )
    const { rows, bottomRows } = useLeaderboardRows(world ?? [], numRows)

    if (isError) {
        throw error
    }

    if (isPending) {
        return null
    }

    const title =
        game.presetName == 'custom'
            ? `${capitalize(game.presetName)} (${game.params.width}×${game.params.height}, ${game.params.mine_count})`
            : capitalize(game.presetName)

    return (
        <div
            className={twJoin(
                'relative min-h-8 border border-neutral-300 border-opacity-0',
                hidden ? 'p-1' : 'border-opacity-100 p-2',
                className
            )}
            {...props}
        >
            <HideToggle hidden={hidden} onClick={() => setMinified(!hidden)} />
            {
                <SingleRankedLeaderboard
                    className={twJoin(hidden && 'hidden')}
                    title={title}
                    rows={rows}
                    bottomRows={bottomRows}
                />
            }
        </div>
    )
}
