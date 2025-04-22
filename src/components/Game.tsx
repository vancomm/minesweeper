import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, capitalize } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import Board from 'components/Board';

import { GameParams } from '@/api/entities';
import { CellState, gamePresets } from '@/constants';
import { useGame } from '@/contexts/GameContext';

export default function Game() {
    const navigate = useNavigate();
    const game = useGame();

    const { width, height, mine_count } = game.params;

    const renderedGrid: number[] =
        game.session?.grid.slice() ?? Array.from({ length: width * height }, () => CellState.Up);

    game.pressedCells?.forEach((j) => {
        renderedGrid[j] = CellState.Down;
    });

    const minesLeftText = Math.min(mine_count - game.flags, 999)
        .toString()
        .padStart(3, '0');

    const timerText = Math.min(Math.floor(game.playtime_ms / 1000), 999)
        .toString()
        .padStart(3, '0');

    return (
        <div id="game-container" className="flex flex-col">
            <GamePresetForm
                className="mb-2 w-fit"
                activeGameParams={game.params}
                activePresetName={game.presetName}
                onSubmit={(presetName, gameParams) => game.reset({ navigate, presetName, gameParams })}
            />
            <Board
                width={width}
                height={height}
                grid={renderedGrid}
                leftCounterValue={minesLeftText}
                rightCounterValue={timerText}
                faceState={game.face}
                onCellDown={(x, y, prevState) => {
                    if (game.session?.ended_at === undefined) {
                        game.cellDown(x, y, prevState);
                    }
                }}
                onCellUp={(x, y, prevState) => {
                    if (game.session?.ended_at !== undefined) {
                        return;
                    }
                    game.cellUp(x, y, prevState);
                    game.openCell(x, y, navigate);
                }}
                onCellAux={(x, y, prevState) => {
                    if (game.over) {
                        return;
                    }
                    if (prevState !== CellState.Up && prevState !== CellState.Flag) {
                        return;
                    }
                    game.flagCell(x, y);
                }}
                onCellLeave={game.cellLeave}
                onFaceClick={() => game.reset({ navigate })}
            />
        </div>
    );
}

interface GamePresetFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
    activePresetName: string;
    activeGameParams: GameParams;
    onSubmit(presetName: string, gameParams: GameParams): unknown;
}

function GamePresetForm({ activePresetName, activeGameParams, onSubmit, className, ...props }: GamePresetFormProps) {
    const [gameParamsFormExpanded, setGameParamsFormExpanded] = React.useState(false);

    return (
        <>
            <div className={twMerge(className, 'select-none')} {...props}>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                    {Object.entries(gamePresets).map(([presetName, presetParams]) => (
                        <div
                            key={`preset-${presetName}`}
                            className="inline-block cursor-pointer has-[:checked]:font-bold"
                        >
                            <label htmlFor={`preset-${presetName}`} className={'inline-block cursor-pointer'}>
                                {capitalize(presetName)}
                            </label>
                            <input
                                type="radio"
                                className="hidden"
                                id={`preset-${presetName}`}
                                name={presetName}
                                checked={presetName === activePresetName}
                                onChange={() => {
                                    setGameParamsFormExpanded(false);
                                    onSubmit(presetName, presetParams);
                                }}
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => setGameParamsFormExpanded((e) => !e)}
                        className={twJoin(activePresetName === 'custom' && 'font-bold')}
                    >
                        <div className="inline">Custom</div>
                        <ExpandMoreIcon
                            sx={{
                                translate: '0 -.1rem',
                                transition: 'transform 300ms',
                            }}
                            className={twJoin(gameParamsFormExpanded && 'rotate-[180deg]')}
                        />
                    </button>
                </div>
                <Collapse in={gameParamsFormExpanded}>
                    <GameParamsForm
                        className="mt-2"
                        defaultParams={activeGameParams}
                        onSubmit={(gameParams) => {
                            setGameParamsFormExpanded(false);
                            onSubmit('custom', gameParams);
                        }}
                    />
                </Collapse>
            </div>
        </>
    );
}

interface GameSettingsProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    defaultParams: GameParams;
    onSubmit: (update: GameParams) => unknown;
}

function GameParamsForm({ defaultParams, onSubmit, className, ...props }: GameSettingsProps) {
    return (
        <form
            className={twMerge(
                'grid w-fit select-none grid-cols-2 gap-2 gap-y-3 border border-neutral-500 p-2',
                className
            )}
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const height = parseInt(formData.get('rows') as string);
                const width = parseInt(formData.get('cols') as string);
                const mine_count = parseInt(formData.get('mines') as string);
                const unique = formData.has('unique');
                onSubmit({ height, width, mine_count, unique });
            }}
            {...props}
        >
            <label htmlFor="rows" className="cursor-pointer">
                Rows
            </label>
            <input
                className="w-12"
                type="number"
                name="rows"
                id="rows"
                defaultValue={defaultParams.height}
                key={`rows-${defaultParams.height}`} // defaultValue doesn't reload without key
            />

            <label htmlFor="cols" className="cursor-pointer">
                Cols
            </label>
            <input
                className="w-12"
                type="number"
                name="cols"
                id="cols"
                defaultValue={defaultParams.width}
                key={`cols-${defaultParams.width}`}
            />

            <label htmlFor="mines" className="cursor-pointer">
                Mines
            </label>
            <input
                className="w-12"
                type="number"
                name="mines"
                id="mines"
                defaultValue={defaultParams.mine_count}
                key={`mines-${defaultParams.mine_count}`}
            />

            <div className="col-span-2 min-w-fit">
                <label htmlFor="unique" className="cursor-pointer">
                    <div className="mr-2 inline">Unique</div>
                    <input
                        type="checkbox"
                        name="unique"
                        id="unique"
                        defaultChecked={defaultParams.unique}
                        key={`unique-${defaultParams.unique}`}
                    />
                </label>
            </div>

            <button type="submit" className="col-span-2 underline">
                Update
            </button>
        </form>
    );
}
