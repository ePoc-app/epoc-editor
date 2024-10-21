import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.ELECTRON=='true' ? './' : '.',
    plugins: [vue()],
    // test: {
    //     environment: 'happy-dom'
    // },
    server: {
        port: 8000,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname)
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler' // or "modern"
            }
        }
    }
});
