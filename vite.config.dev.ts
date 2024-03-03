import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import dotenv from 'dotenv'

dotenv.config()

const vitePort = parseInt(process.env.PORT || '3000') - 1
const apiPort = vitePort + 1
const hmrPort = vitePort + 2

const localPath = `http://localhost:${apiPort}`

export default defineConfig({
    root: './client',
    mode: 'development',
    server: {
        port: vitePort,
        strictPort: true,
        proxy: {
            '/me': localPath,
            '/auth': localPath,
            '/api': localPath,
        },
        hmr: {
            port: hmrPort,
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
