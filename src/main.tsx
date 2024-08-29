import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { useAuth } from '@/contexts/AuthContext'
import AuthProvider from '@/contexts/AuthProvider'
import '@/index.css'
import { routeTree } from '@/routeTree.gen'

const router = createRouter({
    basepath: __BASE_URL__,
    defaultNotFoundComponent: () => '404 Not Found',
    routeTree,
    context: {
        auth: undefined!,
    },
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{ auth }} />
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
    return (
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
