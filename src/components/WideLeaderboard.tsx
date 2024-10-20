import { twJoin } from 'tailwind-merge'

import { GameRecord } from '@/api/entities'
import { useSplitLeaderboardRows } from '@/hooks/useLeaderboardRows'

import { NoLeaderboardEntries } from './Leaderboard'
import SingleRankedLeaderboard from './SingleRankedLeaderboard'

export type AdaptiveLeaderboardProps = {
    records: GameRecord[]
    numRows: number
    className?: string
}

const WideLeaderboard = ({
    records,
    numRows,
    className,
}: AdaptiveLeaderboardProps) => {
    const leaderboards = useSplitLeaderboardRows(records, numRows)
    return (
        <div className={twJoin('wide-hs flex items-start gap-x-5', className)}>
            {leaderboards.map(({ title, rows, bottomRows }) => (
                <SingleRankedLeaderboard
                    key={`leaderboard-${title}`}
                    title={title}
                    rows={rows}
                    bottomRows={bottomRows}
                />
            ))}
            {leaderboards.length === 0 && <NoLeaderboardEntries />}
        </div>
    )
}

export default WideLeaderboard
