import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
    root: './client',
    mode: 'production',
    build: {
        outDir: '../dist/client',
        emptyOutDir: true,
        minify: true,
        assetsDir: 'static',
        rollupOptions: {
            treeshake: true,
            output: {
                chunkFileNames: 'static/[hash].js',
                entryFileNames: 'static/[hash].js',
                assetFileNames: 'static/[hash][extname]',
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
