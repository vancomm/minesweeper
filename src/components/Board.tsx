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
import Square, { SQUARE_SIZE_PX, SquareProps } from './Square'
import React from 'react'

export type Cell = Omit<SquareProps, 'gameOver'>

export type BoardProps = {
    height: number
    width: number
    grid: number[]
    disabled?: boolean
    onSquareDown?: (x: number, y: number, state: number) => unknown
    onSquareUp?: (x: number, y: number, state: number) => unknown
    onSquareAux?: (x: number, y: number, state: number) => unknown
    leftCounterValue: string
    rightCounterValue: string
    faceState: FaceState
    onFaceClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Board({
    height,
    width,
    grid,
    onSquareDown,
    onSquareUp,
    onSquareAux,
    leftCounterValue,
    rightCounterValue,
    faceState,
    onFaceClick,
}: BoardProps) {
    const cssVariables = React.useMemo(
        () =>
            ({
                '--grid-width': (width * SQUARE_SIZE_PX).toString() + 'px',
                '--grid-height': (height * SQUARE_SIZE_PX).toString() + 'px',
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
                        <Square
                            state={state}
                            key={`square-${i}`}
                            className="float-left"
                            onPointerDown={(e) => {
                                if (e.button !== 2) {
                                    onSquareDown?.(x, y, state)
                                }
                            }}
                            onPointerUp={(e) => {
                                if (e.button !== 2) {
                                    onSquareUp?.(x, y, state)
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                onSquareAux?.(x, y, state)
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
