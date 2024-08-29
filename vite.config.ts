import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { readFileSync } from 'fs'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const pkg: unknown = JSON.parse(
        readFileSync(new URL('package.json', import.meta.url), 'utf-8')
    )
    if (
        !(
            typeof pkg === 'object' &&
            pkg !== null &&
            'version' in pkg &&
            typeof pkg.version === 'string'
        )
    ) {
        throw new Error('package.json does not provide version')
    }
    const version =
        mode === 'production' ? pkg.version : pkg.version + '-' + mode

    // create a .env.{mode}.local file for each mode you want to use
    const env = loadEnv(mode, process.cwd(), '')
    const baseUrl = env.BASE_URL || '/'
    const apiUrl = env.API_URL || 'http://localhost:8000/v1'
    const wsUrl = env.WS_URL || 'ws://localhost:8000/v1'
    const outDir = env.OUT_DIR || 'dist'

    console.log(`building version ${version} to be mounted at ${baseUrl}`)

    return {
        base: baseUrl,
        build: {
            outDir: outDir,
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    index: 'index.html',
                    '404': '404.html',
                },
            },
        },
        plugins: [tsconfigPaths(), react(), TanStackRouterVite()],
        define: {
            __BASE_URL__: JSON.stringify(baseUrl),
            __API_URL__: JSON.stringify(apiUrl),
            __WS_URL__: JSON.stringify(wsUrl),
            __APP_VERSION__: JSON.stringify(version),
        },
    }
})
