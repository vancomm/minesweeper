import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import './index.css'
import AuthProvider from './contexts/AuthProvider'
import { useAuth } from './contexts/AuthContext'

// Create a new router instance
const router = createRouter({
    basepath: __BASE_URL__,
    defaultNotFoundComponent: () => '404 Not Found',
    routeTree,
    context: {
        auth: undefined!,
    },
})

// Register the router instance for type safety
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

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
