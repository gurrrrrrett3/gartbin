import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
    root: './client',
    mode: 'development',
    server: {
        port: 3000,
        strictPort: true,
        proxy: {
           '/me': 'http://localhost:3001',
           '/auth': 'http://localhost:3001',
        },
        hmr: {
            port: 3002,
            protocol: 'ws',
            host: 'localhost',
        }   
    },
    build: {
        outDir: '../dist/client',
        emptyOutDir: true,
        assetsDir: 'static',
        rollupOptions: {
            treeshake: true,
            output: {
                chunkFileNames: 'static/[name].js',
                entryFileNames: 'static/[name].js',
                assetFileNames: 'static/[name][extname]',
            },
        }
    },
    plugins: [monacoEditorPlugin({
        languageWorkers: [
            'css',
            'html',
            'json',
            'typescript',
            'editorWorkerService',
        ]
    })],
})
