import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { readFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const pkg = JSON.parse(
        readFileSync(new URL('package.json', import.meta.url), 'utf-8')
    )

    const env = loadEnv(mode, process.cwd(), '')
    const api_url = env.API_URL || 'http://localhost:8000/v1'
    const ws_url = env.WS_URL || 'ws://localhost:8000/v1'
    return {
        base: '/minesweeper/',
        build: {
            rollupOptions: {
                input: {
                    index: 'index.html',
                    '404': '404.html',
                },
            },
        },
        plugins: [react(), TanStackRouterVite()],
        define: {
            __API_URL__: JSON.stringify(api_url),
            __WS_URL__: JSON.stringify(ws_url),
            __APP_VERSION__: JSON.stringify(pkg.version),
        },
    }
})
