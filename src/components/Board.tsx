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
    rows: number
    cols: number
    gameOver: boolean
    cells: Cell[]
    cellSizePx?: number
    onCellClick?: (index: number) => unknown
    onCellDown?: (index: number) => unknown
    onCellUp?: (index: number) => unknown
    leftCounterValue: string
    rightCounterValue: string
    faceState: FaceState
    onFaceClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Board({
    rows,
    cols,
    cells,
    cellSizePx = 24,
    onCellClick,
    onCellDown,
    onCellUp,
    leftCounterValue,
    rightCounterValue,
    faceState,
    onFaceClick,
    gameOver,
}: BoardProps) {
    const cssVariables = React.useMemo(() => {
        const width = cellSizePx,
            height = cellSizePx,
            xLeftBorder = 0.75 * width,
            xInner = cols * width,
            xRightBorder = 0.5625 * width,
            yTopBorder = 0.75 * height,
            yMidBorder = 0.9375 * height,
            yBottomBorder = 0.5625 * height,
            yThin = 0.75 * height,
            yPanel = 48,
            yInner = rows * height,
            yFull = yThin * 3 + yPanel + yInner,
            cssVariables = {
                '--width': width.toString() + 'px',
                '--height': height.toString() + 'px',
                '--rows': rows.toString() + 'px',
                '--cols': cols.toString() + 'px',
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
    }, [cellSizePx, cols, rows])

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
            <div id="game-board" className="board-cells">
                {cells.map(({ className, ...props }, i) => (
                    <Cell
                        key={`cell-${i}`}
                        gameOver={gameOver}
                        className={twMerge(className, 'float-left')}
                        onClick={() => {
                            console.log(`clicked cell ${i}`)
                            onCellClick?.(i)
                        }}
                        onPointerDown={() => onCellDown?.(i)}
                        onPointerUp={() => onCellUp?.(i)}
                        {...props}
                    />
                ))}
            </div>
            <RightBorder />

            <BottomLeftBorder />
            <BottomBorder />
            <BottomRightBorder />
        </div>
    )
}
