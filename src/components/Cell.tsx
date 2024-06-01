import { twMerge } from 'tailwind-merge'

const MINE_COUNT_BGS: Record<string, string> = {
    '1': 'bg-cell-1',
    '2': 'bg-cell-2',
    '3': 'bg-cell-3',
    '4': 'bg-cell-4',
    '5': 'bg-cell-5',
    '6': 'bg-cell-6',
    '7': 'bg-cell-7',
    '8': 'bg-cell-8',
}

const mineCountToBg = (mineCount: number): string =>
    mineCount === 0
        ? 'bg-cell-down'
        : MINE_COUNT_BGS[(mineCount % 9).toString()]

type CellState = {
    mined: boolean
    mineCount: number
    opened: boolean
    flagged: boolean
    gameOver: boolean
}

export type CellProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> &
    CellState

export default function Cell({
    mined,
    mineCount,
    opened,
    flagged,
    style,
    className,
    gameOver,
    ...props
}: CellProps) {
    return (
        <button
            style={{
                width: 'var(--width)',
                height: 'var(--height)',
                backgroundSize: '100%',
                ...style,
            }}
            disabled={opened}
            className={twMerge(
                'block bg-cell-up',
                !opened && 'active:bg-cell-down',
                !opened && (flagged ? 'bg-cell-flag' : 'bg-cell-up'),
                opened && (mined ? 'bg-cell-blast' : mineCountToBg(mineCount)),
                gameOver && flagged && !mined && 'bg-cell-false-mine',
                className
            )}
            {...props}
        />
    )
}
