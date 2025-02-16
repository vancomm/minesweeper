import { GameParams } from 'api/entities';

export const BASE_URL = __BASE_URL__;
export const APP_VERSION = __APP_VERSION__;
export const API_PREFIX = __API_PREFIX__;

export const GAME_PRESETS = {
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
} as const satisfies Record<string, GameParams>;

export type GamePresetName = keyof typeof GAME_PRESETS;

export const GAME_PRESET_NAMES = [...Object.keys(GAME_PRESETS)] as const;

export const paramsToSeed = ({ width, height, mine_count, unique }: GameParams) =>
    `${width}:${height}:${mine_count}:${unique ? '1' : '0'}`;

export const GAME_PRESET_SEEDS = [...Object.values(GAME_PRESETS).map(paramsToSeed)] as const;

export const SEED_2_GAME_PRESET_NAME = Object.entries(GAME_PRESETS).reduce(
    (acc, [k, v]) => ({ ...acc, [paramsToSeed(v)]: k }),
    {} as Readonly<Record<string, string>>
);

export const paramsToPresetName = (params: GameParams) => {
    const seed = paramsToSeed(params);
    return GAME_PRESET_SEEDS.includes(seed) ? SEED_2_GAME_PRESET_NAME[seed] : undefined;
};

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
