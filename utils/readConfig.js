import fs from "fs";
import { join } from "path";

export async function readConfig() {
  const configPath = join(process.cwd(), "component.config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.rootID = config.slug + "-" + config._hash;

  return config;
}
