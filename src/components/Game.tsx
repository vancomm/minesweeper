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
    sessionIdToWS,
} from '../api/game'
import { ServerError } from '../api/common'
import { DivProps } from '../types'
import { useNavigate, UseNavigateResult } from '@tanstack/react-router'
import useWebSocket from 'react-use-websocket'

type GamePreset = GameParams & {
    customizable: boolean
}

const GAME_PRESETS = {
    easy: {
        height: 9,
        width: 9,
        mine_count: 10,
        unique: true,
        customizable: false,
    },
    medium: {
        height: 16,
        width: 16,
        mine_count: 40,
        unique: true,
        customizable: false,
    },
    hard: {
        height: 16,
        width: 30,
        mine_count: 99,
        unique: true,
        customizable: false,
    },
    evil: {
        height: 20,
        width: 30,
        mine_count: 130,
        unique: true,
        customizable: false,
    },
    custom: {
        height: 30,
        width: 30,
        mine_count: 150,
        unique: true,
        customizable: true,
    },
} as const satisfies Record<string, GamePreset>

type GamePresetName = keyof typeof GAME_PRESETS

const paramsToSeed = ({ width, height, mine_count, unique }: GameParams) =>
    `${width}:${height}:${mine_count}:${unique ? '1' : '0'}`

const DEFAULT_GAME_PRESET_NAME: GamePresetName = 'medium'

const gamePresetRadioItems: RadioItemProps<GamePresetName>[] = Object.keys(
    GAME_PRESETS
).map((name) => ({
    id: name,
    label: capitalize(name),
    value: name as GamePresetName,
}))

export type GameSession = GameUpdate & {
    api: GameApi
}

type GameState = {
    session?: GameSession
    presetName: GamePresetName
    gameParams: GameParams
    face: FaceState
    timer: number
    timerInterval?: number
    showCustomControls: boolean
    pressedSquares?: number[]
}

const initialState: GameState = {
    presetName: DEFAULT_GAME_PRESET_NAME,
    gameParams: GAME_PRESETS[DEFAULT_GAME_PRESET_NAME],
    face: 'smile',
    timer: 0,
    showCustomControls: false,
}

type GameEvent =
    | { type: 'cellDown'; x: number; y: number; squareState: number }
    | { type: 'cellUp'; x: number; y: number; squareState: number }
    | {
          type: 'gameUpdated'
          update: GameUpdate
          navigate?: UseNavigateResult<'/game/$session_id'>
      }
    | { type: 'presetPicked'; presetName: GamePresetName }
    | {
          type: 'gameReset'
          gameParams?: GameParams
          presetName?: GamePresetName
          navigate: UseNavigateResult<'/game/$session_id'>
      }
    | { type: 'timerStart'; interval: number; callback: () => unknown }
    | { type: 'timerTick' }
    | { type: 'timerStop' }
    | { type: 'error'; error: ServerError }

const handleGameEvent = (state: GameState, event: GameEvent): GameState => {
    if (event.type !== 'timerTick') {
        console.debug(event)
    }

    switch (event.type) {
        case 'cellDown': {
            if (
                state.session === undefined ||
                state.session.ended_at !== undefined
            ) {
                return state
            }
            const { width, height, grid } = state.session
            const { x, y, squareState } = event
            if (squareState == -2) {
                return {
                    ...state,
                    pressedSquares: [y * state.session.width + x],
                }
            } else if (0 <= squareState && squareState <= 8) {
                const neighbors = [-1, 0, 1]
                    .flatMap((dx) => [-1, 0, 1].map((dy) => [x + dx, y + dy]))
                    .filter(
                        ([xx, yy]) =>
                            0 <= xx &&
                            xx < width &&
                            0 <= yy &&
                            yy < height &&
                            (xx != x || yy != y) &&
                            grid[yy * width + xx] == -2
                    )
                    .map(([x, y]) => y * width + x)
                return {
                    ...state,
                    pressedSquares: neighbors,
                }
            }
            return state
        }
        case 'gameUpdated': {
            const { update, navigate } = event
            if (window.location.href.endsWith('/new') && navigate) {
                navigate({
                    to: '/game/$session_id',
                    params: { session_id: update.session_id },
                })
            }
            if (update.ended_at !== undefined) {
                window.clearInterval(state.timerInterval)
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
                face,
                timer,
                pressedSquares: undefined,
                session: {
                    ...state.session,
                    ...update,
                    api: state.session?.api ?? createGameApi(update.session_id),
                },
            }
        }
        case 'presetPicked': {
            const { presetName } = event
            return {
                ...state,
                presetName,
            }
        }
        case 'gameReset': {
            const { presetName, gameParams, navigate } = event
            navigate({ to: '/game/$session_id', params: { session_id: 'new' } })
            return {
                ...initialState,
                presetName: presetName ?? state.presetName,
                gameParams: gameParams ?? GAME_PRESETS[state.presetName],
            }
        }
        case 'timerStart': {
            if (state.timerInterval !== undefined) {
                window.clearInterval(state.timerInterval)
            }
            const { callback, interval } = event
            return {
                ...state,
                timerInterval: window.setInterval(callback, interval),
            }
        }
        case 'timerTick': {
            if (!state.session) {
                return state
            }
            return {
                ...state,
                timer:
                    (state.session.ended_at ?? Math.floor(Date.now() / 1000)) -
                    state.session.started_at,
            }
        }
        case 'timerStop': {
            return {
                ...state,
                timerInterval: void window.clearInterval(state.timerInterval),
            }
        }
    }
    return state
}

type GameProps = DivProps & {
    initialUpdate?: GameUpdate
}

const placeholderWS = 'ws://echo.websocket.org'

export default function Game({
    initialUpdate,
    className,
    ...props
}: GameProps) {
    const [state, dispatch] = React.useReducer(
        handleGameEvent,
        initialState,
        (state) => {
            if (initialUpdate) {
                const seed = paramsToSeed(initialUpdate)
                state.presetName = Object.entries(GAME_PRESETS).reduce(
                    (acc, [name, params]) =>
                        seed == paramsToSeed(params)
                            ? (name as GamePresetName)
                            : acc,
                    'custom' as GamePresetName
                )
                state = handleGameEvent(state, {
                    type: 'gameUpdated',
                    update: initialUpdate,
                })
                state = handleGameEvent(state, { type: 'timerTick' })
            }
            return state
        }
    )

    const navigate = useNavigate({ from: '/game/$session_id' })

    const { sendMessage, lastJsonMessage } = useWebSocket(
        state.session ? sessionIdToWS(state.session.session_id) : placeholderWS,
        {},
        !!state.session
    )

    React.useEffect(() => {
        if (lastJsonMessage) {
            const update = GameUpdate.parse(lastJsonMessage)
            dispatch({ type: 'gameUpdated', update })
        }
    }, [lastJsonMessage])

    const { width, height, mine_count } = state.session ?? state.gameParams
    const renderedGrid: number[] =
        state.session?.grid.slice() ??
        Array.from(
            {
                length: state.gameParams.height * state.gameParams.width,
            },
            () => -2
        )
    state.pressedSquares?.forEach((j) => {
        renderedGrid[j] = 0
    })

    const flags =
        state.session?.grid.filter((c) => c == -1 || c == 64 || c == 66)
            .length ?? 0

    React.useEffect(() => {
        if (state.session && !state.session.ended_at) {
            dispatch({ type: 'timerTick' })
            dispatch({
                type: 'timerStart',
                callback: () => dispatch({ type: 'timerTick' }),
                interval: 1000,
            })
            return () => dispatch({ type: 'timerStop' })
        }
    }, [state.session])

    return (
        <div
            className={twMerge('flex w-fit flex-col gap-y-1', className)}
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
                                type: 'gameReset',
                                presetName: value,
                                gameParams: GAME_PRESETS[value],
                                navigate,
                            })
                        }
                    }}
                />
            </div>
            <Collapse in={GAME_PRESETS[state.presetName].customizable}>
                <GameSettings
                    defaultParams={GAME_PRESETS[state.presetName]}
                    onSubmit={(update) =>
                        dispatch({
                            type: 'gameReset',
                            presetName: state.presetName,
                            gameParams: update,
                            navigate,
                        })
                    }
                />
            </Collapse>
            <Board
                width={width}
                height={height}
                grid={renderedGrid}
                disabled={state.session?.ended_at !== undefined}
                onCellDown={(x, y, squareState) => {
                    if (state.session?.ended_at === undefined) {
                        dispatch({ type: 'cellDown', x, y, squareState })
                    }
                }}
                onCellUp={(x, y, squareState) => {
                    if (state.session?.ended_at !== undefined) {
                        return
                    }
                    dispatch({ type: 'cellUp', x, y, squareState })

                    if (!state.session) {
                        return createNewGame({
                            search: { x, y, ...state.gameParams },
                        }).then((res) =>
                            res.success
                                ? dispatch({
                                      type: 'gameUpdated',
                                      update: res.data,
                                      navigate: navigate,
                                  })
                                : dispatch({
                                      type: 'error',
                                      error: res.error,
                                  })
                        )
                    }

                    const message =
                        (state.session.grid[y * state.session.width + x] === -2
                            ? 'o'
                            : 'c') + ` ${x} ${y}`
                    sendMessage(message)
                }}
                onCellAux={(x, y, prevState) => {
                    if (
                        !state.session ||
                        state.session?.ended_at !== undefined
                    ) {
                        return
                    }
                    if (prevState !== -2 && prevState !== -1) {
                        return
                    }
                    sendMessage(`f ${x} ${y}`)
                }}
                rightCounterValue={Math.min(state.timer, 999)
                    .toString()
                    .padStart(3, '0')}
                leftCounterValue={Math.min(mine_count - flags, 999)
                    .toString()
                    .padStart(3, '0')}
                faceState={state.face}
                onFaceClick={() => dispatch({ type: 'gameReset', navigate })}
            />
        </div>
    )
}
