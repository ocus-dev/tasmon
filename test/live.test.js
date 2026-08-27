import assert from "node:assert/strict";
import test from "node:test";
import { autoOpenEggAllowed, createLiveMetrics, eggSlotIndex, pageSearchOrder, selectAwakeningRitual } from "../src/live.js";

test("egg auto-opening only allows Ultra through the selected maximum rarity", () => {
  assert.equal(autoOpenEggAllowed("common", "ultra"), false);
  assert.equal(autoOpenEggAllowed("rare", "ultra"), false);
  assert.equal(autoOpenEggAllowed("ultra", "ultra"), true);
  assert.equal(autoOpenEggAllowed("legend", "ultra"), false);
  assert.equal(autoOpenEggAllowed("legend", "legend"), true);
});

test("egg slot lookup preserves the state order used by the rendered grid", () => {
  const eggs = [{ id: "first", rarity: "ultra" }, { id: "second", rarity: "legend" }];

  assert.equal(eggSlotIndex(eggs, "first"), 0);
  assert.equal(eggSlotIndex(eggs, "second"), 1);
  assert.equal(eggSlotIndex(eggs, "missing"), -1);
});

test("awakening selects the highest non-six target and all zero-awakened fodder", () => {
  const monsters = [
    { id: "zero-a", awakening: 0 }, { id: "zero-b", awakening: 0 },
    { id: "tier-two", awakening: 2 }, { id: "tier-five", awakening: 5 }, { id: "six", awakening: 6 },
  ];
  const selection = selectAwakeningRitual(monsters);
  assert.equal(selection.target.id, "tier-five");
  assert.deepEqual(selection.foods.map((monster) => monster.id), ["zero-a", "zero-b"]);
});

test("awakening falls back to a random zero-awakened pair when no progressed target exists", () => {
  const monsters = [{ id: "zero-a", awakening: 0 }, { id: "zero-b", awakening: 0 }, { id: "zero-c", awakening: 0 }, { id: "six", awakening: 6 }];
  const selection = selectAwakeningRitual(monsters, () => 0.99);
  assert.equal(selection.target.id, "zero-c");
  assert.equal(selection.foods.length, 1);
  assert.notEqual(selection.foods[0].id, selection.target.id);
});

test("live metrics calculate gross gold, net gold, kills, and per-member XP rates", () => {
  const metrics = createLiveMetrics();
  metrics.update({
    timestamp: 1_000,
    gold: 100,
    totalKills: 10,
    stage: 1,
    difficulty: 0,
    killsInStage: 10,
    party: [{ id: "a", level: 1, exp: 0 }, { id: "b", level: 1, exp: 0 }],
  });
  metrics.update({
    timestamp: 31_000,
    gold: 1_300,
    totalKills: 16,
    stage: 1,
    difficulty: 0,
    killsInStage: 16,
    party: [{ id: "a", level: 1, exp: 120 }, { id: "b", level: 1, exp: 80 }],
  });

  const result = metrics.read();
  assert.equal(result.grossGold, 1200);
  assert.equal(result.netGold, 1200);
  assert.equal(result.elapsedMs, 30_000);
  assert.equal(result.experience, 200);
  assert.equal(result.kills, 6);
  assert.equal(result.rates.grossGoldPerMinute, 2400);
  assert.equal(result.rates.experiencePerMember.a, 240);
  assert.equal(result.rates.experiencePerMember.b, 160);
});

test("negative gold changes remain net-only", () => {
  const metrics = createLiveMetrics();
  metrics.update({ timestamp: 1_000, gold: 500, totalKills: 0, party: [] });
  metrics.update({ timestamp: 31_000, gold: 300, totalKills: 0, party: [] });

  const result = metrics.read();
  assert.equal(result.grossGold, 0);
  assert.equal(result.netGold, -200);
});

test("EMA rates decay after a burst and account for actual sample time", () => {
  const metrics = createLiveMetrics();
  metrics.update({ timestamp: 1_000, gold: 0, totalKills: 0, party: [] });
  metrics.update({ timestamp: 11_000, gold: 1_000, totalKills: 0, party: [] });
  const burstRate = metrics.read().rates.grossGoldPerMinute;
  metrics.update({ timestamp: 21_000, gold: 1_000, totalKills: 0, party: [] });

  const result = metrics.read();
  assert.equal(result.grossGold, 1000);
  assert.ok(result.rates.grossGoldPerMinute < burstRate);
  assert.equal(result.smoothing, "EMA");
  assert.equal(result.smoothingTimeConstantMs, 30_000);
});

test("estimated eggs per hour multiplies kill rate by global egg chance", () => {
  const metrics = createLiveMetrics();
  metrics.update({ timestamp: 1_000, gold: 0, totalKills: 0, party: [], eggDrop: { chance: 0.001 } });
  metrics.update({ timestamp: 61_000, gold: 0, totalKills: 60, party: [], eggDrop: { chance: 0.001 } });

  const result = metrics.read();
  assert.equal(result.rates.killsPerMinute, 60);
  assert.equal(result.rates.eggsPerHour, result.rates.killsPerMinute * 60 * 0.001);
});

test("estimated chest rate uses kill rate and chest chance", () => {
  const metrics = createLiveMetrics();
  metrics.update({ timestamp: 1_000, gold: 0, totalKills: 0, party: [], chestDrop: { base: 0.045, chance: 0.09 } });
  metrics.update({ timestamp: 61_000, gold: 0, totalKills: 60, party: [], chestDrop: { base: 0.045, chance: 0.09 } });

  const result = metrics.read();
  assert.ok(Math.abs(result.rates.estimatedChestsPerMinute - 5.4) < 1e-12);
});

test("live metrics keep historical drops out of the session egg rate", () => {
  const metrics = createLiveMetrics({ initialEggDrops: [{ timestamp: 0, rarity: "common" }] });
  metrics.update({
    timestamp: 1_000,
    gold: 0,
    totalKills: 0,
    party: [],
    eggInventory: [{ id: "egg-1", rarity: "common" }],
  });
  metrics.update({
    timestamp: 31_000,
    gold: 0,
    totalKills: 30,
    party: [],
    eggInventory: [
      { id: "egg-1", rarity: "common" },
      { id: "egg-2", rarity: "rare" },
    ],
  });

  const result = metrics.read();
  assert.deepEqual(result.eggDrops, [{ timestamp: 0, rarity: "common" }, { timestamp: 31_000, rarity: "rare" }]);
  assert.deepEqual(result.sessionEggDrops, [{ timestamp: 31_000, rarity: "rare" }]);
  assert.equal(result.rates.eggsPerHour, 0);
});

test("etching searches the current box page before later pages", () => {
  assert.deepEqual(pageSearchOrder(3, 0), [0, 1, 2]);
  assert.deepEqual(pageSearchOrder(3, 1), [1, 2, 0]);
  assert.deepEqual(pageSearchOrder(0), []);
});