import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;

function start(label, executable, args, extraEnv = {}) {
  const child = spawn(executable, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
  });

  children.push(child);
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    const reason = signal ? `Signal ${signal}` : `Code ${code ?? 1}`;
    console.error(`${label} wurde beendet (${reason}).`);
    shutdown("SIGTERM");
    process.exitCode = code ?? 1;
  });
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start("Website", process.execPath, ["node_modules/next/dist/bin/next", "dev"]);
start(
  "Lokaler Inhaltsdienst",
  process.execPath,
  ["node_modules/decap-server/dist/index.js"],
  { PORT: "8082", BIND_HOST: "127.0.0.1", MODE: "git" },
);
