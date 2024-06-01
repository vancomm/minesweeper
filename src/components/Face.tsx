import { twJoin } from 'tailwind-merge'

const faceStates = ['smile', 'win', 'lost', 'click'] as const

export type FaceState = (typeof faceStates)[number]

type FaceProps = React.HTMLAttributes<HTMLButtonElement> & {
    state: FaceState
}

export default function Face({ state, className, style, ...props }: FaceProps) {
    return (
        <div id="face-button" className="face-wrapper mx-auto">
            <button
                id="face"
                style={{
                    width: 'calc(1.625 * var(--width))',
                    height: 'calc(1.625 * var(--height))',
                    ...style,
                }}
                className={twJoin(
                    'mx-auto block bg-full',
                    'active:bg-face-smile-down',
                    state === 'smile' && 'bg-face-smile',
                    state === 'click' && 'bg-face-click',
                    state === 'win' && 'bg-face-win',
                    state === 'lost' && 'bg-face-lost',
                    className
                )}
                data-state="smile"
                data-down="false"
                {...props}
            />
        </div>
    )
}
