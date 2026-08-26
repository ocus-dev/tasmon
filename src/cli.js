import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { openArchive } from "./asar.js";
import { BACKUP_KEY, DEFAULT_ENDPOINT, SAVE_KEY, evaluateRuntime, readLocalStorage } from "./cdp.js";
import { startConstellationViewer } from "./constellation.js";
import { runCraftController } from "./craft-controller.js";
import { startLiveDashboard } from "./live.js";
import { loadGameRuntime } from "./game-runtime.js";
import { resolvePartyAttack } from "./real-stats.js";
import { renderReport, writeReport } from "./report.js";
import { readSave, summarizeSave, validateSave } from "./save.js";
import { simulateKpm } from "./simulate-kpm.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultArchive = path.resolve(projectRoot, "..", "resources", "app.asar");

function usage() {
  console.log(`TASMON Analyzer

Usage:
  npm start -- list [pattern]
  npm start -- extract <archive-path> <output-path> [asar-path]
  npm start -- inspect-save <save-json-path>
  npm start -- party-attack <save-json-path>
  npm start -- simulate-kpm [save-json-path] [difficulty] [stage] [--live] [--target-kpm 600] [--party-attack N] [--attacks-per-sec N]
  npm start -- export-save <output-path> [port] [backup]
  npm start -- render-report <save-json-path> [output-path]
  npm start -- live [port] [cdp-port] [--host <address>] [--lan]
  npm start -- turbo [endpoint]
  npm start -- craft [max-runs] [cdp-port] [gear|charm|both] --confirm [--loop] [--min-atk-pct 0.9] [--min-skill-power 0.4] [--use-gotcha-tokens] [--store-locked-items]
  npm start -- constellation [port] [save-json-path]

Commands:
  list          List first-party source and data files in the game archive.
  extract       Extract one file from the archive without unpacking the archive.
  inspect-save  Validate and summarize an exported TASMON save JSON file.
  party-attack  Resolve actual party attack using the installed game data.
  simulate-kpm  Simulate the damage and speed required to reach a target kills/minute.
  export-save   Read the save from a local DevTools port into a project file.
  render-report Generate a standalone HTML attack calculation report.
  live          Start the read-only battle-rate dashboard (localhost by default).
  turbo         POST to the turbo endpoint every 10 seconds.
  craft         Automate the existing game craft controls after confirmation (gear, charm, or both).
  constellation Start the interactive read-only perk constellation viewer.
`);
}

function archivePath(args) {
  return args[0] && args[0].endsWith(".asar") ? path.resolve(args.shift()) : defaultArchive;
}

function listFiles(archive, pattern = "") {
  const matcher = pattern ? new RegExp(pattern, "i") : null;
  return archive
    .files()
    .map(({ path: filePath, entry }) => ({ filePath, entry }))
    .filter(({ filePath }) => !filePath.startsWith("/node_modules/"))
    .filter(({ filePath }) => !matcher || matcher.test(filePath))
    .sort((left, right) => left.filePath.localeCompare(right.filePath));
}

function runList(args) {
  const archive = openArchive(archivePath(args));
  try {
    for (const { filePath, entry } of listFiles(archive, args[0])) {
      console.log(`${filePath}\t${entry.size}`);
    }
  } finally {
    archive.close();
  }
}

async function runExtract(args) {
  const inputPath = args.shift();
  const outputPath = args.shift();
  if (!inputPath || !outputPath) {
    throw new Error("extract requires an archive path and an output path");
  }

  const archive = openArchive(archivePath(args));
  try {
    const contents = archive.readFile(inputPath);
    const destination = path.resolve(projectRoot, outputPath);
    const relative = path.relative(projectRoot, destination);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error("Output path must stay inside info_project");
    }
    const outputDirectory = path.dirname(destination);
    await fs.mkdir(outputDirectory, { recursive: true });
    await fs.writeFile(destination, contents);
    console.log(`Extracted ${inputPath} -> ${relative}`);
  } finally {
    archive.close();
  }
}

async function runInspectSave(args) {
  const savePath = args.shift();
  if (!savePath) throw new Error("inspect-save requires a JSON file path");
  const state = await readSave(path.resolve(savePath));
  const errors = validateSave(state);
  console.log(JSON.stringify({ valid: errors.length === 0, errors, summary: summarizeSave(state) }, null, 2));
  if (errors.length > 0) process.exitCode = 2;
}

async function runPartyAttack(args) {
  const savePath = args.shift();
  if (!savePath) throw new Error("party-attack requires a JSON file path");
  const state = await readSave(path.resolve(savePath));
  const errors = validateSave(state);
  if (errors.length > 0) throw new Error(`Invalid save: ${errors.join("; ")}`);
  const runtime = await loadGameRuntime(defaultArchive, path.join(projectRoot, ".runtime"));
  console.log(JSON.stringify({ party: resolvePartyAttack(state, runtime) }, null, 2));
}

async function runSimulateKpm(args) {
  const live = args.includes("--live");
  if (live) args.splice(args.indexOf("--live"), 1);
  const savePath = live ? null : args.shift();
  if (!savePath && !live) throw new Error("simulate-kpm requires a JSON file path or --live");
  const numberOption = (name, fallback) => {
    const index = args.indexOf(name);
    if (index === -1) return fallback;
    const value = Number(args[index + 1]);
    if (!Number.isFinite(value) || value < 0) throw new Error(`${name} requires a non-negative number`);
    return value;
  };
  const difficulty = Number(args.shift() ?? 1);
  const stage = Number(args.shift() ?? 9);
  if (!Number.isInteger(difficulty) || difficulty < 0 || !Number.isInteger(stage) || stage < 1 || stage > 100) {
    throw new Error("simulate-kpm requires difficulty >= 0 and stage between 1 and 100");
  }
  const state = live
    ? JSON.parse(await evaluateRuntime("JSON.stringify(window.__battleDebug?.()?.state)"))
    : await readSave(path.resolve(savePath));
  const errors = validateSave(state);
  if (errors.length > 0) throw new Error(`Invalid save: ${errors.join("; ")}`);
  const runtime = await loadGameRuntime(defaultArchive, path.join(projectRoot, ".runtime"));
  console.log(JSON.stringify(simulateKpm(state, runtime, {
    difficulty,
    stage,
    targetKpm: numberOption("--target-kpm", 600),
    partyAttack: numberOption("--party-attack", 0),
    attacksPerSecond: numberOption("--attacks-per-sec", 0),
    aoeDamage: numberOption("--aoe-damage", 0),
    aoeCooldown: numberOption("--aoe-cooldown", 0),
    liveStarvation: live,
  }), null, 2));
}

async function runExportSave(args) {
  const outputPath = args.shift();
  if (!outputPath) throw new Error("export-save requires an output path");
  const port = args.shift() ?? "9222";
  const key = args.shift() === "backup" ? BACKUP_KEY : SAVE_KEY;
  const endpoint = `${DEFAULT_ENDPOINT.replace(/:\d+$/, "")}:${port}`;
  const saveText = await readLocalStorage(key, endpoint);
  if (!saveText) throw new Error(`TASMON localStorage key was empty: ${key}`);
  const destination = path.resolve(projectRoot, outputPath);
  const relative = path.relative(projectRoot, destination);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Output path must stay inside info_project");
  }
  await fs.writeFile(destination, saveText, "utf8");
  console.log(`Exported ${key} -> ${relative}`);
}

async function runLive(args) {
  const port = Number(args.shift() ?? 4173);
  const cdpPort = args.shift() ?? "9222";
  const lan = args.includes("--lan");
  const hostIndex = args.indexOf("--host");
  const host = lan ? "0.0.0.0" : hostIndex === -1 ? "127.0.0.1" : String(args[hostIndex + 1] ?? "").trim();
  if (!host || host.startsWith("--")) throw new Error("--host requires an address");
  const runtime = await loadGameRuntime(defaultArchive, path.join(projectRoot, ".runtime"));
  const server = await startLiveDashboard({ host, port, endpoint: `http://127.0.0.1:${cdpPort}`, runtime });
  console.log(`Live dashboard -> http://${host === "0.0.0.0" ? "<this-pc-ip>" : host}:${port}`);
  await new Promise((resolve) => server.on("close", resolve));
}

async function runCraft(args) {
  const confirm = args.includes("--confirm");
  const loop = args.includes("--loop");
  const useGotchaTokens = args.includes("--use-gotcha-tokens");
  const storeLockedItems = args.includes("--store-locked-items");
  const valueOption = (name, fallback) => {
    const index = args.indexOf(name);
    if (index === -1) return fallback;
    const value = Number(args[index + 1]);
    if (!Number.isFinite(value) || value < 0) throw new Error(`${name} requires a non-negative number`);
    return value;
  };
  const minAtkPct = valueOption("--min-atk-pct", 0.90);
  const minSkillPower = valueOption("--min-skill-power", 0.40);
  const valueOptions = new Set(["--min-atk-pct", "--min-skill-power"]);
  const optionValues = new Set([...valueOptions].flatMap((name) => [name, args[args.indexOf(name) + 1]]));
  const positional = args.filter((arg, index) => !optionValues.has(arg) && !valueOptions.has(args[index - 1]) && !["--confirm", "--loop", "--use-gotcha-tokens", "--store-locked-items"].includes(arg));
  const maxRuns = Number(positional.shift() ?? 1);
  const cdpPort = positional.shift() ?? "9222";
  const mode = positional.shift() ?? "gear";
  const endpoint = `${DEFAULT_ENDPOINT.replace(/:\d+$/, "")}:${cdpPort}`;
  const result = await runCraftController({ endpoint, maxRuns, mode, confirm, loop, minAtkPct, minSkillPower, useGotchaTokens, storeLockedItems });
  console.log(JSON.stringify({ mode, maxRuns, loop, minAtkPct, minSkillPower, ...result }, null, 2));
}

async function runConstellation(args) {
  const port = Number(args.shift() ?? 4180);
  const savePath = path.resolve(projectRoot, args.shift() ?? "save.json");
  const server = await startConstellationViewer({ port, savePath });
  console.log(`Constellation viewer -> http://127.0.0.1:${port}`);
  await new Promise((resolve) => server.on("close", resolve));
}

async function runRenderReport(args) {
  const savePath = args.shift();
  if (!savePath) throw new Error("render-report requires a JSON file path");
  const outputPath = args.shift() ?? "report.html";
  const state = await readSave(path.resolve(savePath));
  const errors = validateSave(state);
  if (errors.length > 0) throw new Error(`Invalid save: ${errors.join("; ")}`);
  const runtime = await loadGameRuntime(defaultArchive, path.join(projectRoot, ".runtime"));
  const party = resolvePartyAttack(state, runtime);
  const destination = path.resolve(projectRoot, outputPath);
  const relative = path.relative(projectRoot, destination);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Output path must stay inside info_project");
  }
  await writeReport(destination, renderReport({ party }));
  console.log(`Rendered report -> ${relative}`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    usage();
    return;
  }

  if (command === "list") {
    runList(args);
    return;
  }

  if (command === "extract") {
    await runExtract(args);
    return;
  }

  if (command === "inspect-save") {
    await runInspectSave(args);
    return;
  }

  if (command === "party-attack") {
    await runPartyAttack(args);
    return;
  }
  if (command === "simulate-kpm") {
    await runSimulateKpm(args);
    return;
  }

  if (command === "export-save") {
    await runExportSave(args);
    return;
  }

  if (command === "render-report") {
    await runRenderReport(args);
    return;
  }

  if (command === "live") {
    await runLive(args);
    return;
  }

  if (command === "turbo") {
    await import("./turbo-loop.js");
    return;
  }

  if (command === "craft") {
    await runCraft(args);
    return;
  }

  if (command === "constellation") {
    await runConstellation(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
