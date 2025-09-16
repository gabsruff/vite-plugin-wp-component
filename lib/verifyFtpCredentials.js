import { checkEnv } from "../utils/checkEnv.js";
import { setFtpCredentials } from "./setFtpCredentials.js";
import { deployFtp } from "./deployFtp.js";
import colors from "yoctocolors";

export async function verifyFtpCredentials(config) {
  const reqCredentials = [
    "FTP_HOST",
    "FTP_USER",
    "FTP_PASSWORD",
    "FTP_REMOTE_DIR",
  ];

  if (!checkEnv(reqCredentials)) {
    console.log(colors.red("❌ Missing credentials."));
    await setFtpCredentials(); // puede pedir datos al usuario y actualizar .env
  } else {
    console.log(colors.green("✔ Credentials found."));
    await deployFtp(config);
  }
}
