# TASMON Analyzer

Local tools for inspecting, measuring, and automating the installed TASMON game.

The project reads the game's ASAR archive and can connect to a running game through its local Chrome DevTools Protocol (CDP) port. Analysis commands are read-only. Crafting, awakening, etching, and dashboard automation use the game's existing controls and can change the live save.

## Requirements

- Windows with TASMON installed
- Node.js 22 or newer
- The project directory next to the TASMON installation's `resources` directory

The expected layout is:

```text
Taskbar Monsters/
  TaskbarMonsters.exe
  resources/app.asar
  info_project/
```

The default archive path is `..\resources\app.asar` relative to this project. See [context.md](context.md) for more background about the game layout and save format.

## Quick Start

Open PowerShell in this directory, then install dependencies if the project has them:

```powershell
npm install
```

Run the checks:

```powershell
npm run check
npm test
```

To inspect an exported save without starting the game:

```powershell
npm start -- inspect-save save.json
```

To start the live dashboard:

1. Close TASMON if it is already running.
2. Launch it with a local CDP port:

   ```powershell
   & "..\TaskbarMonsters.exe" --remote-debugging-port=9222
   ```

3. Start the dashboard:

   ```powershell
   npm start -- live
   ```

4. Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

The dashboard samples live battle state once per second. Its Battle rates, Egg drops, Skills, Awakenings, Etching, and Automation tabs are available from the navigation bar.

## Export A Save

With TASMON running on CDP port `9222`:

```powershell
npm start -- export-save save.json
```

To export the backup save instead:

```powershell
npm start -- export-save backup.json 9222 backup
```

The exporter reads Chromium Local Storage through CDP. It does not write to the game profile.

## Common Commands

All commands are run from `info_project`.

### Inspect and calculate

```powershell
# List matching files in the game archive
npm start -- list 'src/game/(battle|data|equipment|state)\.js$'

# Extract one archive file into this project
npm start -- extract /src/game/battle.js extracted/battle.js

# Resolve the active party's attack from an exported save
npm start -- party-attack save.json

# Estimate the KPM required by a stage
npm start -- simulate-kpm save.json 1 9 --target-kpm 600

# Read the live battle state instead of a save file
npm start -- simulate-kpm --live 3 9 --target-kpm 600

# Generate a standalone HTML calculation report
npm start -- render-report save.json report.html

# Start the read-only constellation viewer
npm start -- constellation
```

The constellation viewer is available at [http://127.0.0.1:4180](http://127.0.0.1:4180).

### Crafting

Crafting requires explicit `--confirm` because it changes the live game:

```powershell
npm start -- craft 5 9222 gear --confirm
npm start -- craft 5 9222 charm --confirm
npm start -- craft 5 9222 both --confirm
```

Useful options include:

```powershell
# Repeat every 10 seconds until the controller stops safely
npm start -- craft 1 9222 gear --confirm --loop

# Restrict materials to a level band
npm start -- craft 1 9222 gear --confirm --level-band 100-115

# Change preservation thresholds (decimal fractions)
npm start -- craft 1 9222 gear --confirm --min-atk-pct 0.9 --min-skill-power 0.4
```

The controller only uses safe groups of nine unlocked, unequipped items. It protects favorites, party members, expedition monsters, and preserved high-quality gear according to the configured thresholds.

## Dashboard Automation

The dashboard can drive the game's existing UI through CDP:

- Auto crafting
- Egg opening and awakening/duplicate cleanup
- High-rarity leveling
- Etching helper
- Repeated Farm this stage sequences

These features are opt-in. Review the selected targets and settings before enabling them. The awakening automation frequency is user-configurable. The farm sequence defaults to four non-boss targets with 500 ms gaps and can optionally include the boss level with its explicit checkbox.

Automation is not a replacement for a save backup. Export a save before using any feature that consumes items or changes the game state.

## How It Works

- `src/cli.js` provides the command-line interface.
- `src/cdp.js` provides the local CDP bridge.
- `src/live.js` runs the live dashboard server and coordinates live input operations.
- `dashboard/index.html` contains the dashboard UI.
- `src/damage-model.js`, `src/real-stats.js`, and `src/simulate-kpm.js` implement analysis and estimates.
- `.runtime/` contains the game definitions used for calculations.
- `extracted/` contains selected archive files used for reference and comparison.

The project does not unpack or modify the game archive. Reference files under `extracted/` and `.runtime/` do not automatically change the packaged executable.

## Safety And Privacy

- CDP is configured for local use by default at `127.0.0.1:9222`.
- The dashboard binds to `127.0.0.1` by default.
- `--lan` and `--host` expose the dashboard beyond localhost; use them only on a trusted network.
- Exported saves can contain your game progress. Treat `save.json`, `save-live.json`, and backup files as private.
- Do not run state-changing commands without a current backup and an understanding of the selected options.

## Documentation

- [context.md](context.md): game layout, save format, and confirmed formula notes
- [farm-loop-handoff.md](farm-loop-handoff.md): Farm sequence research and safe continuation notes
- [turbo_research.md](turbo_research.md): historical timing research and experiments

## Development

Run the full local validation suite before submitting changes:

```powershell
npm run check
npm test
```

Tests use Node's built-in test runner. Do not commit generated logs, exported saves, or dashboard screenshots unless they are intentionally part of the change.
