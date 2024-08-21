import { twMerge } from 'tailwind-merge'

/*
 * Each item in the `grid' array is one of the following values:
 *
 * 	- 0 to 8 mean the square is open and has a surrounding mine
 * 	  count.
 *
 *  - -1 means the square is marked as a mine.
 *
 *  - -2 means the square is unknown.
 *
 * 	- -3 means the square is marked with a question mark
 * 	  (FIXME: do we even want to bother with this?).
 *
 * 	- 64 means the square has had a mine revealed when the game
 * 	  was lost.
 *
 * 	- 65 means the square had a mine revealed and this was the
 * 	  one the player hits.
 *
 * 	- 66 means the square has a crossed-out mine because the
 * 	  player had incorrectly marked it.
 */

const CELL_STATE_TO_BG: Map<number, string> = new Map([
    [-3, ''], // TODO question mark -- not implemented yet
    [-2, 'bg-cell-up'],
    [-1, 'bg-cell-flag'],
    [0, 'bg-cell-down'],
    [1, 'bg-cell-1'],
    [2, 'bg-cell-2'],
    [3, 'bg-cell-3'],
    [4, 'bg-cell-4'],
    [5, 'bg-cell-5'],
    [6, 'bg-cell-6'],
    [7, 'bg-cell-7'],
    [8, 'bg-cell-8'],
    [64, 'bg-cell-flag-mine'],
    [65, 'bg-cell-blast'],
    [66, 'bg-cell-false-mine'],
    [67, 'bg-cell-mine'],
])

export const CELL_SIZE_PX = 24

export type CellProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    state: number
}

export default function Cell({ state, style, className, ...props }: CellProps) {
    return (
        <button
            className={twMerge(
                'block h-[24px] w-[24px] bg-[size:100%]',
                CELL_STATE_TO_BG.get(state) ?? 'bg-cell-up',
                // 'active:data-[state=-2]:bg-cell-down',
                className
            )}
            data-state={state}
            {...props}
        />
    )
}
