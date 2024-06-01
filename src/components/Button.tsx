import { twMerge } from 'tailwind-merge'

export default function Button({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button className={twMerge('p-2 rounded-full', className)} {...props} />
    )
}
