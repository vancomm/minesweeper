import { capitalize } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { GameRecord } from 'api/entities'
import * as api from 'api/game'

import HiScoreCategoryRows from '@/components/Leaderboard'
import { paramsToPresetName } from '@/constants'
import { throwIfError } from '@/monad'

export const Route = createFileRoute('/myscores')({
    beforeLoad: ({ context }) => {
        if (!context.auth.player) {
            throw redirect({ to: '/' })
        }
    },
    loader: async ({ context }) =>
        api
            .getRecords({ username: context.auth.player!.username })
            .then(throwIfError),
    component: MyScores,
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
})

function MyScores() {
    const records = Route.useLoaderData()

    const recordsPerPreset = records
        .map((r) => [r, paramsToPresetName(r)] as const)
        .reduce(
            (acc, [r, presetName]) =>
                presetName
                    ? {
                          ...acc,
                          [presetName]:
                              presetName in acc ? [...acc[presetName], r] : [r],
                      }
                    : acc,
            {} as Record<string, GameRecord[]>
        )

    return (
        <>
            <table className="border-separate border-spacing-0.5">
                <tbody>
                    {Object.entries(recordsPerPreset).map(
                        ([presetName, records]) =>
                            records.length > 0 && (
                                <>
                                    <tr className="border-b border-neutral-500">
                                        <td colSpan={4} className="font-bold">
                                            {capitalize(presetName)}
                                        </td>
                                    </tr>
                                    <HiScoreCategoryRows
                                        key={presetName}
                                        title={presetName}
                                        records={records}
                                    />
                                </>
                            )
                    )}
                </tbody>
            </table>
            {!records && (
                <div className="flex h-full items-center justify-center p-4 md:w-64">
                    <div className="italic">No records yet!</div>
                </div>
            )}
        </>
    )
}
