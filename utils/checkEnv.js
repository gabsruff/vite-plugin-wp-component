import { config } from "dotenv";
import colors from "yoctocolors";

config({ quiet: true });

export function checkEnv(vars) {
  const missing = vars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.log(colors.red("❌ Environment variables missing:"));
    missing.forEach((v) => console.log(` - ${v}`));
    return false;
  } else {
    console.log(
      colors.green("✔ Environment variables found in"),
      colors.yellow("'.env'")
    );
    return true;
  }
}
