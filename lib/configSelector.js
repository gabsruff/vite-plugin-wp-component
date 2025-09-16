import { select } from "@inquirer/prompts";
import { setFtpCredentials } from "./setFtpCredentials.js";
import { updateConfig } from "./updateConfig.js";

export async function configSelection(config) {
  //Handle Quit (Ctrl+C)
  process.on("uncaughtException", (error) => {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(colors.red("❌ Operation cancelled"));
    } else {
      // Rethrow unknown errors
      throw error;
    }
  });
  //Prompt user to select config
  const configChoice = await select({
    message: "Which config do you want to edit?",
    choices: [
      {
        name: "FTP Credentials.",
        value: "ftpCredentials",
        description: "Used for deploy via FTP: 'npm run deploy'.",
      },
      {
        name: "Component metadata.",
        value: "componentMeta",
        description:
          "Used during PHP file generation and once deployed it's displayed as plugin information in WordPress.",
      },
    ],
  });
  //Handle config selection
  switch (configChoice) {
    case "ftpCredentials":
      await setFtpCredentials();
      break;
    case "componentMeta":
      await updateConfig(config);
      break;
    default:
      console.log("Unknown choice.");
      break;
  }
}
