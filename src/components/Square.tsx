import { twMerge } from 'tailwind-merge'

import { SquareState } from '@/constants'

const SQUARE_STATE_TO_BG: Map<number, string> = new Map([
    [SquareState.Question, ''], // TODO
    [SquareState.Up, 'bg-cell-up'],
    [SquareState.Flag, 'bg-cell-flag'],
    [0, 'bg-cell-down'],
    [1, 'bg-cell-1'],
    [2, 'bg-cell-2'],
    [3, 'bg-cell-3'],
    [4, 'bg-cell-4'],
    [5, 'bg-cell-5'],
    [6, 'bg-cell-6'],
    [7, 'bg-cell-7'],
    [8, 'bg-cell-8'],
    [SquareState.FlagMine, 'bg-cell-flag-mine'],
    [SquareState.Blast, 'bg-cell-blast'],
    [SquareState.FalseMine, 'bg-cell-false-mine'],
    [SquareState.Mine, 'bg-cell-mine'],
])

export const SQUARE_SIZE_PX = 24

export type SquareProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    state?: number
}

export default function Square({
    state = SquareState.Up,
    style,
    className,
    ...props
}: SquareProps) {
    return (
        <button
            className={twMerge(
                'block h-[24px] w-[24px] bg-[size:100%]',
                SQUARE_STATE_TO_BG.get(state) ?? 'bg-cell-up',
                className
            )}
            data-state={state}
            {...props}
        />
    )
}
