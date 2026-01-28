import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';

export default defineConfig({
    plugins: [react(), mkcert()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        https: true,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                taskpane: path.resolve(__dirname, 'src/outlook/dialog.html'),
                launchevent: path.resolve(__dirname, 'src/outlook/launchevent.html'),
            },
            output: {
                entryFileNames: 'outlook/[name].js',
                chunkFileNames: 'outlook/[name]-[hash].js',
                assetFileNames: 'outlook/[name].[ext]',
            },
        },
    },
});
