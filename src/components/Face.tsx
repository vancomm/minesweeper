import { twJoin } from 'tailwind-merge';

const faceStates = ['smile', 'win', 'lost', 'click'] as const;

export type FaceState = (typeof faceStates)[number];

interface FaceProps extends React.HTMLAttributes<HTMLButtonElement> {
    state: FaceState;
}

export default function Face({ state, className, style, ...props }: FaceProps) {
    return (
        <div id="face-button" className="face-wrapper mx-auto">
            <button
                id="face"
                className={twJoin(
                    'mx-auto block h-[39px] w-[39px] bg-full',
                    'active:bg-face-smile-down',
                    state === 'smile' && 'bg-face-smile',
                    state === 'click' && 'bg-face-click',
                    state === 'win' && 'bg-face-win',
                    state === 'lost' && 'bg-face-lost',
                    className
                )}
                data-state={state}
                {...props}
            />
        </div>
    );
}
