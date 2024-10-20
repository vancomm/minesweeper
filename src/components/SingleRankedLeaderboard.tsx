import {
    LeaderboardSeparator,
    LeaderboardTitle,
    NoLeaderboardEntries,
    RankedLeaderboardRow,
    RankedLeaderboardRowProps,
} from 'components/Leaderboard'

import { TableProps } from '@/props'

export type RankedLeaderboardProps = TableProps & {
    title?: string
    rows: RankedLeaderboardRowProps[]
    bottomRows?: RankedLeaderboardRowProps[]
}

const SingleRankedLeaderboard = ({
    title,
    rows,
    bottomRows,
    ...props
}: RankedLeaderboardProps) => (
    <table {...props}>
        <tbody>
            {title && <LeaderboardTitle title={title} />}
            {rows.map((row) => (
                <RankedLeaderboardRow
                    key={`leaderboard-row-${row.session_id}`}
                    {...row}
                />
            ))}
            {bottomRows && bottomRows.length > 0 && (
                <>
                    <LeaderboardSeparator />
                    {bottomRows.map((row) => (
                        <RankedLeaderboardRow
                            key={`leaderboard-row-${row.session_id}`}
                            {...row}
                        />
                    ))}
                </>
            )}
            {!(rows.length || bottomRows?.length) && <NoLeaderboardEntries />}
        </tbody>
    </table>
)

export default SingleRankedLeaderboard
