import CircularProgress from '@mui/material/CircularProgress';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import TallLeaderboard from 'components/TallLeaderboard';
import WideLeaderboard from 'components/WideLeaderboard';

import { fetchHighscores } from 'api/game';

import { unwrap } from '@/lib';

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
});

type HiScoresProps = {
    numRows: number;
};

function HiScores({ numRows }: HiScoresProps) {
    const { data: records } = useSuspenseQuery({
        queryKey: ['records'],
        queryFn: () => fetchHighscores().then(unwrap),
        refetchOnMount: 'always',
    });

    return (
        <>
            <WideLeaderboard className="col-[content-start] hidden lg:block" records={records} numRows={numRows} />
            <TallLeaderboard className="col-[content-start] block lg:hidden" records={records} numRows={numRows} />
        </>
    );
}
