import { createFileRoute } from '@tanstack/react-router';

import * as auth from '@/api/auth';
import { newGameApi } from '@/api/game';

export const Route = createFileRoute('/game/$session_id')({
    loader: async ({ params: { session_id }, context: { game } }) => {
        if (session_id === 'new') {
            const ok = await auth.status();
            if (!ok) {
                throw new Error('api unavailable');
            }
            return;
        }

        const { success, data: update, error } = await newGameApi(session_id).fetchGame();

        if (!success) {
            console.error(error);
            throw new Error('api unavailable');
        }

        game.init(update);
    },
});
