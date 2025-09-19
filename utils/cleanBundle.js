import { unlink } from "fs/promises";
import { join } from "path";
import colors from "yoctocolors";

export async function cleanBundle() {
  const file = join(process.cwd(), "wp-plugin/assets/index.html");
  try {
    await unlink(file);
    console.log(colors.green("✔ Bundle cleaned."));
  } catch (err) {
    console.error(colors.red(`❌ Error cleaning bundle.`), err);
  }
}
