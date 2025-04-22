import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Fallback to Babel if SWC fails
            swcOptions: {
                jsc: {
                    externalHelpers: false,
                    target: 'es2020',
                },
            },
            // Use Babel as a fallback if SWC has issues
            babel: {
                plugins: [],
            },
            jsxImportSource: 'react',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        // Improve build process
        cssCodeSplit: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        'framer-motion',
                    ],
                    ui: [
                        '@radix-ui',
                        'class-variance-authority',
                        'clsx',
                        'tailwind-merge',
                    ],
                },
            },
        },
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    esbuild: {
        // Use esbuild as a fallback
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
        },
    },
}); 