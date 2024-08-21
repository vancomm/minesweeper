import { createLazyFileRoute } from '@tanstack/react-router'
import { HeadingProps, ParagraphProps } from '../types'
import { twMerge } from 'tailwind-merge'

export const Route = createLazyFileRoute('/about')({
    component: About,
})

const P = ({ className, ...props }: ParagraphProps) => (
    <p className={twMerge('my-2 first:mt-0 last:mb-0', className)} {...props} />
)

const H2 = ({ className, ...props }: HeadingProps) => (
    <h2
        className={twMerge('my-3 font-bold first:mt-0 last:mb-0', className)}
        {...props}
    />
)

function About() {
    return (
        <div className="max-w-lg p-2 md:pr-32">
            <div>
                <P>Yet another implementation of a classic game.</P>
                <H2>How to play</H2>
                <P>
                    Open all squares without mines. Clicking on a mine ends the
                    game.
                </P>
                <P>
                    Each opened square displays a number that reflects how many
                    mines there are in 8 squares around it (its <i>neighbors</i>
                    ). Squares with no mined neighbors display no number.
                </P>
                <H2>Controls</H2>
                <P>
                    Use left click to <b>open</b> a closed square.
                </P>
                <P>
                    Use right click to place a <b>flag</b> on a closed square.
                </P>
                <P>
                    If the number of flags near an opened square equals the
                    number inside the square, you can open all neighboring
                    squares at once by clicking on the opened square (this is
                    called a{' '}
                    <b>
                        <i>chord</i>
                    </b>
                    ).
                </P>
            </div>
        </div>
    )
}
