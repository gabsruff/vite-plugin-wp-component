import { promises as fsp } from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readdir, unlink, mkdir } from "fs/promises";
import colors from "yoctocolors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(process.cwd(), "wp-plugin");

export async function buildPHP(config) {
  const phpTpl = await fsp.readFile(
    path.join(__dirname, "..", "templates/plugin.php.tpl"),
    "utf-8"
  );

  const slugLowDash = config.slug.replace("-", "_");

  const formattedName = config.name
    .split(" ")
    .map((word) => {
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  const phpContent = phpTpl
    .replace(/<%= componentName %>/g, formattedName)
    .replace(/<%= componentDescription %>/g, config.description)
    .replace(/<%= author %>/g, config.author)
    .replace(/<%= slug %>/g, config.slug)
    .replace(/<%= _slug %>/g, slugLowDash)
    .replace(/<%= rootID %>/g, config.rootID);

  await ensureDir(outDir);

  console.log(
    `${colors.cyan("➜")} Cleaning directory: ${colors.yellow("'wp-plugin'")}`
  );

  await deletePhpFiles(outDir);
  console.log(`${colors.green("✔")} Ready.`);

  console.log(
    `${colors.cyan("➜")} Regenerating PHP: ${colors.yellow(
      `'${config.slug}.php'`
    )}`
  );
  const phpConfigfile = join(outDir, `${config.slug}.php`);
  await fsp.writeFile(phpConfigfile, phpContent, "utf-8");
  console.log(`${colors.green("✔")} Ready.`);
  console.log(
    `${colors.cyan("➜")} Executing ${colors.yellow("'vite build'")}...`
  );
}

async function deletePhpFiles(dirPath) {
  try {
    const files = await readdir(dirPath);
    const phpFiles = files.filter((file) => file.endsWith(".php"));

    for (const file of phpFiles) {
      const filePath = join(dirPath, file);
      await unlink(filePath);
    }
  } catch (err) {
    console.error(
      `${colors.red("❌ Error cleaning directory: ")}${dirPath}`,
      err
    );
  }
}

async function ensureDir(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (err) {
    console.error(`${colors.red("Error ensuring directory:")} ${err.message}`);
  }
}

// Ejemplo de uso
