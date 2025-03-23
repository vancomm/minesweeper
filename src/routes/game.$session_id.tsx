import { createFileRoute } from '@tanstack/react-router';

import * as auth from '@/api/auth';
import { newGameApi } from '@/api/game';

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({ params: { session_id }, context: { game } }) => {
        if (session_id === 'new') {
            const res = await auth.status();
            if (res.isErr()) {
                console.error(res.error);
                throw new Error('api unavailable: ' + res.error.type);
            }
            return;
        }

        const gameRes = await newGameApi(session_id).fetchGame();

        if (gameRes.isErr()) {
            console.error(gameRes.error);
            switch (gameRes.error.type) {
                case 'FETCH_ERROR': {
                    throw gameRes.error.error;
                }
                case 'HTTP_ERROR': {
                    throw new Error(`HTTP request returned with status ${gameRes.error.status}`);
                }
                case 'VALIDATION_ERROR': {
                    throw new Error(gameRes.error.error.message);
                }
            }
        }

        game.init(gameRes.value);
    },
});
