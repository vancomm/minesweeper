import { createLazyFileRoute, redirect } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
    loader: () => {
        throw redirect({
            to: '/game/$session_id',
            params: { session_id: 'new' },
        })
    },
})
