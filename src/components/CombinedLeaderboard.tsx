import React from 'react'

import {
    LeaderboardTitle,
    NoLeaderboardEntries,
    RankedLeaderboardProps,
    RankedLeaderboardRow,
} from 'components/Leaderboard'

import { TableProps } from '@/props'

export type MultiRankedLeaderboardProps = TableProps & {
    leaderboards: RankedLeaderboardProps[]
}

const CombinedLeaderboard = ({
    leaderboards,
    ...props
}: MultiRankedLeaderboardProps) => (
    <table {...props}>
        <tbody>
            {leaderboards.map(({ title, rows }, i) => (
                <React.Fragment key={`leaderboard-section-${i}`}>
                    {title && <LeaderboardTitle title={title} />}
                    {rows.length ? (
                        rows.map((row) => (
                            <RankedLeaderboardRow
                                key={`leaderboard-row-${row.session_id}`}
                                {...row}
                            />
                        ))
                    ) : (
                        <NoLeaderboardEntries />
                    )}
                </React.Fragment>
            ))}
            {leaderboards.length === 0 && <NoLeaderboardEntries />}
        </tbody>
    </table>
)

export default CombinedLeaderboard
