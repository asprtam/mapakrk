import fs from 'fs';
/** @type {import('vite').UserConfig} */
export default {
    build: {
        sourcemap: true,
        emptyOutDir: false,
        cssMinify: false,
        outDir: "../../webserver/static/mapa",
        rollupOptions: {
            output: {
                dir: "../../webserver/static/mapa",
                entryFileNames: "[name].js",
                assetFileNames: "[name][extname]",
                chunkFileNames: "[name].js",
                manualChunks: undefined
            }
        },
        watch: {
            
        }
    },
    server: {
        port: 5174,
        host: true,
        allowedHosts: ["goblin.international"],
    }
}