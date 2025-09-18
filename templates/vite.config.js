import { defineConfig } from "vite";
import wpComponentPlugin from "vite-plugin-wp-component";
import { readConfig } from "vite-plugin-wp-component/utils/readConfig.js";

//Fetch config content as __COMPONENT_CONFIG__ object is not available in this context.
const config = await readConfig();

export default defineConfig({
  //Sets relative routes. Used to import component media in production.
  base: "./",
  //Build values below should not be changed.
  //The generated PHP expects them as defined here.
  build: {
    outDir: "wp-plugin/assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "iife",
        entryFileNames: "index.js",
        //Defines the naming logic for CSS and other assets.
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
      //Translates our css-class to cssClass in javascript
      // e.g: element.className = styles.cssClass
      localsConvention: "camelCaseOnly",
      //This is the pattern to proccess the CSS classnames to avoid naming issues in production.
      generateScopedName: `[${config.slug}]__[local]___[hash:base64:5]`,
    },
    postcss: "./postcss.config.js",
  },
  //wpComponentPlugin makes __COMPONENT_CONFIG__ available.
  //__COMPONENT_CONFIG__ is an object containing 'component.config/json'.
  //__COMPONENT_CONFIG__.rootID should be used as the root element ID.
  plugins: [wpComponentPlugin()],
});
