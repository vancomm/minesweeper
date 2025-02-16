import React from 'react';
import { twMerge } from 'tailwind-merge';

export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
    return <input className={twMerge('border border-black p-1 py-0.5 dark:border-white', className)} {...props} />;
}
