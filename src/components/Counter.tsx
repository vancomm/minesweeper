import { twMerge } from 'tailwind-merge'

// FIXME counter borders are rendered wrong

const DIGIT_TO_BG: Map<string, string> = new Map([
    ['-', 'bg-counter-dash'],
    ['0', 'bg-counter-0'],
    ['1', 'bg-counter-1'],
    ['2', 'bg-counter-2'],
    ['3', 'bg-counter-3'],
    ['4', 'bg-counter-4'],
    ['5', 'bg-counter-5'],
    ['6', 'bg-counter-6'],
    ['7', 'bg-counter-7'],
    ['8', 'bg-counter-8'],
    ['9', 'bg-counter-9'],
])

type CounterDigitProps = {
    value: string
}

const CounterDigit = ({ value }: CounterDigitProps) => (
    <div
        className={twMerge('counter-digit', DIGIT_TO_BG.get(value))}
        data-value={value}
        style={{
            width: 'calc(0.8125 * var(--width))',
            height: 'calc(1.4375 * var(--height))',
            backgroundSize: '100% 100%',
        }}
    />
)

const CounterLeftBorder = () => (
    <div
        className="counter-left"
        style={{
            width: 'calc(0.0625 * var(--width))',
            height: 'calc(1.5625 * var(--height))',
            backgroundSize: '100% 100%',
        }}
    />
)

const CounterRightBorder = () => <div className="counter-right" />

export type CounterProps = React.HTMLAttributes<HTMLDivElement> & {
    value: string
}

export default function Counter({ value, className }: CounterProps) {
    return (
        <div
            className={twMerge(
                'flex items-center justify-center bg-border-bottom-counter-middle',
                className
            )}
            style={{
                backgroundSize: '100% 100%',
            }}
        >
            <CounterLeftBorder />
            {[...value].map((char, i) => (
                <CounterDigit key={`key-${i}`} value={char} />
            ))}
            <CounterRightBorder />
        </div>
    )
}
