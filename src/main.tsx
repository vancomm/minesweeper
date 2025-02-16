import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { useAuth } from '@/contexts/AuthContext';
import AuthProvider from '@/contexts/AuthProvider';
import GameProvider from '@/contexts/GameProvider';
import '@/index.css';
import { routeTree } from '@/routeTree.gen';

import { useGame } from './contexts/GameContext';

const router = createRouter({
    basepath: __BASE_URL__,
    defaultNotFoundComponent: () => '404 Not Found',
    routeTree,
    context: {
        auth: undefined!,
        game: undefined!,
    },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
    const auth = useAuth();
    const game = useGame();
    return <RouterProvider router={router} context={{ auth, game }} />;
}

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GameProvider>
                    <InnerApp />
                </GameProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
