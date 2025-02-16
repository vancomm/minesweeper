import { twMerge } from 'tailwind-merge';

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
]);

type CounterDigitProps = {
    value: string;
};

const CounterDigit = ({ value }: CounterDigitProps) => (
    <div
        className={twMerge('counter-digit h-[34.5px] w-[19.5px] bg-[size:100%_100%]', DIGIT_TO_BG.get(value))}
        data-value={value}
    />
);

const CounterLeftBorder = () => (
    <div className="counter-left h-[37.5px] w-[1.5px] bg-border-counter-left bg-[size:100%_100%]" />
);

const CounterRightBorder = () => (
    <div className="counter-right h-[37.5px] w-[1.5px] bg-border-counter-right bg-[size:100%_100%]" />
);

export type CounterProps = React.HTMLAttributes<HTMLDivElement> & {
    value: string;
};

export default function Counter({ value, className }: CounterProps) {
    return (
        <div
            className={twMerge(
                'flex items-center justify-center bg-border-bottom-counter-middle bg-[size:100%_100%]',
                className
            )}
        >
            <CounterLeftBorder />
            {[...value].map((char, i) => (
                <CounterDigit key={`key-${i}`} value={char} />
            ))}
            <CounterRightBorder />
        </div>
    );
}
