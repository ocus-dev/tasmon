import test from "node:test";
import assert from "node:assert/strict";
import { craftableGroupCount, selectCraftGroup } from "../src/craft-controller.js";

function items(count, overrides = {}) {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    rarity: "immortal",
    lv: 80,
    part: "weapon",
    locked: false,
    stats: {},
    ...overrides,
  }));
}

test("immortal gear is craftable when it does not meet both preservation thresholds", () => {
  const groups = craftableGroupCount({ items: items(9), storage: [], equipped: [] }, "gear");

  assert.equal(groups[0].batches, 1);
});

test("items above both stat thresholds are preserved from crafting", () => {
  const protectedItems = items(9, { stats: { atkPct: 0.901, skillPower: 0.401 } });

  assert.deepEqual(craftableGroupCount({ items: protectedItems, storage: [], equipped: [] }, "gear"), []);
});

test("stat thresholds can be overridden", () => {
  const itemSet = items(9, { stats: { atkPct: 0.81, skillPower: 0.31 } });

  assert.deepEqual(
    craftableGroupCount({ items: itemSet, storage: [], equipped: [] }, "gear", {
      minAtkPct: 0.8,
      minSkillPower: 0.3,
    }),
    [],
  );
});

test("OR preserves a high-attack item without skill power", () => {
  const itemSet = items(9, { stats: { atkPct: 2.0, skillPower: 0 } });

  assert.deepEqual(
    craftableGroupCount({ items: itemSet, storage: [], equipped: [] }, "gear", { skillOperator: "OR" }),
    [],
  );
});

test("HP can be enabled as a preservation trait", () => {
  const itemSet = items(9, { stats: { atkPct: 0, skillPower: 0, hpPct: 1.01 } });

  assert.deepEqual(
    craftableGroupCount({ items: itemSet, storage: [], equipped: [] }, "gear", {
      hpEnabled: true,
      atkOperator: "OR",
      hpOperator: "OR",
    }),
    [],
  );
});

test("base egg-drop jewelry is always preserved", () => {
  const jewelry = items(9, { part: "charm", baseStats: ["dropBonus"] });

  assert.deepEqual(craftableGroupCount({ items: jewelry, storage: [], equipped: [] }, "charm"), []);
});

test("attack and skill rules can be disabled", () => {
  const itemSet = items(9, { stats: { atkPct: 0, skillPower: 0 } });

  const groups = craftableGroupCount({ items: itemSet, storage: [], equipped: [] }, "gear", { atkEnabled: false, skillEnabled: false });

  assert.equal(groups[0].batches, 1);
});

test("combined crafting gives charm groups a turn before returning to gear", () => {
  const groups = [
    { mode: "gear", batches: 4, count: 36 },
    { mode: "charm", batches: 1, count: 9 },
  ];

  assert.equal(selectCraftGroup(groups, "both", "charm").mode, "charm");
  assert.equal(selectCraftGroup(groups, "both", "gear").mode, "gear");
});