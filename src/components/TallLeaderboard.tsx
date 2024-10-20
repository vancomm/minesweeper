import { GameRecord } from '@/api/entities'
import CombinedLeaderboard from '@/components/CombinedLeaderboard'
import { useSplitLeaderboardRows } from '@/hooks/useLeaderboardRows'

export type TallLeaderboardProps = {
    records: GameRecord[]
    numRows: number
    className?: string
}

const TallLeaderboard = ({
    records,
    numRows,
    className,
}: TallLeaderboardProps) => {
    const leaderboards = useSplitLeaderboardRows(records, numRows)
    return (
        <CombinedLeaderboard
            className={className}
            leaderboards={leaderboards}
        />
    )
}

export default TallLeaderboard
