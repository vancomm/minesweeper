import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    loader: () => {
        throw redirect({
            to: '/game/$session_id',
            params: { session_id: 'new' },
        })
    },
})
