import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function getPackageVersion(): string {
    const pkg: unknown = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf-8'));

    if (!(typeof pkg === 'object' && pkg !== null && 'version' in pkg && typeof pkg.version === 'string')) {
        throw new Error('package.json does not provide version');
    }

    return pkg.version;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const version = getPackageVersion();
    const subversion = mode === 'production' ? '' : '-' + mode;
    const buildVersion = version + subversion;

    // create a .env.{mode}.local file for each mode you want to use
    const env = loadEnv(mode, process.cwd(), '');
    const backendProxy = env.BACKEND_PROXY || 'http://localhost:8080';
    const baseUrl = env.BASE_URL || '/';
    const outDir = env.OUT_DIR || 'dist';
    const apiPrefix = env.API_URL || '/api';

    console.log(`building version ${buildVersion} to be mounted at ${baseUrl}`);

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
        server: {
            proxy: {
                [apiPrefix]: {
                    target: backendProxy,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(apiPrefix, ''),
                    ws: true,
                },
            },
        },
        plugins: [tsconfigPaths(), react(), TanStackRouterVite()],
        define: {
            __BASE_URL__: JSON.stringify(baseUrl),
            __API_PREFIX__: JSON.stringify(apiPrefix),
            __APP_VERSION__: JSON.stringify(buildVersion),
        },
    };
});
