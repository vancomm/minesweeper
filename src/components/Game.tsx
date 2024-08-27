import React from 'react'
import { useNavigate, UseNavigateResult } from '@tanstack/react-router'
import useWebSocket from 'react-use-websocket'
import { twMerge } from 'tailwind-merge'
import { capitalize } from '@mui/material'
import Collapse from '@mui/material/Collapse'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
import { ServerError, sessionIdToWS } from '../api/common'
import { DivProps } from '../types'
import {
    GamePreset,
    GamePresetName,
    paramsToSeed,
    SquareState,
} from '../constants'

type GameSession = GameUpdate & {
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

type GameProps = DivProps & {
    presets: Record<string, GamePreset>
    defaultPresetName: GamePresetName
    initialUpdate?: GameUpdate
}

export default function Game({
    presets,
    defaultPresetName,
    initialUpdate,
    className,
    ...props
}: GameProps) {
    const initialState: GameState = React.useMemo(
        () => ({
            presetName: defaultPresetName,
            gameParams: presets[defaultPresetName],
            face: 'smile',
            timer: 0,
            showCustomControls: false,
        }),
        [defaultPresetName, presets]
    )

    const handleGameEvent = React.useCallback(
        (state: GameState, event: GameEvent): GameState => {
            if (event.type !== 'timerTick') {
                console.debug(event)
            }

            switch (event.type) {
                case 'cellDown': {
                    const { x, y, squareState } = event
                    const { width, height } =
                        state.session ?? presets[state.presetName]
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
                    void navigate({
                        to: '/game/$session_id',
                        params: { session_id: 'new' },
                    })
                    return {
                        ...initialState,
                        presetName: presetName ?? state.presetName,
                        gameParams: gameParams ?? presets[state.presetName],
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
        [presets, initialState]
    )

    const [state, dispatch] = React.useReducer(
        handleGameEvent,
        initialState,
        (state) => {
            if (initialUpdate) {
                const seed = paramsToSeed(initialUpdate)
                state.presetName = Object.entries(presets).reduce(
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
        state.session ? sessionIdToWS(state.session.session_id) : '',
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
        Array.from({ length: width * height }, () => SquareState.Up)
    state.pressedSquares?.forEach((j) => {
        renderedGrid[j] = SquareState.Down
    })

    const flags =
        state.session?.grid.filter(
            (c) =>
                c == SquareState.Flag ||
                c == SquareState.FlagMine ||
                c == SquareState.FalseMine
        ).length ?? 0

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

    const gamePresetRadioItems: RadioItemProps<GamePresetName>[] =
        React.useMemo(
            () =>
                Object.keys(presets).map((name) => ({
                    id: name,
                    label: capitalize(name),
                    value: name as GamePresetName,
                })),
            [presets]
        )

    // const [settingsExpanded, setSettingsExpanded] = React.useState(false)

    return (
        <div className={twMerge('flex flex-col', className)} {...props}>
            <div className="mb-2 w-fit select-none">
                <RadioGroup
                    items={gamePresetRadioItems}
                    activeId={state.presetName}
                    onChange={({ value }) => {
                        if (presets[value].customizable) {
                            dispatch({
                                type: 'presetPicked',
                                presetName: value,
                            })
                        } else {
                            dispatch({
                                type: 'gameReset',
                                presetName: value,
                                gameParams: presets[value],
                                navigate,
                            })
                        }
                    }}
                />
                {/* TODO */}
                {/* <button onClick={() => setSettingsExpanded((e) => !e)}>
                    <div className="inline">Custom</div>
                    <ExpandMoreIcon
                        className={twMerge(
                            'rotate-0 transition-transform',
                            settingsExpanded && 'rotate-[-180deg]'
                            // settingsExpanded
                            //     ? 'animate-half-spin-to'
                            //     : 'animate-half-spin-from'
                        )}
                    />
                </button> */}
            </div>
            {/* <Collapse in={settingsExpanded}> */}
            <Collapse in={presets[state.presetName].customizable}>
                <GameSettings
                    className="mb-2"
                    defaultParams={presets[state.presetName]}
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
                onSquareDown={(x, y, squareState) => {
                    if (state.session?.ended_at === undefined) {
                        dispatch({ type: 'cellDown', x, y, squareState })
                    }
                }}
                onSquareUp={(x, y, squareState) => {
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
                        (state.session.grid[y * state.session.width + x] ===
                        SquareState.Up
                            ? 'o'
                            : 'c') + ` ${x} ${y}`
                    sendMessage(message)
                }}
                onSquareAux={(x, y, prevState) => {
                    if (
                        !state.session ||
                        state.session?.ended_at !== undefined
                    ) {
                        return
                    }
                    if (
                        prevState !== SquareState.Up &&
                        prevState !== SquareState.Flag
                    ) {
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
