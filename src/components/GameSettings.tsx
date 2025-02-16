import { twMerge } from 'tailwind-merge';

import { GameParams } from 'api/entities';

import { FormProps } from '@/props';

type GameSettingsProps = Omit<FormProps, 'onSubmit'> & {
    defaultParams: GameParams;
    onSubmit: (update: GameParams) => unknown;
};

export default function GameSettings({ defaultParams, onSubmit, className, ...props }: GameSettingsProps) {
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
