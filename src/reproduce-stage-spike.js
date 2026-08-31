import { evaluateRuntime } from "./cdp.js";

const dashboardEndpoint = process.argv.find((value) => value.startsWith("http://127.0.0.1:4173"))
  ?? "http://127.0.0.1:4173";
const gameEndpoint = "http://127.0.0.1:9222";
const pulseCount = Number(process.env.TURBO_PULSES ?? 3);
const switchCount = Number(process.env.STAGE_SWITCHES ?? 3);
const sampleMs = Number(process.env.STAGE_SAMPLE_MS ?? 10_000);
const stageTargets = ["[10-7]", "[10-8]", "[10-9]"];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readLive() {
  const response = await fetch(`${dashboardEndpoint}/api/live`);
  if (!response.ok) throw new Error(`Live dashboard returned HTTP ${response.status}`);
  return response.json();
}

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
      playerHp: debug.playerHp ?? null,
      bossWave: Boolean(debug.bossWave),
      enemyGroup: Array.isArray(debug.enemyGroup) ? debug.enemyGroup.map((hp) => Math.round(hp)) : null,
      turbo: window.__turboRespawn ? {
        enabled: Boolean(window.__turboRespawn.enabled),
        stack: window.__turboRespawn.stack ?? 0,
        phase: window.__turboRespawn.phase ?? null,
      } : null,
    };
  })()`, gameEndpoint);
}

async function clickStage(labelText) {
  return evaluateRuntime(`(() => {
    const mapTab = document.querySelector('.bar-tab[data-win="map"]');
    let label = [...document.querySelectorAll('.portal-node-label')]
      .find((candidate) => candidate.textContent.includes(${JSON.stringify(labelText)}));
    if (!label && mapTab) {
      mapTab.click();
      label = [...document.querySelectorAll('.portal-node-label')]
        .find((candidate) => candidate.textContent.includes(${JSON.stringify(labelText)}));
    }
    const node = label?.previousElementSibling;
    if (!node) return { label: ${JSON.stringify(labelText)}, result: "missing-stage" };
    if (node.classList.contains("locked")) return { label: ${JSON.stringify(labelText)}, result: "locked-stage" };
    if (node.classList.contains("current")) return { label: ${JSON.stringify(labelText)}, result: "already-stage" };
    node.click();
    return { label: ${JSON.stringify(labelText)}, result: "stage-clicked" };
  })()`, gameEndpoint);
}

function compact(live, debug) {
  return {
    kpm: live.rates?.killsPerMinute ?? null,
    totalKills: live.latest?.totalKills ?? debug?.totalKills ?? null,
    stage: debug?.stage ?? live.latest?.stage ?? null,
    killsInStage: debug?.killsInStage ?? live.latest?.killsInStage ?? null,
    playerHp: debug?.playerHp ?? live.latest?.playerHp ?? null,
    enemyAlive: debug?.enemyGroup?.filter((hp) => hp > 0).length ?? null,
    turbo: live.turbo,
    turboStack: live.turboStack ?? debug?.turbo?.stack ?? null,
  };
}

console.log(JSON.stringify({ protocol: "stage-switch-spike", pulseCount, switchCount, sampleMs }));
await post("/api/turbo/stop").catch(() => null);
await post("/api/turbo/experimental", { enabled: true, verbose: false });
const activation = await post("/api/turbo");
for (let index = 1; index < pulseCount; index += 1) {
  await wait(250);
  await post("/api/turbo");
}

const before = compact(await readLive(), await debugSnapshot());
console.log(JSON.stringify({ step: "before-switches", state: before }));

for (let index = 0; index < switchCount; index += 1) {
  const target = stageTargets[index % stageTargets.length];
  const click = await clickStage(target);
  await wait(sampleMs);
  const live = await readLive();
  const debug = await debugSnapshot();
  console.log(JSON.stringify({ step: "after-switch", index: index + 1, click, state: compact(live, debug) }));
}

const stopped = await post("/api/turbo/stop");
console.log(JSON.stringify({ step: "complete", activation: { turbo: activation.turbo, stack: activation.stack }, stopped }));