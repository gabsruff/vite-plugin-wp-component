import { defineConfig } from "vite";
import crypto from "crypto";
import wpComponentPlugin from "vite-plugin-wp-component";
import { readConfig } from "vite-plugin-wp-component/utils/readConfig";

const config = await readConfig();

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      name: config.slug,
      fileName: "index.js",
      cssFilename: "style.css",
    },
    outDir: "wp-plugin/assets", // destino directo dentro del plugin
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "iife",
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: (name) => {
        const buffer = crypto.randomBytes(2);
        const hash = buffer.toString("hex");
        return `${config.slug}-${name}-${hash}`;
      },
    },
    postcss: "./postcss.config.js",
  },
  plugins: [wpComponentPlugin()],
});
