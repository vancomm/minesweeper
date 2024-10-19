import React from 'react'
import { twMerge } from 'tailwind-merge'

import {
    BottomBorder,
    BottomLeftBorder,
    BottomRightBorder,
    LeftBorder,
    MidBorder,
    MidLeftBorder,
    MidRightBorder,
    RightBorder,
    TopBorder,
    TopLeftBorder,
    TopRightBorder,
} from 'components/Borders'
import Counter from 'components/Counter'
import Face, { FaceState } from 'components/Face'

import Cell, { CELL_SIZE_PX, CellProps } from '@/components/Cell'

export type Cell = Omit<CellProps, 'gameOver'>

export type BoardProps = {
    height: number
    width: number
    grid: number[]
    faceState: FaceState
    leftCounterValue: string
    rightCounterValue: string
    onCellDown?: (x: number, y: number, state: number) => unknown
    onCellUp?: (x: number, y: number, state: number) => unknown
    onCellAux?: (x: number, y: number, state: number) => unknown
    onCellLeave?: (x: number, y: number, state: number) => unknown
    onFaceClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Board({
    height,
    width,
    grid,
    faceState,
    leftCounterValue,
    rightCounterValue,
    onCellDown,
    onCellUp,
    onCellAux,
    onCellLeave,
    onFaceClick,
}: BoardProps) {
    const cssVariables = React.useMemo(
        () =>
            ({
                '--grid-width': (width * CELL_SIZE_PX).toString() + 'px',
                '--grid-height': (height * CELL_SIZE_PX).toString() + 'px',
            }) as React.CSSProperties,
        [width, height]
    )

    return (
        <div
            style={cssVariables}
            className={twMerge(
                'grid',
                'grid-cols-[18px_var(--grid-width)_13.5px]',
                'grid-rows-[18px_48px_22.5px_var(--grid-height)_13.5px]'
            )}
            id="game-container"
        >
            <TopLeftBorder />
            <TopBorder />
            <TopRightBorder />

            <LeftBorder />
            <div className="bg-[silver] p-[4.5px]">
                <Counter value={leftCounterValue} className="float-left" />
                <Counter value={rightCounterValue} className="float-right" />
                <Face state={faceState} onClick={onFaceClick} />
            </div>
            <RightBorder />

            <MidLeftBorder />
            <MidBorder />
            <MidRightBorder />

            <LeftBorder />
            <div id="game-board" className="board-cells bg-[silver]">
                {grid.map((state, i) => {
                    const x = i % width
                    const y = Math.floor(i / width)
                    return (
                        <Cell
                            state={state}
                            key={`cell-${i}`}
                            className="float-left"
                            onPointerDown={(e) => {
                                if (e.button !== 2) {
                                    onCellDown?.(x, y, state)
                                }
                            }}
                            onPointerUp={(e) => {
                                if (e.button !== 2) {
                                    onCellUp?.(x, y, state)
                                }
                            }}
                            onPointerLeave={() => {
                                onCellLeave?.(x, y, state)
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                onCellAux?.(x, y, state)
                            }}
                        />
                    )
                })}
            </div>
            <RightBorder />

            <BottomLeftBorder />
            <BottomBorder />
            <BottomRightBorder />
        </div>
    )
}
