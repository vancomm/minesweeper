import { z } from 'zod'
import { createApiMethod } from './common'
import { GameStatus } from '../common'

const OpenedCell = z.object({
    mined: z.boolean(),
    mineCount: z.number(),
})

type OpenedCell = z.infer<typeof OpenedCell>

const GameUpdate = z.object({
    flags: z.number(),
    cells: OpenedCell.array(),
    status: GameStatus,
})

type GameUpdate = z.infer<typeof GameUpdate>

const SessionStart = z.object({
    token: z.string(),
    update: GameUpdate,
})

type SessionStart = z.infer<typeof SessionStart>

type NewGameParams = {
    rows: number
    cols: number
    mines: number
    firstMove: number
}

export const createSession = createApiMethod<
    NewGameParams,
    typeof SessionStart
>('/start', SessionStart)

type CellActionParams = {
    index: number
}

export const createGameApi = (sessionToken: string) => {
    const openCell = createApiMethod<CellActionParams, typeof GameUpdate>(
        `/${sessionToken}/open`,
        GameUpdate
    )
    const flagCell = createApiMethod<CellActionParams, typeof GameUpdate>(
        `/${sessionToken}/flag`,
        GameUpdate
    )
    const chordCell = createApiMethod<CellActionParams, typeof GameUpdate>(
        `/${sessionToken}/chord`,
        GameUpdate
    )
    return {
        openCell,
        flagCell,
        chordCell,
    }
}
