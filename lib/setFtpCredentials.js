import { input, password, confirm } from "@inquirer/prompts";
import updateEnv from "../utils/updateEnv.js";
import { deployFtp } from "./deployFtp.js";
import { config } from "dotenv";
import colors from "yoctocolors";

config({ quiet: true });

export async function setFtpCredentials() {
  //Handle Quit (Ctrl+C)
  process.on("uncaughtException", (error) => {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(colors.red("❌ Operation cancelled"));
    } else {
      // Rethrow unknown errors
      throw error;
    }
  });
  //Prompt user
  const saveDirExists = process.env.FTP_REMOTE_DIR.length > 2 ? true : false;
  const defaultDir = "public_html/wp-content/plugins";

  const FTP_HOST = await input({
    message: "FTP Host:",
    default: process.env.FTP_HOST,
  });
  const FTP_USER = await input({
    message: "FTP User:",
    default: process.env.FTP_USER,
  });
  const FTP_PASSWORD = await password({
    message: "FTP Password:",
    default: process.env.FTP_PASSWORD,
  });

  const FTP_REMOTE_DIR = await input({
    message: "FTP Remote directory:",
    default: saveDirExists ? process.env.FTP_REMOTE_DIR : defaultDir,
  });
  //Save credentials

  const answers = {
    FTP_HOST: FTP_HOST.trim(),
    FTP_USER: FTP_USER.trim(),
    FTP_PASSWORD: FTP_PASSWORD,
    FTP_REMOTE_DIR: FTP_REMOTE_DIR.trim(),
  };
  updateEnv(answers);
  console.log(colors.gray(`Credentials saved at ${colors.yellow("'.env'")}`));

  //Go to deploy
  await setDeployNow();
}

async function setDeployNow() {
  //Prompt user for deploy confirmation
  const deploy = await confirm({
    message: "Do you want to deploy now?",
    default: false,
  });
  //Handle prompt responsw
  if (deploy === true) {
    console.log(`${colors.cyan("➜")} Initializing deploy...`);
    await deployFtp();
  } else {
    console.log(
      colors.gray(
        `You can deploy later using ${colors.yellow("'npm run deploy'")}`
      )
    );
  }
}
