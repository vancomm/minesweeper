import { capitalize } from '@mui/material';
import { twJoin } from 'tailwind-merge';

import { RankedLeaderboardRowProps } from 'components/Leaderboard';

import { GameRecord, PlayerInfo } from 'api/entities';

import { gamePresetSeeds, paramsToSeed, seedToPresetName } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { GameContext, useGame } from '@/contexts/GameContext';
import { bisectLeft } from '@/lib';

const prepareRows = (records: GameRecord[], numRows: number, game: GameContext, player: PlayerInfo | undefined) => {
    const personal = records.filter(({ username }) => player?.username == username);
    const bottomRows: RankedLeaderboardRowProps[] = [];

    if (game.session) {
        const liveRow: GameRecord = {
            ...game.params,
            game_session_id: game.session.game_session_id,
            username: player?.username ?? null,
            playtime_ms: game.over ? game.playtime_ms : game.playtime_ms - (game.playtime_ms % 1000),
        };
        if (game.session.dead) {
            bottomRows.push({
                ...liveRow,
                playtime: liveRow.playtime_ms / 1000,
                rank: '💥',
                className: 'font-bold',
            });
        }
        const liveIndex = bisectLeft(
            records as { playtime_ms: number }[],
            { playtime_ms: game.playtime_ms },
            (a, b) => a.playtime_ms - b.playtime_ms
        );
        if (!game.over) {
            if (liveIndex >= numRows) {
                bottomRows.push({
                    ...liveRow,
                    playtime: liveRow.playtime_ms / 1000,
                    rank: `${liveIndex + 1}.`,
                    className: 'font-bold',
                });
            } else {
                records.splice(liveIndex, 0, liveRow);
            }
        }
    }

    const rows: RankedLeaderboardRowProps[] = records
        .map((r, i) => ({
            ...r,
            idx: i,
            isLatest: r.game_session_id === game.session?.game_session_id,
        }))
        .filter((r) => r.idx < numRows || r.isLatest)
        .map((r) => ({
            ...r,
            className: twJoin(r.isLatest && 'font-bold'),
            rank: `${r.idx + 1}.`,
            username: r.username || (r.isLatest && (player?.username || 'You')) || (
                <div className="italic opacity-50">Anonymous</div>
            ),
            playtime: `${(r.playtime_ms / 1000).toFixed(2).replace(/\.(\d{,2})$/, '000')}`,
            isPB: !!(
                game.over &&
                r.isLatest &&
                player?.username &&
                personal.at(0)?.game_session_id === r.game_session_id
            ),
            isWB: !!(game.over && r.isLatest && records.at(0)?.game_session_id === r.game_session_id),
        }));

    return { rows, bottomRows };
};

export const useLeaderboardRows = (records: GameRecord[], numRows: number) => {
    const game = useGame();
    const { player } = useAuth();

    return prepareRows(records, numRows, game, player);
};

export const useSplitLeaderboardRows = (records: GameRecord[], numRows: number) => {
    const game = useGame();
    const { player } = useAuth();

    const recordsPerPreset = records
        .map((r) => [r, paramsToSeed(r)] as const)
        .map(([r, seed]) => [r, gamePresetSeeds.includes(seed) ? seedToPresetName[seed] : undefined] as const)
        .reduce(
            (acc, [r, presetName]) =>
                presetName
                    ? {
                          ...acc,
                          [presetName]: presetName in acc ? [...acc[presetName], r] : [r],
                      }
                    : acc,
            {} as Record<string, GameRecord[]>
        );

    const leaderboards = Object.entries(recordsPerPreset).map(([presetName, records]) => ({
        title: capitalize(presetName),
        ...prepareRows(records, numRows, game, player),
    }));

    return leaderboards;
};
