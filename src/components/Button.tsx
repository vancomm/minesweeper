import { twMerge } from 'tailwind-merge';

export default function Button({
    className,
    ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button className={twMerge('rounded-full p-2', className)} {...props} />;
}
