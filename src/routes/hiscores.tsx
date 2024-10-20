import CircularProgress from '@mui/material/CircularProgress'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { twJoin } from 'tailwind-merge'

import TallLeaderboard from 'components/TallLeaderboard'
import WideLeaderboard from 'components/WideLeaderboard'

import { fetchRecords } from 'api/game'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { throwIfError } from '@/monad'

export const Route = createFileRoute('/hiscores')({
    component: () => (
        <React.Suspense>
            <HiScores numRows={10} />
        </React.Suspense>
    ),
    pendingComponent: () => (
        <div className="grid h-64 w-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
})

type HiScoresProps = {
    numRows: number
}

function HiScores({ numRows }: HiScoresProps) {
    const { data: records } = useSuspenseQuery({
        queryKey: ['records'],
        queryFn: () => fetchRecords().then(throwIfError),
        refetchOnMount: 'always',
    })

    const { isLg } = useBreakpoint('lg')

    return (
        <>
            <WideLeaderboard
                className={twJoin(!isLg && 'hidden')}
                records={records}
                numRows={numRows}
            />
            <TallLeaderboard
                className={twJoin(isLg && 'hidden')}
                records={records}
                numRows={numRows}
            />
        </>
    )
}
