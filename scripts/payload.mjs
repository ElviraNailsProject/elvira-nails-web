import { spawn } from "node:child_process";
import path from "node:path";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });
const child = spawn(
  process.execPath,
  [path.resolve("node_modules/payload/bin.js"), ...process.argv.slice(2)],
  { stdio: "inherit", env: process.env },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
