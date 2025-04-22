import { GameParams } from 'api/entities';

export const BASE_URL = __BASE_URL__;
export const APP_VERSION = __APP_VERSION__;
export const API_PREFIX = __API_PREFIX__;

export const gamePresets = {
    easy: {
        height: 9,
        width: 9,
        mine_count: 10,
        unique: true,
    },
    medium: {
        height: 16,
        width: 16,
        mine_count: 40,
        unique: true,
    },
    hard: {
        height: 16,
        width: 30,
        mine_count: 99,
        unique: true,
    },
    evil: {
        height: 20,
        width: 30,
        mine_count: 130,
        unique: true,
    },
} as const satisfies Readonly<Record<string, GameParams>>;

export type GamePresetName = keyof typeof gamePresets;

export const gamePresetNames = [...Object.keys(gamePresets)] as const;

export function paramsToSeed({ width, height, mine_count, unique }: GameParams) {
    return `${width}:${height}:${mine_count}:${unique ? '1' : '0'}`;
}

export const gamePresetSeeds = [...Object.values(gamePresets).map(paramsToSeed)] as const;

export const seedToPresetName = Object.entries(gamePresets).reduce(
    (acc, [k, v]) => ({ ...acc, [paramsToSeed(v)]: k }),
    {} as Readonly<Record<string, string>>
);

export function paramsToPresetName(params: GameParams) {
    const seed = paramsToSeed(params);
    return gamePresetSeeds.includes(seed) ? seedToPresetName[seed] : undefined;
}

export const CellState = {
    Question: -3,
    Up: -2,
    Flag: -1,
    Down: 0,
    FlagMine: 64,
    Blast: 65,
    FalseMine: 66,
    Mine: 67,
} as const;

export type CellStateKey = keyof typeof CellState;

export type CellState = (typeof CellState)[CellStateKey];
