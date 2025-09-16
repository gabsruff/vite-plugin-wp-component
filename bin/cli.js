#!/usr/bin/env node
import { program } from "commander";
import { readConfig } from "../utils/readConfig.js";
import { init } from "../lib/init.js";
import { configSelection } from "../lib/configSelector.js";
import { verifyFtpCredentials } from "../lib/verifyFtpCredentials.js";
import { buildPHP } from "../lib/buildPHP.js";

program
  .name("component")
  .description("CLI para manejar componentes con Vite + WordPress")
  .version("1.0.0");

program
  .command("init")
  .description("Inicia el plugin")
  .action(async () => {
    await init();
  });

program
  .command("config")
  .description("Muestra la config actual del componente")
  .action(async () => {
    const config = await readConfig();
    await configSelection(config);
  });

program
  .command("deploy")
  .description("Despliega al servidor")
  .action(async () => {
    const config = await readConfig();
    await verifyFtpCredentials(config);
  });

program
  .command("build")
  .description("Generates PHP file.")
  .action(async () => {
    const config = await readConfig();
    await buildPHP(config);
  });

program.parseAsync(process.argv);
