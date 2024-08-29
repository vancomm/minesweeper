import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Collapse, capitalize } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { ErrorComponent, createLazyFileRoute } from '@tanstack/react-router'
import { UseNavigateResult, useNavigate } from '@tanstack/react-router'
import React from 'react'
import useWebSocket from 'react-use-websocket'
import { twJoin } from 'tailwind-merge'

import Board from 'components/Board'
import { FaceState } from 'components/Face'
import GameSettings from 'components/GameSettings'

import { ServerError, sessionIdToWS } from 'api/common'
import {
    GameApi,
    GameParams,
    GameUpdate,
    createGameApi,
    createNewGame,
} from 'api/game'

import {
    GAME_PRESETS,
    GamePresetName,
    SquareState,
    paramsToSeed,
} from '@/constants'
import { DivProps } from '@/types'

export const Route = createLazyFileRoute('/game/$session_id')({
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    component: RestoredGame,
    errorComponent: ErrorComponent,
})

function RestoredGame() {
    const update = Route.useLoaderData()
    return (
        <div className="overflow-x-scroll">
            <Game
                presets={GAME_PRESETS}
                defaultPresetName={'medium'}
                initialUpdate={update}
            />
        </div>
    )
}

type GameSession = GameUpdate & {
    api: GameApi
}

type GameState = {
    session?: GameSession
    presetName: string
    gameParams: GameParams
    face: FaceState
    timer: number
    timerInterval?: number
    pressedSquares?: number[]
}

type GameEvent =
    | { type: 'cellDown'; x: number; y: number; squareState: number }
    | { type: 'cellUp'; x: number; y: number; squareState: number }
    | { type: 'cellLeave' }
    | {
          type: 'gameUpdated'
          update: GameUpdate
          navigate?: UseNavigateResult<'/game/$session_id'>
      }
    | { type: 'presetPicked'; presetName: string }
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

type GameProps = DivProps & {
    presets: Record<string, GameParams>
    defaultPresetName: GamePresetName
    initialUpdate?: GameUpdate
}

function Game({ presets, defaultPresetName, initialUpdate }: GameProps) {
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
                            presets[
                                state.presetName in presets
                                    ? state.presetName
                                    : defaultPresetName
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
        [presets, initialState, defaultPresetName]
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

    const navigate = useNavigate()

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

    const [settingsExpanded, setSettingsExpanded] = React.useState(false)

    return (
        <div className="flex flex-col">
            <div className="mb-2 w-fit select-none">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                    {Object.entries(presets).map(([name, preset]) => (
                        <div
                            key={`preset-${name}`}
                            className="inline-block cursor-pointer has-[:checked]:font-bold"
                        >
                            <label
                                htmlFor={`preset-${name}`}
                                className={'inline-block cursor-pointer'}
                            >
                                {capitalize(name)}
                            </label>
                            <input
                                type="radio"
                                className="hidden"
                                id={`preset-${name}`}
                                name={name}
                                checked={name === state.presetName}
                                onChange={() =>
                                    dispatch({
                                        type: 'gameReset',
                                        presetName: name as GamePresetName,
                                        gameParams: preset,
                                        navigate,
                                    })
                                }
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => setSettingsExpanded((e) => !e)}
                        className={twJoin(
                            state.presetName === 'custom' && 'font-bold'
                        )}
                    >
                        <div className="inline">Custom</div>
                        <ExpandMoreIcon
                            sx={{
                                translate: '0 -.1rem',
                                transition: 'transform 300ms',
                            }}
                            className={twJoin(
                                settingsExpanded && 'rotate-[180deg]'
                            )}
                        />
                    </button>
                </div>
            </div>
            <Collapse in={settingsExpanded}>
                <GameSettings
                    className="mb-2"
                    defaultParams={state.session ?? state.gameParams}
                    onSubmit={(params) =>
                        dispatch({
                            type: 'gameReset',
                            presetName: 'custom',
                            gameParams: params,
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
                onSquareLeave={() => {
                    if (state.pressedSquares?.length) {
                        dispatch({ type: 'cellLeave' })
                    }
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
