import { defineConfig } from "vite";
import wpComponentPlugin from "vite-plugin-wp-component";
import { readConfig } from "vite-plugin-wp-component/utils/readConfig.js";

const config = await readConfig();

export default defineConfig({
  base: "./",
  build: {
    outDir: "wp-plugin/assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "iife",
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (/\.css$/i.test(assetInfo.names)) {
            return "style.css";
          } else {
            return "media/[name]-[hash][extname]";
          }
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: `[${config.slug}]__[local]___[hash:base64:5]`,
    },
    postcss: "./postcss.config.js",
  },
  plugins: [wpComponentPlugin()],
});
