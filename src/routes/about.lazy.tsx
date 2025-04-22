import { createLazyFileRoute } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Cell from 'components/Cell';

import { CellState } from '@/constants';

export const Route = createLazyFileRoute('/about')({
    component: About,
});

const P = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={twMerge('my-2 first:mt-0 last:mb-0', className)} {...props} />
);

const H2 = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={twMerge('my-3 font-bold first:mt-0 last:mb-0', className)} {...props} />
);

const DemoCell = ({ trueState }: { trueState: number }) => {
    const [pressed, setPressed] = React.useState(false);
    const [opened, setOpened] = React.useState(false);
    const [flagged, setFlagged] = React.useState(false);

    return (
        <Cell
            state={pressed ? CellState.Down : opened ? trueState : flagged ? CellState.Flag : CellState.Up}
            onPointerDown={(e) => {
                if (e.button !== 2 && !opened && !flagged) {
                    setPressed(true);
                }
            }}
            onPointerUp={(e) => {
                if (e.button !== 2 && !flagged) {
                    setPressed(false);
                    setOpened((o) => !o);
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                if (!opened) {
                    setFlagged((f) => !f);
                }
            }}
        />
    );
};

const ChordDemo = () => {
    const [pressed, setPressed] = React.useState(false);
    const [opened, setOpened] = React.useState(false);

    return (
        <div className="h-[72px] w-[72px]">
            <Cell
                state={CellState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={CellState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={pressed ? CellState.Down : opened ? 1 : CellState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={pressed ? CellState.Down : opened ? 2 : CellState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={3}
                className="float-left"
                onPointerDown={(e) => {
                    if (e.button !== 2 && !opened) {
                        setPressed(true);
                    }
                }}
                onPointerUp={(e) => {
                    if (e.button !== 2) {
                        setPressed(false);
                        setOpened((o) => !o);
                    }
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={pressed ? CellState.Down : opened ? 2 : CellState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={pressed ? CellState.Down : opened ? 0 : CellState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={pressed ? CellState.Down : opened ? 1 : CellState.Up}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
            <Cell
                state={CellState.Flag}
                className="float-left cursor-not-allowed"
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
};

function About() {
    return (
        <div className="max-w-lg p-2 md:pr-32">
            <div>
                <P>Yet another implementation of a classic game.</P>
                <H2>How to play</H2>
                <P>
                    Mines are scattered throughout the game board. Open all cells without mines. Clicking on a cell that
                    conceals a mine ends the game.
                </P>
                <P>
                    Each opened cell displays a number that reflects how many mines there are in 8 cells around it (its{' '}
                    <i>neighbors</i>
                    ). Cells with no mined neighbors display no number. First cell you click is guaranteed to be safe,
                    and so are its neighbors.
                </P>
                <H2>Controls</H2>
                <P>
                    Use left click to <b>open</b> a closed cell.
                </P>
                <DemoCell trueState={1} />
                <P>
                    Use right click to place a <b>flag</b> on a closed cell. Flags help you mark the cells you believe
                    to contain mines.
                </P>
                <DemoCell trueState={CellState.Blast} />
                <P>
                    If the number of flags near an opened cell equals the number inside the cell, you can open all
                    neighboring cells at once by clicking on the opened cell (this is called{' '}
                    <b>
                        <i>chording</i>
                    </b>
                    ).
                </P>
                <ChordDemo />
                <H2>Custom game settings</H2>
                <P>
                    In addition to the predefined game modes, you may provide your own width, height and mine count for
                    the game grid. The &quot;unique&quot; game setting determines if the generated grid allows for only
                    one possible solution. All predefined game modes offer only &quot;unique&quot; games.
                </P>
            </div>
        </div>
    );
}
