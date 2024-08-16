import { twMerge } from 'tailwind-merge'
import Counter from './Counter'
import Face, { FaceState } from './Face'
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
} from './Borders'
import Cell, { CellProps } from './Cell'
import React from 'react'

export type Cell = Omit<CellProps, 'gameOver'>

export type BoardProps = {
    height: number
    width: number
    grid: number[]
    disabled?: boolean
    cellSizePx?: number
    onCellDown?: (x: number, y: number, state: number) => unknown
    onCellUp?: (x: number, y: number, state: number) => unknown
    onCellAux?: (x: number, y: number, state: number) => unknown
    cellProps?: Omit<CellProps, 'state'>
    leftCounterValue: string
    rightCounterValue: string
    faceState: FaceState
    onFaceClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Board({
    height,
    width,
    grid,
    disabled,
    cellSizePx = 24,
    cellProps,
    onCellAux,
    onCellDown,
    onCellUp,
    leftCounterValue,
    rightCounterValue,
    faceState,
    onFaceClick,
}: BoardProps) {
    const cssVariables = React.useMemo(() => {
        const widthPx = cellSizePx,
            heightPx = cellSizePx,
            xLeftBorder = 0.75 * widthPx,
            xInner = width * widthPx,
            xRightBorder = 0.5625 * widthPx,
            yTopBorder = 0.75 * heightPx,
            yMidBorder = 0.9375 * heightPx,
            yBottomBorder = 0.5625 * heightPx,
            yThin = 0.75 * heightPx,
            yPanel = 48,
            yInner = height * heightPx,
            yFull = yThin * 3 + yPanel + yInner,
            cssVariables = {
                '--width': widthPx.toString() + 'px',
                '--height': heightPx.toString() + 'px',
                '--rows': heightPx.toString() + 'px',
                '--cols': widthPx.toString() + 'px',
                '--x-left-border': xLeftBorder.toString() + 'px',
                '--x-inner': xInner.toString() + 'px',
                '--x-right-border': xRightBorder.toString() + 'px',
                '--y-top-border': yTopBorder.toString() + 'px',
                '--y-mid-border': yMidBorder.toString() + 'px',
                '--y-bottom-border': yBottomBorder.toString() + 'px',
                '--y-thin': yThin.toString() + 'px',
                '--y-panel': yPanel.toString() + 'px',
                '--y-inner': yInner.toString() + 'px',
                '--y-full': yFull.toString() + 'px',
            } as React.CSSProperties
        return cssVariables
    }, [cellSizePx, width, height])

    return (
        <div
            className={twMerge(
                'grid',
                'grid-cols-[var(--x-left-border)_var(--x-inner)_var(--x-right-border)]',
                'grid-rows-[var(--y-top-border)_var(--y-panel)_var(--y-mid-border)_var(--y-inner)_var(--y-bottom-border)]'
            )}
            style={cssVariables}
            id="game-container"
        >
            <TopLeftBorder />
            <TopBorder />
            <TopRightBorder />

            <LeftBorder />
            <div className="p-[4.5px] bg-[silver]">
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
                            disabled={disabled}
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
                            onContextMenu={(e) => {
                                e.preventDefault()
                                onCellAux?.(x, y, state)
                            }}
                            {...cellProps}
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
