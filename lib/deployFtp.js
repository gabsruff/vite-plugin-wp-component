import ftp from "basic-ftp";
import { readdir } from "fs/promises";
import { join } from "path";
import { config } from "dotenv";
import colors from "yoctocolors";

config({ quiet: true });

const wpPluginPath = join(process.cwd(), "wp-plugin");

export async function deployFtp(config) {
  const empty = await isDirEmpty(wpPluginPath);
  if (empty) {
    console.log(
      colors.red("❌ Bundle not found at:"),
      colors.yellow("'wp-plugin'")
    );
    console.log(
      colors.cyan("➜"),
      ` Use ${colors.cyan("'npm run build'")} first.`
    );
    return;
  }
  console.log(colors.green("✔ Bundle found."));
  console.log(`${colors.cyan("➜")} Attempting to deploy...`);

  const client = new ftp.Client();

  try {
    console.log(`${colors.cyan("➜")} Stablishing connection...`);
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    console.log(`${colors.cyan("➜")} Uploading plugin...`);
    await client.ensureDir(`${process.env.FTP_REMOTE_DIR}/${config.slug}`);
    await client.clearWorkingDir();
    await client.uploadFromDir(wpPluginPath);

    console.log(colors.green("✔ Successfull deploy."));
  } catch (err) {
    console.error(
      colors.red("❌ Error trying to deploy."),
      "\n",
      "❌ Error:",
      err
    );
  }
  client.close();
}

async function isDirEmpty(path) {
  try {
    const files = await readdir(path);
    return files.length === 0; // true si está vacío
  } catch (err) {
    console.error(
      colors.red(`❌ Error reading directory: ${colors.yellow(path)}`),
      "\n",
      err
    );
    return true;
  }
}
