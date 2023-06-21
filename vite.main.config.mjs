import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config
export default defineConfig({
    publicDir: 'public',
    build: {
        ssr: 'electron/electron.js',
        rollupOptions: {
            input: ['electron/electron.js']
        }
    },
    plugins: [commonjs()]
});
