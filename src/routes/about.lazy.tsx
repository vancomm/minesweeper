import { createLazyFileRoute } from '@tanstack/react-router'
import { HeadingProps, ParagraphProps } from '../types'
import { twMerge } from 'tailwind-merge'
import Square from '../components/Square'
import { SquareState } from '../constants'
import React from 'react'

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

const DemoSquare = ({ trueState }: { trueState: number }) => {
    const [pressed, setPressed] = React.useState(false)
    const [opened, setOpened] = React.useState(false)
    const [flagged, setFlagged] = React.useState(false)

    return (
        <Square
            state={
                pressed
                    ? SquareState.Down
                    : opened
                      ? trueState
                      : flagged
                        ? SquareState.Flag
                        : SquareState.Up
            }
            onPointerDown={(e) => {
                if (e.button !== 2 && !opened && !flagged) {
                    setPressed(true)
                }
            }}
            onPointerUp={(e) => {
                if (e.button !== 2 && !flagged) {
                    setPressed(false)
                    setOpened((o) => !o)
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                if (!opened) {
                    setFlagged((f) => !f)
                }
            }}
        />
    )
}

const ChordDemo = () => {
    const [pressed, setPressed] = React.useState(false)
    const [opened, setOpened] = React.useState(false)

    return (
        <div className="h-[72px] w-[72px]">
            <Square
                state={SquareState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={SquareState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={pressed ? SquareState.Down : opened ? 1 : SquareState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={pressed ? SquareState.Down : opened ? 2 : SquareState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={3}
                className="float-left"
                onPointerDown={(e) => {
                    if (e.button !== 2 && !opened) {
                        setPressed(true)
                    }
                }}
                onPointerUp={(e) => {
                    if (e.button !== 2) {
                        setPressed(false)
                        setOpened((o) => !o)
                    }
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={pressed ? SquareState.Down : opened ? 2 : SquareState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={pressed ? SquareState.Down : opened ? 0 : SquareState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={pressed ? SquareState.Down : opened ? 1 : SquareState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Square
                state={SquareState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    )
}

function About() {
    return (
        <div className="max-w-lg p-2 md:pr-32">
            <div>
                <P>Yet another implementation of a classic game.</P>
                <H2>How to play</H2>
                <P>
                    Mines are scattered throughout the game board. Open all
                    squares without mines. Clicking on a square that conceals a
                    mine ends the game.
                </P>
                <P>
                    Each opened square displays a number that reflects how many
                    mines there are in 8 squares around it (its <i>neighbors</i>
                    ). Squares with no mined neighbors display no number. First
                    square you click is guaranteed to be safe, and so are its
                    neighbors.
                </P>
                <H2>Controls</H2>
                <P>
                    Use left click to <b>open</b> a closed square.
                </P>
                <DemoSquare trueState={1} />
                <P>
                    Use right click to place a <b>flag</b> on a closed square.
                    Flags help you mark the squares you believe to contain
                    mines.
                </P>
                <DemoSquare trueState={SquareState.Blast} />
                <P>
                    If the number of flags near an opened square equals the
                    number inside the square, you can open all neighboring
                    squares at once by clicking on the opened square (this is
                    called{' '}
                    <b>
                        <i>chording</i>
                    </b>
                    ).
                </P>
                <ChordDemo />
                <H2>Custom game settings</H2>
                <P>
                    In addition to the predefined game modes, you may provide
                    your own width, height and mine count for the game grid. The
                    &quot;unique&quot; game setting determines if the generated
                    grid allows for only one possible solution. All predefined
                    game modes offer only &quot;unique&quot; games.
                </P>
            </div>
        </div>
    )
}
