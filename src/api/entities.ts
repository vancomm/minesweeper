import { z } from 'zod'

export type CellParams = {
    x: number
    y: number
}

export type GameParams = {
    width: number
    height: number
    mine_count: number
    unique: boolean
}

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

export const GameRecord = z.object({
    session_id: z.string(),
    username: z.string().nullable(),
    width: z.number(),
    height: z.number(),
    mine_count: z.number(),
    unique: z.boolean(),
    playtime: z.number().transform((ms) => ms / 1000),
})

export type GameRecord = z.infer<typeof GameRecord>

export type AuthError = {
    statusCode: number
    errorText: string
}

export type AuthParams = {
    username: string
    password: string
}

export const PlayerInfo = z.object({
    player_id: z.number(),
    username: z.string(),
})

export type PlayerInfo = z.infer<typeof PlayerInfo>

export const Status = z.discriminatedUnion('logged_in', [
    z.object({
        logged_in: z.literal(false),
    }),
    z.object({
        logged_in: z.literal(true),
        player: PlayerInfo,
    }),
])

export type Status = z.infer<typeof Status>
