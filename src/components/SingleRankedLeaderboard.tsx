import {
    LeaderboardSeparator,
    LeaderboardTitle,
    NoLeaderboardEntries,
    RankedLeaderboardRow,
    RankedLeaderboardRowProps,
} from 'components/Leaderboard';

export interface RankedLeaderboardProps extends React.TableHTMLAttributes<HTMLTableElement> {
    title?: string;
    rows: RankedLeaderboardRowProps[];
    bottomRows?: RankedLeaderboardRowProps[];
}

export default function SingleRankedLeaderboard({ title, rows, bottomRows, ...props }: RankedLeaderboardProps) {
    return (
        <table {...props}>
            <tbody>
                {title && <LeaderboardTitle title={title} />}
                {rows.map((row) => (
                    <RankedLeaderboardRow key={`leaderboard-row-${row.game_session_id}`} {...row} />
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
            </tbody>
        </table>
    );
}
