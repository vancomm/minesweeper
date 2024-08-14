import React from 'react'
import Collapse from '@mui/material/Collapse'
import { capitalize } from '@mui/material'
import { twMerge } from 'tailwind-merge'

import Board from './Board'
import { FaceState } from './Face'
import GameSettings from './GameSettings'
import RadioGroup, { RadioItemProps } from './RadioRow'
import {
    createGameApi,
    createNewGame,
    GameApi,
    GameUpdate,
    GameParams,
} from '../api/game'
import { ServerError } from '../api/common'
import { DivProps } from '../types'

type GamePreset = GameParams & {
    customizable?: boolean
}

const GAME_PRESETS: Record<string, GamePreset> = {
    easy: { height: 9, width: 9, mine_count: 10, unique: true },
    medium: { height: 16, width: 16, mine_count: 40, unique: true },
    hard: { height: 16, width: 30, mine_count: 99, unique: true },
    evil: { height: 20, width: 30, mine_count: 130, unique: true },
    custom: {
        height: 30,
        width: 30,
        mine_count: 150,
        unique: true,
        customizable: true,
    },
} as const

type GamePresetName = keyof typeof GAME_PRESETS

const DEFAULT_GAME_PRESET_NAME: GamePresetName = 'medium'

const gamePresetRadioItems: RadioItemProps<GamePresetName>[] = Object.keys(
    GAME_PRESETS
).map((name) => ({
    id: name,
    label: capitalize(name),
    value: name as GamePresetName,
}))

type GameSession = GameUpdate & {
    api: GameApi
}

type GameState = {
    session?: GameSession
    presetName: GamePresetName
    gameParams: GameParams
    face: FaceState
    timer: number
    showCustomControls: boolean
}

const initialState: GameState = {
    presetName: DEFAULT_GAME_PRESET_NAME,
    gameParams: GAME_PRESETS[DEFAULT_GAME_PRESET_NAME],
    face: 'smile',
    timer: 0,
    showCustomControls: false,
}

type GameEvent =
    | { type: 'cellDown'; x: number; y: number }
    | { type: 'cellUp'; x: number; y: number }
    | { type: 'gameStarted'; update: GameUpdate }
    | { type: 'gameUpdated'; update: GameUpdate }
    | { type: 'faceClicked' }
    | { type: 'presetPicked'; presetName: GamePresetName }
    | {
          type: 'paramsChanged'
          gameParams: GameParams
          presetName: GamePresetName
      }
    | { type: 'settingsUpdated'; update: GameParams }
    | { type: 'timerTick' }
    | { type: 'error'; error: ServerError }

const handleGameEvent = (state: GameState, event: GameEvent): GameState => {
    if (event.type !== 'timerTick') {
        console.debug(event)
    }

    switch (event.type) {
        case 'gameStarted': {
            const { update } = event
            const api = createGameApi(update.session_id)
            return {
                ...state,
                session: { api, ...update },
            }
        }
        case 'gameUpdated': {
            const { update } = event
            if (!state.session) {
                console.error('opened a cell before starting a session')
                return state
            }
            const timer = update.ended_at
                ? update.ended_at - update.started_at
                : state.timer
            const face: FaceState = update.dead
                ? 'lost'
                : update.won
                  ? 'win'
                  : 'smile'
            return {
                ...state,
                face: face,
                timer,
                session: {
                    ...state.session,
                    ...update,
                },
            }
        }
        case 'presetPicked': {
            const { presetName } = event
            const updated = {
                ...state,
                presetName,
            }
            return updated
        }
        case 'paramsChanged': {
            const { type, ...update } = event
            const updated = {
                ...initialState,
                ...update,
            }
            return updated
        }
        case 'faceClicked': {
            return { ...initialState, presetName: state.presetName }
        }
        case 'timerTick': {
            if (!state.session) {
                return state
            }
            return {
                ...state,
                timer: Math.floor(Date.now() / 1000) - state.session.started_at,
            }
        }
    }
    return state
}

export default function Game({ className, ...props }: DivProps) {
    const [state, dispatch] = React.useReducer(handleGameEvent, initialState)

    const grid: number[] = React.useMemo(() => {
        console.log('recalculating grid')
        return (
            state.session?.grid ??
            Array.from(
                {
                    length: state.gameParams.height * state.gameParams.width,
                },
                () => -2
            )
        )
    }, [state.gameParams, state.session])

    const playing = !!state.session?.started_at && !state.session?.ended_at
    const deadOrWon = !!(state.session?.dead || state.session?.won)
    const flags = state.session?.grid.filter((c) => c == -1).length ?? 0

    const [timerInterval, setTimerInterval] = React.useState<number>()

    React.useEffect(() => {
        if (!playing && timerInterval !== undefined) {
            setTimerInterval(() => void window.clearInterval(timerInterval))
        }
        if (playing && timerInterval === undefined) {
            setTimerInterval(
                window.setInterval(() => dispatch({ type: 'timerTick' }), 1000)
            )
        }
    }, [playing, timerInterval])

    return (
        <div
            className={twMerge('w-fit flex flex-col gap-y-1', className)}
            {...props}
        >
            <div className="w-fit select-none">
                <RadioGroup
                    items={gamePresetRadioItems}
                    activeId={state.presetName}
                    onChange={({ value }) => {
                        if (GAME_PRESETS[value].customizable) {
                            dispatch({
                                type: 'presetPicked',
                                presetName: value,
                            })
                        } else {
                            dispatch({
                                type: 'paramsChanged',
                                presetName: value,
                                gameParams: GAME_PRESETS[value],
                            })
                        }
                    }}
                />
            </div>
            <Collapse in={GAME_PRESETS[state.presetName].customizable}>
                <GameSettings
                    gameParams={GAME_PRESETS[state.presetName]}
                    onSubmit={(update) =>
                        dispatch({
                            type: 'paramsChanged',
                            presetName: state.presetName,
                            gameParams: update,
                        })
                    }
                />
            </Collapse>
            <Board
                height={state.gameParams.height}
                width={state.gameParams.width}
                gameOver={deadOrWon}
                grid={grid}
                cellProps={{ disabled: deadOrWon }}
                onCellDown={(x, y) => dispatch({ type: 'cellDown', x, y })}
                onCellUp={(x, y, prevState) => {
                    dispatch({ type: 'cellUp', x, y })

                    if (!state.session) {
                        return createNewGame({
                            x,
                            y,
                            ...state.gameParams,
                        }).then((res) =>
                            res.success
                                ? dispatch({
                                      type: 'gameStarted',
                                      update: res.data,
                                  })
                                : dispatch({
                                      type: 'error',
                                      error: res.error,
                                  })
                        )
                    }

                    const action =
                        prevState === -2
                            ? state.session.api.openCell
                            : state.session.api.chordCell

                    return action({ x, y }).then((res) =>
                        res.success
                            ? dispatch({
                                  type: 'gameUpdated',
                                  update: res.data,
                              })
                            : dispatch({ type: 'error', error: res.error })
                    )
                }}
                onCellAux={(x, y) =>
                    state.session?.api.flagCell({ x, y }).then((res) =>
                        res.success
                            ? dispatch({
                                  type: 'gameUpdated',
                                  update: res.data,
                              })
                            : dispatch({ type: 'error', error: res.error })
                    )
                }
                rightCounterValue={Math.min(state.timer, 999)
                    .toString()
                    .padStart(3, '0')}
                leftCounterValue={(state.gameParams.mine_count - flags)
                    .toString()
                    .padStart(3, '0')}
                faceState={state.face}
                onFaceClick={() => dispatch({ type: 'faceClicked' })}
            />
        </div>
    )
}
