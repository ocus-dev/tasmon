import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateRuntime } from "./cdp.js";
import { AWAKENING, AWAKEN_MAX, DEX_BUFF_CAPS, EGG_DROP_CHANCE, JOBS, PERKS, RARITY_META, RARITY_ORDER, SKILLS, SPECIES, dexTotals, skillStars } from "../extracted/data.js";
import { resolvePartyAttack } from "./real-stats.js";
import { renderReport } from "./report.js";
import { runCraftController } from "./craft-controller.js";

const LEVEL_CAP = 100;
const EMA_TIME_CONSTANT_MS = 30_000;
const dashboardPath = fileURLToPath(new URL("../dashboard/index.html", import.meta.url));
const attackReportPath = fileURLToPath(new URL("../report.html", import.meta.url));
const wikiPath = fileURLToPath(new URL("../context.md", import.meta.url));
const eggLogPath = fileURLToPath(new URL("../.runtime/egg-drops.json", import.meta.url));
const FIRST_EGG_MULT = 25;
const ROOKIE_EGG_MULT = 3;
const POST_ROOKIE_EGG_MULT = 0.22;
const EQUIP_DROP_CHANCE = 0.045;
const NORMAL_CHEST_BONUS_MULT = 1.5;
const ROOKIE_CHEST_MULT = 1.5;
const STAGES_PER_DIFFICULTY = 10;
const KPM_HISTORY_LIMIT = 3601;
const RARE_CHOICE_BASE = 0.08;
const RARE_CHOICE_PER_STAR = 0.012;

export function selectAwakeningRitual(monsters, random = Math.random) {
  const eligible = monsters.filter((monster) => (monster.awakening ?? 0) < 6);
  const zeroAwakened = eligible.filter((monster) => (monster.awakening ?? 0) === 0);
  const progressed = eligible
    .filter((monster) => (monster.awakening ?? 0) > 0)
    .sort((left, right) => (right.awakening ?? 0) - (left.awakening ?? 0));
  if (progressed.length > 0 && zeroAwakened.length > 0) {
    return { target: progressed[0], foods: zeroAwakened };
  }
  if (progressed.length === 0 && zeroAwakened.length >= 2) {
    const targetIndex = Math.min(zeroAwakened.length - 1, Math.floor(random() * zeroAwakened.length));
    const target = zeroAwakened[targetIndex];
    const foodPool = zeroAwakened.filter((_, index) => index !== targetIndex);
    const food = foodPool[Math.min(foodPool.length - 1, Math.floor(random() * foodPool.length))];
    return { target, foods: [food] };
  }
  return null;
}

const percent = (value) => `${Math.round((value ?? 0) * 100)}%`;
function englishSkillDescription(skill) {
  const active = skill.active ?? {};
  const cooldown = `${skill.cooldown ?? 0}s`;
  const duration = active.duration ? ` for ${active.duration}s` : "";
  let text = `Every ${cooldown}: `;
  if (active.type === "buff") {
    if (active.kind === "haste") text += `party attack speed +${percent(active.power)}${duration}`;
    else if (active.kind === "critup") text += `party critical rate +${percent(active.power)}${duration}`;
    else text += `party attack +${percent(active.power)}${duration}`;
  } else if (active.type === "heal") text += `restore ${percent(active.power)} party HP`;
  else if (active.type === "guard") text += `create a ${percent(active.power)} max-HP barrier${duration}`;
  else text += `deal ${active.power ?? 0}x attack damage`;
  const passive = skill.passive ?? {};
  const passiveParts = [];
  if (passive.atkMult) passiveParts.push(`attack +${percent(passive.atkMult - 1)}`);
  if (passive.hpMult) passiveParts.push(`max HP +${percent(passive.hpMult - 1)}`);
  if (passive.dropBonus) passiveParts.push(`drop rate +${percent(passive.dropBonus)}`);
  if (passive.goldBonus) passiveParts.push(`gold +${percent(passive.goldBonus)}`);
  return passiveParts.length ? `${text} / ${passiveParts.join(", ")}` : text;
}

function fallbackEggDrop(state) {
  if (!state?.party || !state.monsters) return null;
  const members = state.party.map((id) => state.monsters[id]).filter(Boolean);
  const sum = (read) => members.reduce((total, member) => total + read(member), 0);
  const equipmentStat = (member, key) => (member.equipment ?? []).reduce(
    (total, item) => total
      + (item.stats?.[key] ?? item.stat?.[key] ?? 0)
      + (item.opts ?? []).filter((entry) => entry.stat === key).reduce((sum, entry) => sum + (entry.value ?? 0), 0)
      + (item.enhances ?? []).filter((entry) => entry?.stat === key).reduce((sum, entry) => sum + (entry.value ?? 0), 0),
    0,
  );
  const bonus = sum((member) => SKILLS[member.skillId]?.passive?.dropBonus ?? 0)
    + sum((member) => AWAKENING.dropBonus[member.awakening ?? 0] ?? 0)
    + sum((member) => equipmentStat(member, "dropBonus"))
    + sum((member) => (member.perks ?? []).reduce((total, entry) => total + (PERKS[entry.id]?.stat?.dropBonus ?? 0), 0))
    + sum((member) => JOBS[member.job]?.farm?.drop ?? 0)
    + Math.min(DEX_BUFF_CAPS.drop, dexTotals(state.dex).drop);
  const owned = (state.monsterCount ?? Object.keys(state.monsters).length) + (state.eggs ?? 0);
  const baseMult = owned < 3 ? (owned <= 1 ? FIRST_EGG_MULT : ROOKIE_EGG_MULT) : POST_ROOKIE_EGG_MULT;
  const base = EGG_DROP_CHANCE * baseMult;
  return { base, chance: base * (1 + Math.max(0, bonus)), bonus };
}

function skillRollReference() {
  const maxSkillStars = Math.max(...Object.keys(SKILLS).map((id) => skillStars(id)));
  return RARITY_ORDER.map((rarity) => {
    const stars = RARITY_META[rarity].stars;
    const rareMaxStars = Math.min(stars + 4, maxSkillStars);
    const rareMinStars = stars + 2;
    const standardMaxStars = Math.min(stars + 1, maxSkillStars);
    const standardMaxRarity = RARITY_ORDER.find((candidate) => RARITY_META[candidate].stars === standardMaxStars) ?? rarity;
    const rareMaxRarity = RARITY_ORDER.find((candidate) => RARITY_META[candidate].stars === rareMaxStars) ?? rarity;
    return {
      rarity,
      label: RARITY_META[rarity].label,
      stars,
      standardMaxStars,
      standardMaxRarity,
      rareRange: rareMinStars <= rareMaxStars ? `${rareMinStars}-${rareMaxStars}` : null,
      rareMaxStars,
      rareMaxRarity,
      rareMaxLabel: RARITY_META[rareMaxRarity].label,
      rareChoiceChance: RARE_CHOICE_BASE + stars * RARE_CHOICE_PER_STAR,
    };
  });
}

async function readEggLog() {
  try {
    const parsed = JSON.parse(await fs.readFile(eggLogPath, "utf8"));
    return Array.isArray(parsed) ? parsed.filter((drop) => drop && Number.isFinite(drop.timestamp) && typeof drop.rarity === "string") : [];
  } catch (error) {
    if (error.code !== "ENOENT") console.warn(`Unable to read egg log: ${error.message}`);
    return [];
  }
}

async function writeEggLog(drops) {
  await fs.mkdir(path.dirname(eggLogPath), { recursive: true });
  await fs.writeFile(eggLogPath, `${JSON.stringify(drops, null, 2)}\n`, "utf8");
}

function fallbackGlobalBonuses(state) {
  if (!state?.party || !state.monsters) return null;
  const members = state.party.map((id) => state.monsters[id]).filter(Boolean);
  const sum = (read) => members.reduce((total, member) => total + read(member), 0);
  const skillPassive = (member, key) => SKILLS[member.skillId]?.passive?.[key] ?? 0;
  const equipmentStat = (member, key) => (member.equipment ?? []).reduce(
    (total, item) => total
      + (item.stats?.[key] ?? item.stat?.[key] ?? 0)
      + (item.opts ?? []).filter((entry) => entry.stat === key).reduce((sum, entry) => sum + (entry.value ?? 0), 0),
    0,
  );
  const perkStat = (member, key) => (member.perks ?? []).reduce(
    (total, entry) => total + (PERKS[entry.id]?.stat?.[key] ?? 0),
    0,
  );
  const jobFarm = (member, key) => JOBS[member.job]?.farm?.[key] ?? 0;
  const dex = dexTotals(state.dex);
  const goldRaw = sum((member) => skillPassive(member, "goldBonus"))
    + sum((member) => AWAKENING.goldBonus[member.awakening ?? 0] ?? 0)
    + sum((member) => equipmentStat(member, "goldBonus"))
    + sum((member) => perkStat(member, "goldBonus"))
    + sum((member) => jobFarm(member, "gold"));
  const expRaw = sum((member) => equipmentStat(member, "expBonus"))
    + sum((member) => jobFarm(member, "exp"));
  return {
    gold: Math.min(AWAKENING.goldBonusCap, goldRaw) + dex.gold,
    exp: Math.min(1, expRaw) + dex.exp,
  };
}

function fallbackCapStats(state) {
  if (!state?.party || !state.monsters) return null;
  const members = state.party.map((id) => state.monsters[id]).filter(Boolean);
  const sum = (read) => members.reduce((total, member) => total + read(member), 0);
  const equipmentStat = (member, key) => (member.equipment ?? []).reduce(
    (total, item) => total
      + (item.stats?.[key] ?? item.stat?.[key] ?? 0)
      + (item.opts ?? []).filter((entry) => entry.stat === key).reduce((sum, entry) => sum + (entry.value ?? 0), 0),
    0,
  );
  const perkStat = (member, key) => (member.perks ?? []).reduce(
    (total, entry) => total + (PERKS[entry.id]?.stat?.[key] ?? 0),
    0,
  );
  const jobStat = (member, key) => JOBS[member.job]?.stat?.[key] ?? 0;
  const jobFarm = (member, key) => JOBS[member.job]?.farm?.[key] ?? 0;
  const ivAverage = (key) => members.length
    ? members.reduce((total, member) => total + (member.iv?.[key] ?? 1), 0) / members.length
    : 1;
  const dex = dexTotals(state.dex);
  const goldRaw = sum((member) => SKILLS[member.skillId]?.passive?.goldBonus ?? 0)
    + sum((member) => AWAKENING.goldBonus[member.awakening ?? 0] ?? 0)
    + sum((member) => equipmentStat(member, "goldBonus"))
    + sum((member) => perkStat(member, "goldBonus"))
    + sum((member) => jobFarm(member, "gold"));
  const expRaw = sum((member) => equipmentStat(member, "expBonus")) + sum((member) => jobFarm(member, "exp"));
  const capped = (raw, cap, effective = Math.min(cap, raw)) => ({ raw, effective, cap, excess: Math.max(0, raw - cap) });
  return {
    gold: capped(goldRaw, AWAKENING.goldBonusCap, Math.min(AWAKENING.goldBonusCap, goldRaw) + dex.gold),
    exp: capped(expRaw, 1, Math.min(1, expRaw) + dex.exp),
    attackSpeed: capped(
      sum((member) => equipmentStat(member, "atkSpeed") + perkStat(member, "atkSpeed") + jobStat(member, "atkSpeed")),
      0.6,
    ),
    critRate: capped(
      (0.05 + sum((member) => equipmentStat(member, "critRate") + perkStat(member, "critRate") + jobStat(member, "critRate"))) * ivAverage("crit"),
      0.5,
    ),
    critDamage: capped(1.5 + sum((member) => equipmentStat(member, "critDmg") + perkStat(member, "critDmg")), 3),
    cdr: capped(sum((member) => equipmentStat(member, "cdr") + perkStat(member, "cdr") + jobStat(member, "cdr")), 0.5),
    defenseCut: capped(
      sum((member) => equipmentStat(member, "defPct")) * ivAverage("def")
        + sum((member) => perkStat(member, "defCut") + jobStat(member, "defCut")),
      0.5,
    ),
    bossDamage: capped(sum((member) => equipmentStat(member, "bossDmg")), 1),
    lifesteal: capped(sum((member) => equipmentStat(member, "lifesteal")), 0.25),
  };
}

function expToNext(level) {
  if (level < 30) return Math.round(40 * Math.pow(1.19, level - 1));
  const at30 = 40 * Math.pow(1.19, 29);
  if (level < 60) return Math.round(at30 * Math.pow(1.202, level - 30));
  const at60 = at30 * Math.pow(1.202, 30);
  if (level < 80) return Math.round(at60 * Math.pow(1.09, level - 60));
  const at80 = at60 * Math.pow(1.09, 20);
  return Math.round(at80 * Math.pow(1.042, level - 80));
}

function totalExpAt(level) {
  let total = 0;
  for (let current = 1; current < level; current++) total += expToNext(current);
  return total;
}

function projectExpression() {
  return `(() => {
    const expToNext = (level) => {
      if (level < 30) return Math.round(40 * Math.pow(1.19, level - 1));
      const at30 = 40 * Math.pow(1.19, 29);
      if (level < 60) return Math.round(at30 * Math.pow(1.202, level - 30));
      const at60 = at30 * Math.pow(1.202, 30);
      if (level < 80) return Math.round(at60 * Math.pow(1.09, level - 60));
      const at80 = at60 * Math.pow(1.09, 20);
      return Math.round(at80 * Math.pow(1.042, level - 80));
    };
    const debug = window.__battleDebug?.();
    const state = debug?.state;
    if (!debug || !state) return null;
    return {
      timestamp: Date.now(),
      gold: state.gold ?? 0,
      eggDrop: debug.eggDrop ? {
        chance: debug.eggDrop.chance ?? 0,
        bonus: debug.eggDrop.bonus ?? 0,
      } : null,
      rateState: {
        party: state.party ?? [],
        monsters: Object.fromEntries((state.party ?? []).map((id) => [id, state.monsters?.[id]]).filter(([, monster]) => monster)),
        monsterCount: Object.keys(state.monsters ?? {}).length,
        dex: state.dex ?? {},
        eggs: state.eggs?.length ?? 0,
      },
      eggInventory: (state.eggs ?? []).map((egg) => ({ id: egg.id, rarity: egg.rarity })),
      totalKills: state.totalKills ?? 0,
      chestBonus: (state.party ?? []).reduce((total, id) => {
        const monster = state.monsters?.[id];
        return total + (monster?.equipment ?? []).reduce((sum, item) => sum
          + (item.stats?.chestBonus ?? item.stat?.chestBonus ?? 0)
          + (item.opts ?? []).filter((entry) => entry.stat === "chestBonus")
            .reduce((optionSum, entry) => optionSum + (entry.value ?? 0), 0)
          + (item.enhances ?? []).filter((entry) => entry?.stat === "chestBonus")
            .reduce((enhanceSum, entry) => enhanceSum + (entry.value ?? 0), 0), 0);
      }, 0),
      chestDrop: {
        base: ${EQUIP_DROP_CHANCE}
          * (state.difficulty === 0 && (state.bossClearedD?.[0] ?? 0) < ${STAGES_PER_DIFFICULTY} ? ${NORMAL_CHEST_BONUS_MULT} : 1)
          * (Object.keys(state.monsters ?? {}).length + (state.eggs?.length ?? 0) < 3 ? ${ROOKIE_CHEST_MULT} : 1),
        chance: ${EQUIP_DROP_CHANCE}
          * (state.difficulty === 0 && (state.bossClearedD?.[0] ?? 0) < ${STAGES_PER_DIFFICULTY} ? ${NORMAL_CHEST_BONUS_MULT} : 1)
          * (Object.keys(state.monsters ?? {}).length + (state.eggs?.length ?? 0) < 3 ? ${ROOKIE_CHEST_MULT} : 1)
          * (1 + (state.party ?? []).reduce((total, id) => {
          const monster = state.monsters?.[id];
          return total + (monster?.equipment ?? []).reduce((sum, item) => sum
            + (item.stats?.chestBonus ?? item.stat?.chestBonus ?? 0)
            + (item.opts ?? []).filter((entry) => entry.stat === "chestBonus")
              .reduce((optionSum, entry) => optionSum + (entry.value ?? 0), 0)
            + (item.enhances ?? []).filter((entry) => entry?.stat === "chestBonus")
              .reduce((enhanceSum, entry) => enhanceSum + (entry.value ?? 0), 0), 0);
        }, 0)),
      },
      stage: state.stage ?? 0,
      difficulty: state.difficulty ?? 0,
      killsInStage: state.killsInStage ?? 0,
      bossWave: Boolean(debug.bossWave),
      playerHp: debug.playerHp ?? null,
      party: (state.party ?? []).map((id) => {
        const monster = state.monsters?.[id];
        return monster ? {
          id,
          level: monster.level ?? 1,
          exp: monster.exp ?? 0,
          xpToNext: monster.level >= ${LEVEL_CAP} ? null : expToNext(monster.level ?? 1),
        } : null;
      }).filter(Boolean),
    };
  })()`;
}

const ENGLISH_SPECIES_NAMES = {
  abyssaltoad: "Abyssal Toad", abyssfox: "Abyss Fox", abysswitch: "Abyss Witch", archermouse: "Archer Mouse",
  auradrake: "Aura Drake", blazegecko: "Blaze Gecko", bonemonarch: "Bone Monarch", blossompot: "Blossom Pot",
  darkbehemoth: "Dark Behemoth", darkknight: "Dark Knight", drakelord: "Drake Lord", dryadqueen: "Dryad Queen",
  emberdrake: "Ember Drake", flameogre: "Flame Ogre", frostdrake: "Frost Drake", frostwolf: "Frost Wolf",
  gaiaturtle: "Gaia Turtle", galebird: "Gale Bird", galewolf: "Gale Wolf", gargoyle: "Gargoyle",
  generalmouse: "General Mouse", glacierturtle: "Glacier Turtle", griffon: "Griffon", gusthawk: "Gust Hawk",
  haloangel: "Halo Angel", heromouse: "Hero Mouse", infernoknight: "Inferno Knight", jadeogre: "Jade Ogre",
  lavaserpent: "Lava Serpent", leafmouse: "Leaf Mouse", luminfairy: "Lumin Fairy", lunarfox: "Lunar Fox",
  magmagolem: "Magma Golem", magmafox: "Magma Fox", mistraven: "Mist Raven", nightraven: "Night Raven",
  phoenix: "Phoenix", pinkfairy: "Pink Fairy", pyrebird: "Pyre Bird", royalgriffon: "Royal Griffon",
  shieldmouse: "Shield Mouse", siren: "Siren", solarcat: "Solar Cat", stormpaladin: "Storm Paladin",
  sunblossom: "Sun Blossom", sylphdrake: "Sylph Drake", tempestgecko: "Tempest Gecko", terrashell: "Terra Shell",
  thornshell: "Thorn Shell", thunderbird: "Thunder Bird", titanmole: "Titan Mole", valkyrie: "Valkyrie",
  voidbehemoth: "Void Behemoth", voidcat: "Void Cat", voltgecko: "Volt Gecko", worldsprout: "World Sprout",
};

function englishSpeciesName(id) {
  return ENGLISH_SPECIES_NAMES[id] ?? String(id ?? "Unknown")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function awakeningExpression() {
  const speciesMeta = Object.fromEntries(Object.entries(SPECIES).map(([id, species]) => [id, { name: englishSpeciesName(id), rarity: species.rarity ?? "common" }]));
  return `(() => {
    const state = window.__battleDebug?.()?.state;
    if (!state) return null;
    const speciesMeta = ${JSON.stringify(speciesMeta)};
    const party = new Set(state.party ?? []);
    const expeditions = (state.expeditions ?? []).flatMap((group) => Array.isArray(group) ? group : (group.members ?? []));
    const monsters = Object.entries(state.monsters ?? {}).map(([id, monster]) => ({
      id, speciesId: monster.speciesId, fav: Boolean(monster.fav), party: party.has(id), expedition: expeditions.includes(id),
      name: speciesMeta[monster.speciesId]?.name ?? monster.speciesId ?? "unknown",
      rarity: speciesMeta[monster.speciesId]?.rarity ?? "common", level: monster.level ?? 1, awakening: monster.awakening ?? 0,
      shiny: Boolean(monster.shiny), job: monster.job ?? null, equipmentCount: (monster.equipment ?? []).length,
    }));
    return { max: ${AWAKEN_MAX}, needs: [12, 18, 48, 72, 144, 216], gapFactor: 0.6, maxChance: 0.9,
      monsters,
      targets: monsters.filter((monster) => !monster.expedition),
      fodder: monsters.filter((monster) => !monster.fav && !monster.party && !monster.expedition) };
  })()`;
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error("Request body must be valid JSON")); }
    });
    request.on("error", reject);
  });
}

function progressOf(member) {
  if (member.level >= LEVEL_CAP) return totalExpAt(LEVEL_CAP);
  return totalExpAt(member.level) + member.exp;
}

function rate(value, elapsedMs) {
  return elapsedMs > 0 ? value * 60_000 / elapsedMs : 0;
}

function smooth(previous, current, elapsedMs) {
  if (previous === null) return current;
  const alpha = 1 - Math.exp(-elapsedMs / EMA_TIME_CONSTANT_MS);
  return previous + alpha * (current - previous);
}

export function createLiveMetrics({ initialEggDrops = [], persistEggDrops = () => {} } = {}) {
  const session = {
    startedAt: Date.now(),
    last: null,
    grossGold: 0,
    netGold: 0,
    experience: 0,
    experienceByMember: new Map(),
    kills: 0,
    eggDrops: [...initialEggDrops],
    sessionEggDrops: [],
    kpmHistory: [],
    elapsedMs: 0,
    ema: {
      grossGoldPerMinute: null,
      netGoldPerMinute: null,
      experiencePerMinute: null,
      killsPerMinute: null,
      experiencePerMember: new Map(),
    },
    latest: null,
    error: null,
  };

  return {
    update(snapshot) {
      const now = snapshot.timestamp ?? Date.now();
      snapshot.eggDrop = snapshot.eggDrop ?? fallbackEggDrop(snapshot.rateState);
      snapshot.globalBonuses = snapshot.globalBonuses ?? fallbackGlobalBonuses(snapshot.rateState);
      snapshot.capStats = snapshot.capStats ?? fallbackCapStats(snapshot.rateState);
      if (session.last) {
        const elapsed = Math.max(0, now - session.last.timestamp);
        const goldDelta = snapshot.gold - session.last.gold;
        const expDeltaByMember = new Map();
        const expDelta = snapshot.party.reduce((sum, member) => {
          const previous = session.last.party.find((item) => item.id === member.id);
          if (!previous) return sum;
          const delta = Math.max(0, progressOf(member) - progressOf(previous));
          expDeltaByMember.set(member.id, delta);
          return sum + delta;
        }, 0);
        session.elapsedMs += elapsed;
        session.grossGold += Math.max(0, goldDelta);
        session.netGold += goldDelta;
        session.experience += expDelta;
        for (const [id, delta] of expDeltaByMember) {
          session.experienceByMember.set(id, (session.experienceByMember.get(id) ?? 0) + delta);
        }
        const killsDelta = Math.max(0, snapshot.totalKills - session.last.totalKills);
        session.kills += killsDelta;
        const previousEggs = new Set((session.last.eggInventory ?? []).map((egg) => egg.id));
        for (const egg of snapshot.eggInventory ?? []) {
          if (!previousEggs.has(egg.id)) {
            const drop = { timestamp: now, rarity: egg.rarity ?? "unknown" };
            session.eggDrops.push(drop);
            session.sessionEggDrops.push(drop);
            persistEggDrops(session.eggDrops);
          }
        }
        if (elapsed > 0) {
          session.ema.grossGoldPerMinute = smooth(session.ema.grossGoldPerMinute, rate(Math.max(0, goldDelta), elapsed), elapsed);
          session.ema.netGoldPerMinute = smooth(session.ema.netGoldPerMinute, rate(goldDelta, elapsed), elapsed);
          session.ema.experiencePerMinute = smooth(session.ema.experiencePerMinute, rate(expDelta, elapsed), elapsed);
          session.ema.killsPerMinute = smooth(session.ema.killsPerMinute, rate(killsDelta, elapsed), elapsed);
          const memberIds = new Set([
            ...session.last.party.map((member) => member.id),
            ...snapshot.party.map((member) => member.id),
          ]);
          for (const id of memberIds) {
            session.ema.experiencePerMember.set(
              id,
              smooth(session.ema.experiencePerMember.get(id) ?? null, rate(expDeltaByMember.get(id) ?? 0, elapsed), elapsed),
            );
          }
        }
      }
      session.last = snapshot;
      session.latest = snapshot;
      session.kpmHistory.push({ timestamp: now, killsPerMinute: session.ema.killsPerMinute ?? 0 });
      if (session.kpmHistory.length > KPM_HISTORY_LIMIT) session.kpmHistory.splice(0, session.kpmHistory.length - KPM_HISTORY_LIMIT);
      session.error = null;
    },
    fail(error) {
      session.error = error.message;
    },
    read() {
      const latest = session.latest;
      return {
        connected: Boolean(latest) && !session.error,
        error: session.error,
        startedAt: session.startedAt,
        elapsedMs: session.elapsedMs,
        grossGold: session.grossGold,
        netGold: session.netGold,
        experience: session.experience,
        kills: session.kills,
        eggDrops: session.eggDrops,
        sessionEggDrops: session.sessionEggDrops,
        kpmHistory: session.kpmHistory,
        smoothing: "EMA",
        smoothingTimeConstantMs: EMA_TIME_CONSTANT_MS,
        rates: {
          grossGoldPerMinute: session.ema.grossGoldPerMinute ?? 0,
          netGoldPerMinute: session.ema.netGoldPerMinute ?? 0,
          experiencePerMinute: session.ema.experiencePerMinute ?? 0,
          killsPerMinute: session.ema.killsPerMinute ?? 0,
          estimatedChestsPerMinute: (session.ema.killsPerMinute ?? 0) * (latest?.chestDrop?.chance ?? 0),
          eggsPerHour: (session.ema.killsPerMinute ?? 0) * 60 * (latest?.eggDrop?.chance ?? 0),
          experiencePerMember: Object.fromEntries(session.ema.experiencePerMember),
        },
        latest,
      };
    },
    reset() {
      session.startedAt = Date.now();
      session.last = null;
      session.grossGold = 0;
      session.netGold = 0;
      session.experience = 0;
      session.experienceByMember.clear();
      session.kills = 0;
      session.sessionEggDrops = [];
      session.kpmHistory = [];
      session.elapsedMs = 0;
      session.ema.grossGoldPerMinute = null;
      session.ema.netGoldPerMinute = null;
      session.ema.experiencePerMinute = null;
      session.ema.killsPerMinute = null;
      session.ema.experiencePerMember.clear();
      session.error = null;
    },
  };
}

export async function readLiveSnapshot(endpoint) {
  return evaluateRuntime(projectExpression(), endpoint);
}

function keySnapshotExpression() {
  return `(() => {
    const debug = window.__battleDebug?.();
    const state = debug?.state;
    const keys = Array.isArray(state?.keyItems) ? state.keyItems : [];
    const difficulty = state?.difficulty ?? debug?.difficulty ?? 0;
    const byDifficulty = {};
    for (const key of keys) {
      const value = key?.difficulty;
      byDifficulty[value] = (byDifficulty[value] ?? 0) + 1;
    }
    return {
      total: keys.length,
      difficulty,
      current: keys.filter((key) => key?.difficulty === difficulty).length,
      byDifficulty,
    };
  })()`;
}

async function readKeySnapshot(endpoint) {
  return evaluateRuntime(keySnapshotExpression(), endpoint);
}

function awakenUiExpression(targetId, foodIds) {
  return `(async () => {
    const text = (node) => node?.textContent?.replace(/\\s+/g, " ").trim() ?? "";
    const visible = (node) => {
      if (!node || node.classList.contains("hidden")) return false;
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const debug = window.__battleDebug?.();
    const state = debug?.state;
    if (!state) return { error: "Battle state unavailable" };
    const targetId = ${JSON.stringify(targetId)};
    const foodIds = [...new Set(${JSON.stringify(foodIds)})];
    if (!state.monsters?.[targetId] || foodIds.some((id) => !state.monsters?.[id] || id === targetId)) return { error: "Selected monster no longer exists" };
    const expeditionIds = new Set((state.expeditions ?? []).flatMap((group) => Array.isArray(group) ? group : (group.members ?? [])));
    if (foodIds.some((id) => state.monsters[id].fav || state.party.includes(id) || expeditionIds.has(id))) return { error: "Favorites, party members, and expedition monsters are protected" };
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const findCell = (id) => document.querySelector('.mon-cell[data-mon="' + CSS.escape(id) + '"]');
    const clickMonster = async (id) => {
      let cell = findCell(id);
      if (cell) { cell.click(); return true; }
      const pageCount = document.querySelectorAll("#box-list .page-tab").length;
      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const page = document.querySelectorAll("#box-list .page-tab")[pageIndex];
        if (!page) continue;
        page.click();
        await wait(100);
        cell = findCell(id);
        if (cell) { cell.click(); return true; }
      }
      return false;
    };
    let compoundPanel = document.querySelector("#compound-panel");
    if (!visible(compoundPanel)) {
      const tab = document.querySelector('.bar-tab[data-win="compound"]');
      if (!tab) return { error: "Compound window unavailable" };
      tab.click();
      await wait(100);
      compoundPanel = document.querySelector("#compound-panel");
    }
    if (!visible(compoundPanel)) return { error: "Compound window did not open" };
    const ritualTab = [...compoundPanel.querySelectorAll(".cmp-tab")]
      .find((button) => /覚醒|Awaken/i.test(text(button)));
    if (!ritualTab) return { error: "Awakening mode unavailable" };
    ritualTab.click();
    await wait(80);
    if (!await clickMonster(targetId)) return { error: "Target monster is not visible in the box" };
    for (const id of foodIds) {
      if (!await clickMonster(id)) return { error: "A selected duplicate is not visible in the box" };
    }
    await wait(80);
    compoundPanel = document.querySelector("#compound-panel");
    const ritualButton = [...compoundPanel.querySelectorAll("button.compound-do")]
      .find((button) => /儀式を行う|Perform the rite/i.test(text(button)) && !button.disabled);
    if (!ritualButton) return { error: "Awakening ritual button is unavailable" };
    const before = state.monsters[targetId]?.awakening ?? 0;
    ritualButton.click();
    await wait(250);
    const after = window.__battleDebug?.()?.state?.monsters?.[targetId]?.awakening ?? before;
    const remainingSlots = [...document.querySelectorAll("#compound-panel .cmp-slot .cmp-x")];
    for (const clearButton of remainingSlots) clearButton.click();
    await wait(80);
    return {
      success: after > before,
      before,
      after,
      consumed: foodIds.length,
      selectionCleared: document.querySelectorAll("#compound-panel .cmp-slot").length === 0,
    };
  })()`;
}

async function setTurboRespawn(enabled, endpoint) {
  return evaluateRuntime(`(() => {
    const debug = window.__battleDebug?.();
    const existing = window.__turboRespawn;
    if (existing) {
      if (!${enabled}) {
        existing.restore();
        return false;
      }
      if (existing.version === 7 && existing.enabled && typeof existing.pulse === "function") {
        return existing.pulse();
      }
      existing.restore();
    }
    if (!${enabled}) return false;
    const original = window.setTimeout;
    const turbo = {
      version: 7,
      enabled: true,
      stack: 0,
      phase: "idle",
      keyCount: 0,
      stageIndex: 0,
      lastAction: "installed",
      log: [],
      restore() {
        if (window.setTimeout === turbo.wrapper) window.setTimeout = original;
        turbo.enabled = false;
        turbo.log.push({ at: Date.now(), action: "stopped", stack: turbo.stack });
      },
      write(action, detail = {}) {
        turbo.lastAction = action;
        turbo.log.push({ at: Date.now(), action, stack: turbo.stack, ...detail });
        turbo.log = turbo.log.slice(-40);
      },
      stageNode(labelText) {
        const mapTab = document.querySelector('.bar-tab[data-win="map"]');
        let label = [...document.querySelectorAll(".portal-node-label")]
          .find((candidate) => candidate.textContent.includes(labelText));
        if (!label && mapTab) {
          mapTab.click();
          label = [...document.querySelectorAll(".portal-node-label")]
            .find((candidate) => candidate.textContent.includes(labelText));
        }
        const node = label?.previousElementSibling;
        if (!node) return "missing-stage";
        if (node.classList.contains("locked")) return "locked-stage";
        if (node.classList.contains("current")) return "already-stage";
        node.click();
        return "stage-moved";
      },
      loopNode(labelText) {
        const label = [...document.querySelectorAll(".portal-node-label")]
          .find((candidate) => candidate.textContent.includes(labelText));
        const row = label?.parentElement;
        const button = row?.querySelector(".portal-loop");
        if (!button) return "missing-loop";
        if (button.classList.contains("on")) return "already-looping";
        button.click();
        return "loop-enabled";
      },
      bossKeyCount() {
        const current = window.__battleDebug?.();
        const state = current?.state;
        const difficulty = current?.difficulty;
        // The game HUD counts both inventory and stored keys as usable.
        return (state?.keyItems ?? []).filter((key) => key.difficulty === difficulty).length;
      },
      pulse() {
        if (!turbo.enabled) return { enabled: false, action: "stopped" };
        turbo.stack += 1;
        if (window.setTimeout !== turbo.wrapper) window.setTimeout = turbo.wrapper;
        const keys = turbo.bossKeyCount();
        const stages = ["[10-7]", "[10-10]", "[10-8]", "[10-10]", "[10-9]", "[10-10]"];
        const target = stages[turbo.stageIndex % stages.length];
        turbo.stageIndex = (turbo.stageIndex + 1) % stages.length;
        turbo.phase = target === "[10-10]" ? "boss-10-10" : "farm-" + target.slice(1, -1);
        turbo.keyCount = keys;
        const stageAction = turbo.stageNode(target);
        const loopAction = turbo.loopNode(target);
        turbo.write(stageAction + "/" + loopAction, { phase: turbo.phase, keyCount: keys, target, layers: turbo.stack });
        return { enabled: true, phase: turbo.phase, keyCount: turbo.keyCount, stack: turbo.stack, lastAction: turbo.lastAction, log: turbo.log };
      },
    };
    turbo.wrapper = function (callback, delay, ...args) {
      const timer = original.call(this, callback, delay, ...args);
      if (delay === 450 && turbo.enabled) {
        for (let duplicate = 0; duplicate < turbo.stack; duplicate++) original.call(this, callback, delay, ...args);
      }
      return timer;
    };
    window.__turboRespawn = turbo;
    window.setTimeout = turbo.wrapper;
    return turbo.pulse();
  })()`, endpoint);
}

export async function startLiveDashboard({ host = "127.0.0.1", port = 4173, endpoint, runtime } = {}) {
  const initialEggDrops = await readEggLog();
  let persistChain = Promise.resolve();
  const persistEggDrops = (drops) => {
    persistChain = persistChain
      .then(() => writeEggLog(drops))
      .catch((error) => console.warn(`Unable to persist egg log: ${error.message}`));
  };
  const metrics = createLiveMetrics({ initialEggDrops, persistEggDrops });
  const poll = async () => {
    try {
      const snapshot = await readLiveSnapshot(endpoint);
      if (!snapshot) throw new Error("TASMON debug object is unavailable");
      snapshot.report = resolvePartyAttack(snapshot.rateState, runtime);
      metrics.update(snapshot);
    } catch (error) {
      metrics.fail(error);
    }
  };

  await poll();
  const timer = setInterval(poll, 1000);
  let turboEnabled = false;
  let turboPhase = null;
  let turboKeys = 0;
  let turboRefreshTimer = null;
  let turboStack = 0;
  let turboLastAction = null;
  let turboLog = [];
  const ultraAutomation = { open: false, condense: false, busy: false, last: null, lastError: null };
  const runUltraAutomation = async () => {
    if (ultraAutomation.busy || (!ultraAutomation.open && !ultraAutomation.condense)) return;
    ultraAutomation.busy = true;
    try {
      ultraAutomation.last = await evaluateRuntime(ultraAutomationExpression(ultraAutomation), endpoint, { awaitPromise: true });
      ultraAutomation.lastError = ultraAutomation.last?.error ?? null;
    } catch (error) {
      ultraAutomation.lastError = error.message;
    } finally {
      ultraAutomation.busy = false;
    }
  };
  const ultraAutomationTimer = setInterval(runUltraAutomation, 5_000);
  const ultraLeveling = { enabled: false, running: false, last: null, lastError: null, logs: [], levels: new Map(), restored: false };
  const logUltraLeveling = (message, detail = null) => {
    ultraLeveling.logs.push({ at: Date.now(), message, detail });
    if (ultraLeveling.logs.length > 80) ultraLeveling.logs.splice(0, ultraLeveling.logs.length - 80);
  };
  const runUltraLeveling = async () => {
    if (!ultraLeveling.enabled || ultraLeveling.running) return;
    ultraLeveling.running = true;
    try {
      ultraLeveling.last = await evaluateRuntime(levelUltraExpression(), endpoint, { awaitPromise: true });
      ultraLeveling.lastError = ultraLeveling.last?.error ?? null;
      if (ultraLeveling.lastError) {
        logUltraLeveling(`Error: ${ultraLeveling.lastError}`);
      } else {
        for (const monster of ultraLeveling.last?.debug?.trainable ?? []) {
          const previousLevel = ultraLeveling.levels.get(monster.id);
          if (previousLevel !== undefined && monster.level > previousLevel) {
            logUltraLeveling(`${monster.id} leveled to ${monster.level}`);
          }
          ultraLeveling.levels.set(monster.id, monster.level);
        }
        for (const swap of ultraLeveling.last?.swapped ?? []) logUltraLeveling(`${swap.id} swapped in`);
        if (ultraLeveling.last?.complete && ultraLeveling.last.restored && !ultraLeveling.restored) {
          logUltraLeveling("All awakened Ultras leveled; original party restored at 10-9");
          ultraLeveling.restored = true;
        }
      }
    } catch (error) {
      ultraLeveling.lastError = error.message;
      logUltraLeveling(`Runtime error: ${error.message}`);
    } finally {
      ultraLeveling.running = false;
    }
  };
  const ultraLevelingTimer = setInterval(runUltraLeveling, 5_000);
  const craftAutomation = {
    running: false,
    mode: "both",
    minAtkPct: 0.9,
    minSkillPower: 0.4,
    runs: 0,
    lastResult: null,
    exitReason: null,
    lastError: null,
    logs: [],
    controller: null,
  };
  const craftStatus = () => ({
    running: craftAutomation.running,
    mode: craftAutomation.mode,
    minAtkPct: craftAutomation.minAtkPct,
    minSkillPower: craftAutomation.minSkillPower,
    runs: craftAutomation.runs,
    lastResult: craftAutomation.lastResult,
    exitReason: craftAutomation.exitReason,
    lastError: craftAutomation.lastError,
    logs: craftAutomation.logs,
  });
  const stopCraftAutomation = () => {
    if (craftAutomation.controller) craftAutomation.controller.abort();
  };
  const startCraftAutomation = ({ mode, minAtkPct, minSkillPower }) => {
    if (craftAutomation.running) throw new Error("Craft automation is already running");
    craftAutomation.running = true;
    craftAutomation.mode = mode;
    craftAutomation.minAtkPct = minAtkPct;
    craftAutomation.minSkillPower = minSkillPower;
    craftAutomation.runs = 0;
    craftAutomation.lastResult = null;
    craftAutomation.exitReason = null;
    craftAutomation.lastError = null;
    craftAutomation.logs = [];
    craftAutomation.controller = new AbortController();
    runCraftController({
      endpoint,
      mode,
      maxRuns: 1,
      confirm: true,
      loop: true,
      minAtkPct,
      minSkillPower,
      signal: craftAutomation.controller.signal,
      log: (message) => {
        craftAutomation.logs.push({ at: Date.now(), message });
        craftAutomation.logs = craftAutomation.logs.slice(-60);
      },
    }).then((result) => {
      craftAutomation.runs = result.results.filter((entry) => entry.crafted).length;
      const last = result.results.at(-1);
      craftAutomation.lastResult = last ? { crafted: last.crafted, verified: last.verified, reason: last.reason ?? null } : null;
      craftAutomation.exitReason = result.exitReason;
    }).catch((error) => {
      craftAutomation.lastError = error.message;
      craftAutomation.exitReason = "error";
    }).finally(() => {
      craftAutomation.running = false;
      craftAutomation.controller = null;
    });
  };
  const refreshTurboState = async () => {
    if (!turboEnabled) return;
    try {
      const [keys, runtime] = await Promise.all([
        readKeySnapshot(endpoint),
        evaluateRuntime(`(() => {
          const turbo = window.__turboRespawn;
          return turbo ? {
            enabled: turbo.enabled,
            stack: turbo.stack,
            phase: turbo.phase,
            lastAction: turbo.lastAction,
            log: turbo.log,
          } : null;
        })()`, endpoint),
      ]);
      if (!runtime?.enabled) return;
      turboKeys = keys?.current ?? 0;
      turboPhase = runtime.phase ?? turboPhase;
      turboStack = runtime.stack ?? turboStack;
      turboLastAction = runtime.lastAction ?? turboLastAction;
      turboLog = runtime.log ?? turboLog;
    } catch {
      // The regular live poll will report a disconnected game separately.
    }
  };
  const signatureOwners = Object.fromEntries(
    Object.entries(SPECIES)
      .filter(([, species]) => SKILLS[species.skillId]?.signature)
      .map(([speciesId, species]) => [species.skillId, speciesId]),
  );
  const skillCatalog = Object.entries(SKILLS).map(([id, skill]) => ({
    id,
    name: skill.name ?? id,
    description: englishSkillDescription(skill),
    type: skill.active?.type ?? "unknown",
    kind: skill.active?.kind ?? "single",
    power: skill.active?.power ?? 0,
    cooldown: skill.cooldown ?? 0,
    stars: skillStars(id),
    hits: skill.active?.hits ?? 1,
    availability: skill.signature ? (signatureOwners[id] ? `${signatureOwners[id]} (natural owner)` : "Signature") : skill.enhanceOnly ? "Enhancement-only" : skill.jobOnly ? "Job-only" : "Normal",
  }));
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, `http://${request.headers.host ?? "localhost"}`).pathname;
    if (pathname === "/api/live") {
      await refreshTurboState();
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify({ ...metrics.read(), turbo: turboEnabled, turboPhase, turboKeys, turboStack, turboLastAction, turboLog, ultraAutomation: { ...ultraAutomation }, ultraLeveling: { enabled: ultraLeveling.enabled, running: ultraLeveling.running, last: ultraLeveling.last, lastError: ultraLeveling.lastError, logs: ultraLeveling.logs }, crafting: craftStatus() }));
      return;
    }
    if (pathname === "/api/report") {
      const latest = metrics.read().latest;
      if (!latest?.report) {
        response.writeHead(503, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        response.end("Live party report is not available yet");
        return;
      }
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      response.end(renderReport({ party: latest.report, generatedAt: new Date(latest.timestamp).toISOString() }));
      return;
    }
    if (pathname === "/api/crafting" && request.method === "GET") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify(craftStatus()));
      return;
    }
    if (pathname === "/api/ultra-leveling" && request.method === "POST") {
      try {
        const body = await readRequestBody(request);
        ultraLeveling.enabled = body.enabled === true;
        if (!ultraLeveling.enabled) {
          ultraLeveling.levels.clear();
          ultraLeveling.restored = false;
        }
        if (ultraLeveling.enabled) await runUltraLeveling();
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify({ enabled: ultraLeveling.enabled, running: ultraLeveling.running, last: ultraLeveling.last, lastError: ultraLeveling.lastError, logs: ultraLeveling.logs }));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/crafting" && request.method === "POST") {
      try {
        const body = await readRequestBody(request);
        if (body.confirm !== true) throw new Error("Craft automation requires explicit confirmation");
        const mode = body.mode ?? "gear";
        const minAtkPct = Number(body.minAtkPct ?? 0.9);
        const minSkillPower = Number(body.minSkillPower ?? 0.4);
        if (!new Set(["gear", "charm", "both"]).has(mode)) throw new Error("Mode must be gear, charm, or both");
        if (!Number.isFinite(minAtkPct) || minAtkPct < 0 || !Number.isFinite(minSkillPower) || minSkillPower < 0) throw new Error("Thresholds must be non-negative numbers");
        startCraftAutomation({ mode, minAtkPct, minSkillPower });
        response.writeHead(202, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify(craftStatus()));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/crafting/stop" && request.method === "POST") {
      stopCraftAutomation();
      response.writeHead(202, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify(craftStatus()));
      return;
    }
    if (pathname === "/api/keys") {
      try {
        const keys = await readKeySnapshot(endpoint);
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify(keys));
      } catch (error) {
        response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/awakenings") {
      try {
        const data = await evaluateRuntime(awakeningExpression(), endpoint);
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify(data));
      } catch (error) {
        response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/awaken" && request.method === "POST") {
      try {
        const body = await readRequestBody(request);
        const targetId = typeof body.targetId === "string" ? body.targetId : "";
        const foodIds = Array.isArray(body.foodIds) ? body.foodIds.filter((id) => typeof id === "string") : [];
        if (!targetId || foodIds.length === 0) throw new Error("Choose a target and at least one duplicate");
        const result = await evaluateRuntime(awakenUiExpression(targetId, foodIds), endpoint, { awaitPromise: true });
        if (result?.error) {
          response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
          response.end(JSON.stringify(result));
          return;
        }
        const inventory = await evaluateRuntime(awakeningExpression(), endpoint);
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify({ result, inventory }));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/skills") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify(skillCatalog));
      return;
    }
    if (pathname === "/api/skill-roll-reference") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify(skillRollReference()));
      return;
    }
    if (pathname === "/api/reset" && request.method === "POST") {
      metrics.reset();
      response.writeHead(204);
      response.end();
      return;
    }
    if (pathname === "/api/ultra-automation" && request.method === "POST") {
      try {
        const body = await readRequestBody(request);
        ultraAutomation.open = body.open === true;
        ultraAutomation.condense = body.condense === true;
        await runUltraAutomation();
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify({ ...ultraAutomation }));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    if (pathname === "/api/turbo" && request.method === "POST") {
      try {
        const turbo = await setTurboRespawn(true, endpoint);
        const keys = await readKeySnapshot(endpoint);
        turboEnabled = Boolean(turbo?.enabled ?? turbo);
        turboKeys = keys?.current ?? turbo?.keyCount ?? 0;
        turboPhase = turboKeys >= 9 ? "boss-10-10" : "farm-10-7";
        turboStack = turbo?.stack ?? 0;
        turboLastAction = turbo?.lastAction ?? null;
        turboLog = turbo?.log ?? turboLog;
        if (turboRefreshTimer) clearInterval(turboRefreshTimer);
        turboRefreshTimer = setInterval(refreshTurboState, 250);
        await refreshTurboState();
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify({ turbo: turboEnabled, phase: turboPhase, keyCount: turboKeys, stack: turboStack, lastAction: turboLastAction, log: turboLog }));
      } catch (error) {
        turboEnabled = false;
        response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message, turbo: false }));
      }
      return;
    }
    if (pathname === "/api/turbo/stop" && request.method === "POST") {
      try {
        await setTurboRespawn(false, endpoint);
        turboEnabled = false;
        turboPhase = null;
        turboKeys = 0;
        turboStack = 0;
        turboLastAction = "stopped";
        turboLog = [];
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
        response.end(JSON.stringify({ turbo: false, phase: null, keyCount: 0, stack: 0, lastAction: "stopped", log: [] }));
      } catch (error) {
        response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message, turbo: turboEnabled }));
      }
      return;
    }
    if (pathname === "/" || pathname === "/index.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(await fs.readFile(dashboardPath));
      return;
    }
    if (pathname === "/report.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(await fs.readFile(attackReportPath));
      return;
    }
    if (pathname === "/context.md") {
      response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      response.end(await fs.readFile(wikiPath));
      return;
    }
    response.writeHead(404);
    response.end("Not found");
  });

  server.on("close", () => {
    clearInterval(timer);
    clearInterval(ultraAutomationTimer);
    clearInterval(ultraLevelingTimer);
    stopCraftAutomation();
    if (turboRefreshTimer) clearInterval(turboRefreshTimer);
  });
  await new Promise((resolve) => server.listen(port, host, resolve));
  return server;
}

function ultraAutomationExpression({ open, condense }) {
  const speciesMeta = Object.fromEntries(Object.entries(SPECIES).map(([id, species]) => [id, { rarity: species.rarity }]));
  return `(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const debug = window.__battleDebug?.();
    const state = debug?.state;
    if (!state) return { error: "TASMON debug object is unavailable", debug: { url: location.href } };
    const result = { opened: 0, condensed: 0, protectedAwakeningSix: 0, skipped: [] };
    const speciesMeta = ${JSON.stringify(speciesMeta)};
    const ultraEggIndexes = () => (state.eggs ?? []).map((egg, index) => ({ egg, index })).filter(({ egg }) => egg.rarity === "ultra");
    const closeHatchPopup = async () => {
      const closeButton = document.querySelector("#hatch-overlay:not(.hidden) .hatch-close-btn");
      if (closeButton) {
        closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
        for (let attempt = 0; attempt < 80 && !document.querySelector("#hatch-overlay.hidden"); attempt += 1) await sleep(100);
      }
      return Boolean(!document.querySelector("#hatch-overlay:not(.hidden)"));
    };
    if (${Boolean(open)}) {
      for (const { egg } of ultraEggIndexes()) {
        if (!(await closeHatchPopup())) { result.skipped.push("Hatch popup could not close: " + egg.id); continue; }
        const currentIndex = (state.eggs ?? []).findIndex((candidate) => candidate.id === egg.id);
        if (currentIndex < 0) continue;
        const slots = [...document.querySelectorAll(".egg-slot.filled")];
        const slot = slots[currentIndex];
        if (!slot) { result.skipped.push("Egg slot unavailable: " + egg.id); continue; }
        const before = state.eggs.length;
        slot.click();
        for (let attempt = 0; attempt < 80 && state.eggs.length >= before; attempt += 1) await sleep(100);
        if (state.eggs.length < before) {
          let closeButton = null;
          for (let attempt = 0; attempt < 120; attempt += 1) {
            closeButton = document.querySelector("#hatch-overlay:not(.hidden) .hatch-close-btn");
            if (closeButton) break;
            await sleep(100);
          }
          if (closeButton) {
            closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
            for (let attempt = 0; attempt < 80 && !document.querySelector("#hatch-overlay.hidden"); attempt += 1) await sleep(100);
          }
          if (document.querySelector("#hatch-overlay.hidden")) result.opened += 1;
          else result.skipped.push("Hatch popup did not close: " + egg.id);
        } else result.skipped.push("Hatch did not complete: " + egg.id);
      }
    }
    if (${Boolean(condense)}) {
      const groups = new Map();
      for (const monster of Object.values(state.monsters ?? {})) {
        const species = speciesMeta[monster.speciesId];
        if (!species || !["ultra", "legend"].includes(species.rarity)) continue;
        const list = groups.get(monster.speciesId) ?? [];
        list.push(monster);
        groups.set(monster.speciesId, list);
      }
      const clickMonster = async (id) => {
        for (let page = 0; page < 30; page += 1) {
          const cell = document.querySelector('.mon-cell[data-mon="' + CSS.escape(id) + '"]');
          if (cell) { cell.click(); await sleep(150); return true; }
          const tabs = [...document.querySelectorAll(".page-tab")];
          if (!tabs[page + 1]) break;
          tabs[page + 1].click();
          await sleep(150);
        }
        return false;
      };
      const openRitual = async () => {
        let panel = document.querySelector("#compound-panel");
        if (!panel || panel.classList.contains("hidden")) {
          const compound = document.querySelector('.bar-tab[data-win="compound"]') ?? document.querySelector(".feed-btn");
          if (!compound) return false;
          compound.click();
          await sleep(200);
          panel = document.querySelector("#compound-panel");
        }
        const ritualTab = [...(panel?.querySelectorAll(".cmp-tab") ?? [])].find((tab) => /覚醒|Awaken/i.test(tab.textContent));
        if (ritualTab) ritualTab.click();
        await sleep(200);
        return Boolean(panel && ritualTab);
      };
      const clearRitualTarget = async () => {
        let clearButton = document.querySelector("#compound-panel .cmp-slot:not(.cmp-empty) .cmp-x");
        while (clearButton) {
          clearButton.click();
          await sleep(150);
          clearButton = document.querySelector("#compound-panel .cmp-slot:not(.cmp-empty) .cmp-x");
        }
      };
      for (const monsters of groups.values()) {
        const speciesId = monsters[0]?.speciesId;
        const party = new Set(state.party ?? []);
        const expedition = new Set((state.expeditions ?? []).flatMap((group) => Array.isArray(group) ? group : (group.members ?? [])));
        const isEligible = (monster) => (monster.awakening ?? 0) < 6 && !monster.fav && !party.has(monster.id) && !expedition.has(monster.id);
        const protectedCount = monsters.filter((monster) => (monster.awakening ?? 0) >= 6).length;
        result.protectedAwakeningSix += protectedCount;
        for (;;) {
          const selection = (() => {
            const currentMonsters = Object.values(state.monsters ?? {}).filter((monster) => monster.speciesId === speciesId);
            const eligible = currentMonsters.filter(isEligible);
            const zeroAwakened = eligible.filter((monster) => (monster.awakening ?? 0) === 0);
            const progressed = eligible
              .filter((monster) => (monster.awakening ?? 0) > 0)
              .sort((left, right) => (right.awakening ?? 0) - (left.awakening ?? 0));
            if (progressed.length > 0 && zeroAwakened.length > 0) return { target: progressed[0], foods: zeroAwakened };
            if (progressed.length > 0 || zeroAwakened.length < 2) return null;
            const targetIndex = Math.floor(Math.random() * zeroAwakened.length);
            const target = zeroAwakened[targetIndex];
            const foodPool = zeroAwakened.filter((_, index) => index !== targetIndex);
            const food = foodPool[Math.floor(Math.random() * foodPool.length)];
            return { target, foods: [food] };
          })();
          if (!selection) break;
          const { target, foods } = selection;
          await clearRitualTarget();
          if (!(await openRitual()) || !(await clickMonster(target.id))) {
            result.skipped.push("No ritual path for " + target.speciesId);
            break;
          }
          let clickedAllFoods = true;
          for (const food of foods) {
            if (!(await clickMonster(food.id))) { clickedAllFoods = false; break; }
          }
          if (!clickedAllFoods) {
            result.skipped.push("No ritual path for " + target.speciesId);
            break;
          }
          const beforeCount = Object.keys(state.monsters).length;
          const ritualButton = [...document.querySelectorAll("button.cmp-cta")].find((button) => !button.disabled && /儀式|rite|awaken/i.test(button.textContent));
          if (!ritualButton) { result.skipped.push("Ritual button unavailable for " + target.speciesId); continue; }
          ritualButton.click();
          for (let attempt = 0; attempt < 80 && Object.keys(state.monsters).length >= beforeCount; attempt += 1) await sleep(100);
          if (Object.keys(state.monsters).length < beforeCount) result.condensed += 1;
          else result.skipped.push("Ritual did not consume pair for " + target.speciesId);
          await clearRitualTarget();
        }
      }
    }
    return result;
  })()`;
}

function levelUltraExpression() {
  const speciesMeta = Object.fromEntries(Object.entries(SPECIES).map(([id, species]) => [id, { rarity: species.rarity }]));
  return `(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const debug = window.__battleDebug?.();
    const state = debug?.state;
    if (!state) return { error: "TASMON debug object is unavailable" };
    const speciesMeta = ${JSON.stringify(speciesMeta)};
    const session = window.__ultraLevelingSession ??= { originalParty: [...(state.party ?? [])] };
    const expeditions = new Set((state.expeditions ?? []).flatMap((group) => Array.isArray(group) ? group : (group.members ?? [])));
    const ultra = Object.values(state.monsters ?? {}).filter((monster) => speciesMeta[monster.speciesId]?.rarity === "ultra" && (monster.awakening ?? 0) > 0 && (monster.level ?? 1) < 90);
    const trainable = ultra.filter((monster) => !expeditions.has(monster.id));
    if (trainable.length === 0 && ultra.length > 0) return { complete: false, blocked: ultra.length, remaining: ultra.length, offParty: 0, swapped: [], stage: "blocked", loop: "blocked" };
    const party = state.party ?? [];
    const remaining = trainable.filter((monster) => !party.includes(monster.id));
    const targetForParty = (currentParty) => currentParty.map((id, index) => ({ id, index, monster: state.monsters?.[id] }))
      .filter(({ index, monster }) => index > 0 && monster && !(speciesMeta[monster.speciesId]?.rarity === "ultra" && (monster.level ?? 1) < 90))
      .sort((left, right) => right.index - left.index)[0];
    const target = targetForParty(party);
    const debugInfo = () => ({
      url: location.href,
      activeTab: document.querySelector(".bar-tab.active")?.dataset.win ?? null,
      barTabs: [...document.querySelectorAll(".bar-tab")].map((tab) => ({ text: tab.textContent.trim(), className: tab.className, win: tab.dataset.win ?? null })),
      partyState: party.map((id) => ({ id, speciesId: state.monsters?.[id]?.speciesId ?? null })),
      partyCells: [...document.querySelectorAll(".hero-party-cell")].map((cell) => ({ id: cell.dataset.mon, className: cell.className, hasSwap: Boolean(cell.querySelector(".party-swap-btn")) })),
      swapCount: document.querySelectorAll(".party-swap-btn").length,
      heroTabs: [...document.querySelectorAll(".hero-tab")].map((tab) => ({ text: tab.textContent.trim(), className: tab.className })),
      inventoryControls: [...document.querySelectorAll("button")].map((button) => ({ text: button.textContent.trim(), className: button.className, title: button.title })).filter((button) => /item|box|mon|tasmon|持ち物|タスモン/i.test(button.text + " " + button.title + " " + button.className)).slice(0, 40),
      map: { bodies: document.querySelectorAll("#map-body").length, portals: document.querySelectorAll(".portal-node-label").length, maps: document.querySelectorAll(".portal-map").length, labels: [...document.querySelectorAll(".portal-node-label")].map((label) => label.textContent.trim()), tabs: [...document.querySelectorAll(".portal-tab")].map((tab) => ({ text: tab.textContent.trim(), className: tab.className })), modes: [...document.querySelectorAll(".portal-mode-pill")].map((mode) => ({ text: mode.textContent.trim(), className: mode.className })) },
      partyMarkup: [...document.querySelectorAll(".hero-party-cell")].map((cell) => cell.outerHTML.slice(0, 500)),
      target: target ? { id: target.id, index: target.index } : null,
      trainable: trainable.map((monster) => ({ id: monster.id, level: monster.level ?? 1 })),
    });
    const waitForCell = async (selector, attempts = 20) => {
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const cell = document.querySelector(selector);
        if (cell) return cell;
        await sleep(100);
      }
      return null;
    };
    const waitForPartySwap = async (monsterId, attempts = 30) => {
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const cell = [...document.querySelectorAll(".hero-party-cell")].find((candidate) => candidate.dataset.mon === monsterId);
        const swap = cell?.querySelector(".party-swap-btn");
        if (swap) return swap;
        await sleep(100);
      }
      return null;
    };
    const dragMonsterToSlot = async (candidateId, targetId, targetIndex) => {
      const targetCell = [...document.querySelectorAll(".hero-party-cell")].find((cell) => cell.dataset.mon === targetId);
      let candidateCell = document.querySelector('.mon-cell[data-mon="' + CSS.escape(candidateId) + '"]');
      if (!candidateCell) {
        const candidateSelector = '.mon-cell[data-mon="' + CSS.escape(candidateId) + '"]';
        const allMons = document.querySelector(".fav-boxlist-btn");
        if (allMons) { allMons.click(); await sleep(200); }
        candidateCell = await waitForCell(candidateSelector, 5);
        const pageButtons = [...document.querySelectorAll(".page-tab")];
        for (const pageButton of pageButtons) {
          if (candidateCell) break;
          pageButton.click();
          candidateCell = await waitForCell(candidateSelector, 5);
        }
      }
      if (!targetCell || !candidateCell) return { error: "Drag/drop party controls unavailable", targetFound: Boolean(targetCell), candidateFound: Boolean(candidateCell) };
      const dataTransfer = new DataTransfer();
      dataTransfer.setData("text/plain", "mon:" + candidateId);
      candidateCell.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer }));
      targetCell.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer }));
      targetCell.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
      for (let attempt = 0; attempt < 20; attempt += 1) {
        if (state.party?.[targetIndex] === candidateId) return { targetFound: true, candidateFound: true };
        await sleep(100);
      }
      return { error: "Party drag/drop did not update party state", targetFound: true, candidateFound: true };
    };
    const swapped = [];
    for (let swapIndex = 0; swapIndex < 2; swapIndex += 1) {
      const currentParty = state.party ?? [];
      const currentTarget = targetForParty(currentParty);
      const candidate = trainable.find((monster) => !currentParty.includes(monster.id));
      if (!candidate || !currentTarget) break;
      const heroTab = document.querySelector('.bar-tab[data-win="hero"]');
      if (heroTab) heroTab.click();
      const partyTab = [...document.querySelectorAll(".hero-tab")].find((tab) => /パーティ編成|party/i.test(tab.textContent));
      if (partyTab) partyTab.click();
      const swap = await waitForPartySwap(currentTarget.id);
      const allMons = document.querySelector(".fav-boxlist-btn");
      if (allMons) { allMons.click(); await sleep(200); }
      if (swap) {
        swap.click();
        await sleep(150);
        const cell = await waitForCell('.mon-cell[data-mon="' + CSS.escape(candidate.id) + '"]');
        if (!cell) return { error: "Ultra monster is not visible in the Tasmon list", remaining: trainable.length, blocked: ultra.length - trainable.length, swapped, debug: debugInfo() };
        cell.click();
        await sleep(250);
      } else {
        const dragResult = await dragMonsterToSlot(candidate.id, currentTarget.id, currentTarget.index);
        if (dragResult.error) return { error: dragResult.error, remaining: trainable.length, blocked: ultra.length - trainable.length, swapped, debug: { ...debugInfo(), drag: dragResult, heroTabCount: document.querySelectorAll(".hero-tab").length, partyTabFound: Boolean(partyTab) } };
      }
      swapped.push({ id: candidate.id, level: candidate.level ?? 1, replaced: currentTarget.id, slot: currentTarget.index });
    }
    const stageNode = async (labelText) => {
      const mapTab = document.querySelector('.bar-tab[data-win="map"]')
        ?? [...document.querySelectorAll(".bar-tab")].find((tab) => /map|地図/i.test(tab.textContent));
      let label = [...document.querySelectorAll(".portal-node-label")].find((candidate) => candidate.textContent.includes(labelText));
      if (!label && mapTab) {
        mapTab.click();
        await sleep(250);
        label = [...document.querySelectorAll(".portal-node-label")].find((candidate) => candidate.textContent.includes(labelText));
      }
      if (!label) {
        const area = labelText.startsWith("[") ? labelText.slice(1, labelText.indexOf("-")) : null;
        const areaTab = [...document.querySelectorAll(".portal-tab")].find((tab) => area && (tab.textContent.includes("第" + area + "幕") || tab.textContent.includes("Act " + area) || tab.textContent.trim() === area));
        if (areaTab) {
          areaTab.click();
          await sleep(250);
          label = [...document.querySelectorAll(".portal-node-label")].find((candidate) => candidate.textContent.includes(labelText));
        }
      }
      const node = label?.previousElementSibling;
      if (!node) return "missing-stage";
      if (node.classList.contains("locked")) return "locked-stage";
      if (node.classList.contains("current")) return "already-stage";
      node.click();
      return "stage-moved";
    };
    const loopNode = async (labelText) => {
      const label = [...document.querySelectorAll(".portal-node-label")].find((candidate) => candidate.textContent.includes(labelText));
      const button = label?.parentElement?.querySelector(".portal-loop");
      if (!button) return "missing-loop";
      if (button.classList.contains("on")) return "already-looping";
      button.click();
      return "loop-enabled";
    };
    const restoreParty = async () => {
      const restored = [];
      for (let index = 1; index < session.originalParty.length; index += 1) {
        const desiredId = session.originalParty[index];
        if (state.party?.[index] === desiredId) continue;
        const currentId = state.party?.[index];
        if (!currentId) return { error: "Original party member is unavailable", restored };
        const result = await dragMonsterToSlot(desiredId, currentId, index);
        if (result.error) return { error: result.error, restored };
        restored.push({ id: desiredId, slot: index });
      }
      return { restored };
    };
    if (ultra.length === 0) {
      const partyResult = await restoreParty();
      if (partyResult.error) return { error: partyResult.error, complete: true, restored: false, swapped: [], debug: debugInfo() };
      const stage = await stageNode("[10-9]");
      const loop = await loopNode("[10-9]");
      return { complete: true, restored: true, blocked: 0, remaining: 0, offParty: 0, swapped: [], restoredParty: partyResult.restored, stage, loop, debug: debugInfo() };
    }
    const stage = await stageNode("[8-5]");
    const loop = await loopNode("[8-5]");
    return { remaining: ultra.length, blocked: ultra.length - trainable.length, offParty: remaining.length, swapped, stage, loop, debug: debugInfo() };
  })()`;
}