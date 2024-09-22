import { UseNavigateResult } from '@tanstack/react-router'
import React from 'react'
import useWebSocket from 'react-use-websocket'

import { sessionIdToWS } from '@/api/common'
import { GameUpdate, createGameApi, createNewGame } from '@/api/game'
import { FaceState } from '@/components/Face'
import {
    GAME_PRESETS,
    GamePresetName,
    SquareState,
    paramsToSeed,
} from '@/constants'
import { GameContext, GameEvent, GameState } from '@/contexts/GameContext'

const DEFAULT_GAME_PRESET_NAME = 'medium'

type GameProviderProps = { children?: React.ReactNode }

export default function GameProvider({ children }: GameProviderProps) {
    const initialState: GameState = React.useMemo(
        () => ({
            presetName: DEFAULT_GAME_PRESET_NAME,
            gameParams: GAME_PRESETS[DEFAULT_GAME_PRESET_NAME],
            face: 'smile',
            timer: 0,
        }),
        []
    )

    const handleGameEvent = React.useCallback(
        (state: GameState, event: GameEvent): GameState => {
            if (event.type !== 'timerTick') {
                console.debug(event)
            }

            switch (event.type) {
                case 'cellDown': {
                    const { x, y, squareState } = event
                    const { width, height } = state.session ?? state.gameParams
                    const index = y * width + x
                    if (squareState == SquareState.Up) {
                        return { ...state, pressedSquares: [index] }
                    }
                    if (
                        state.session === undefined ||
                        state.session.ended_at !== undefined
                    ) {
                        return state
                    }
                    const { grid } = state.session
                    if (0 <= squareState && squareState <= 8) {
                        return {
                            ...state,
                            pressedSquares: [x - 1, x, x + 1]
                                .flatMap((xx) =>
                                    [y - 1, y, y + 1].map((yy) => [xx, yy])
                                )
                                .filter(
                                    ([xx, yy]) =>
                                        0 <= xx &&
                                        xx < width &&
                                        0 <= yy &&
                                        yy < height &&
                                        yy * width + xx !== index &&
                                        grid[yy * width + xx] === SquareState.Up
                                )
                                .map(([xx, yy]) => yy * width + xx),
                        }
                    }
                    return state
                }
                case 'cellLeave': {
                    return {
                        ...state,
                        pressedSquares: undefined,
                    }
                }
                case 'gameInit': {
                    const { update } = event

                    const seed = paramsToSeed(update)
                    const presetName = Object.entries(GAME_PRESETS).reduce(
                        (acc, [name, params]) =>
                            seed == paramsToSeed(params) ? name : acc,
                        'custom'
                    )

                    return {
                        ...handleGameEvent(
                            handleGameEvent(state, {
                                type: 'gameUpdated',
                                update,
                            }),
                            { type: 'timerTick' }
                        ),
                        presetName,
                    }
                }
                case 'gameUpdated': {
                    const { update, navigate } = event

                    if (window.location.href.endsWith('/new') && navigate) {
                        void navigate({
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
                            api:
                                state.session?.api ??
                                createGameApi(update.session_id),
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
                    if (!window.location.href.endsWith('/new')) {
                        void navigate({
                            to: '/game/$session_id',
                            params: { session_id: 'new' },
                        })
                    }
                    return {
                        ...initialState,
                        presetName: presetName ?? state.presetName,
                        gameParams:
                            gameParams ??
                            state.session ??
                            GAME_PRESETS[
                                state.presetName in GAME_PRESETS
                                    ? (state.presetName as GamePresetName)
                                    : DEFAULT_GAME_PRESET_NAME
                            ],
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
                            (state.session.ended_at ??
                                Math.floor(Date.now() / 1000)) -
                            state.session.started_at,
                    }
                }
                case 'timerStop': {
                    return {
                        ...state,
                        timerInterval: void window.clearInterval(
                            state.timerInterval
                        ),
                    }
                }
            }
            return state
        },
        [initialState]
    )

    const [state, dispatch] = React.useReducer(handleGameEvent, initialState)

    const { sendMessage, lastJsonMessage } = useWebSocket(
        state.session ? sessionIdToWS(state.session.session_id) : '',
        {},
        !!state.session
    )

    const over = React.useMemo(
        () =>
            state.session === undefined ||
            state.session?.ended_at !== undefined,
        [state]
    )

    const openSquare = React.useCallback(
        (x: number, y: number, navigate: UseNavigateResult<string>) => {
            if (!state.session) {
                const res = createNewGame({
                    search: { x, y, ...state.gameParams },
                })
                return res.then(({ success, data, error }) =>
                    success
                        ? dispatch({
                              type: 'gameUpdated',
                              update: data,
                              navigate: navigate,
                          })
                        : dispatch({
                              type: 'error',
                              error: error,
                          })
                )
            }
            const message =
                (state.session.grid[y * state.session.width + x] ===
                SquareState.Up
                    ? 'o'
                    : 'c') + ` ${x} ${y}`
            sendMessage(message)
        },
        [state, sendMessage]
    )

    const flagSquare = React.useCallback(
        (x: number, y: number) => {
            sendMessage(`f ${x} ${y}`)
        },
        [sendMessage]
    )

    React.useEffect(() => {
        if (lastJsonMessage) {
            const update = GameUpdate.parse(lastJsonMessage)
            dispatch({ type: 'gameUpdated', update })
        }
    }, [lastJsonMessage, dispatch])

    React.useEffect(() => {
        if (!over) {
            dispatch({ type: 'timerTick' })
            dispatch({
                type: 'timerStart',
                callback: () => dispatch({ type: 'timerTick' }),
                interval: 1000,
            })
            return () => dispatch({ type: 'timerStop' })
        }
        return () => {}
    }, [over, dispatch])

    const value = React.useMemo(
        () => ({
            state,
            dispatch,
            over,
            openSquare,
            flagSquare,
        }),
        [state, dispatch, over, openSquare, flagSquare]
    )

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
