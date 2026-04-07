import React from 'react';
import { twJoin } from 'tailwind-merge';

import {
    LeaderboardSeparator,
    LeaderboardTitle,
    NoLeaderboardEntries,
    PersonalBest,
    RankedLeaderboardRow,
    RankedLeaderboardRowProps,
    WorldBest,
} from 'components/Leaderboard';

export interface RankedLeaderboardProps {
    title?: string;
    rows: RankedLeaderboardRowProps[];
    bottomRows?: RankedLeaderboardRowProps[];
    className?: string;
}

// export default function SingleRankedLeaderboard({ title, rows, bottomRows, ...props }: RankedLeaderboardProps) {
//     return (
//         <table {...props}>
//             <tbody>
//                 {title && <LeaderboardTitle title={title} />}
//                 {rows.map((row) => (
//                     <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
//                 ))}
//                 {bottomRows && bottomRows.length > 0 && (
//                     <>
//                         <LeaderboardSeparator />
//                         {bottomRows.map((row) => (
//                             <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
//                         ))}
//                     </>
//                 )}
//                 {!(rows.length || bottomRows?.length) && <NoLeaderboardEntries />}
//             </tbody>
//         </table>
//     );
// }

export default function SingleRankedLeaderboard({ title, rows, bottomRows, className }: RankedLeaderboardProps) {
    return (
        <div className={twJoin('leaderboard-layout grid w-64 gap-x-1', className)}>
            <div className="col-span-full text-center font-bold">{title}</div>
            {/* {title && <LeaderboardTitle title={title} />} */}
            {rows.map(({ game_session_id, rank, username, playtime, isPB, isWB }) => (
                <React.Fragment key={`leaderboard-row-${game_session_id}`}>
                    <div className="col-[rank]">{rank}</div>
                    <div className="col-[name] flex justify-between">
                        <div>{username}</div>
                        <div className="flex items-end gap-x-1">
                            {isPB && <PersonalBest />}
                            {isWB && <WorldBest />}
                        </div>
                    </div>
                    <div className="col-[time] font-mono">{playtime}</div>
                </React.Fragment>
                // <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
            ))}
            {bottomRows && bottomRows.length > 0 && (
                <>
                    <LeaderboardSeparator />
                    {bottomRows.map((row) => (
                        <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
                    ))}
                </>
            )}
            {!(rows.length || bottomRows?.length) && <NoLeaderboardEntries />}
        </div>
    );
}
