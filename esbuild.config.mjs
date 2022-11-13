import { build } from 'esbuild';

build({
    entryPoints: [
        './app.js',
    ],
    outdir: 'dist',
    bundle: true,
    splitting: true,
    format: 'esm',
    target:[
        'es2020',
        'chrome58'
    ],
    loader: {
        ".js": "jsx",
    },
    sourcemap: false,
   
}).then(() => console.log("⚡ Build complete! ⚡"))
    .catch(() => process.exit(1));