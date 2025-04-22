import { twMerge } from 'tailwind-merge';

import { CellState } from '@/constants';

export const CELL_SIZE_PX = 24;

const cellStateToBackground: ReadonlyMap<number, string> = new Map([
    [CellState.Question, ''], // TODO
    [CellState.Up, 'bg-cell-up'],
    [CellState.Flag, 'bg-cell-flag'],
    [0, 'bg-cell-down'],
    [1, 'bg-cell-1'],
    [2, 'bg-cell-2'],
    [3, 'bg-cell-3'],
    [4, 'bg-cell-4'],
    [5, 'bg-cell-5'],
    [6, 'bg-cell-6'],
    [7, 'bg-cell-7'],
    [8, 'bg-cell-8'],
    [9, 'bg-cell-9'],
    [CellState.FlagMine, 'bg-cell-flag-mine'],
    [CellState.Blast, 'bg-cell-blast'],
    [CellState.FalseMine, 'bg-cell-false-mine'],
    [CellState.Mine, 'bg-cell-mine'],
]);

export interface CellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    state?: number;
}

export default function Cell({ state = CellState.Up, className, ...props }: CellProps) {
    return (
        <button
            className={twMerge(
                'block h-[24px] w-[24px] bg-[size:100%]',
                cellStateToBackground.get(state) ?? 'bg-cell-up',
                className
            )}
            data-state={state}
            {...props}
        />
    );
}
