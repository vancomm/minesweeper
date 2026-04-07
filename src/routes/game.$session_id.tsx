import CircularProgress from '@mui/material/CircularProgress';
import { createFileRoute } from '@tanstack/react-router';

import ErrorComponent from 'components/ErrorComponent';

import * as auth from '@/api/auth';
import { FetchError, ValidatedFetchError } from '@/api/common';
import { newGameApi } from '@/api/game';

export const Route = createFileRoute('/game/$session_id')({
    pendingComponent: () => (
        <div className="col-[content-start] grid h-64 place-items-center">
            <CircularProgress color="inherit" />
        </div>
    ),
    errorComponent: ErrorComponent,
    loader: async ({ params: { session_id }, context: { game } }) => {
        if (session_id === 'new') {
            const res = await auth.status();
            if (res.isErr()) {
                handleFetchError(res.error);
            }
            return;
        }

        const gameRes = await newGameApi(session_id).fetchGame();

        if (gameRes.isErr()) {
            handleValidatedFetchError(gameRes.error);
        }

        game.init(gameRes.value);
    },
});

function handleFetchError(err: FetchError): never {
    console.error(err);
    switch (err.type) {
        case 'TIMEOUT_ERROR': {
            throw new Error('Server timed out');
        }
        case 'NETWORK_ERROR': {
            throw new Error('Network error. Check your connection');
        }
        case 'HTTP_ERROR': {
            throw new Error(`Server responded with status ${err.status}`);
        }
    }
}

function handleValidatedFetchError(err: ValidatedFetchError): never {
    if (err.type === 'VALIDATION_ERROR') {
        console.error(err);
        throw new Error(err.error.message);
    }
    return handleFetchError(err);
}
