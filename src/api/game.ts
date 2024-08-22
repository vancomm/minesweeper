import { z } from 'zod'
import { createApiMethod } from './common'

// const ENDPOINT =
//     (import.meta.env.REACT_APP_SERVICE_URL as string) ??
//     'http://localhost:8000/v1'

const ENDPOINT = __API_URL__
const WS_ENDPOINT = __WS_URL__

export const sessionIdToWS = (session_id: string) =>
    `${WS_ENDPOINT}/game/${session_id}/connect`

// type PosParams struct {
// 	X int `schema:"x,required"`
// 	Y int `schema:"y,required"`
// }

type SquareParams = {
    x: number
    y: number
}

// type NewGameParams struct {
// 	Width     int  `schema:"width,required"`
// 	Height    int  `schema:"height,required"`
// 	MineCount int  `schema:"mine_count,required"`
// 	Unique    bool `schema:"unique,required"`
// }

export type GameParams = {
    width: number
    height: number
    mine_count: number
    unique: boolean
}

// type GameSessionJSON struct {
// 	SessionId string         `json:"session_id"`
// 	Grid      mines.GridInfo `json:"grid"`
// 	Width     int            `json:"width"`
// 	Height    int            `json:"height"`
// 	MineCount int            `json:"mine_count"`
// 	Unique    bool           `json:"unique"`
// 	Dead      bool           `json:"dead"`
// 	Won       bool           `json:"won"`
// 	StartedAt int64          `json:"started_at"`
// 	EndedAt   *int64         `json:"ended_at,omitempty"`
// }

export const GameUpdate = z.object({
    session_id: z.string(),
    grid: z.number().array(),
    width: z.number(),
    height: z.number(),
    mine_count: z.number(),
    unique: z.boolean(),
    dead: z.boolean(),
    won: z.boolean(),
    started_at: z.number(),
    ended_at: z.number().optional(),
})

export type GameUpdate = z.infer<typeof GameUpdate>

export const createNewGame = createApiMethod<SquareParams & GameParams>(
    `${ENDPOINT}/game`,
    {
        method: 'POST',
    }
)(GameUpdate)

export const GameRecord = z.object({
    width: z.number(),
    height: z.number(),
    mine_count: z.number(),
    unique: z.boolean(),
    playtime: z.number(),
})

export type GameRecord = z.infer<typeof GameRecord>

export const getRecords = createApiMethod(`${ENDPOINT}/records`)(
    GameRecord.array()
)

export const checkGameApi = createApiMethod(`${ENDPOINT}/status`)(z.unknown())

export const createGameApi = (session_id: string) => {
    const fetchGame = createApiMethod(`${ENDPOINT}/game/${session_id}`)(
        GameUpdate
    )
    const openCell = createApiMethod<SquareParams>(
        `${ENDPOINT}/game/${session_id}/open`,
        {
            method: 'POST',
        }
    )(GameUpdate)
    const flagCell = createApiMethod<SquareParams>(
        `${ENDPOINT}/game/${session_id}/flag`,
        {
            method: 'POST',
        }
    )(GameUpdate)
    const chordCell = createApiMethod<SquareParams>(
        `${ENDPOINT}/game/${session_id}/chord`,
        {
            method: 'POST',
        }
    )(GameUpdate)
    const executeBatch = createApiMethod(
        `${ENDPOINT}/game/${session_id}/batch`,
        { method: 'POST' }
    )(GameUpdate)
    return {
        fetchGame,
        openCell,
        flagCell,
        chordCell,
        executeBatch,
    }
}

export type GameApi = ReturnType<typeof createGameApi>
