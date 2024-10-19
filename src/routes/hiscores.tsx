import CircularProgress from '@mui/material/CircularProgress'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { twJoin } from 'tailwind-merge'

import {
    MultiRankedLeaderboard,
    SingleRankedLeaderboard,
} from 'components/Leaderboard'

import { GameRecord } from 'api/entities'
import { getRecords } from 'api/game'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useSplitLeaderboardRows } from '@/hooks/useLeaderboardRows'
import { throwIfError } from '@/monad'

export const Route = createFileRoute('/hiscores')({
    component: HiScores,
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
})

type HiScoresProps = {
    numRows?: number
}

function HiScores({ numRows = 10 }: HiScoresProps) {
    const {
        data: records,
        error,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['records'],
        queryFn: () => getRecords().then(throwIfError),
        refetchOnMount: 'always',
    })

    const { isLg } = useBreakpoint('lg')

    if (isError) {
        throw error
    }

    if (isPending) {
        return null
    }

    return (
        <>
            <WideHiScores
                className={twJoin(!isLg && 'hidden')}
                records={records}
                numRows={numRows}
            />
            <TallHiScores
                className={twJoin(isLg && 'hidden')}
                records={records}
                numRows={numRows}
            />
        </>
    )
}

type HiScoreVariantProps = {
    records: GameRecord[]
    numRows: number
    className?: string
}

function WideHiScores({ records, numRows, className }: HiScoreVariantProps) {
    const leaderboards = useSplitLeaderboardRows(records, numRows)
    return (
        <div className={twJoin('wide-hs flex items-start gap-x-5', className)}>
            {leaderboards.map(({ title, rows, bottomRows }) => (
                <SingleRankedLeaderboard
                    key={`leaderboard-${title}`}
                    title={title}
                    rows={rows}
                    bottomRows={bottomRows}
                />
            ))}
        </div>
    )
}

function TallHiScores({ records, numRows, className }: HiScoreVariantProps) {
    const leaderboards = useSplitLeaderboardRows(records, numRows)
    return (
        <MultiRankedLeaderboard
            className={className}
            leaderboards={leaderboards}
        />
    )
}
