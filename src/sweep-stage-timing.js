import { evaluateRuntime } from "./cdp.js";

const dashboardEndpoint = "http://127.0.0.1:4173";
const gameEndpoint = "http://127.0.0.1:9222";
const delays = (process.env.STAGE_DELAYS_MS ?? "0,100,200,300,400,450,500,600,700")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value >= 0);
const settleMs = Number(process.env.STAGE_SETTLE_MS ?? 10_000);
const farmStageCount = Number(process.env.FARM_STAGE_COUNT ?? 4);
const farmClickGapMs = Number(process.env.FARM_CLICK_GAP_MS ?? 500);
const farmStageStride = Number(process.env.FARM_STAGE_STRIDE ?? 3);
const turboEnabled = process.env.TURBO_ENABLED !== "false";
const pollMs = 20;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function post(path, body) {
  const response = await fetch(`${dashboardEndpoint}${path}`, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function debugSnapshot() {
  return evaluateRuntime(`(() => {
    const debug = window.__battleDebug?.();
    if (!debug) return null;
    return {
      stage: debug.state?.stage ?? null,
      killsInStage: debug.state?.killsInStage ?? null,
      totalKills: debug.totalKills ?? debug.state?.totalKills ?? null,
      enemyGroup: Array.isArray(debug.enemyGroup) ? debug.enemyGroup.map((hp) => Math.round(hp)) : null,
    };
  })()`, gameEndpoint);
}

async function waitForRuntime() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const debug = await debugSnapshot();
    if (debug) return debug;
    await wait(100);
  }
  throw new Error("Game debug state did not become available after reset");
}

async function waitForEmptyWave() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const debug = await debugSnapshot();
    if (debug?.enemyGroup?.length && debug.enemyGroup.every((hp) => hp <= 0)) return debug;
    await wait(pollMs);
  }
  throw new Error("No empty wave observed within 30 seconds");
}

async function clickFarmThisStage(selectionIndex) {
  return evaluateRuntime(`(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const current = window.__battleDebug?.()?.state?.stage;
    const mapTab = document.querySelector('.bar-tab[data-win="map"]')
      ?? [...document.querySelectorAll('.bar-tab')].find((tab) => /map|地図/i.test(tab.textContent));
    let labels = [...document.querySelectorAll('.portal-node-label')];
    if (!labels.length && mapTab) {
      mapTab.click();
      await sleep(250);
      labels = [...document.querySelectorAll('.portal-node-label')];
    }
    const farmLabels = labels.filter((candidate) => {
      const node = candidate.previousElementSibling;
      return node && !node.classList.contains("locked") && !candidate.textContent.includes("[10-10]");
    });
    const label = farmLabels.length
      ? farmLabels[Math.abs(${selectionIndex} * ${farmStageStride}) % farmLabels.length]
      : null;
    const loopButton = label?.parentElement?.querySelector(".portal-loop");
    if (!loopButton) return { result: "missing-farm-control", current, labels: labels.map((item) => item.textContent.trim()) };
    const wasOn = loopButton.classList.contains("on");
    if (!wasOn) loopButton.click();
    return { result: wasOn ? "already-farming" : "farm-enabled", current, label: label.textContent.trim() };
  })()`, gameEndpoint, { awaitPromise: true });
}

async function readTrialState() {
  const [live, debug] = await Promise.all([
    fetch(`${dashboardEndpoint}/api/live`).then((response) => response.json()),
    debugSnapshot(),
  ]);
  return {
    kpm: live.rates?.killsPerMinute ?? null,
    totalKills: debug?.totalKills ?? live.latest?.totalKills ?? null,
    stage: debug?.stage ?? null,
    killsInStage: debug?.killsInStage ?? null,
    enemyAlive: debug?.enemyGroup?.filter((hp) => hp > 0).length ?? null,
    turboStack: live.turboStack ?? null,
  };
}

console.log(JSON.stringify({ protocol: "farm-loop-timing-sweep", delays, settleMs, farmStageCount, farmClickGapMs, farmStageStride, turboEnabled }));
await post("/api/turbo/stop").catch(() => null);

try {
  for (const delay of delays) {
    await post("/api/turbo/experiment/reset");
    const initial = await waitForRuntime();
    if (turboEnabled) {
      await post("/api/turbo/experimental", { enabled: true, verbose: false });
      await post("/api/turbo");
      await post("/api/turbo");
      await post("/api/turbo");
    }
    const before = await readTrialState();
    const emptyWave = await waitForEmptyWave();
    await wait(delay);
    const clickBaseline = await readTrialState();
    const clicks = [];
    for (let clickIndex = 0; clickIndex < farmStageCount; clickIndex += 1) {
      clicks.push(await clickFarmThisStage(clickIndex));
      if (clickIndex + 1 < farmStageCount) await wait(farmClickGapMs);
    }
    await wait(settleMs);
    const after = await readTrialState();
    console.log(JSON.stringify({ delay, initial, before, emptyWave, clickBaseline, clicks, after, killDelta: after.totalKills - clickBaseline.totalKills }));
    await post("/api/turbo/stop");
  }
} finally {
  await post("/api/turbo/stop").catch(() => null);
}