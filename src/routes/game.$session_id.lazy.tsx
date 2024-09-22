import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Collapse, capitalize } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { ErrorComponent, createLazyFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { twJoin } from 'tailwind-merge'

import Board from 'components/Board'
import GameSettings from 'components/GameSettings'

import { GAME_PRESETS, GamePresetName, SquareState } from '@/constants'
import { useGame } from '@/contexts/GameContext'

export const Route = createLazyFileRoute('/game/$session_id')({
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    component: () => (
        <div className="overflow-x-scroll">
            <Game />
        </div>
    ),
    errorComponent: ErrorComponent,
})

function Game() {
    const game = useGame()

    const navigate = useNavigate()

    const { width, height, mine_count } =
        game.state.session ?? game.state.gameParams

    const renderedGrid: number[] =
        game.state.session?.grid.slice() ??
        Array.from({ length: width * height }, () => SquareState.Up)

    game.state.pressedSquares?.forEach((j) => {
        renderedGrid[j] = SquareState.Down
    })

    const flags =
        game.state.session?.grid.filter(
            (c) =>
                c == SquareState.Flag ||
                c == SquareState.FlagMine ||
                c == SquareState.FalseMine
        ).length ?? 0

    const [settingsExpanded, setSettingsExpanded] = React.useState(false)

    return (
        <div id="game-container" className="flex flex-col gap-y-2">
            <div className="w-fit select-none">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                    {Object.entries(GAME_PRESETS).map(([name, preset]) => (
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
                                checked={name === game.state.presetName}
                                onChange={() =>
                                    game.dispatch({
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
                            game.state.presetName === 'custom' && 'font-bold'
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
                    defaultParams={game.state.session ?? game.state.gameParams}
                    onSubmit={(params) =>
                        game.dispatch({
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
                disabled={game.state.session?.ended_at !== undefined}
                onSquareDown={(x, y, prevState) => {
                    if (game.state.session?.ended_at === undefined) {
                        game.dispatch({
                            type: 'cellDown',
                            x,
                            y,
                            squareState: prevState,
                        })
                    }
                }}
                onSquareUp={(x, y, prevState) => {
                    if (game.state.session?.ended_at !== undefined) {
                        return
                    }
                    game.dispatch({
                        type: 'cellUp',
                        x,
                        y,
                        squareState: prevState,
                    })

                    game.openSquare(x, y, navigate)
                }}
                onSquareAux={(x, y, prevState) => {
                    if (game.over) {
                        return
                    }
                    if (
                        prevState !== SquareState.Up &&
                        prevState !== SquareState.Flag
                    ) {
                        return
                    }
                    game.flagSquare(x, y)
                }}
                onSquareLeave={() => {
                    if (game.state.pressedSquares?.length) {
                        game.dispatch({ type: 'cellLeave' })
                    }
                }}
                rightCounterValue={Math.min(game.state.timer, 999)
                    .toString()
                    .padStart(3, '0')}
                leftCounterValue={Math.min(mine_count - flags, 999)
                    .toString()
                    .padStart(3, '0')}
                faceState={game.state.face}
                onFaceClick={() =>
                    game.dispatch({ type: 'gameReset', navigate })
                }
            />
        </div>
    )
}
