import React from 'react';

import {
    LeaderboardTitle,
    NoLeaderboardEntries,
    RankedLeaderboardProps,
    RankedLeaderboardRow,
} from 'components/Leaderboard';

export interface MultiRankedLeaderboardProps extends React.TableHTMLAttributes<HTMLTableElement> {
    leaderboards: RankedLeaderboardProps[];
}

export default function CombinedLeaderboard({ leaderboards, ...props }: MultiRankedLeaderboardProps) {
    return (
        <table {...props}>
            <tbody>
                {leaderboards.map(({ title, rows }, i) => (
                    <React.Fragment key={`leaderboard-section-${i}`}>
                        {title && <LeaderboardTitle title={title} />}
                        {rows.length ? (
                            rows.map((row) => (
                                <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
                            ))
                        ) : (
                            <NoLeaderboardEntries />
                        )}
                    </React.Fragment>
                ))}
                {leaderboards.length === 0 && <NoLeaderboardEntries />}
            </tbody>
        </table>
    );
}
