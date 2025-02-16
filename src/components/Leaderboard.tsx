import React from 'react';
import { twJoin } from 'tailwind-merge';

import { TableProps } from '@/props';

type RowTagProps = {
    title?: string;
    className?: string;
    children: React.ReactNode;
};

const RowTag = ({ className, ...props }: RowTagProps) => (
    <div
        className={twJoin(
            'ml-1 inline-block -translate-y-0.5 rounded-sm border border-neutral-500 px-[.2rem] pb-[.1rem] text-xs leading-4 first:ml-2 dark:border-neutral-400 dark:bg-neutral-500',
            className
        )}
        {...props}
    />
);

const PersonalBest = () => (
    <RowTag className="cursor-help" title="Personal Best">
        PB
    </RowTag>
);
const WorldBest = () => (
    <RowTag className="cursor-help" title="World Best">
        WB
    </RowTag>
);

export type RankedLeaderboardRowProps = {
    game_session_id: string;
    rank: React.ReactNode;
    username: React.ReactNode;
    playtime: React.ReactNode;
    isPB?: boolean;
    isWB?: boolean;
    className?: string;
};

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
);

export type LeaderboardTitleProps = {
    title: string;
};

export const LeaderboardTitle = ({ title }: LeaderboardTitleProps) => (
    <tr className="border-b border-neutral-500">
        <td colSpan={4} className="text-center font-bold">
            {title}
        </td>
    </tr>
);

export const LeaderboardSeparator = () => <tr className="border-b border-neutral-500" />;

export const NoLeaderboardEntries = () => (
    <tr>
        <td colSpan={4} className="px-12 italic">
            No records yet!
        </td>
    </tr>
);

export type EmptyLeaderboardProps = { title?: string };

export const EmptyLeaderboard = ({ title }: EmptyLeaderboardProps) => (
    <table>
        <tbody>
            {title && <LeaderboardTitle title={title} />}
            <NoLeaderboardEntries />
        </tbody>
    </table>
);

export type RankedLeaderboardProps = TableProps & {
    title?: string;
    rows: RankedLeaderboardRowProps[];
    bottomRows?: RankedLeaderboardRowProps[];
};
