import { input } from "@inquirer/prompts";
import { writeFile, readFile, cp } from "fs/promises";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import colors from "yoctocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function init() {
  //Handle Quit (Ctrl+C)
  process.on("uncaughtException", (error) => {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(colors.red("❌ Operation cancelled"));
    } else {
      // Rethrow unknown errors
      throw error;
    }
  });
  // Prompt user
  const name = await input({
    message: "Component's name:",
    default: "My component",
  });
  const description = await input({
    message: "Description:",
    default: "Component developed using Vite.",
  });
  const author = await input({ message: "Author:", default: "Awesome dev" });
  const suggestedSlug = name
    .toLowerCase()
    .split(" ")
    .filter((v, i) => i < 3)
    .join("-");

  const slug = await input({
    message: "Slug (no-spaces):",
    default: suggestedSlug,
  });

  // Create UID for the component
  const buffer = crypto.randomBytes(3);
  const hash = buffer.toString("hex");

  // Save config at component.config.json
  const configPath = join(process.cwd(), "component.config.json");
  const configData = {
    name: name,
    description: description,
    author: author,
    slug: slug,
    _hash: hash,
  };

  await writeFile(configPath, JSON.stringify(configData, null, 2));
  console.log(
    "Config saved in 'component.config.json'. You can modify the config file or run the command 'npm run config' to update."
  );
  console.log(
    `${colors.cyan("➜")} Creating other necessary files...
    )}`
  );
  //Crear .env
  const envTpl = await readFile(
    join(__dirname, "../templates/.env.tpl"),
    "utf-8"
  );
  const envFile = join(process.cwd(), `.env`);
  await writeFile(envFile, envTpl, "utf-8");

  console.log(colors.green("✔ Created:"), colors.yellow("'.env'"));
  //Copy Vite config and PostCss config
  await cp(
    join(__dirname, "../templates/vite.config.js"),
    join(process.cwd(), "vite.config.js")
  );

  console.log(colors.green("✔ Created:"), colors.yellow("'vite.config.js'"));
  await cp(
    join(__dirname, "../templates/postcss.config.js"),
    join(process.cwd(), "postcss.config.js")
  );
  console.log(colors.green("✔ Created:"), colors.yellow("'postcss.config.js'"));
  //Final log
  console.log(colors.green(`✔ Configuration complete`));
  console.log(colors.gray("➜ npm install"));
  console.log(colors.gray("➜ npm run dev"));
}
