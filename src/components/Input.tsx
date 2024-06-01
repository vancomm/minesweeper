import React from 'react'
import { twMerge } from 'tailwind-merge'

export type InputProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>

export default function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={twMerge(
                'rounded bg-white p-1 shadow-inner',
                'dark:bg-neutral-700',
                className
            )}
            {...props}
        />
    )
}
