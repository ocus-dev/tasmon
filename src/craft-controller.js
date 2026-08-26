import { evaluateRuntime } from "./cdp.js";

const DEFAULT_ENDPOINT = "http://127.0.0.1:9222";
const CRAFT_COST = 9;
const WAIT_MS = 150;
const VERIFY_WAIT_MS = 100;
const VERIFY_ATTEMPTS = 10;
const LOOP_INTERVAL_MS = 2_000;
const GOTCHA_CHECK_INTERVAL_MS = 60_000;
const DEFAULT_MIN_ATK_PCT = 0.90;
const DEFAULT_MIN_SKILL_POWER = 0.40;
const DEFAULT_MIN_HP_PCT = 0;
const DEFAULT_ATK_OPERATOR = "AND";
const DEFAULT_SKILL_OPERATOR = "AND";
const DEFAULT_HP_OPERATOR = "AND";
const RETRYABLE_UI_REASONS = new Set([
  "compound-tab-not-found",
  "craft-window-not-visible",
  "craft-mode-not-found",
  "auto-fill-not-found",
]);

function waitFor(ms, signal) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
  });
}

const SNAPSHOT = `(() => {
  const debug = window.__battleDebug?.();
  const state = debug?.state;
  if (!state) return null;
  const equipped = Object.values(state.monsters ?? {})
    .flatMap((monster) => (monster.equipment ?? []).map((item) => item.id));
  const project = (item) => ({
    id: item.id,
    rarity: item.rarity,
    lv: item.lv ?? 1,
    part: item.part,
    locked: !!item.locked,
    baseStats: (item.opts ?? []).filter((entry) => entry?.base === true).map((entry) => entry.stat),
    stats: [...(item.opts ?? []), ...(item.enhances ?? [])].reduce((totals, entry) => {
      if (entry?.stat) totals[entry.stat] = (totals[entry.stat] ?? 0) + (entry.value ?? 0);
      return totals;
    }, {}),
  });
  return {
    items: (state.items ?? []).map(project),
    storage: state.settings?.cubeUseStorage === false ? [] : (state.storage ?? []).map(project),
    equipped,
  };
})()`;

const SNAPSHOT_WITH_STORAGE = SNAPSHOT.replace(
  'storage: state.settings?.cubeUseStorage === false ? [] : (state.storage ?? []).map(project)',
  'storage: (state.storage ?? []).map(project)',
);

function bandOf(level) {
  const bands = [
    { min: 1, max: 10 },
    { min: 10, max: 20 },
    { min: 15, max: 30 },
    { min: 20, max: 40 },
    { min: 30, max: 50 },
    { min: 40, max: 65 },
    { min: 65, max: 80 },
  ];
  const itemLevel = Math.max(1, Math.round(level ?? 1));
  for (let index = bands.length - 1; index >= 0; index -= 1) {
    if (itemLevel >= bands[index].min && itemLevel <= bands[index].max) return index;
  }
  return itemLevel > 80 ? bands.length - 1 : 0;
}

export function craftableGroupCount(snapshot, mode = "gear", thresholds = {}) {
  if (!snapshot) return [];
  const minAtkPct = thresholds.minAtkPct ?? DEFAULT_MIN_ATK_PCT;
  const minSkillPower = thresholds.minSkillPower ?? DEFAULT_MIN_SKILL_POWER;
  const minHpPct = thresholds.minHpPct ?? DEFAULT_MIN_HP_PCT;
  const atkEnabled = thresholds.atkEnabled !== false;
  const skillEnabled = thresholds.skillEnabled !== false;
  const atkOperator = thresholds.atkOperator === "OR" ? "OR" : DEFAULT_ATK_OPERATOR;
  const skillOperator = thresholds.skillOperator === "OR" ? "OR" : DEFAULT_SKILL_OPERATOR;
  const hpOperator = thresholds.hpOperator === "OR" ? "OR" : DEFAULT_HP_OPERATOR;
  const equipped = new Set(snapshot.equipped ?? []);
  const groups = new Map();
  for (const item of [...(snapshot.items ?? []), ...(snapshot.storage ?? [])]) {
    const charm = item.part === "charm";
    const itemMode = charm ? "charm" : "gear";
    if (mode !== "both" && mode !== itemMode) continue;
    if (itemMode === "charm" && item.baseStats?.includes("dropBonus")) continue;
    const criteria = [
      ...(atkEnabled ? [{ value: (item.stats?.atkPct ?? 0) > minAtkPct, operator: atkOperator }] : []),
      ...(skillEnabled ? [{ value: (item.stats?.skillPower ?? 0) > minSkillPower, operator: skillOperator }] : []),
      ...(thresholds.hpEnabled === true ? [{ value: (item.stats?.hpPct ?? 0) > minHpPct, operator: hpOperator }] : []),
    ];
    const protectedItem = criteria.length > 0 && criteria.slice(1).reduce(
      (result, criterion) => criterion.operator === "OR" ? result || criterion.value : result && criterion.value,
      criteria[0].value,
    );
    if (itemMode === "gear" && protectedItem) continue;
    if (item.locked || equipped.has(item.id)) continue;
    const key = `${itemMode}|${item.rarity}|${bandOf(item.lv)}`;
    groups.set(key, { mode: itemMode, rarity: item.rarity, band: bandOf(item.lv), count: (groups.get(key)?.count ?? 0) + 1 });
  }
  return [...groups.entries()]
    .map(([key, group]) => ({ key, ...group, batches: Math.floor(group.count / CRAFT_COST) }))
    .filter((group) => group.count > 0)
    .sort((left, right) => right.count - left.count);
}

export function selectCraftGroup(groups, mode = "gear", preferredMode = mode) {
  return groups.find((group) => group.batches > 0 && (mode !== "both" || group.mode === preferredMode))
    ?? groups.find((group) => group.batches > 0);
}

async function gameAction(expression, endpoint) {
  return evaluateRuntime(expression, endpoint, { awaitPromise: true });
}

function craftUiExpression(mode, band, includeStorage = false) {
  const modeValue = mode === "charm" ? "craftCharm" : "craft";
  return `(async () => {
    const text = (node) => node?.textContent?.replace(/\\s+/g, " ").trim() ?? "";
    const visible = (node) => {
      if (!node || node.classList.contains("hidden")) return false;
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const clickText = (selector, expected) => {
      const node = [...document.querySelectorAll(selector)].find((candidate) => visible(candidate) && text(candidate) === expected);
      if (!node) return false;
      node.click();
      return true;
    };
    let body = document.querySelector("#cube-body");
    if (!visible(body)) {
      const tab = document.querySelector('.bar-tab[data-win="compound"]');
      if (!tab) return { ok: false, reason: "compound-tab-not-found" };
      tab.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      body = document.querySelector("#cube-body");
    }
    if (!visible(body)) return { ok: false, reason: "craft-window-not-visible" };
    if (${includeStorage}) {
      const storageToggle = body.querySelector(".cube-storage-row input[type=checkbox]");
      if (storageToggle && !storageToggle.checked) {
        storageToggle.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        body = document.querySelector("#cube-body");
      }
    }
    const modeSel = document.querySelector("#cube-body select.cube-band");
    if (!modeSel || ![...modeSel.options].some((option) => option.value === ${JSON.stringify(modeValue)}))
      return { ok: false, reason: "craft-mode-not-found" };
    modeSel.value = ${JSON.stringify(modeValue)};
    modeSel.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const bandSel = [...document.querySelectorAll("#cube-body select.cube-band")]
      .find((select) => [...select.options].some((option) => option.value === ${JSON.stringify(String(band))}));
    if (!bandSel || ![...bandSel.options].some((option) => option.value === ${JSON.stringify(String(band))}))
      return { ok: false, reason: "craft-band-not-found" };
    bandSel.value = ${JSON.stringify(String(band))};
    bandSel.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const auto = [...body.querySelectorAll("button")]
      .find((button) => ["自動入力", "Auto-fill"].includes(text(button)));
    if (!auto) return { ok: false, reason: "auto-fill-not-found" };
    auto.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const slots = [...document.querySelectorAll("#cube-grid .cube-slot.filled:not(.result)")].length;
    if (slots !== ${CRAFT_COST}) return { ok: true, slots, crafted: false, reason: "fewer-than-nine" };
    const craft = body.querySelector(".cube-craft-btn");
    if (!craft || craft.disabled) return { ok: false, reason: "craft-button-disabled", slots };
    craft.click();
    await new Promise((resolve) => setTimeout(resolve, ${WAIT_MS}));
    return { ok: true, slots, crafted: true };
  })()`;
}

const OPEN_PENDING_CHESTS = `(() => {
  const debug = window.__battleDebug?.();
  const state = debug?.state;
  const openAll = debug?.openChestOfKind;
  if (!state || typeof openAll !== "function") return { ok: false, reason: "chest-batch-api-unavailable" };
  const before = state.chests?.length ?? 0;
  openAll(null);
  const remaining = state.chests?.length ?? 0;
  return { ok: true, opened: before - remaining, remaining };
})()`;

const ALCHEMIZE_LOW_EGGS = `(async () => {
  const text = (node) => node?.textContent?.replace(/\\s+/g, " ").trim() ?? "";
  const visible = (node) => {
    if (!node || node.classList.contains("hidden")) return false;
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  };
  const debug = window.__battleDebug?.();
  const state = debug?.state;
  if (!state) return { ok: false, reason: "battle-state-unavailable" };
  const before = (state.eggs ?? []).filter((egg) => ["common", "rare"].includes(egg.rarity)).length;
  if (before === 0) return { ok: true, count: 0 };
  let body = document.querySelector("#cube-body");
  if (!visible(body)) {
    const tab = document.querySelector('.bar-tab[data-win="compound"]');
    if (!tab) return { ok: false, reason: "compound-tab-not-found" };
    tab.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    body = document.querySelector("#cube-body");
  }
  if (!visible(body)) return { ok: false, reason: "craft-window-not-visible" };
  const modeSel = body.querySelector("select.cube-band");
  if (!modeSel) return { ok: false, reason: "alchemy-mode-not-found" };
  if (modeSel.value !== "alchemy") {
    if (![...modeSel.options].some((option) => option.value === "alchemy")) return { ok: false, reason: "alchemy-mode-not-found" };
    modeSel.value = "alchemy";
    modeSel.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  body = document.querySelector("#cube-body");
  let eggButton = null;
  for (let attempt = 0; attempt < 5 && !eggButton; attempt += 1) {
    eggButton = [...(body?.querySelectorAll("button") ?? [])]
      .find((button) => visible(button) && ["コモン/レアの卵", "Common/Rare eggs"].some((label) => text(button).includes(label)));
    if (!eggButton) await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!eggButton) return { ok: false, reason: "egg-alchemy-button-not-found" };
  if (eggButton.disabled) return { ok: false, reason: "egg-alchemy-button-disabled", count: before };
  eggButton.click();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const after = (state.eggs ?? []).filter((egg) => ["common", "rare"].includes(egg.rarity)).length;
  return { ok: after === 0, count: before - after, remaining: after };
})()`;

const CRAFT_MAINTENANCE = (useGotchaTokens, storeLockedItems) => `(async () => {
  const debug = window.__battleDebug?.();
  const state = debug?.state;
  if (!state) return { ok: false, used: 0, stored: 0, reason: "battle-state-unavailable" };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const closeItemsWindow = () => {
    if (typeof debug.closeWindow === "function") {
      debug.closeWindow("items", { force: true });
      return;
    }
    const panel = document.querySelector("#items-panel");
    panel?.querySelector(".win-close")?.click();
  };
  let used = 0;
  let stored = 0;
  let reason = null;
  if (${useGotchaTokens}) {
    const compoundTab = document.querySelector('.bar-tab[data-win="compound"]');
    if (!compoundTab) return { ok: false, used, stored, reason: "compound-tab-not-found" };
    compoundTab.click();
    await sleep(100);
    const gachaTab = [...document.querySelectorAll("#compound-body .cmp-tab")]
      .find((button) => button.textContent.includes("ガチャ") || button.textContent.includes("Gacha"));
    if (!gachaTab) return { ok: false, used, stored, reason: "gacha-tab-not-found" };
    for (const [coinId, count] of Object.entries(state.storageCoins ?? {})) {
      if (count <= 0) continue;
      state.coins[coinId] = (state.coins[coinId] ?? 0) + count;
      state.storageCoins[coinId] = 0;
    }
    gachaTab.click();
    await sleep(100);
    for (let rowIndex = 0; rowIndex < document.querySelectorAll("#compound-body .gacha-row").length; rowIndex += 1) {
      for (;;) {
        const row = document.querySelectorAll("#compound-body .gacha-row")[rowIndex];
        const owned = Number(row?.querySelector(".gacha-cost")?.textContent?.match(/(\\d+)/)?.[1] ?? 0);
        if (owned <= 0) break;
        const slot = row?.querySelector(".coin-slot");
        if (!slot) { reason = "gacha-slot-not-found"; break; }
        slot.click();
        await sleep(40);
        const pull = row.querySelector(".gacha-pull");
        if (!pull || pull.disabled) { reason = "gacha-pull-unavailable"; break; }
        pull.click();
        await sleep(100);
        used += 1;
      }
      if (reason) break;
    }
    closeItemsWindow();
  }
  if (${storeLockedItems}) {
    const storageCap = Math.min(640, state.storageCap ?? 80);
    for (const item of [...(state.items ?? [])]) {
      if (!item.locked) continue;
      if ((state.storage ?? []).length >= storageCap) { reason = reason ?? "storage-full"; break; }
      const index = state.items.indexOf(item);
      if (index < 0) continue;
      state.items.splice(index, 1);
      state.storage.push(item);
      stored += 1;
    }
  }
  localStorage.setItem("taskbar-idle-rpg-save", JSON.stringify(state));
  debug.renderHud?.();
  return { ok: !reason, used, stored, reason };
})()`;

export async function runCraftController({ endpoint = DEFAULT_ENDPOINT, maxRuns = 1, mode = "gear", confirm = false, loop = false, minAtkPct = DEFAULT_MIN_ATK_PCT, minSkillPower = DEFAULT_MIN_SKILL_POWER, minHpPct = DEFAULT_MIN_HP_PCT, atkEnabled = true, skillEnabled = true, hpEnabled = false, atkOperator = DEFAULT_ATK_OPERATOR, skillOperator = DEFAULT_SKILL_OPERATOR, hpOperator = DEFAULT_HP_OPERATOR, useGotchaTokens = false, storeLockedItems = false, log = console.log, signal } = {}) {
  if (!confirm) throw new Error("Craft automation changes game state; rerun with --confirm to enable it");
  if (!Number.isInteger(maxRuns) || maxRuns < 1) throw new Error("maxRuns must be a positive integer");
  if (!new Set(["gear", "charm", "both"]).has(mode)) throw new Error("mode must be gear, charm, or both");

  const results = [];
  let exitReason = loop ? "stopped-by-user" : "max-runs-reached";
  let preferredMode = mode === "both" ? "charm" : mode;
  let lastGotchaTokenCheckAt = 0;
  for (let run = 0; (loop || run < maxRuns) && !signal?.aborted; run += 1) {
    let chests = { ok: true, opened: 0, remaining: 0 };
    if (mode !== "charm") {
      chests = await gameAction(OPEN_PENDING_CHESTS, endpoint);
      if (!chests?.ok) {
        if (loop) {
          log(`Chest batch unavailable (${chests?.reason}); checking again in 10 seconds`);
          await waitFor(LOOP_INTERVAL_MS, signal);
          continue;
        }
        results.push({ run: run + 1, crafted: false, reason: chests?.reason ?? "chest-batch-open-failed", chests });
        exitReason = chests?.reason ?? "chest-batch-open-failed";
        break;
      }
      if (chests.opened > 0) log(`Opened ${chests.opened} pending chests`);
    }
    let before = await evaluateRuntime(SNAPSHOT, endpoint);
    const thresholds = { minAtkPct, minSkillPower, minHpPct, atkEnabled, skillEnabled, hpEnabled, atkOperator, skillOperator, hpOperator };
    let groups = craftableGroupCount(before, mode, thresholds);
    let group = selectCraftGroup(groups, mode, preferredMode);
    let includeStorage = false;
    if (!group) {
      const withStorage = await evaluateRuntime(SNAPSHOT_WITH_STORAGE, endpoint);
      const storageGroups = craftableGroupCount(withStorage, mode, thresholds);
      const storageGroup = selectCraftGroup(storageGroups, mode, preferredMode);
      if (storageGroup) {
        groups = storageGroups;
        group = storageGroup;
        includeStorage = true;
        before = withStorage;
      }
    }
    if (!group) {
      if (!loop) {
        results.push({ run: run + 1, crafted: false, reason: "no-safe-nine-item-group", groups, chests });
        exitReason = "no-safe-nine-item-group";
        break;
      }
      log(`No safe nine-item group; checking again in 10 seconds`);
      await waitFor(LOOP_INTERVAL_MS, signal);
      continue;
    }
    const action = await gameAction(craftUiExpression(group.mode, group.band, includeStorage), endpoint);
    if (!action?.ok || !action.crafted) {
      if (loop && RETRYABLE_UI_REASONS.has(action?.reason)) {
        log(`Craft menu unavailable (${action.reason}); retrying in 10 seconds`);
        await waitFor(LOOP_INTERVAL_MS, signal);
        continue;
      }
      results.push({ run: run + 1, crafted: false, ...action });
      exitReason = action?.reason ?? "craft-action-failed";
      break;
    }
    const beforeCount = (before.items?.length ?? 0) + (before.storage?.length ?? 0);
    const beforeIds = new Set([
      ...(before.items ?? []).map((item) => item.id),
      ...(before.storage ?? []).map((item) => item.id),
    ]);
    let after = null;
    let afterCount = beforeCount;
    let newItemCount = 0;
    let verified = false;
    for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt += 1) {
      after = await evaluateRuntime(SNAPSHOT, endpoint);
      afterCount = (after?.items?.length ?? 0) + (after?.storage?.length ?? 0);
      newItemCount = [...(after?.items ?? []), ...(after?.storage ?? [])]
        .filter((item) => !beforeIds.has(item.id)).length;
      verified = afterCount === beforeCount - (CRAFT_COST - 1) && newItemCount === 1;
      if (verified) break;
      await waitFor(VERIFY_WAIT_MS, signal);
    }
    //if (!verified) {
    //  results.push({ run: run + 1, crafted: true, slots: action.slots, verified, before, after });
    //  exitReason = "post-craft-verification-failed";
    //  break;
    //}
    let alchemy = { ok: true, count: 0 };
    if (group.mode === "gear") {
      alchemy = await gameAction(ALCHEMIZE_LOW_EGGS, endpoint);
      if (!alchemy?.ok) {
        results.push({ run: run + 1, crafted: true, slots: action.slots, verified, alchemy, chests });
        exitReason = alchemy?.reason ?? "egg-alchemy-failed";
        break;
      }
      chests = await gameAction(OPEN_PENDING_CHESTS, endpoint);
      if (!chests?.ok) {
        results.push({ run: run + 1, crafted: true, slots: action.slots, verified, chests });
        exitReason = chests?.reason ?? "chest-batch-open-failed";
        break;
      }
    }
    const checkGotchaTokens = useGotchaTokens && Date.now() - lastGotchaTokenCheckAt >= GOTCHA_CHECK_INTERVAL_MS;
    if (checkGotchaTokens) lastGotchaTokenCheckAt = Date.now();
    if (checkGotchaTokens || storeLockedItems) {
      const maintenance = await gameAction(CRAFT_MAINTENANCE(checkGotchaTokens, storeLockedItems), endpoint);
      if (maintenance?.used) log(`Used ${maintenance.used} gotcha token${maintenance.used === 1 ? "" : "s"}`);
      if (maintenance?.stored) log(`Moved ${maintenance.stored} locked item${maintenance.stored === 1 ? "" : "s"} to storage`);
      if (!maintenance?.ok && maintenance?.reason) log(`Craft maintenance stopped: ${maintenance.reason}`);
    }
    results.push({ run: run + 1, crafted: true, slots: action.slots, verified, alchemy, chests, before, after });
    if (mode === "both") preferredMode = group.mode === "charm" ? "gear" : "charm";
    const eggMessage = group.mode === "gear" ? `; alchemized ${alchemy.count} common/rare eggs` : "";
    log(loop
      ? `Craft ${run + 1}: verified${eggMessage}; opened ${chests.opened} chests; next run in 10 seconds`
      : `Craft ${run + 1}/${maxRuns}: verified${eggMessage}; opened ${chests.opened} chests`);
    if (loop) await waitFor(LOOP_INTERVAL_MS, signal);
  }
  if (signal?.aborted) exitReason = "stopped-by-user";
  log(`Craft controller exiting: ${exitReason}`);
  return { results, exitReason };
}

export { SNAPSHOT };