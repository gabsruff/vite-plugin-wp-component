import { input } from "@inquirer/prompts";
import { promises as fsp } from "fs";
import crypto from "crypto";
import colors from "yoctocolors";

export async function updateConfig(config) {
  //Handle Quit (Ctrl+C)
  process.on("uncaughtException", (error) => {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(colors.red("❌ Operation cancelled"));
    } else {
      // Rethrow unknown errors
      throw error;
    }
  });
  // Prompt User
  const currentConfig = config;

  const name = await input({
    message: "Component's Name:",
    default: currentConfig.name,
  });
  const description = await input({
    message: "Description:",
    default: currentConfig.description,
  });
  const author = await input({
    message: "Author:",
    default: currentConfig.author,
  });
  const suggestedSlug = name
    .toLowerCase()
    .split(" ")
    .filter((v, i) => i < 3)
    .join("-");

  const slug = await input({
    message: "Slug (no-spaces):",
    default: suggestedSlug,
  });

  //Regenerate UID
  const buffer = crypto.randomBytes(3);
  const hash = buffer.toString("hex");
  //Save config
  const newConfig = {
    name: name,
    description: description,
    author: author,
    slug: slug,
    _hash: hash,
  };
  //Final log
  fsp.writeFile("component.config.json", JSON.stringify(newConfig, null, 2));
  console.log(
    colors.green("✔ Config saved at:"),
    colors.yellow("'component.config.json'")
  );
  console.log(
    colors.gray(
      `You can modify the config file or run the command ${colors.yellow(
        "'npm run config'"
      )} to update.`
    )
  );
  console.log(
    colors.gray(
      `Make sure to rebuild ${colors.yellow(
        "'npm run build'"
      )} before deploying your bundle.`
    )
  );
}
