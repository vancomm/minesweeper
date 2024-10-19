import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Collapse, capitalize } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { twJoin } from 'tailwind-merge'

import Board from 'components/Board'
import GameSettings from 'components/GameSettings'

import { CellState, GAME_PRESETS, GamePresetName } from '@/constants'
import { useGame } from '@/contexts/GameContext'

export default function Game() {
    const game = useGame()

    const navigate = useNavigate()

    const { width, height, mine_count } = game.params

    const renderedGrid: number[] =
        game.session?.grid.slice() ??
        Array.from({ length: width * height }, () => CellState.Up)

    game.pressedCells?.forEach((j) => {
        renderedGrid[j] = CellState.Down
    })

    const minesLeftText = Math.min(mine_count - game.flags, 999)
        .toString()
        .padStart(3, '0')

    const timerText = Math.min(Math.floor(game.playtime), 999)
        .toString()
        .padStart(3, '0')

    const [settingsExpanded, setSettingsExpanded] = React.useState(false)

    return (
        <div id="game-container" className="flex flex-col">
            <div className="mb-2 w-fit select-none">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                    {Object.entries(GAME_PRESETS).map(
                        ([presetName, presetParams]) => (
                            <div
                                key={`preset-${presetName}`}
                                className="inline-block cursor-pointer has-[:checked]:font-bold"
                            >
                                <label
                                    htmlFor={`preset-${presetName}`}
                                    className={'inline-block cursor-pointer'}
                                >
                                    {capitalize(presetName)}
                                </label>
                                <input
                                    type="radio"
                                    className="hidden"
                                    id={`preset-${presetName}`}
                                    name={presetName}
                                    checked={presetName === game.presetName}
                                    onChange={() =>
                                        game.reset({
                                            navigate,
                                            presetName:
                                                presetName as GamePresetName,
                                            gameParams: presetParams,
                                        })
                                    }
                                />
                            </div>
                        )
                    )}
                    <button
                        onClick={() => setSettingsExpanded((e) => !e)}
                        className={twJoin(
                            game.presetName === 'custom' && 'font-bold'
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
                    defaultParams={game.params}
                    onSubmit={(params) => {
                        setSettingsExpanded(false)
                        game.reset({
                            presetName: 'custom',
                            gameParams: params,
                            navigate,
                        })
                    }}
                />
            </Collapse>
            <Board
                width={width}
                height={height}
                grid={renderedGrid}
                leftCounterValue={minesLeftText}
                rightCounterValue={timerText}
                faceState={game.face}
                onCellDown={(x, y, prevState) => {
                    if (game.session?.ended_at === undefined) {
                        game.cellDown(x, y, prevState)
                    }
                }}
                onCellUp={(x, y, prevState) => {
                    if (game.session?.ended_at !== undefined) {
                        return
                    }
                    game.cellUp(x, y, prevState)
                    game.openCell(x, y, navigate)
                }}
                onCellAux={(x, y, prevState) => {
                    if (game.over) {
                        return
                    }
                    if (
                        prevState !== CellState.Up &&
                        prevState !== CellState.Flag
                    ) {
                        return
                    }
                    game.flagCell(x, y)
                }}
                onCellLeave={game.cellLeave}
                onFaceClick={() => game.reset({ navigate })}
            />
        </div>
    )
}
