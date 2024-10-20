import CircularProgress from '@mui/material/CircularProgress'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import React from 'react'
import { twJoin } from 'tailwind-merge'

import TallLeaderboard from 'components/TallLeaderboard'
import WideLeaderboard from 'components/WideLeaderboard'

import { fetchRecords } from 'api/game'

import { useAuth } from '@/contexts/AuthContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { throwIfError } from '@/monad'

export const Route = createFileRoute('/myscores')({
    beforeLoad: ({ context }) => {
        if (!context.auth.player) {
            throw redirect({ to: '/' })
        }
    },
    component: () => (
        <React.Suspense
            fallback={
                <div className="grid h-64 w-64 place-items-center">
                    <CircularProgress color="inherit" />
                </div>
            }
        >
            <MyScores numRows={10} />
        </React.Suspense>
    ),
})

type MyScoresProps = {
    numRows: number
}

function MyScores({ numRows }: MyScoresProps) {
    const auth = useAuth()
    const player = auth.player!

    const { data: records } = useSuspenseQuery({
        queryKey: ['records', player.username],
        queryFn: () =>
            fetchRecords({ username: player.username }).then(throwIfError),
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
