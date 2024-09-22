import { UseNavigateResult } from '@tanstack/react-router'
import React from 'react'

import { FaceState } from 'components/Face'

import { ServerError } from 'api/common'
import { GameApi, GameParams, GameUpdate } from 'api/game'

export type GameSession = GameUpdate & {
    api: GameApi
}

export type GameState = {
    session?: GameSession
    presetName: string
    gameParams: GameParams
    face: FaceState
    timer: number
    timerInterval?: number
    pressedSquares?: number[]
}

export type GameEvent =
    | { type: 'cellDown'; x: number; y: number; squareState: number }
    | { type: 'cellUp'; x: number; y: number; squareState: number }
    | { type: 'cellLeave' }
    | {
          type: 'gameUpdated'
          update: GameUpdate
          navigate?: UseNavigateResult<'/game/$session_id'>
      }
    | { type: 'presetPicked'; presetName: string }
    | { type: 'gameInit'; update: GameUpdate }
    | {
          type: 'gameReset'
          gameParams?: GameParams
          presetName?: string
          navigate: UseNavigateResult<'/game/$session_id'>
      }
    | { type: 'timerStart'; interval: number; callback: () => unknown }
    | { type: 'timerTick' }
    | { type: 'timerStop' }
    | { type: 'error'; error: ServerError }

export type GameContext = {
    state: GameState
    dispatch: React.Dispatch<GameEvent>
    over: boolean
    openSquare: (
        x: number,
        y: number,
        navigate: UseNavigateResult<string>
    ) => void
    flagSquare: (x: number, y: number) => void
}

export const GameContext = React.createContext<GameContext>(null!)

export const useGame = () => React.useContext(GameContext)
