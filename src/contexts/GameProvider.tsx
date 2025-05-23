import { useQueryClient } from '@tanstack/react-query';
import { UseNavigateResult } from '@tanstack/react-router';
import React from 'react';
import useWebSocket from 'react-use-websocket';

import { FaceState } from 'components/Face';

import { GameParams, GameUpdate } from 'api/entities';
import { GameApi, createNewGame, getWSConnectURL, newGameApi } from 'api/game';

import { CellState, GamePresetName, gamePresets, paramsToSeed } from '@/constants';
import { GameContext, GameResetParams } from '@/contexts/GameContext';

const DEFAULT_GAME_PRESET_NAME = 'medium';

type GameState = {
    session?: GameUpdate & { api: GameApi };
    presetName: string;
    gameParams: GameParams;
    face: FaceState;
    timer: number;
    timerInterval?: number;
    pressedCells?: number[];
};

type GameEvent =
    | { type: 'cellDown'; x: number; y: number; cellState: number }
    | { type: 'cellUp'; x: number; y: number; cellState: number }
    | { type: 'cellLeave' }
    | {
          type: 'gameUpdated';
          update: GameUpdate;
          navigate?: UseNavigateResult<string>;
      }
    | { type: 'presetPicked'; presetName: string }
    | { type: 'gameInit'; update: GameUpdate }
    | {
          type: 'gameReset';
          navigate: UseNavigateResult<string>;
          gameParams?: GameParams;
          presetName?: string;
      }
    | { type: 'timerStart'; interval: number; callback: () => unknown }
    | { type: 'timerTick' }
    | { type: 'timerStop' }
    | { type: 'error'; error: unknown };

type GameProviderProps = { children?: React.ReactNode };

function pointsAround(x: number, y: number): [number, number][] {
    return [x - 1, x, x + 1].flatMap((xx) => [y - 1, y, y + 1].map((yy) => [xx, yy] as [number, number]));
}

export default function GameProvider({ children }: GameProviderProps) {
    const queryClient = useQueryClient();

    const initialState: GameState = React.useMemo(
        () => ({
            presetName: DEFAULT_GAME_PRESET_NAME,
            gameParams: gamePresets[DEFAULT_GAME_PRESET_NAME],
            face: 'smile',
            timer: 0,
        }),
        []
    );

    const handleGameEvent = React.useCallback(
        (state: GameState, event: GameEvent): GameState => {
            if (event.type !== 'timerTick') {
                console.debug(event);
            }

            switch (event.type) {
                case 'cellDown': {
                    const { x, y, cellState } = event;
                    const { width, height } = state.session ?? state.gameParams;
                    const index = y * width + x;
                    if (cellState == CellState.Up) {
                        return { ...state, pressedCells: [index] };
                    }
                    if (
                        !(0 <= cellState && cellState <= 8) ||
                        state.session === undefined ||
                        state.session.ended_at !== undefined
                    ) {
                        return state;
                    }
                    const { grid } = state.session;
                    return {
                        ...state,
                        pressedCells: pointsAround(x, y)
                            .filter(
                                ([xx, yy]) =>
                                    0 <= xx &&
                                    xx < width &&
                                    0 <= yy &&
                                    yy < height &&
                                    yy * width + xx !== index &&
                                    grid[yy * width + xx] === CellState.Up
                            )
                            .map(([xx, yy]) => yy * width + xx),
                    };
                }
                case 'cellLeave': {
                    return { ...state, pressedCells: undefined };
                }
                case 'gameInit': {
                    const { update } = event;
                    const seed = paramsToSeed(update);
                    const presetName = Object.entries(gamePresets).reduce(
                        (acc, [name, params]) => (seed == paramsToSeed(params) ? name : acc),
                        'custom'
                    );
                    return {
                        ...handleGameEvent(
                            handleGameEvent(state, {
                                type: 'gameUpdated',
                                update,
                            }),
                            { type: 'timerTick' }
                        ),
                        presetName,
                    };
                }
                case 'gameUpdated': {
                    const { update, navigate } = event;
                    if (window.location.href.endsWith('/new') && navigate) {
                        void navigate({
                            to: '/game/$session_id',
                            params: { session_id: update.game_session_id },
                        });
                    }
                    if (update.ended_at !== undefined) {
                        queryClient
                            .invalidateQueries({
                                queryKey: ['records', paramsToSeed(update)],
                            })
                            .catch(console.error);
                        window.clearInterval(state.timerInterval);
                    }
                    const face: FaceState = update.dead ? 'lost' : update.won ? 'win' : 'smile';
                    const timer = update.ended_at ? update.ended_at - update.started_at : state.timer;
                    const api = state.session?.api ?? newGameApi(update.game_session_id);
                    return {
                        ...state,
                        face,
                        timer,
                        pressedCells: undefined,
                        session: {
                            ...state.session,
                            ...update,
                            api,
                        },
                    };
                }
                case 'presetPicked': {
                    const { presetName } = event;
                    return { ...state, presetName };
                }
                case 'gameReset': {
                    const { presetName, gameParams, navigate } = event;
                    if (!window.location.href.endsWith('/new')) {
                        void navigate({
                            to: '/game/$session_id',
                            params: { session_id: 'new' },
                        });
                    }
                    return {
                        ...initialState,
                        presetName: presetName ?? state.presetName,
                        gameParams:
                            gameParams ??
                            state.session ??
                            gamePresets[
                                state.presetName in gamePresets
                                    ? (state.presetName as GamePresetName)
                                    : DEFAULT_GAME_PRESET_NAME
                            ],
                    };
                }
                case 'timerStart': {
                    if (state.timerInterval !== undefined) {
                        window.clearInterval(state.timerInterval);
                    }
                    const { callback, interval } = event;
                    return {
                        ...state,
                        timerInterval: window.setInterval(callback, interval),
                    };
                }
                case 'timerTick': {
                    if (!state.session) {
                        return state;
                    }
                    return {
                        ...state,
                        timer: ((state.session.ended_at ?? Date.now()) - state.session.started_at) / 1000,
                    };
                }
                case 'timerStop': {
                    return {
                        ...state,
                        timerInterval: void window.clearInterval(state.timerInterval),
                    };
                }
            }
            return state;
        },
        [initialState, queryClient]
    );

    const [state, dispatch] = React.useReducer(handleGameEvent, initialState);

    const ws = useWebSocket(state.session ? getWSConnectURL(state.session.game_session_id) : '', {}, !!state.session);

    const over = React.useMemo(() => state.session === undefined || state.session?.ended_at !== undefined, [state]);

    React.useEffect(() => {
        if (ws.lastJsonMessage) {
            const update = GameUpdate.parse(ws.lastJsonMessage);
            dispatch({ type: 'gameUpdated', update });
        }
    }, [ws.lastJsonMessage, dispatch]);

    React.useEffect(() => {
        if (!over) {
            dispatch({ type: 'timerTick' });
            dispatch({
                type: 'timerStart',
                callback: () => dispatch({ type: 'timerTick' }),
                interval: 1000,
            });
            return () => dispatch({ type: 'timerStop' });
        }
        return () => {};
    }, [over, dispatch]);

    const value = React.useMemo(
        () => ({
            session: state.session,
            presetName: state.presetName,
            params: state.session ?? state.gameParams,
            pressedCells: state.pressedCells,
            over,
            playtime_ms: state.session ? (state.session.ended_at ?? Date.now()) - state.session.started_at : 0,
            flags:
                state.session?.grid.filter(
                    (c) => c == CellState.Flag || c == CellState.FlagMine || c == CellState.FalseMine
                ).length ?? 0,
            face: state.face,
            seed: paramsToSeed(state.session ?? state.gameParams),
            init: (update: GameUpdate) => {
                dispatch({ type: 'gameInit', update });
            },
            reset: ({ navigate, gameParams, presetName }: GameResetParams) => {
                dispatch({
                    type: 'gameReset',
                    presetName,
                    gameParams,
                    navigate,
                });
            },
            openCell: (x: number, y: number, navigate: UseNavigateResult<string>) => {
                if (!state.session) {
                    return createNewGame({ x, y, ...state.gameParams }).then((res) => {
                        if (res.isErr()) {
                            return dispatch({
                                type: 'error',
                                error: res.error,
                            });
                        }
                        return dispatch({
                            type: 'gameUpdated',
                            update: res.value,
                            navigate,
                        });
                    });
                }
                const message =
                    (state.session.grid[y * state.session.width + x] === CellState.Up ? 'o' : 'c') + ` ${x} ${y}`;
                ws.sendMessage(message);
            },
            flagCell: (x: number, y: number) => {
                ws.sendMessage(`f ${x} ${y}`);
            },
            cellDown: (x: number, y: number, prevState: number) => {
                dispatch({
                    type: 'cellDown',
                    x,
                    y,
                    cellState: prevState,
                });
            },
            cellUp: (x: number, y: number, prevState: number) => {
                dispatch({
                    type: 'cellUp',
                    x,
                    y,
                    cellState: prevState,
                });
            },
            cellLeave: () => {
                if (state.pressedCells?.length) {
                    dispatch({ type: 'cellLeave' });
                }
            },
        }),
        [state, ws, over]
    );

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
