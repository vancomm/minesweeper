import { twMerge } from 'tailwind-merge'

// FIXME counter borders are rendered wrong

type CounterDigit = {
    value: string
}

const CounterDigit = ({ value }: CounterDigit) => (
    <div
        className="counter-digit"
        data-value={value}
        style={{
            width: 'calc(0.8125 * var(--width))',
            height: 'calc(1.4375 * var(--height))',
            backgroundImage: `url('svg/counter/Winmine XP/counter${value}.svg')`,
            backgroundSize: '100% 100%',
        }}
    />
)

const CounterLeftBorder = () => (
    <div
        style={{
            width: 'calc(0.0625 * var(--width))',
            height: 'calc(1.5625 * var(--height))',
            backgroundImage: "url('svg/border/WinmineXP/counterleft.svg')",
            backgroundSize: '100% 100%',
        }}
        className="counter-left"
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
                'flex items-center justify-center bg-black',
                className
            )}
            style={{
                backgroundImage:
                    "url('../svg/border/WinmineXP/countermiddle.svg')",
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
