import React from 'react'
import { twJoin } from 'tailwind-merge'

import { GameRecord } from 'api/entities'

import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { TableProps } from '@/props'

type RowTagProps = {
    title?: string
    className?: string
    children: React.ReactNode
}

const RowTag = ({ className, ...props }: RowTagProps) => (
    <div
        className={twJoin(
            'ml-1 inline-block -translate-y-0.5 rounded-sm border border-neutral-500 px-[.2rem] pb-[.1rem] text-xs leading-4 first:ml-2 dark:border-neutral-400 dark:bg-neutral-500',
            className
        )}
        {...props}
    />
)

const PersonalBest = () => (
    <RowTag className="cursor-help" title="Personal Best">
        PB
    </RowTag>
)
const WorldBest = () => (
    <RowTag className="cursor-help" title="World Best">
        WB
    </RowTag>
)

export type RankedLeaderboardRowProps = {
    session_id: string
    rank: React.ReactNode
    username: React.ReactNode
    playtime: React.ReactNode
    isPB?: boolean
    isWB?: boolean
    className?: string
}

export const RankedLeaderboardRow = ({
    rank,
    username,
    playtime,
    isPB,
    isWB,
    className,
}: RankedLeaderboardRowProps) => (
    <tr className={className}>
        <td className="pr-1 text-end">{rank}</td>
        <td className="pr-8">{username}</td>
        <td className="text-end font-mono">{playtime}</td>
        <td>
            {isPB && <PersonalBest />}
            {isWB && <WorldBest />}
        </td>
    </tr>
)

export const LeaderboardSeparator = () => (
    <tr className="border-b border-neutral-500" />
)

export const NoLeaderboardEntries = () => (
    <tr>
        <td colSpan={4} className="px-12 italic">
            No records!
        </td>
    </tr>
)

export type LeaderboardTitleProps = {
    title: string
}

export const LeaderboardTitle = ({ title }: LeaderboardTitleProps) => (
    <tr className="border-b border-neutral-500">
        <td colSpan={4} className="text-center font-bold">
            {title}
        </td>
    </tr>
)

type RankedLeaderboardProps = TableProps & {
    title?: string
    rows: RankedLeaderboardRowProps[]
    bottomRows?: RankedLeaderboardRowProps[]
}

export const SingleRankedLeaderboard = ({
    title,
    rows,
    bottomRows,
    ...props
}: RankedLeaderboardProps) => (
    <table {...props}>
        <tbody>
            {title && <LeaderboardTitle title={title} />}
            {rows.length || bottomRows?.length ? (
                <>
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
                </>
            ) : (
                <NoLeaderboardEntries />
            )}
        </tbody>
    </table>
)

export type MultiRankedLeaderboardProps = TableProps & {
    leaderboards: RankedLeaderboardProps[]
}

export const MultiRankedLeaderboard = ({
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
        </tbody>
    </table>
)

// =================================== * * * ===========================================

type HiScoreRowProps = GameRecord & {
    rank: number
    isCurrent: boolean
    isPB: boolean
    isWB: boolean
}

export const HiScoreRow = ({
    rank,
    username,
    playtime,
    isCurrent,
    isPB,
    isWB,
}: HiScoreRowProps) => (
    <tr className={twJoin(isCurrent && 'font-bold')}>
        <td className="pr-1 text-end">{rank}.</td>
        <td className="pr-8">
            {username ?? <div className="italic opacity-50">Anonymous</div>}
        </td>
        <td className="text-end font-mono">{playtime.toFixed(3)}</td>
        <td>
            {isPB && <PersonalBest />}
            {isWB && <WorldBest />}
        </td>
    </tr>
)

type HiScoreSectionProps = {
    title: string
    records: GameRecord[]
}

export default function HiScoreCategoryRows({
    title,
    records,
}: HiScoreSectionProps) {
    const game = useGame()
    const { player } = useAuth()

    const world = records.sort((a, b) => a.playtime - b.playtime)

    const personal = world.filter(
        ({ username }) => player?.username == username
    )

    const rows = world.slice(0, 10).map((r, i) => {
        const isCurrent = r.session_id == game.session?.session_id
        return {
            ...r,
            username: isCurrent ? (player?.username ?? 'You') : r.username,
            rank: i + 1,
            isCurrent,
            isPB: !!(
                isCurrent &&
                player &&
                game.session?.won &&
                personal &&
                personal[0].session_id === r.session_id
            ),
            isWB: isCurrent && world && world[0].session_id === r.session_id,
        }
    })

    return rows.length > 0 ? (
        rows.map((row, i) => <HiScoreRow key={`${title}-${i}`} {...row} />)
    ) : (
        <tr>
            <td colSpan={4} className="px-12 italic">
                No records!
            </td>
        </tr>
    )
}
