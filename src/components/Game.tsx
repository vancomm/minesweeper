import React from 'react'
import Collapse from '@mui/material/Collapse'
import { capitalize } from '@mui/material'
import { twMerge } from 'tailwind-merge'

import Input from '../components/Input'
import { FaceState } from '../components/Face'
import Board, { Cell } from '../components/Board'
import RadioGroup, { RadioItemProps } from '../components/RadioRow'
import { DivProps, FormProps } from '../types'
import { GAME_MODES, GameMode, GameModeName, GameStatus } from '../common'
// import { createSession } from '../api/game'

type GameState = {
    status: GameStatus
    modeName: GameModeName
    rows?: number
    cols?: number
    mines?: number
    flags: number
    face: FaceState
    cells: Cell[]
    timer: number
}

const createRandomCell = () => ({
    opened: false,
    flagged: false,
    mineCount: Math.floor(Math.random() * 9),
    mined: Math.random() < 0.1,
})

const openCell = async (index: number): Promise<Cell> => {
    console.log(`calling fake API to open cell ${index}`)
    return Promise.resolve({
        ...createRandomCell(),
        opened: true,
    })
}

const createCells = (length: number): Cell[] =>
    Array.from({ length }, createRandomCell)

const initialState: Omit<GameState, 'cells'> = {
    status: 'preparing',
    modeName: 'medium',
    flags: 0,
    face: 'smile',
    timer: 0,
}

type GameEvent =
    | { type: 'cellOpened'; index: number; update: Cell; newStatus: GameStatus }
    | { type: 'cellDown'; index: number }
    | { type: 'cellUp'; index: number }
    | { type: 'faceClicked' }
    | { type: 'modeChanged'; modeName: GameModeName }
    | {
          type: 'settingsUpdated'
          update: Omit<GameMode, 'customizable'>
      }
    | { type: 'timerTick' }

const handleGameEvent = (state: GameState, event: GameEvent): GameState => {
    console.log(event)

    switch (event.type) {
        case 'cellOpened': {
            const { index, update, newStatus } = event
            return {
                ...state,
                status: newStatus,
                cells: state.cells.map((cell, i) =>
                    i === index ? update : cell
                ),
            }
        }
        case 'modeChanged': {
            const { modeName } = event
            const { rows, cols } = GAME_MODES[modeName]
            const updated = {
                ...initialState,
                modeName,
                timer: 0,
                cells: createCells(rows * cols),
            }
            return updated
        }
        case 'faceClicked': {
            const { rows, cols, modeName } = {
                ...state,
                ...GAME_MODES[state.modeName],
            }
            return {
                ...initialState,
                modeName,
                cells: createCells(rows * cols),
            }
        }
        case 'timerTick': {
            return {
                ...state,
                timer: state.timer + 1,
            }
        }
        case 'settingsUpdated': {
            const { update } = event
            return {
                ...state,
                ...update,
                cells: createCells(update.rows * update.cols),
            }
        }
    }
    return state
}

export default function Game({ className, ...props }: FormProps) {
    const [state, dispatch] = React.useReducer(
        handleGameEvent,
        initialState,
        (state) => ({
            ...state,
            cells: createCells(
                (state.rows ?? GAME_MODES[state.modeName].rows) *
                    (state.cols ?? GAME_MODES[state.modeName].cols)
            ),
        })
    )

    const activeMode = GAME_MODES[state.modeName] as GameMode

    const { rows, cols, mines, customizable } = React.useMemo(() => {
        const { customizable, ...mode } = GAME_MODES[state.modeName] as GameMode
        return {
            rows: state.rows ?? mode.rows,
            cols: state.cols ?? mode.cols,
            mines: state.mines ?? mode.mines,
            customizable,
        }
    }, [state.rows, state.cols, state.mines, state.modeName])

    const gameModeRadioItems: RadioItemProps<GameModeName>[] = Object.keys(
        GAME_MODES
    ).map((name) => ({
        id: name,
        label: capitalize(name),
        value: name as GameModeName,
    }))

    const [interval, _setInterval] = React.useState<number>()

    React.useEffect(() => {
        if (state.status !== 'playing' && interval !== undefined) {
            _setInterval(() => window.clearInterval(interval) as undefined)
        }
        if (state.status === 'playing' && interval === undefined) {
            _setInterval(
                window.setInterval(() => dispatch({ type: 'timerTick' }), 1000)
            )
        }
    }, [state.status, state.timer, interval])

    const SettingsField = ({ className, ...props }: DivProps) => (
        <div
            className={twMerge(
                'w-full flex items-center justify-between gap-x-4',
                className
            )}
            {...props}
        />
    )

    const GameSettings = () => (
        <form
            className={twMerge('w-fit p-3 flex gap-5', className)}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const rows = parseInt(formData.get('rows') as string)
                const cols = parseInt(formData.get('cols') as string)
                const mines = parseInt(formData.get('mines') as string)
                dispatch({
                    type: 'settingsUpdated',
                    update: { rows, cols, mines },
                })
            }}
            {...props}
        >
            <SettingsField>
                <label htmlFor="rows">Rows</label>
                <Input
                    className="w-16"
                    type="number"
                    name="rows"
                    id="rows"
                    defaultValue={rows}
                />
            </SettingsField>
            <SettingsField>
                <label htmlFor="cols">Cols</label>
                <Input
                    className="w-16"
                    type="number"
                    name="cols"
                    id="cols"
                    defaultValue={cols}
                />
            </SettingsField>
            <SettingsField>
                <label htmlFor="cols">Mines</label>
                <Input
                    className="w-16"
                    type="number"
                    name="mines"
                    id="mines"
                    defaultValue={mines}
                />
            </SettingsField>
            <button type="submit">Update</button>
        </form>
    )

    return (
        <div className="w-fit flex flex-col gap-y-1">
            <div className="w-fit select-none">
                <RadioGroup
                    items={gameModeRadioItems}
                    activeId={state.modeName}
                    onChange={({ value }) =>
                        dispatch({ type: 'modeChanged', modeName: value })
                    }
                />
            </div>
            <Collapse in={customizable}>
                <GameSettings />
            </Collapse>
            <Board
                rows={state.rows ?? activeMode.rows}
                cols={state.cols ?? activeMode.cols}
                gameOver={state.status === 'won' || state.status === 'lost'}
                cells={state.cells}
                onCellUp={(index) => {
                    dispatch({ type: 'cellUp', index })
                    console.log(state.cells.filter((c) => c.opened))
                    if (!state.cells[index].opened) {
                        // createSession({
                        //     rows,
                        //     cols,
                        //     mines,
                        //     firstMove: index,
                        // })
                        //     .then((res) => console.log(res))
                        //     .then(() => openCell(index))
                        openCell(index)
                            .then((update) =>
                                dispatch({
                                    type: 'cellOpened',
                                    newStatus: 'playing',
                                    index,
                                    update,
                                })
                            )
                            .catch((e) => {
                                console.error(e)
                            })
                    }
                }}
                onCellDown={(index) => dispatch({ type: 'cellDown', index })}
                leftCounterValue={Math.min(state.timer, 999)
                    .toString()
                    .padStart(3, '0')}
                rightCounterValue={(
                    (state.mines ?? activeMode.mines) - state.flags
                )
                    .toString()
                    .padStart(3, '0')}
                faceState={state.face}
                onFaceClick={() => {
                    dispatch({ type: 'faceClicked' })
                }}
            />
        </div>
    )
}
