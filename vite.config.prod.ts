import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import path from 'path'

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
        publicPath: 'static/worker',
        customDistPath(root, buildOutDir, base) {
            return path.resolve(root, buildOutDir, "static/worker/")
        }
    })],
})
