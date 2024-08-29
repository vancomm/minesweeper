import { capitalize } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { createFileRoute } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

import { GameRecord, getRecords } from 'api/game'

import { GAME_PRESETS, paramsToSeed } from '@/constants'
import { HeadingProps } from '@/types'
import { raise } from '@/utils'

const H3 = ({ className, ...props }: HeadingProps) => (
    <h3 className={twMerge('font-bold', className)} {...props} />
)

export const Route = createFileRoute('/hiscores')({
    loader: async () =>
        getRecords({}).then(({ success, data }) =>
            success ? data : raise(new Error('api unavailable'))
        ),
    component: HiScores,
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
})

type HiScoreSectionProps = {
    title: string
    records: GameRecord[]
}

const HiScoreSection = ({ title, records }: HiScoreSectionProps) => (
    <>
        <tr className="border-b border-neutral-500">
            <td colSpan={2}>
                <H3>{title}</H3>
            </td>
        </tr>
        {records.map(({ username, playtime }, i) => (
            <tr key={`${title}-${i}`}>
                <td className="pr-1 text-end">{i + 1}.</td>
                <td className="pr-8">
                    {username ?? (
                        <div className="italic opacity-50">Anonymous</div>
                    )}
                </td>
                <td>{playtime.toFixed(3)}</td>
            </tr>
        ))}
    </>
)

function HiScores() {
    const records = Route.useLoaderData()

    const categories = Object.keys(GAME_PRESETS).reduce(
        (acc, k) => ({ ...acc, [k]: [] }),
        {} as Record<string, GameRecord[]>
    )
    const seedToCategory = Object.entries(GAME_PRESETS).reduce(
        (acc, [k, v]) => ({ ...acc, [paramsToSeed(v)]: k }),
        {} as Record<string, string>
    )
    records.forEach((record) => {
        const seed = paramsToSeed(record)
        if (seed in seedToCategory) {
            categories[seedToCategory[seed]].push(record)
        }
    })

    return (
        <>
            <table className="border-separate border-spacing-0.5">
                <tbody>
                    {Object.entries(categories).map(
                        ([key, records]) =>
                            records.length > 0 && (
                                <HiScoreSection
                                    key={key}
                                    title={capitalize(key)}
                                    records={records
                                        .slice()
                                        .sort(
                                            (
                                                { playtime: a },
                                                { playtime: b }
                                            ) => a - b
                                        )
                                        .slice(0, 10)}
                                />
                            )
                    )}
                </tbody>
            </table>
            {Object.values(categories).every((c) => !c.length) && (
                <div className="flex h-full w-64 items-center justify-center">
                    <div className="italic">No records yet!</div>
                </div>
            )}
        </>
    )
}
