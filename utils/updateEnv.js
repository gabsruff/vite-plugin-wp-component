import fs from "fs";
import path from "path";
import colors from "yoctocolors";

const envPath = path.join(process.cwd(), ".env");

export default function updateEnv(updates) {
  let lines = [];
  if (fs.existsSync(envPath)) {
    lines = fs.readFileSync(envPath, "utf8").split("\n");
  }

  const updatedKeys = new Set(Object.keys(updates));

  // Procesar cada línea
  const newLines = lines.map((line) => {
    const trimmed = line.trim();
    // Mantener comentarios y líneas vacías
    if (!trimmed || trimmed.startsWith("#")) return line;

    const [key] = line.split("=");
    if (updates[key] !== undefined) {
      updatedKeys.delete(key);
      return `${key}=${updates[key]}`;
    }
    return line;
  });

  // Agregar las variables nuevas que no existían
  updatedKeys.forEach((key) => {
    newLines.push(`${key}=${updates[key]}`);
  });

  fs.writeFileSync(envPath, newLines.join("\n"));
  console.log(colors.green("✔ Updated variables."));
}
