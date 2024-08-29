import { twJoin, twMerge } from 'tailwind-merge'
import { UlProps } from '../types'

export type RadioItemProps<T> = {
    id: number | string
    label: string
    value: T
}

type RadioGroupProps<T> = Omit<UlProps, 'onChange'> & {
    items: RadioItemProps<T>[]
    activeId: number | string
    onChange?: (item: RadioItemProps<T>, index: number) => unknown
}

export default function RadioGroup<T>({
    items,
    activeId,
    className,
    onChange,
    ...props
}: RadioGroupProps<T>) {
    const radioGroupId = [...items.map(({ label }) => label)].sort().join('')

    return (
        <ul
            className={twJoin(
                'flex flex-wrap justify-center gap-x-4 gap-y-2 px-2',
                className
            )}
            {...props}
        >
            {items.map((item, i) => (
                <li
                    key={`${radioGroupId}-${item.id}`}
                    className={twMerge(
                        'inline-block cursor-pointer has-[:checked]:font-bold',
                        className
                    )}
                >
                    <label
                        htmlFor={`${radioGroupId}-${i}`}
                        className={'inline-block cursor-pointer'}
                    >
                        {item.label}
                    </label>
                    <input
                        type="radio"
                        className="hidden"
                        id={`${radioGroupId}-${i}`}
                        name={radioGroupId}
                        onChange={() => onChange?.(item, i)}
                        checked={activeId === item.id}
                    />
                </li>
            ))}
        </ul>
    )
}
