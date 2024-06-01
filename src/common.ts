import { z } from 'zod'

export const GAME_STATUS = ['preparing', 'playing', 'won', 'lost'] as const

export const GameStatus = z.enum(GAME_STATUS)

export type GameStatus = z.infer<typeof GameStatus>

export type GameMode = {
    rows: number
    cols: number
    mines: number
    customizable?: boolean
}

export const GAME_MODES = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
    evil: { rows: 20, cols: 30, mines: 130 },
    custom: { rows: 30, cols: 30, mines: 150, customizable: true },
} as const satisfies Record<string, GameMode>

export type GameModeName = keyof typeof GAME_MODES
