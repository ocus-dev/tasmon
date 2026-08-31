# TASMON Analyzer

A local, read-only analyzer for the installed TASMON game.

## Requirements

- Node.js 22 or newer
- A TASMON installation at the sibling directory documented in `context.md`

## Commands

From this directory:

```powershell
npm run check
npm test
npm start -- list 'src/game/(battle|data|equipment|state)\.js$'
npm start -- extract /src/game/battle.js extracted/battle.js
npm start -- inspect-save path\to\save.json
npm start -- party-attack path\to\save.json
npm start -- simulate-kpm path\to\save.json 1 9 --target-kpm 600 --party-attack 100000 --attacks-per-sec 2
npm start -- simulate-kpm --live 3 9 --target-kpm 600
npm start -- export-save save.json
npm start -- render-report save.json report.html
npm start -- live
npm start -- turbo
npm start -- craft 1 9222 gear --confirm
npm start -- craft 1 9222 gear --confirm --level-band 100-115
npm start -- craft 1 9222 both --confirm --min-atk-pct 0.9 --min-skill-power 0.4
npm start -- constellation
```

## Turbo Loop

With the live dashboard running, post to its turbo endpoint immediately and then every 10 seconds:

```powershell
npm start -- turbo
```

Pass a different endpoint as the optional argument when needed:

```powershell
npm start -- turbo http://127.0.0.1:4173/api/turbo
```

`simulate-kpm` uses difficulty index `1` for Nightmare and stage `9` for 10-9. It reports the enemy HP, required damage per second, basic-attack-only KPM, scheduled offensive skills, and a wave-aware KPM estimate. The wave estimate applies cooldowns, initial skill delays, crits, dex attack bonus, AOE conversion, native AOE, single-target overkill rules, and the 450ms wave respawn delay. `skillInclusiveKpm` is only an optimistic DPS upper bound. `--live` reads the current in-memory battle state through CDP, avoiding a stale exported save. Use `--aoe-damage` and `--aoe-cooldown` to test an additional AOE cast.


To generate report for active party:
```powershell
node src/cli.js render-report save.json report_3.html
node src/cli.js render-report save.json report_3.html
```


The default archive is:

```text
..\resources\app.asar
```

The analyzer reads the ASAR index and selected files directly. It does not unpack or modify the game archive.

## Exporting The Live Save

Close TASMON, then launch it with a local DevTools port:

```powershell
& "..\TaskbarMonsters.exe" --remote-debugging-port=9222
```

With the game running, export the save into this project:

```powershell
node src/cli.js export-save save.json
```

The exporter reads `localStorage["taskbar-idle-rpg-save"]` through the local DevTools connection. It does not write to localStorage or the game profile. Use `backup` as the third argument to export the backup key instead:

```powershell
node src/cli.js export-save backup.json 9222 backup
```

## Craft Controller

The craft controller is separate from the read-only analyzer. It connects to the running game through the local DevTools port and clicks the game's existing Compound, Auto-fill, and Craft controls. The game remains responsible for item validation, success rolls, inventory changes, cube XP, and saving.

It requires explicit confirmation:

```powershell
node src/cli.js craft 5 9222 gear --confirm
node src/cli.js craft 5 9222 charm --confirm
node src/cli.js craft 5 9222 both --confirm
node src/cli.js craft 1 9222 gear --confirm --loop
```

Before each run it reads the live debug state, requires a safe group of nine unlocked, unequipped items, and reports an explicit `exitReason` when it stops. If the active inventory has no safe batch, it checks storage and enables the game's existing `Include storage items` control when a safe storage-backed batch is available. `both` mode chooses between eligible gear and charm batches, keeping the lanes separate. Immortal gear is eligible unless its combined `atkPct` is greater than `0.90` and its combined `skillPower` is greater than `0.40`; those values are summed from the item's `opts` and `enhances` arrays and are preserved from crafting. Override the defaults with `--min-atk-pct` and `--min-skill-power` (values are decimal fractions, so 90% is `0.9`). Gear-capable modes batch-open all pending common, rare, and boss chests through the game's existing chest API at the start of every iteration, including when no safe craft group exists, and checks again after a verified gear craft. Without `--confirm`, it refuses to run because crafting changes the live game state.
The controller supports the game's current level bands through `125`, including `100-115`. By default it selects the best available band automatically; pass `--level-band 100-115` to restrict materials to that band. The live dashboard exposes the same choice under `Item level band`.

Add `--loop` to repeat verified crafts every 10 seconds. The loop stops when no safe nine-item group remains or any controller check fails. Press `Ctrl+C` to stop it manually.

## Live Battle Dashboard

With TASMON running on its local DevTools port, start the read-only dashboard:

```powershell
node src/cli.js live
```

Open `http://127.0.0.1:4173`. The dashboard samples a narrow projection from `window.__battleDebug()` once per second through CDP. It reports gross battle gold per minute, net gold per minute, party experience per minute, kills per minute, estimated chests per minute, the uncapped summed party `chestBonus`, current stage, and current party progress. The `Egg drops` tab records newly observed egg IDs and rarities for the dashboard session, with rarity percentages, a newest-first timeline, eggs/hour, average interval, and best/common rarity highlights. Estimated chests per minute is the kill rate multiplied by the current effective normal chest-drop chance; it does not modify live state. Gross gold counts positive gold changes; net gold also includes spending. The dashboard binds to localhost and does not modify the game archive, renderer code, Local Storage, or save data.

The `Awakenings` tab groups duplicate monsters by species. Choose the monster to keep, then compare two plans: `Safe path` uses low-value same-species copies for guaranteed stages, while `Cheapest path` spends low-cost non-safe fodder on earlier chance rolls and preserves same-species copies for later guaranteed stages. `Use this plan` applies either recommendation to the existing batch selection, which can still be adjusted manually. Favorites, party members, and expedition monsters are protected. The dashboard drives the game's existing Compound/Awakening UI through CDP, so the game remains responsible for validation, consumption, RNG, saving, and inventory redraw. The read-only inventory projection is available at `GET /api/awakenings`; confirmed actions use `POST /api/awaken` with `{ "targetId": "...", "foodIds": ["..."] }`.

## Constellation Viewer

Start the read-only perk board viewer with:

```powershell
node src/cli.js constellation
```

Open `http://127.0.0.1:4180`. Select a party member to overlay activated nodes and inspect aggregate Attack, HP, and secondary perk bonuses from the exported `save.json`.

## Current Scope

- ASAR file indexing and selective extraction
- Read-only validation and summary of exported save JSON
- Real party attack and maximum HP resolution using the installed game definitions
- Standalone HTML attack, maximum HP, and skill calculation report
- Pure normal-attack and skill-damage calculations
- Tests for the confirmed damage formula
- Documentation of Raise and breeding skill inheritance rules

The report's maximum HP section shows the party total and each member's breakdown. It uses the installed game's HP formula: `round((base HP x level growth x HP IV x rarity x passive x awakening x job x pinnacle x equipment HP% x perk x breeding x collection) + equipment flat HP)`. The skill section shows each equipped skill's neutral single-target baseline. It includes attack, skill power, equipment/perk/job skill-power bonuses, and cooldown. Element matchup, role matchup, boss/trial modifiers, buffs, and critical state are shown as formula factors but are not assumed in the neutral baseline.

Skill inheritance rules are documented in the `context.md` section `Skill Inheritance: Raise vs. Breeding`. In short, Raise (feeding a departing Tasmon to a Growing Tasmon) can transfer one eligible skill only when the target has an open learned-skill slot. The full list of exclusions and the separate breeding rules are described there.
