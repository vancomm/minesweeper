import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import './index.css'
import AuthProvider from './contexts/AuthProvider'

// Create a new router instance
const router = createRouter({
    basepath: __BASE_URL__,
    routeTree,
    defaultNotFoundComponent: () => '404 Not Found',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </StrictMode>
    )
}
