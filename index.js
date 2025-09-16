import { readConfig } from "./utils/readConfig.js";

export default async function wpComponentPlugin(options = {}) {
  const config = await readConfig();
  return {
    name: "vite-plugin-wp-component",

    // Hook de Vite (sirve en dev y build)
    config() {
      return {
        define: {
          __COMPONENT_CONFIG__: JSON.stringify(config),
        },
      };
    },
  };
}
