import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { openArchive } from "./asar.js";

const RUNTIME_FILES = [
  "/src/game/content-pack.js",
  "/src/game/data.js",
  "/src/game/endgame.js",
  "/src/game/extra-difficulty.js",
  "/src/game/rng.js",
  "/src/game/trial.js",
  "/src/game/equipment.js",
  "/src/game/breeding.js",
];

export async function prepareGameRuntime(archivePath, runtimeRoot) {
  const archive = openArchive(archivePath);
  try {
    for (const archivePath of RUNTIME_FILES) {
      const destination = path.join(runtimeRoot, archivePath.slice(1));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, archive.readFile(archivePath));
    }
  } finally {
    archive.close();
  }
}

export async function loadGameRuntime(archivePath, runtimeRoot) {
  await prepareGameRuntime(archivePath, runtimeRoot);
  const gameRoot = path.join(runtimeRoot, "src", "game");
  const importModule = (name) => import(pathToFileURL(path.join(gameRoot, name)).href);
  const [data, equipment, breeding] = await Promise.all([
    importModule("data.js"),
    importModule("equipment.js"),
    importModule("breeding.js"),
  ]);
  return { data, equipment, breeding };
}
