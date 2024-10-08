import { GameParams } from 'api/game'

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
} as const satisfies Record<string, GameParams>

export type GamePresetName = keyof typeof GAME_PRESETS

export const paramsToSeed = ({
    width,
    height,
    mine_count,
    unique,
}: GameParams) => `${width}:${height}:${mine_count}:${unique ? '1' : '0'}`

export const SquareState = {
    Question: -3,
    Up: -2,
    Flag: -1,
    Down: 0,
    FlagMine: 64,
    Blast: 65,
    FalseMine: 66,
    Mine: 67,
} as const
