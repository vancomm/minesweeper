import { twMerge } from 'tailwind-merge'

import Input from './Input'
import { GameParams } from '../api/game'
import { DivProps, FormProps } from '../types'
import Button from './Button'

const SettingsField = ({ className, ...props }: DivProps) => (
    <div
        className={twMerge(
            'w-full flex items-center justify-between gap-x-4',
            className
        )}
        {...props}
    />
)

type GameSettingsProps = Omit<FormProps, 'onSubmit'> & {
    defaultParams: GameParams
    onSubmit: (update: GameParams) => unknown
}

export default function GameSettings({
    defaultParams,
    onSubmit,
    className,
    ...props
}: GameSettingsProps) {
    return (
        <form
            className={twMerge(
                'w-fit p-3 flex items-center gap-5 select-none',
                className
            )}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const height = parseInt(formData.get('rows') as string)
                const width = parseInt(formData.get('cols') as string)
                const mine_count = parseInt(formData.get('mines') as string)
                const unique = formData.has('unique')
                onSubmit({ height, width, mine_count, unique })
            }}
            {...props}
        >
            <SettingsField>
                <label htmlFor="rows" className="cursor-pointer">
                    Rows
                </label>
                <Input
                    className="w-16"
                    type="number"
                    name="rows"
                    id="rows"
                    defaultValue={defaultParams.height}
                    key={`rows-${defaultParams.height}`} // defaultValue doesn't reload without key
                />
            </SettingsField>
            <SettingsField>
                <label htmlFor="cols" className="cursor-pointer">
                    Cols
                </label>
                <Input
                    className="w-16"
                    type="number"
                    name="cols"
                    id="cols"
                    defaultValue={defaultParams.width}
                    key={`cols-${defaultParams.width}`}
                />
            </SettingsField>
            <SettingsField>
                <label htmlFor="mines" className="cursor-pointer">
                    Mines
                </label>
                <Input
                    className="w-16"
                    type="number"
                    name="mines"
                    id="mines"
                    defaultValue={defaultParams.mine_count}
                    key={`mines-${defaultParams.mine_count}`}
                />
            </SettingsField>
            <SettingsField className="pr-5 border-r border-neutral-300">
                <label htmlFor="unique" className="cursor-pointer">
                    Unique
                </label>
                <Input
                    // className="w-16"
                    type="checkbox"
                    name="unique"
                    id="unique"
                    defaultChecked={defaultParams.unique}
                    key={`unique-${defaultParams.unique}`}
                />
            </SettingsField>
            <Button type="submit" className="p-0 rounded-md hover:underline">
                Update
            </Button>
        </form>
    )
}
