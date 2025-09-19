import { unlink } from "fs/promises";
import { join } from "path";

export async function cleanBundle() {
  const file = join(process.cwd(), "wp-plugin/index.html");
  try {
    await unlink(file);
    console.log(colors.green("✔ Bundle cleaned."));
  } catch (err) {
    console.error(`❌ Error cleaning bundle.`);
  }
}
