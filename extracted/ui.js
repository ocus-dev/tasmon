import {
  AWAKENING,
  AWAKEN_MAX,
  PERKS,
  PERK_INTERVAL,
  perkHash,
  perkMilestones,
  SKILL_PICK_INTERVAL,
  skillChoices,
  skillMilestones,
  SKILLS,
  skillStars,
  ELEMENT_META,
  elementMult,
  ELEMENT_ADVANTAGE,
  roleMult,
  ROLE_KEYS,
  ROLE_ADVANTAGE,
  stageElement,
  counterElement,
  stageGimmick,
  ENEMY_ELEMENTS,
  enemyTier,
  gradeFromIv,
  DIFFICULTIES,
  HATCH_TABLE,
  KILLS_PER_STAGE,
  LEVEL_CAP,
  MAX_EGG_SLOTS,
  STAGES_PER_DIFFICULTY,
  RARITY_META,
  RARITY_ORDER,
  rarityWeights,
  wildEggWeights,
  SHINY_CHANCE_BRED,
  SHINY_CHANCE_WILD,
  SHINY_FEED_INHERIT,
  JOBS,
  jobStat,
  PINNACLE_GAMBLE,
  dexTotals,
  dexBuffOf,
  DEX_MILESTONES,
  RARE_JOB_CHANCE,
  SKIP_JOB_CHANCE,
  HIDDEN_JOB_CHANCE,
  EVOLVE_FAIL_CHANCE,
  EVO_STONES,
  EVO_STONE_ROLES,
  SPHERE_BOARD_SIZE,
  SPHERE_NODES,
  SPHERE_SECTORS,
  SPHERE_SECTOR_SPECIALS,
  SPHERE_START,
  SPHERE_STATS,
  SPECIES,
  SHIELD_CAP_PER_SEC,
  GUARD_CUT_CAP,
  DEFENSE_REDUCTION_FLOOR,
  UPDATE_FEED,
  LATEST_SEASON,
  GAME_MAILS,
  OFFLINE_CAP_MS,
} from "./game/data.js";
import { EVOLVE_LEVELS } from "./game/data.js";
import {
  effectiveSkill,
  equippedSkillsOf,
  enemyAtk,
  perkStat,
  partyDefenseMult,
  hazardTakenMult,
  recommendedPower,
  enemyMaxHp,
  goldReward,
  expToNext,
  monsterAtk,
  setDexCollectionBonus,
  monsterMaxHp,
} from "./game/battle.js";
import {
  breedResultSpecies,
  breedSuccessRate,
  breedJumpChance,
  childPlus,
  defaultInheritPick,
  inheritChoices,
  PLUS_STAT_PER,
  RECIPE_LIST,
} from "./game/breeding.js";
import { hatchEgg, makeEgg } from "./game/eggs.js";
import { evolvedNameOf, evolutionLineOf } from "./game/evolution-names.js";
import { rollDailyBossDrop } from "./game/state.js";
import { MISSIONS, missionView, missionClaimableCount, claimMission, bumpMissionCounter, refundTutorialCost } from "./game/missions.js";
import {
  PASS_SEASON, PASS_TIER_EXP, PASS_MAX_TIER, PASS_QUESTS,
  passFreeReward, passPremiumReward, passState, passTier, passRemainDays,
  passProgress, passClaimFree, passClaimPremium, passPremiumOwned, battleSpeedOf,
} from "./game/pass.js";
import {
  DLC, DLC_IDS, dlcOwned, ownedDlcIds, setDlcProvider,
  TITLES, availableTitles, activeTitle, setTitle,
  STARTER_PACKS, STARTER_PERKS, SKIN_DLC, claimStarterPerks, pendingStarterPacks,
} from "./game/dlc.js";
import { devFlags, isDevAllowed, setDevAllowed } from "./game/devmode.js";
import { loadItemImages, partIconSprite } from "./game/item-sprites.js";
import { BOSS_COIN_CHANCE, COIN_DROP_CHANCE, coinDropWeights, GACHA_COINS, pullGacha } from "./game/gacha.js";
import { weightedPick } from "./game/rng.js";
import {
  CRAFT_COST,
  CUBE_LEVEL_MAX,
  CUBE_UNLOCK_LEVEL,
  CUBE_EXP_BY_RARITY,
  cubeExpToNext,
  describeOpt,
  EQUIP_DROP_CHANCE,
  NORMAL_CHEST_BONUS_MULT,
  NORMAL_AREA_RARE_BOX_MULT,
  normalChestWeights,
  equipStat,
  itemBand,
  bandLabel,
  CRAFT_BANDS,
  bandMinOf,
  bandCeilOf,
  EQUIP_LV_TIERS,
  PARTS,
  PART_ORDER,
  ROLE_WEAPONS,
  CHARM_KINDS,
  CHARM_SLOT_KINDS,
  charmKindOf,
  PART_UNLOCK,
  CHARM_SLOT_UNLOCK,
  PART_SLOTS,
  inferPart,
  INV_CAP,
  itemScore,
  bossChestWeights,
  itemSellPrice,
  itemQuality,
  marketValueEstimate,
  marketListable,
  MARKET_MIN_RARITY,
  optQuality,
  rerollCost,
  STAT_META,
  ENHANCE_KINDS,
  ENHANCE_GRADES,
  ENHANCE_TIERS,
  ENHANCE_ROLL_COST,
  ENHANCE_ROLL_COSTS,
  ENHANCE_MIN_RARITY,
  ENHANCE_KIND_MULT,
  ENHANCE_PART_CAT_LABEL,
  enhancePartCat,
  enhanceSlotDisplayOrder,
  enhanceSlotsOf,
  enhanceGradeRates,
  rollItemOfRarity,
  rollBossChestItem,
  rollNormalChestItem,
  equipLvTier,
  expectedLevelForStage,
} from "./game/equipment.js";
import {
  CRAFT_SUCCESS, cubeCanCraft, cubeCanCraftBand, cubeLevelOf,
  enhanceUnlocked, enhanceRollSlot,
  keyRarityOf, CRYSTAL_RARITY, preciousRarityOf, preciousMarketEstimate,
  loadTradeShipPrecious, unloadTradeShipPrecious,
} from "./game/state.js";
import {
  addLog,
  applyKill,
  equipItem,
  applyOfflineProgress,
  breed,
  canBreed,
  craftItemsExact,
  craftablePool,
  unequipItemById,
  alchemizeItems,
  alchemizeMonsters,
  alchemizeEggs,
  depositAll,
  deserialize,
  moveToInventory,
  moveToStorage,
  moveCoinToStorage,
  moveCoinToInventory,
  sellJunk,
  storageCapOf,
  storageSlotCost,
  buyStorageSlot,
  STORAGE_MAX_CAP,
  leader,
  makeMonster,
  MAX_PARTY,
  newGameState,
  partyAtk,
  partyAttackSpeed,
  partyIvAvg,
  partyCritRate,
  partyCritDmg,
  partyCdr,
  critDpsMult,
  partyDefenseCut,
  partyGoldBonus,
  partyMonsters,
  CHEST_CAP,
  CHEST_CAPS,
  chestCapOf,
  autoOpenCdMult,
  buyChestCapUpg,
  buyAutoOpenUpg,
  CHEST_UPG_MAX,
  CHEST_CAP_UPG_PRICES,
  AUTO_OPEN_UPG_PRICES,
  bossKeyCount,
  addBossKey,
  addCrystal,
  grantDebugEndgameParty,
  keyLabelOf,
  crystalCount,
  partyLifesteal,
  partyBossDmg,
  chooseStarter,
  hatchStarter,
  hatchStarterEgg,
  STARTER_EGGS,
  STARTER_CHOICES,
  nextIncubatorUnlock,
  evoStoneRarityOf,
  loadTradeShipStone,
  eggReadyAt,
  INCUBATOR_MAX_SLOTS,
  isBossStage,
  isRookie,
  eggDropBreakdown,
  ROOKIE_DEF_MULT,
  ROOKIE_CHEST_MULT,
  ROOKIE_REGEN_PER_SEC,
  HEAL_CAP_PER_SEC,
  HEAL_BURST_WINDOW_SEC,
  effectiveStage,
  maxStageOf,
  bossClearedOf,
  difficultyUnlocked,
  setDifficulty,
  stageKillTarget,
  registerDex,
  claimedDex,
  refundDailyBoss,
  featureUnlocked,
  boxCapOf,
  boxCount,
  boxSlotCost,
  buyBoxSlot,
  BOX_CAP_STEP,
  BOX_CAP_MAX,
  claimDexBuff,
  dexUnclaimedCount,
  dexEvolutionOf,
  dailyBossAvailable,
  dailyBossSlot,
  consumeDailyBoss,
  KEY_FROM_CHEST_CHANCE,
  choosePerk,
  resetPerksWithToken,
  learnSkill,
  pendingSkillPicks,
  skillPicksOf,
  toggleEquippedSkill,
  setEquippedSkillAt,
  skipSkillPick,
  SKILL_LOADOUT_MAX,
  buyEggSlot,
  EGG_CAP_MAX,
  EGG_CAP_STEP,
  eggCapOf,
  eggSlotCost,
  invCapOf,
  invSlotCost,
  buyInvSlot,
  buyInvSlotWithCoin,
  INV_CAP_MAX,
  INV_CAP_STEP,
  INV_EXPAND_COIN,
  openChest,
  pendingPerks,
  partyAtkVs,
  releaseMonster,
  RELEASE_GOLD,
  feedMonster,
  totalExpAt,
  monsterToEquipment,
  conversionOdds,
  autoEquipBest,
  awakenRitual,
  awakenRitualOdds,
  canEvolve,
  canPinnacle,
  pinnacleCost,
  pinnacleEvolve,
  claimExpedition,
  DEBUG_BOOST_MULT,
  debugBoost,
  evolveCost,
  evolveMonster,
  evolveOptions,
  evoStoneCount,
  evoStoneStoredCount,
  moveEvoStoneToStorage,
  moveEvoStoneToInventory,
  addEvoStone,
  craftEvoStone,
  EVO_STONE_CRAFT_COST,
  evolveStage,
  monRarityOf,
  feedPreview,
  toggleDebugBoost,
  sphereActivate,
  jobRoleOf,
  sphereFrontier,
  sphereTaken,
  sphereLockReason,
  EXPEDITION_MAX_MONS,
  EXPEDITION_SLOT_MAX,
  expeditionCapOf,
  expedSlotCost,
  buyExpedSlot,
  TRADE_SHIP_CAP,
  loadTradeShip,
  unloadTradeShip,
  tradeCargoCount,
  tradeTokenState,
  marketSlotsOf,
  MARKET_SLOT_MAX,
  TRADE_SHIP_MON_CAP,
  monsterListable,
  loadTradeShipMonster,
  unloadTradeShipMonster,
  EXPEDITION_HOURS,
  expeditionOutlook,
  activeExpeditionSpot,
  dailyBossVariant,
  expeditionInfos,
  expeditionPartyCount,
  expeditionsOf,
  EXPEDITION_PARTY_SIZE,
  onExpedition,
  startExpedition,
  AWAKEN_RITUAL_CAP,
  rerollItem,
  sellItem,
  serialize,
  setStage,
  storageUsed,
  movePreciousToStorage,
  movePreciousToInventory,
  togglePartyMember,
  unequipItem,
  unequipAllMonsters,
  isCatchingUp,
  PARTY_CATCHUP_EXP_MULT,
  PARTY_CATCHUP_THRESHOLD,
} from "./game/state.js";
import { drawSprite, eggSprite, chestSprite, spriteGrid, SHINY_HUE } from "./game/sprites.js";
import {
  getBossSprite,
  getEnemySprite,
  getMonsterSprite,
  getEvolvedMonsterSprite,
  getJobSprite,
  hasDedicatedChar,
  loadCustomSprites,
  loadBattleBackgrounds,
} from "./game/sprite-registry.js";
import { BattleScene } from "./battle-scene.js";
import {
  MEYASUBAKO_CATEGORIES,
  MEYASUBAKO_ENDPOINT,
  TEXT_MAX as MEYASU_TEXT_MAX,
  buildCtx as buildMeyasuCtx,
  canPost as canPostSuggestion,
  nextPostableAt,
  submit as submitSuggestion,
  fetchReport as fetchMeyasuReport,
  flushOutbox as flushMeyasuOutbox,
  submitTrialVote,
} from "./game/meyasubako.js";
import { fetchGifts, claimGift, applyGiftItem } from "./game/gifts.js";
import { activeTrials, votingOpen, trialRemainMs, nextDeadline, nextRelease, trialCycleStarted } from "./game/trial.js";
import {
  sfx,
  setBgmMood,
  initAudioOnGesture,
  soundEnabled,
  bgmEnabled,
  setSoundEnabled,
  setBgmEnabled,
} from "./game/audio.js";
import { T, setLang, LANG, preferredLang, applyDataLocale, translateStaticDom, enableAutoTranslate, scanUntranslated } from "./game/i18n.js";
import { LANGS } from "./game/i18n-locales.js";


// 検証モードの許可は「起動引数だけ」で決まる(preload が window.tbmDev で渡す)。
// 他のどの初期化よりも先に確定させる — 以降の判定が全部同じ答えを見るように。
setDevAllowed(window.tbmDev?.allowed === true);

// 有料DLCの所有判定を Steam に繋ぐ(2026-07-28)。
// これ以前は所有判定が常に false で、有料機能はどうやっても開かなかった。
// 差し替えるのはこの1点だけ — dlcOwned() を通る経路は全部これを見る。
// Steamが無い環境(開発中の npm start・Steamを通さない起動)では
// window.tbmSteam が付かないので、これまで通り「全部未所有」で動く
{
  // 最初は「全部未所有」で始めて、Steamから返事が来たら差し替える。
  // 返事を待ってから描くと、Steamが無い環境で起動が止まる(実際に踏んだ)。
  // 有料の窓は起動直後には開いていないので、後から入っても見た目は破綻しない
  let ownedDlc = {};
  setDlcProvider((id) => ownedDlc[id] === true);

  const applyOwned = (next, announce) => {
    if (!next) return;
    const changed = DLC_IDS.some((id) => (next[id] === true) !== (ownedDlc[id] === true));
    ownedDlc = next;
    // 受け取り方メールを新規所有ぶんだけ1回送る(2026-08-12)。announce(フォーカス
    // 復帰時のみtrue)とは無関係に判定する: 先に買ってから初めて起動した人にも
    // 「起動直後から既に所有」というケースで案内が要るため、changed/announceに
    // 頼らずここで毎回チェックする
    state.settings.dlcMailSent = state.settings.dlcMailSent ?? {};
    let mailed = false;
    for (const id of DLC_IDS) {
      if (next[id] === true && state.settings.dlcMailSent[id] !== true) {
        state.settings.dlcMailSent[id] = true;
        mailed = true;
      }
    }
    if (mailed) {
      updateMailBadge();
      if (openOrder.includes("notice") && noticeTab === "mail") renderNotice();
      save();
    }
    if (!changed) return;
    renderHud();
    if (openOrder.includes("pass")) keepScroll(renderPass);
    if (announce) toast(T("🎉 購入を確認した。有料コンテンツが開いた"), "#ffd67a");
  };

  window.tbmSteam?.ready?.().then((o) => applyOwned(o, false)).catch(() => {});
  // 「Steamで購入」から戻ってきたら取り直す。買った直後に再起動を強いると、
  // そこで返金される。買ったらすぐ使えるのが、有料コンテンツの最低条件
  window.addEventListener("focus", () => {
    window.tbmSteam?.refresh?.().then((o) => applyOwned(o, true)).catch(() => {});
  });
}
// TDZ回避: 初期化中(loadCustomSprites の rAF コールバックや toast())から参照される
// let/const は、その参照点より前=ファイル先頭で宣言する。Electron(file://)は画像が
// 同期的に load してコールバックが評価途中で走るため、宣言が下にあると
// 「Cannot access before initialization」で起動が丸ごと落ちる(2026-07-10 修正)。
let openOrder = []; // 開いている順(古い→新しい)。実体は下の window 管理で使う
let currentDetailId = null;
let expedSelIds = new Set(); // 探索に出す子の選択(タスモン窓の選択モードで選ぶ)
let expedSelectMode = false; // タスモン窓を「探索メンバー選択」モードにする(2026-07-11)
let expedHours = 12; // 探索時間の選択(3/6/12)
// いま編成できる「次のパーティ」の人数(2026-08-13 複数パーティ化)。
// 基本は3体1組。＋1枠購入の端数ぶんは最後の組だけ小さくなる。
// 出せる組数(expeditionPartyCount)を使い切っていたら0
function expedNextPartySize() {
  const infos = expeditionInfos(state);
  if (infos.length >= expeditionPartyCount(state)) return 0;
  const inFlight = infos.reduce((s, x) => s + x.monIds.length, 0);
  return Math.max(0, Math.min(EXPEDITION_PARTY_SIZE, expeditionCapOf(state) - inFlight));
}
let expedNotified = false; // 探索完了トーストの一度きり制御
let expedCheckTimer = 0; // 帰還チェックのスロットル
let sphereView = null; // スフィア盤のビュー {cx, cy, zoom}(セッション中は解放後も維持)
// お任せ振り分けの実行中フラグ(多重起動防止)。
// 2026-07-29 FB「お任せで振ろうとしても触れないバグ」: 実行中に例外や再描画で
// 終了処理が走らないとフラグが立ちっぱなし=ボタン永久死になっていた。
// 値を「開始時刻」にして、古すぎるフラグは押した側が自己回復する(hatching事故と同型)
// 値は「最後に1歩進んだ時刻」(心拍)。開始時刻のままだと、長いルート(100pt≈34秒)が
// ゾンビ判定に引っかかるか、逆にゾンビを許す時間を延ばすかの二択になる。
// 心拍にすると「動いているか」を長さと無関係に見分けられる
let sphereAutoRunning = 0; // 0=停止中 / それ以外=最後に1歩進んだ時刻(ms)
const SPHERE_AUTO_STUCK_MS = 15000; // 心拍がこれだけ途絶えたらゾンビとみなす
const SPHERE_AUTO_ALIVE_MS = 3000; // 再描画を先送りする猶予(1歩=340msなので十分広い)
// お任せ実行中に来た再描画の先送り(2026-07-30 FB「お任せにすると途中で止まる」)。
// 盤面を載せている窓を作り直すとキャンバスがDOMから外れ、振り分けが自分で
// 止まっていた(水晶ドロップ・進化・パーティ交代などが戦闘中に renderDetail を呼ぶ)。
// 実行中の再描画はここに溜めて、振り終わってから1回だけ流す
const sphereDeferredRender = { detail: false, skills: false };
// ルート確認(「このルートで振る」の2回目クリック待ち)もbusy扱い(2026-08-01 Haru報告
// 「選択肢が出るけどすぐに戻って押せない」: 確認待ちは実行中フラグの外だったため、
// 周回中の撃破再描画が0.2秒で盤面を作り直し、確認ボタンが即座に消えていた)。
// booleanでなく提示時刻で持ち、60秒で自然失効(放置しても再描画が永久に止まらない)
let spherePlanShownAt = 0;
const SPHERE_PLAN_WAIT_MS = 60000;
function sphereAutoBusy() {
  if (sphereAutoRunning > 0 && Date.now() - sphereAutoRunning < SPHERE_AUTO_ALIVE_MS) return true;
  return spherePlanShownAt > 0 && Date.now() - spherePlanShownAt < SPHERE_PLAN_WAIT_MS;
}
const msgHistory = []; // TBH風RECORDS: 直近のメッセージを遡れるように保持
const MSG_HISTORY_MAX = 150;

const SAVE_KEY = "taskbar-idle-rpg-save";
const BACKUP_KEY = "taskbar-idle-rpg-save-backup";
const TICK_MS = 50;
const PLAYER_ATTACK_INTERVAL = 1.0;
const ENEMY_ATTACK_INTERVAL = 1.6;
// 自動回復は無し(2026-07-06確定): 回復はヒーラーのスキルだけ=職業の存在意義を作る

// ---- 状態のロード ----
// メインのセーブが壊れていたらバックアップから復旧する(セーブ破損の保険)。
let state = null;
try {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) state = deserialize(saved);
} catch {
  state = null;
}
if (!state) {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) state = deserialize(backup);
  } catch {
    state = null;
  }
}
if (!state) state = newGameState();

// 言語の適用は「最初の描画より前」が絶対条件(2026-07-18実測: 後ろに置くと
// 先に組まれるパーティ行などが日本語のまま残る)。
// 初回だけOSの言語に合わせて決め、その結果をセーブに書く(2026-07-28)。
// 一度決めたら以後は動かさない — OSの言語を変えただけでゲームの言語が
// 勝手に入れ替わるのは、🌐で選んだ人の意思を無視することになる
if (!state.settings?.lang) {
  state.settings = state.settings ?? {};
  state.settings.lang = preferredLang(navigator.languages ?? [navigator.language]);
}
setLang(state.settings.lang);
applyDataLocale();
// CSS側が言語で振る舞いを変えられるように印を付ける(例: 窓タイトルの字間。
// 和文用のletter-spacing 7pxは英文の長いタイトルだと窓に収まらない 2026-07-21)
// data-lang は **和文 or 欧文** の2値。欧文レイアウト調整(語が長い・字間を詰めない)は
// 中露西葡独仏韓すべてに等しく必要なので、既存の [data-lang="en"] 指定を全言語で活かす。
// 言語ごとの微調整が要るときは data-lang2(正確なコード)を使う
document.body.dataset.lang = state.settings.lang === "ja" ? "ja" : "en";
document.body.dataset.lang2 = state.settings.lang;

const offline = applyOfflineProgress(state);

// 図鑑バフの反映(2026-07-16): 攻撃/HPは battle.js のグローバル係数として効かせる。
// balance-simとテストはこれを呼ばない=図鑑は覚醒と同じ「プレイヤー側の上振れ」扱い。
// 登録経路(孵化/配合/スターター)が複数あるため、起動時+帰還チェックの5秒間隔で同期する
function syncDexBonus() {
  const t = dexTotals(claimedDex(state)); // バフは解放済みぶんだけ(2026-07-18 解放ボタン制)
  setDexCollectionBonus(1 + t.atk, 1 + t.hp);
}
syncDexBonus();

// 図鑑ボタンの赤丸(未解放バフの数 2026-07-18 FB)。ボタンはタスモン窓の固定要素
function updateDexBadge() {
  // ※モジュール初期化の早い段階でも呼ばれるため $ ヘルパではなく直接引く
  const btn = document.getElementById("box-dex-btn");
  if (!btn) return;
  let dot = btn.querySelector(".dex-reddot");
  const n = dexUnclaimedCount(state);
  if (n > 0) {
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "dex-reddot";
      btn.appendChild(dot);
    }
    dot.textContent = n > 9 ? "9+" : String(n);
  } else {
    dot?.remove();
  }
}
updateDexBadge();

// ---- UI自己監視(2026-07-19 FB「進化してもアイコンが変わらない。こういうバグが
// 一切ないように自己監視できるシステムを」) ----
// 描画時に付けた data-uiKey(種族|進化スキン|覚醒)と現在のstateを定期照合し、
// ズレた窓を自動で描き直す(自己修復)。ズレはコンソールに記録=バグの早期発見。
// 手動検査は window.__scanStaleUi()(出荷ゲート: スモーク後に0件必須)
window.__scanStaleUi = () => {
  const stale = [];
  for (const el of document.querySelectorAll("[data-mon][data-ui-key]")) {
    const mon = state.monsters[el.dataset.mon];
    if (!mon) continue; // 逃がした直後などは窓側の再描画で消える(不一致とは別)
    // 閉じている窓の残骸は無害(開くとき必ず再描画される)ので、可視要素だけ検査
    const panel = el.closest("[id$=-panel]");
    if (panel?.classList.contains("hidden")) continue;
    if (!panel && el.offsetParent === null) continue;
    const now = `${mon.speciesId}|${mon.evoSkin ?? ""}|${mon.awakening ?? 0}`;
    if (el.dataset.uiKey !== now) {
      stale.push({ win: panel?.id ?? "?", mon: mon.id, was: el.dataset.uiKey, now });
    }
  }
  return stale;
};
setInterval(() => {
  try {
    const stale = window.__scanStaleUi();
    if (stale.length === 0) return;
    console.warn("[UI自己監視] 陳腐化した表示を自動修復:", stale);
    for (const winId of new Set(stale.map((s2) => s2.win))) {
      const key = winId.replace(/-panel$/, "");
      if (key === "battle") syncSceneParty(); // バトル窓のパーティ行はここで組み直る
      else if (openOrder.includes(key)) renderers[key]?.();
    }
    refreshMonViews();
    renderHud();
  } catch { /* 監視自体がゲームを壊さないこと */ }
}, 8000);

// パーティ合計HPを1つのゲージとして扱う
function partyMaxHp() {
  return partyMonsters(state).reduce((s, m) => s + monsterMaxHp(m), 0);
}

// サステイン基準HP(2026-07-21 FB「HP%盛り×HP比シールドでほぼ無敵」対策):
// 回復の毎秒予算とバリアの発行量は「細工由来のHPアップを除いたHP」を基準にする。
// 細工でHPを盛っても表示HP・耐久は増えるが、毎秒の回復・バリア量は増えない
// (敵の攻撃は絶対値なので、%基準サステインをHPスケールさせると恒久無敵になる)
function partySustainBasisHp() {
  return partyMonsters(state).reduce((s, m) => s + monsterMaxHp(m, { sustainBasis: true }), 0);
}

// 敵は3体編成(ウェーブ制)。enemyGroup は各敵の残りHP。全滅で次のウェーブが湧く。
let enemyGroup = [];
let enemyRowEls = []; // 青窓の敵行(属性/ジョブアイコン+HPバー)。spawn時に組み、毎フレーム幅だけ更新
let playerHp = partyMaxHp();

// いま狙っている敵(先頭の生存敵)。-1 なら全滅中。
function targetIdx() {
  return enemyGroup.findIndex((hp) => hp > 0);
}
let playerAttackTimer = 0;
let enemyAttackTimer = 0;
let hatching = false;
// トーストの消灯タイマー。spawnWave(モジュール初期化中に走る)がtoastを呼ぶことが
// あるため、宣言は必ずここ(初期化フローより前)に置く ※TDZクラッシュの前科あり
let toastTimer = null;

// スキル: パーティメンバーごとに独立したクールダウン(残り秒)
let skillCd = [];
// 攻撃バフ(buffスキル): 倍率と残り秒
let atkBuff = { mult: 1, timer: 0 };
// タンクの「かばう」(guardスキル)。cut=被ダメ軽減率、counterDmg=攻撃してきた敵への反撃
let defBuff = { cut: 0, timer: 0, counterDmg: 0 };
// ---- スキル多様化(2026-07-11): 追加のバフ/状態 ----
let hasteBuff = { mult: 1, timer: 0 }; // ヘイスト(攻撃速度)
let regenBuff = { hpsFrac: 0, timer: 0, by: null }; // リジェネ(毎秒 最大HP×hpsFrac 回復)
let critBuff = { add: 0, timer: 0 }; // 会心率アップ
let shieldHp = 0; // バリア(被ダメを先に吸収する使い捨てプール)
let shieldTimer = 0;
// 継続ダメージ {dps, t, by} の配列(敵スロットごと)。術者ごとに1本まで持てる
// (2026-07-21 FB分析: 旧実装は1本の上書き式で、dot持ちを複数編成すると互いに
// 打ち消し合っていた=23種あるdotがビルドとして成立しない「罠」だった。
// 難易度モデルは各メンバーのスキルDPSを独立に合算しているので、この修正で
// 実装がモデルの想定に一致する)
let enemyDots = [[], [], []];
let dotAcc = [0, 0, 0]; // 継続ダメージの表示用蓄積
let dotShowTimer = 0;

function resetSkillCooldowns() {
  // メンバーごと×セットスキルごとのCD。開始位置をずらして発動が重ならないように
  skillCd = partyMonsters(state).map((m, i) =>
    equippedSkillsOf(m).map((sk, s) => sk.cooldown * (0.4 + i * 0.2 + s * 0.5)),
  );
}
resetSkillCooldowns();

// ---- DOM参照 ----
const $ = (id) => document.getElementById(id);

// 再描画でスクロール位置が先頭に戻らないようにする(2026-07-15 FB「合成などで右クリック
// すると勝手に初期位置にスクロールして戻る機能やめて」)。
// 各render関数は innerHTML="" で中身を作り直すため、スクロール中に右クリック(=合成
// スロットから外す等)すると一覧の先頭へ飛ばされ、探していた場所を見失っていた。
// 窓のスクロール枠そのものは再描画で消えないので、位置を控えて戻せばよい。
const SCROLL_KEEP_IDS = [
  "cube-body", "hero-tab-body", "items-list", "storage-list",
  "box-list", "meyasu-body", "compound-body", "detail-panel",
  "inv-body", // 2026-08-06: インベントリを別窓化
];
function keepScroll(fn) {
  const saved = SCROLL_KEEP_IDS.map((id) => {
    const node = $(id);
    return node ? { id, top: node.scrollTop } : null;
  }).filter((x) => x && x.top > 0);
  fn();
  // 中身を作り直した直後に戻す(高さが復元されているので同期でよい)。
  // 再描画がノードごと置き換えることがある(hero-tab-body等)ので、古い参照ではなく
  // IDで取り直して復元する(2026-07-16 FB「合成に入れるといちいち先頭に戻る」の真因)
  for (const { id, top } of saved) {
    const node = $(id);
    if (node) node.scrollTop = Math.min(top, node.scrollHeight);
  }
}
const el = {
  gold: $("gold-label"),
  enemyHpFill: $("enemy-hpfill"),
  enemyElement: $("enemy-element"),
  ffEnemyWin: $("ff-enemy-win"),
  ffPartyWin: $("ff-party-win"),
  eggSlots: $("egg-slots"),
  boxPanel: $("box-panel"),
  boxList: $("box-list"),
  toast: $("toast"),
  hatchOverlay: $("hatch-overlay"),
  hatchRays: $("hatch-rays"),
  hatchCanvas: $("hatch-canvas"),
  hatchStars: $("hatch-stars"),
  hatchCaption: $("hatch-caption"),
};

// assets/ のカスタムPNGスプライトを読み込む(あれば順次差し替わる)。
// 起動直後は内蔵ドット絵で描画されるため、PNG読み込み完了ごとに(次フレームへ束ねて)
// スプライトを表示している窓を再描画し「起動時だけ初期アイコン」問題を解消する。
let spriteRefreshQueued = false;
function queueSpriteRefresh() {
  if (spriteRefreshQueued) return;
  spriteRefreshQueued = true;
  requestAnimationFrame(() => {
    spriteRefreshQueued = false;
    try {
      syncSceneParty();
    } catch (e) {}
    if (openOrder.includes("detail")) renderDetail(currentDetailId);
    if (openOrder.includes("box")) renderBox();
    if (openOrder.includes("status")) renderStatus();
    if (openOrder.includes("compound")) renderCompound();
    if (openOrder.includes("dex")) renderDex();
  });
}
loadCustomSprites(queueSpriteRefresh);
loadItemImages(); // AI生成の装備アイコン(あれば順次差し替わる。無ければ内蔵ドット絵のまま)

// FFウィンドウの状態(rebuildPartyWindow が初回 syncSceneParty から呼ばれるため、
// scene 生成より前に宣言しておく必要がある)
// 敵の表示名(bat/impはAIアート差し替えに合わせて改名)
// 敵名: 属性(ENEMY_ELEMENTS順)× ティア(小型/獣/巨兵/竜)で決まる。
// 例: 炎×ティア3=「炎竜」。属性は6種全てに対応。
const ENEMY_ELEM_JP = { water: "水", wind: "風", fire: "炎", dark: "闇", earth: "地", light: "光" };
const ENEMY_TIER_JP = ["兵", "獣", "巨兵", "竜"];
function enemyNameOf(variantIdx, tier = 0) {
  const elem = ENEMY_ELEMENTS[variantIdx];
  if (!elem) return "??";
  return `${ENEMY_ELEM_JP[elem] ?? ""}${ENEMY_TIER_JP[Math.max(0, Math.min(3, tier))]}`;
}
let partyRowEls = [];
let lastEnemyWinHtml = "";
let partyPowerEl = null; // パーティ窓の「⚔ 戦力/目安」行
let lastPowerText = "";
let wasRookie = false; // 加護の終わりを祝うトースト用(表示は消したが節目は残す 2026-07-17)

// 役割マーカー(スキルの種類から役割を判定)。パーティ窓の初期化(syncSceneParty)より
// 前に定義しておく — const は巻き上げされないため、後方定義だと初期化中にTDZで落ちる
const ROLE_META = Object.freeze({
  nuke: { key: "nuke", label: "アタッカー", icon: "⚔", color: "#ff8a5a" },
  heal: { key: "heal", label: "ヒーラー", icon: "✚", color: "#8af0a8" },
  guard: { key: "guard", label: "タンク", icon: "🛡", color: "#8ab8ff" },
  buff: { key: "buff", label: "バッファー", icon: "↑", color: "#ffd76a" },
});

// ジョブ(役割)は種族の「基本スキル」で固定(2026-07-09)。装備スキルで職業が変わらないよう、
// effectiveSkill(=装備中)ではなく基本スキルの種類で判定する。
// 2026-07-10: 進化ジョブ(mon.job)があればそのロールを優先(ジョブチェンジ対応)。
function baseRoleType(mon) {
  const jobRole = JOBS[mon?.job]?.role;
  if (jobRole) return jobRole;
  const sp = SPECIES[mon.speciesId];
  return SKILLS[sp?.skillId]?.active?.type ?? "nuke";
}
function roleOf(mon) {
  return ROLE_META[baseRoleType(mon)] ?? ROLE_META.nuke;
}

// ユニーク装備の見た目だけの特殊効果(2026-08-11 Haru指示「戦闘力に直結しない
// ユニークなオプション。色違いになる/戦闘でオーラを纏う」)。装備している間だけ効き、
// 外すと元に戻る(mon.shiny 等の保存データそのものは書き換えない)。
// 「個体の見た目の解決点は1つ」ルール(2026-07-30)に合わせ、ここ1箇所で集約する
function uniqueVisualFx(mon) {
  let shiny = false;
  let auraTier = 0;
  let auraColor = null;
  for (const it of mon?.equipment ?? []) {
    const sp = it?.special;
    if (!sp) continue;
    if (sp.shiny) shiny = true;
    if (sp.auraTier && sp.auraTier > auraTier) {
      auraTier = sp.auraTier;
      auraColor = sp.auraColor ?? auraColor;
    }
  }
  return { shiny, auraTier, auraColor };
}

// 見た目の色相シフト: 色違い(150)+進化ジョブの色(JOBS[].hue)。
// 進化するとキャラの絵の色が変わる=見た目でも進化が分かる(2026-07-11)
function monHue(mon) {
  const shiny = !!mon?.shiny || uniqueVisualFx(mon).shiny;
  // 進化で「姿」が変割った個体(進化専用アート or 上位レアスキン)は色相ずらし不要。
  // 形そのものが変わるので、色違いの色だけ維持する(2026-07-11 FB「色だけじゃなく形も」)
  if (monSkinOf(mon)) return shiny ? SHINY_HUE : 0;
  const jobHue = JOBS[mon?.job]?.hue ?? 0;
  return ((shiny ? SHINY_HUE : 0) + jobHue) % 360;
}

// 進化スキン(上位レア種族の姿)が有効ならその種族IDを返す。
// 優先順(2026-07-28): レア職・隠し職の専用キャラ > 進化専用アート > evoSkin
function monSkinOf(mon) {
  if (!mon || !mon.job) return null;
  if (hasDedicatedChar(mon.job) && getJobSprite(mon.job)) return "__jobChar";
  if (getEvolvedMonsterSprite(mon.speciesId, evolveStage(mon))) return "__evolvedArt";
  return mon.evoSkin && SPECIES[mon.evoSkin] ? mon.evoSkin : null;
}

// この個体の今の見た目スプライト(2026-07-11): 進化後アートがあればそれ、無ければ基本形。
// assets/monsters/evolved/<id>_e1.png / _e2.png を置くと進化で絵ごと変わる
function monSpriteOf(mon) {
  // レア職・隠し職は専用キャラ(2026-07-28 FB)。読み込み前はevoSkinで暫定表示
  if (mon?.job && hasDedicatedChar(mon.job)) {
    const js = getJobSprite(mon.job);
    if (js) return js;
  }
  return (
    getEvolvedMonsterSprite(mon.speciesId, evolveStage(mon)) ??
    (mon.evoSkin && SPECIES[mon.evoSkin] ? getMonsterSprite(mon.evoSkin) : getMonsterSprite(mon.speciesId))
  );
}

// ジョブ(役割)のカスタムアイコン画像(assets/icons/role/<key>.png)。絵文字の代わりに使う。
function roleIconHtml(role, size = 13) {
  return iconImgHtml("role", (role && role.key) || "nuke", size, "role-ico");
}

// キャンバスの内部解像度をバトルウィンドウの実寸に合わせる(引き伸ばしによる歪みを防ぐ)
const sceneCanvas = $("scene");
sceneCanvas.width = Math.max(300, sceneCanvas.clientWidth);
sceneCanvas.height = Math.max(260, sceneCanvas.clientHeight);
const scene = new BattleScene(sceneCanvas);
window.__battleScene = scene; // 実機検証用フック(__smokeOpenAll等と同列の診断口)
// HPリセット挙動の実機検証用(2026-07-23 FB「負けたら/ステージ変わったらHPリセット」)
// 撮影用(2026-08-03 広報GIF): 卵を直接足す/先頭の子を覚醒6にする。
// どちらも検証専用(製品UIからは呼ばれない)
window.__debugAddEgg = (rarity = "celestial") => {
  state.eggs.push(makeEgg(rarity));
  if (openOrder.includes("eggs")) renderEggs();
  save();
};
window.__debugAwakenFirst = () => {
  const m = state.monsters[state.party[0]];
  if (!m) return;
  m.awakening = 6;
  renderBox();
  save();
};
window.__debugHp = {
  get: () => playerHp,
  set: (v) => { playerHp = v; },
  max: () => partyMaxHp(),
  gotoStage: (s) => onSelectStage(s),
  addGold: (n) => { state.gold += n; }, // 自動更新(liveRefresh)の実機検証用
};
syncSceneParty();
scene.setStage(state.stage);
// 実素材の背景の使用フラグ。買った16:9素材は縦長の戦闘画面に合わず見栄えが落ちたため、
// 既定はプロシージャル背景(この画面用に自作)に戻す。true にすると実素材を読み込む。
const USE_IMAGE_BACKGROUNDS = false; // 2026-07-08「背景は元に戻して」= プロシージャル背景に戻す
// 背景読み込みで何が起きてもゲーム本体の起動は止めない。
try {
  if (USE_IMAGE_BACKGROUNDS) loadBattleBackgrounds(scene);
} catch (e) {
  console.warn("背景の読み込みをスキップ:", e);
}

// 新しい敵ウェーブを湧かせる。ふだんは3体、ステージ最後の1体(KILLS_PER_STAGE体目)はボス1体。
// waveVariants は各敵の見た目バリアント(=属性の決定にも使う)。
let waveVariants = [0, 1, 2];
let enemyRoles = ["nuke", "nuke", "nuke"]; // 各敵のタイプ(役割)。相性の副軸(AB1)
let bossWave = false; // 今のウェーブがボスか(HP・攻撃・見た目の倍率に使う)
let dailyBossActive = false; // デイリーボス戦のあいだ true(ステージ進行の外側)
// 通常ステージの中ボス=×3/×1.5、幕ボスの間(x-10)=本物の壁(×6/×2)、
// デイリーボス=×10/×2.5(ただし1日2回・勝てば激レア報酬のチャンスの腕試し)
function bossHpMult() {
  if (dailyBossActive) return dailyBossVariant()?.hpMult ?? 10; // 変種(隔週追加)は個性が出る
  if (currentGimmick()?.kind === "wall") return currentGimmick().hpMult; // 難所「巨壁」= 1面分の超耐久1体
  return isBossStage(state.stage) ? 6 : 3;
}
function bossAtkMult() {
  if (dailyBossActive) return dailyBossVariant()?.atkMult ?? 2.5;
  if (currentGimmick()?.kind === "wall") return currentGimmick().atkMult;
  return isBossStage(state.stage) ? 2 : 1.5;
}

// ---- 難所ステージ(2026-07-15 FB: ナイトメア以降 4-5/8-5 は編成必須ギミック) ----
function currentGimmick() {
  return dailyBossActive ? null : stageGimmick(state.difficulty ?? 0, state.stage);
}
// 与ダメ減衰を持つ難所(試練・深淵): 幕属性に有利を取れない仲間の与ダメージが激減(offMult)。
// 個別(スキル)は発動者で判定、通常攻撃はパーティ平均 = 刺さる属性を並べるほど通る。
// 深淵は同時に takenMult も高いので、攻めの属性そろえと守りの属性投資が両方要る
const OFF_PENALTY_KINDS = ["trial", "abyss"];
function trialMultOf(monster) {
  const g = currentGimmick();
  if (!OFF_PENALTY_KINDS.includes(g?.kind)) return 1;
  return elementMult(SPECIES[monster.speciesId].element, stageElement(state.stage)) > 1 ? 1 : g.offMult;
}
function trialPartyMult() {
  if (!OFF_PENALTY_KINDS.includes(currentGimmick()?.kind)) return 1;
  const mems = partyMonsters(state);
  if (mems.length === 0) return 1;
  return mems.reduce((s, m) => s + trialMultOf(m), 0) / mems.length;
}
// 難所の攻略ヒント(地図のツールチップ)。数値は必ずギミックの実データから出す:
// 以前は「与ダメージ88%減」「HP×25」を直書きしていたので GIMMICK_SCALE を触ると
// 表示が嘘になった。かつ嵐が巨壁の説明文に落ちていた(kindの分岐漏れ)
function gimmickHint(gim, counter) {
  const el = counter ? ELEMENT_META[counter].label : "有利";
  const cut = Math.round((1 - (gim.offMult ?? 1)) * 100);
  const up = Math.round(((gim.takenMult ?? 1) - 1) * 100);
  if (gim.kind === "trial") return `${el}属性以外の与ダメージ${cut}%減 — カウンター編成が必須`;
  if (gim.kind === "storm") return `被ダメージ${up}%増 — 耐性編成か属性防御(細工)が必須`;
  if (gim.kind === "abyss") return `${el}属性以外の与ダメージ${cut}%減 + 被ダメージ${up}%増 — 攻めの属性と属性防御を両方そろえないと通れない`;
  return `超耐久の巨大な1体(HP×${gim.hpMult}) — ボス特効・トドメの一撃などボス特化編成が必須(報酬は1面分)`;
}

// 戦闘の敵ステータスは実効ステージ(難易度×30+面)で決まる
function combatStage() {
  return effectiveStage(state);
}

function currentEnemyMaxHp() {
  return enemyMaxHp(combatStage()) * (bossWave ? bossHpMult() : 1);
}

function spawnWave() {
  dailyBossActive = false;
  enemyDots = [[], [], []]; // 継続ダメージは敵が入れ替わったら消える
  dotAcc = [0, 0, 0];
  const gim = currentGimmick();
  // 幕ボスの間(x-10)と難所「巨壁」はボス単体。通常面は最後の1体が中ボス
  bossWave = isBossStage(state.stage) || gim?.kind === "wall" || state.killsInStage === KILLS_PER_STAGE - 1;
  setBgmMood(bossWave); // BGMをボス調(低音マイナー)に切り替え
  const tier = enemyTier(combatStage()); // 難易度で敵の姿が小型→獣→鎧→竜に上がる
  if (bossWave) {
    const mile = isBossStage(state.stage);
    const wall = gim?.kind === "wall";
    enemyGroup = [currentEnemyMaxHp()];
    const domElem = stageElement(state.stage);
    waveVariants = [ENEMY_ELEMENTS.indexOf(domElem)]; // ボスは支配属性
    enemyRoles = [enemyRoleFor(0)];
    // 幕ボスと巨壁は支配属性の専用大型ボスアート(巨壁は「巨大さ」が正体)
    const bossSprite = mile || wall ? getBossSprite(domElem) : null;
    scene.setEnemies(waveVariants, { boss: true, bossSprite, tier, marks: enemyMarksFor(waveVariants, enemyRoles) });
    toast(
      wall ? "⚠ 難所「巨壁」— 超耐久の巨大な1体!ボス特効・トドメの一撃で崩せ(倒せば1面分の報酬)"
        : mile ? "👑 幕ボスの間 — 倒せばボス箱確定!" : "👑 ボスが 現れた!",
      wall ? "#ff9a5a" : "#ffcf4a",
    );
    scene.shake = Math.max(scene.shake, mile || wall ? 0.3 : 0.15);
  } else {
    // ステージの支配属性が3体中2体を占める(残り1体はランダムで彩り)。
    // 「この面は水の面」とわかる=刺さる編成を組む理由になる。
    // 難所「属性の試練」は3体とも支配属性=ルールが一目でわかる
    enemyGroup = [0, 1, 2].map(() => enemyMaxHp(combatStage()));
    const domIdx = ENEMY_ELEMENTS.indexOf(stageElement(state.stage));
    waveVariants =
      gim && gim.kind !== "wall"
        ? [domIdx, domIdx, domIdx] // 難所は3体とも支配属性=ルールが一目でわかる
        : [domIdx, (state.totalKills + 1) % ENEMY_ELEMENTS.length, domIdx];
    enemyRoles = [0, 1, 2].map((s) => enemyRoleFor(s));
    scene.setEnemies(waveVariants, { tier, marks: enemyMarksFor(waveVariants, enemyRoles) });
    if (gim?.kind === "storm" && lastTrialToastStage !== state.stage) {
      // 難所「属性の嵐」(2026-07-24): 何をすれば通れるかを画面内で言い切る
      lastTrialToastStage = state.stage;
      const em = ELEMENT_META[stageElement(state.stage)];
      const up = Math.round((gim.takenMult - 1) * 100);
      // 文字列連結にすると英語化の全数監査が骨格を2本に割ってしまうので1本のテンプレで書く
      toast(
        `☈ 難所「属性の嵐」— 被ダメージが${up}%増!${em ? em.label : ""}に強い編成か、属性防御(細工)で耐えろ`,
        "#ff9a5a",
      );
    }
    if (gim?.kind === "trial" && lastTrialToastStage !== state.stage) {
      lastTrialToastStage = state.stage;
      const ce = counterElement(stageElement(state.stage));
      const cm = ce ? ELEMENT_META[ce] : null;
      const cut = Math.round((1 - gim.offMult) * 100);
      toast(
        `⚠ 難所「属性の試練」— ${cm ? cm.label : "有利"}属性以外の与ダメージが${cut}%減!編成を見直そう`,
        "#ff9a5a",
      );
    }
    if (gim?.kind === "abyss" && lastTrialToastStage !== state.stage) {
      // 難所「深淵」(2026-07-25): 攻めと守りの両方を要求する最上位の難所。
      // 片方だけ対策して突っ込んで全滅する事故を防ぐため、条件を2つとも言い切る
      lastTrialToastStage = state.stage;
      const ce = counterElement(stageElement(state.stage));
      const cm = ce ? ELEMENT_META[ce] : null;
      const cut = Math.round((1 - gim.offMult) * 100);
      const up = Math.round((gim.takenMult - 1) * 100);
      toast(
        `☠ 難所「深淵」— ${cm ? cm.label : "有利"}属性以外の与ダメージが${cut}%減、しかも被ダメージが${up}%増!攻めの属性と属性防御を両方そろえろ`,
        "#ff6a8a",
      );
    }
  }
  rebuildEnemyWindow();
}
let lastTrialToastStage = null; // 試練の説明トーストは面ごとに1回だけ

// 青窓の敵行を組み直す(spawn時のみ。属性/ジョブアイコン+名前+HPバー)。
// HP幅は renderFFWindows が毎フレーム更新する(img再読込を避けるため構造は使い回す)。
function rebuildEnemyWindow() {
  if (!el.ffEnemyWin) return;
  el.ffEnemyWin.innerHTML = "";
  const tier = enemyTier(combatStage());
  const max = bossWave ? currentEnemyMaxHp() : enemyMaxHp(combatStage());
  enemyRowEls = enemyGroup.map((_hp, i) => {
    const v = waveVariants[i];
    const elem = ENEMY_ELEMENTS[v];
    const em = ELEMENT_META[elem];
    // ジョブ表示は削除(2026-07-12 FB: ジョブ相性削除に伴い戦闘画面から撤去)
    const row = document.createElement("div");
    row.className = "ffe-row";
    const ec = document.createElement("span");
    ec.className = "ffe-elem";
    ec.title = em ? em.label : "";
    ec.innerHTML = iconImgHtml("element", elem, 13, "elem-ico");
    const name = document.createElement("span");
    name.className = "ffe-name";
    // 王冠と敵名は別のテキストノードにする(2026-07-22 EN実機スキャンで
    // 「👑闇兵」が未翻訳として出た)。連結すると辞書のキーと一致しなくなり、
    // 敵名156種ぶんの「👑つき」を辞書に足す羽目になる。分ければ名前側の
    // 既存エントリがそのまま効く
    if (bossWave) name.appendChild(document.createTextNode("👑"));
    name.appendChild(document.createTextNode(enemyNameOf(v, tier)));
    if (em) name.style.color = em.color;
    const hp = document.createElement("span");
    hp.className = "ffe-hp";
    const fill = document.createElement("i");
    hp.appendChild(fill);
    row.append(ec, name, hp);
    el.ffEnemyWin.appendChild(row);
    return { row, fill, max };
  });
}
spawnWave();

// ---- デイリーボス(1日2回・午前/午後) ----
// 挑戦権を消費して超強敵に挑む。勝てばゴールドどっさり+激レア報酬(コイン等)のチャンス
// (2026-08-04 Haru指示でコイン確定→ランダム化。DAILY_BOSS_DROP_WEIGHTS参照)。
// 強さは今の難易度の到達点基準(×10 HP)= 育成の腕試し
// デイリーボス戦の中断(ステージ/難易度の手動変更が割り込んだとき)。
// 挑戦権はボタンの時点で消費+保存済みなので、黙って上書きすると
// 「権利だけ消えて何も起きない」になる(2026-08-13 実機報告の実犯②と同族)。
// 敗北時(onPlayerDefeated)と同じく挑戦権を返してから抜ける
function interruptDailyBoss() {
  if (!dailyBossActive) return;
  dailyBossActive = false;
  const refunded = refundDailyBoss(state);
  if (refunded) toast("👹 デイリーボスを中断した(挑戦権は戻った)", "#ffd67a");
}

function spawnDailyBoss() {
  bumpMissionCounter(state, "dailyboss"); // チュートリアル: デイリーボスに挑んだ
  dailyBossActive = true;
  bossWave = true;
  setBgmMood(true);
  enemyGroup = [currentEnemyMaxHp()]; // 今の面の実効ステージ×10(bossHpMult)
  const domElem = stageElement(state.stage);
  waveVariants = [ENEMY_ELEMENTS.indexOf(domElem)];
  enemyRoles = [enemyRoleFor(0)];
  scene.setEnemies(waveVariants, {
    boss: true,
    bossSprite: getBossSprite(domElem),
    tier: enemyTier(combatStage()),
    marks: enemyMarksFor(waveVariants, enemyRoles),
  });
  toast(`👹 ${dailyBossVariant()?.name ?? "デイリーボス"}出現!! 勝てば激レア報酬のチャンス`, "#ff8ad8");
  scene.shake = Math.max(scene.shake, 0.35);
  playerAttackTimer = -1.5;
  enemyAttackTimer = -1.5;
  rebuildEnemyWindow();
}

// いま狙っている敵の属性。
function targetElement() {
  const ti = targetIdx();
  return ti === -1 ? null : ENEMY_ELEMENTS[waveVariants[ti]];
}

// 敵のタイプ(役割)を決める(ステージ+撃破数+スロットで巡回=毎回顔ぶれが変わる)。
function enemyRoleFor(slot) {
  return ROLE_KEYS[(combatStage() + state.totalKills + slot) % ROLE_KEYS.length];
}
// いま狙っている敵のタイプ(役割)。
function targetRole() {
  const ti = targetIdx();
  return ti === -1 ? null : enemyRoles[ti] ?? null;
}
// パーティ全体 → 敵役割 のタイプ相性倍率(各メンバーの役割相性の平均)。
// 通常攻撃はパーティ合算火力なので、有利役割を編成に混ぜるほど平均倍率が上がる。
function partyRoleMultVs(enemyRole) {
  const members = partyMonsters(state);
  if (!enemyRole || members.length === 0) return 1;
  const sum = members.reduce((s, m) => s + roleMult(roleOf(m).key, enemyRole), 0);
  return sum / members.length;
}

function syncSceneParty() {
  scene.setParty(
    partyMonsters(state).map((m) => {
      const role = roleOf(m);
      const elem = SPECIES[m.speciesId].element;
      const evoStage = evolveStage(m);
      // レアリティオーラ(2026-07-11 FB): アルカナ(★6)以上は戦闘で特殊オーラ。進化込みレア度
      const rarM = RARITY_META[monRarityOf(m)];
      // ユニーク装備の戦闘オーラ(2026-08-11): 自然なレア度オーラより強い方を採用
      const fx = uniqueVisualFx(m);
      const natAuraTier = Math.max(0, (rarM?.stars ?? 1) - 5); // ★6=1 .. ★10=5
      const useFxAura = fx.auraTier > natAuraTier;
      return {
        speciesId: m.speciesId,
        shiny: !!m.shiny || fx.shiny,
        hue: monHue(m), // 色違い/進化ジョブの色変化(2026-07-11)
        awakening: m.awakening ?? 0,
        evoStage, // 進化後アートの解決に使う
        skinId: m.evoSkin && SPECIES[m.evoSkin] ? m.evoSkin : null, // 上位レア種族の姿(2026-07-11)
        jobId: m.job ?? null, // レア職・隠し職の専用キャラとモーション(2026-07-28)
        // アートもスキンも無い進化キャラだけ「ひとまわり大きく」で別キャラ感を出す代替
        evoScale:
          getEvolvedMonsterSprite(m.speciesId, evoStage) || (m.evoSkin && SPECIES[m.evoSkin])
            ? 1
            : evoStage >= 2 ? 1.22 : evoStage === 1 ? 1.1 : 1,
        // 頭上HPバー横のマーク用: 役割キー+属性キー(PNGアイコンで表示 2026-07-11)
        roleKey: role.key,
        roleColor: parseInt((role.color || "#ffffff").slice(1), 16),
        elem,
        elemColor: parseInt((ELEMENT_META[elem]?.color || "#ffffff").slice(1), 16),
        auraTier: useFxAura ? fx.auraTier : natAuraTier,
        auraColor: useFxAura && fx.auraColor
          ? parseInt(fx.auraColor.replace("#", ""), 16)
          : parseInt((rarM?.color || "#ffffff").slice(1), 16),
      };
    }),
  );
  resetSkillCooldowns();
  rebuildPartyWindow();
}

// 敵の頭上マーク({roleKey, elem, ...})を setEnemies に渡す形へ変換
function enemyMarksFor(variants, roles) {
  return variants.map((v, i) => {
    const roleKey = roles[i];
    const rc = ROLE_META[roleKey]?.color || "#ffffff";
    const elem = ENEMY_ELEMENTS[v];
    const ec = ELEMENT_META[elem]?.color || "#ffffff";
    return {
      roleKey,
      elem,
      roleColor: parseInt(rc.slice(1), 16),
      elemColor: parseInt(ec.slice(1), 16),
    };
  });
}

// 相性の有利不利からダメージ数字の色クラスを決める(2026-07-10)。
// 両有利="adv2"(真っ赤大)・片有利="adv1"(オレンジ)・不利="weak"(灰小)・等倍/相殺=null
function advClassOf(elemM, roleM, eps = 0.001) {
  const advCount = (elemM > 1 + eps ? 1 : 0) + (roleM > 1 + eps ? 1 : 0);
  const dis = elemM < 1 - eps || roleM < 1 - eps;
  if (advCount === 2) return "adv2";
  if (advCount === 1 && !dis) return "adv1";
  if (advCount === 0 && dis) return "weak";
  return null;
}

// ---- メインループ ----
let lastTime = performance.now();
let liveStatusTimer = 0; // ステータス窓の経験値/レベルをライブ更新するスロットル
setInterval(() => {
  const now = performance.now();
  // 検証用倍速(×2/×5/×10 2026-07-13): 戦闘・スキルCD・バフ・演出のdtを加速する。
  // 実時間ゲート(卵6h/宝箱自動開封CD/探索/オフライン)は実時間のまま=倍速対象外
  const debugSpeed = state.debugBoosts?.speed || 1;
  const dt = Math.min(0.2, (now - lastTime) / 1000) * debugSpeed;
  lastTime = now;

  // 保険: 演出が閉じているのにhatchingが残っていたら復帰(旧: 戦闘停止の再発防止)
  if (hatching && el.hatchOverlay.classList.contains("hidden")) hatching = false;
  // 戦闘時間1.1倍(2026-07-24): プレミアムパス所有中は戦闘ロジックのdtを1.1倍で進める。
  // 敵味方が同率で速くなるので有利不利は不変(時短のみ・POWER_REGISTRY登録済み)。
  // 実時間ゲート(卵/宝箱CD/探索/オフライン)はこの下の実時間処理のままなので対象外。
  // 孵化・進化などの演出中も戦闘は止めない(2026-07-24 FB「卵から孵化させると
  // 戦闘画面含めてすべてが止まる。すべての動作がリアルタイムにできるように」)。
  // 放置ゲームなので「見ている間だけ進む」は損失になる=演出は画面の上に重ねるだけにする
  tickBattle(dt * battleSpeedOf(state));
  // 戦闘中は経験値/レベルが撃破ごとに入る。読み取り専用のステータス窓を
  // 0.4秒ごとにライブ更新して「経験値が入ってレベルが上がる」のが見えるようにする。
  liveStatusTimer += dt;
  if (liveStatusTimer >= 0.4) {
    liveStatusTimer = 0;
    if (openOrder.includes("status")) renderStatus();
    if (openOrder.includes("portrait")) renderPortrait(currentDetailId); // memo付き=軽い
    // ミッション窓もここで直接更新(2026-08-05 FB「ミッション窓を開いたままだと
    // クエストクリアしても反映されない」): liveRefresh の署名(liveSignature)には
    // クエスト達成条件(踏破ステージ・難易度・カウンター等)が含まれておらず、
    // 汎用の毎秒リフレッシュだけでは反映が漏れていた。missionView は毎回 state を
    // 直接評価するので、専用に直呼びすれば必ず最新のクリア状況が出る
    // (renderMission 内の throttleRender で連続呼び出しは間引かれるので負荷は増えない)
    if (openOrder.includes("mission")) renderMission();
    // 2026-08-11 FB「ミッション達成しているのにお知らせマーク出てないよ」: タブの
    // 赤丸(updateMissionBadge)は上のrenderMissionと同じ理由で反映が漏れるのに、
    // 窓の中身とは別で5秒おきの探索チェックブロックにしか呼び出しが無かった
    // (背景タブでsetIntervalが間引かれるとさらに遅延する)。同じ0.4秒枠に揃える
    updateMissionBadge();
  }
  liveRefresh(dt); // 開いている全窓へのリアルタイム反映(2026-07-24 FB)
  // 頭上HPバー用の割合(味方=パーティ共有HP、敵=各体のHP/そのウェーブの最大HP)
  const eMax = bossWave ? currentEnemyMaxHp() : enemyMaxHp(combatStage());
  scene.setHeadSkillGauges(lastGaugeFracs);
  scene.setHpBars(
    playerHp / Math.max(1, partyMaxHp()),
    enemyGroup.map((hp) => hp / Math.max(1, eMax)),
  );
  // scene.update はここでは呼ばない(2026-07-30 FB「戦闘がすごいカクカク」)。
  // 旧: ロジックと同じ50ms間隔(=上限20fps)で描いていて、tickが重いと15fpsまで
  // 落ちていた。描画は下の rAF ループ(モニタ同期)が担う — ロジックは20Hzのまま
  renderHud();
  // 青窓のHP/スキルバーはthrottleRender(200ms)の外で毎tick更新(2026-08-01
  // 友人テストFB「スキルバーがリアルタイムで動いてない」: renderHud経由だと
  // 200ms間引き+操作直後の先送りでカクついていた。renderFFWindowsは差分更新
  // だけの軽い関数なので20Hzで直接回す)
  renderFFWindows();
  renderMiniBattle(now); // バトル窓を閉じている間の小さな戦闘表示

  // 探索隊の帰還チェック(5秒に1回)。
  // 2026-07-19 FB「帰ってきたら探索窓の中で帰還表示、クリックで結果」:
  // 勝手に受け取らず、帰還を知らせて(トースト+タブの赤丸)、探索窓の帰還セレモニーで
  // プレイヤーが包みを開ける体験に(AFK系RPGの「帰還した隊が宝箱を差し出す」型)
  expedCheckTimer += dt;
  if (expedCheckTimer > 5) {
    expedCheckTimer = 0;
    syncDexBonus(); // 図鑑バフの同期(孵化などで登録が増えたぶんを反映 2026-07-16)
    const anyExpedDone = expeditionInfos(state).some((x) => x.done);
    if (anyExpedDone && !expedNotified) {
      expedNotified = true;
      sfx("banner");
      toast("🧭 探索隊が帰ってきた! 探索窓で包みを開けよう", "#8ad8ff");
      if (openOrder.includes("exped")) renderExpedition();
    }
    // タスクバーの探索タブに帰還バッジ(受け取るまで点滅)
    document.querySelector('.bar-tab[data-win="exped"]')?.classList.toggle("tab-alert", anyExpedDone);
    // パスタブにも「受け取れる報酬あり」バッジ(2026-07-20)
    const pp = passState(state);
    const passReady = passTier(state) > 0 &&
      Array.from({ length: passTier(state) }, (_, i) => i + 1).some((t) => !pp.claimedFree.includes(t));
    document.querySelector('.bar-tab[data-win="pass"]')?.classList.toggle("tab-alert", passReady);
    // ミッションタブにも「受け取れる報酬あり」バッジ(2026-07-31 友人テストFB)
    updateMissionBadge();
  }
}, TICK_MS);

// ---- 戦闘の描画ループ(rAF・2026-07-30 FB「戦闘がすごいカクカク」) ----
// 戦闘ロジックは上の setInterval(50ms=20Hz)のままで正しい(数値の進みは20Hzで十分)。
// 描画までそこに乗せていたのが実測15fpsの根本原因: 上限が構造的に20fpsで、
// tickのDOM仕事が重い瞬間はさらに落ちる。描画はモニタのリフレッシュ(rAF)に載せ、
// 隠れているときはOSが勝手に止めてくれる(電力にも優しい)
let lastFrameAt = performance.now();
(function battleFrame() {
  const now = performance.now();
  // 倍速(検証用)は演出の時間進行にも効かせる(ロジック側と同じ扱い)
  const fdt = Math.min(0.2, (now - lastFrameAt) / 1000) * (state.debugBoosts?.speed || 1);
  lastFrameAt = now;
  try {
    scene.update(fdt);
  } catch (e) {
    console.error("戦闘描画でエラー(次フレームで継続)", e);
  }
  requestAnimationFrame(battleFrame);
})();

// ---- 回復の毎秒上限(2026-07-15 FB「回復スキルが強すぎる」) ----
// スキルによる回復は healBudget から引く。予算は毎秒 HEAL_CAP_PER_SEC ずつ補充され、
// HEAL_BURST_WINDOW_SEC ぶんまで貯金できる。これで
//   ・回復1体(平均3.4%/秒)は上限3.5%/秒に収まるのでそのまま働く
//   ・単発の大回復は貯金から満額で出る(気持ちよさは維持)
//   ・回復を何体積んでも持続力は3.5%/秒で頭打ち = 「3体で無敵」が構造的に起きない
// 加護の自動回復(ROOKIE_REGEN)と与ダメ吸収(lifesteal/drain)は別枠。前者は導入の保護、
// 後者は与ダメに比例するので「積むだけ」では伸びない。
let healBudget = 0;
// 予算の基準は細工HPを除いたHP(partySustainBasisHp 2026-07-21)
function healCapMax() {
  return partySustainBasisHp() * HEAL_CAP_PER_SEC * HEAL_BURST_WINDOW_SEC;
}
// スキル回復を予算の範囲で与える。実際に回復した量を返す
function grantSkillHeal(amount, byMonsterId) {
  if (amount <= 0) return 0;
  const maxHp = partyMaxHp();
  const allowed = Math.min(amount, healBudget, maxHp - playerHp);
  if (allowed <= 0) return 0;
  healBudget -= allowed;
  playerHp += allowed;
  if (byMonsterId != null) statFor(byMonsterId).heal += allowed;
  return allowed;
}

// ユニーク限定ステ「与ダメ吸収」: 与えたダメージの一部をパーティHPへ(2026-07-13)
function applyLifesteal(dmg) {
  const ls = partyLifesteal(state);
  if (ls <= 0 || dmg <= 0) return;
  const maxHp = partyMaxHp();
  if (playerHp >= maxHp) return;
  playerHp = Math.min(maxHp, playerHp + dmg * ls);
}

// ステージ/難易度が変わったら必ず全回復(2026-07-23 FB「負けたらHPリセット、
// ステージ変わったらHPリセットするようにして」)。前進/後退/手動移動/難易度切替の
// 各ハンドラにも個別のリセットはあるが、経路の追加・変更で漏れないよう
// ここで中央監視する(自動周回・鍵ジャンプ・オフライン復帰なども全て通る)
let lastStageKey = -1;
function resetHpOnStageChange() {
  const key = (state.difficulty ?? 0) * 10000 + state.stage;
  if (key !== lastStageKey) {
    if (lastStageKey !== -1) playerHp = partyMaxHp();
    lastStageKey = key;
  }
}

function tickBattle(dt) {
  resetHpOnStageChange();
  stageElapsed += dt; // ステージ結果のDPS算出用の経過秒
  // 回復予算の補充(上限まで)。基準は細工HPを除いたHP(2026-07-21)
  healBudget = Math.min(healCapMax(), healBudget + partySustainBasisHp() * HEAL_CAP_PER_SEC * dt);
  // 駆け出しの加護: 仲間3体まではゆっくり自動回復(2026-07-08ユーザー指示で復活)。
  // 本番(4体以降)は回復=ヒーラーのみ。
  if (isRookie(state)) {
    const maxHp = partyMaxHp();
    playerHp = Math.min(maxHp, playerHp + maxHp * ROOKIE_REGEN_PER_SEC * dt);
  }
  // 攻撃バフ・かばうの減衰
  if (atkBuff.timer > 0) {
    atkBuff.timer -= dt;
    if (atkBuff.timer <= 0) atkBuff = { mult: 1, timer: 0 };
  }
  if (defBuff.timer > 0) {
    defBuff.timer -= dt;
    if (defBuff.timer <= 0) defBuff = { cut: 0, timer: 0, counterDmg: 0 };
  }
  if (hasteBuff.timer > 0) {
    hasteBuff.timer -= dt;
    if (hasteBuff.timer <= 0) hasteBuff = { mult: 1, timer: 0 };
  }
  if (critBuff.timer > 0) {
    critBuff.timer -= dt;
    if (critBuff.timer <= 0) critBuff = { add: 0, timer: 0 };
  }
  if (regenBuff.timer > 0) {
    // リジェネ: 毎フレーム少しずつ回復(発動者に回復量を記録)。上限の対象
    const tick = Math.min(dt, regenBuff.timer);
    grantSkillHeal(partyMaxHp() * regenBuff.hpsFrac * tick, regenBuff.by);
    regenBuff.timer -= dt;
    if (regenBuff.timer <= 0) regenBuff = { hpsFrac: 0, timer: 0, by: null };
  }
  if (shieldTimer > 0) {
    shieldTimer -= dt;
    if (shieldTimer <= 0) shieldHp = 0;
  }
  // 継続ダメージ(毒/炎上): 術者ごとの1本を全部刻み、1秒ごとに紫の数字でまとめて見せる
  dotShowTimer += dt;
  for (let di = 0; di < enemyGroup.length; di++) {
    const dots = enemyDots[di];
    if (!dots || dots.length === 0 || enemyGroup[di] <= 0) continue;
    let dd = 0;
    for (const d of dots) {
      d.t -= dt;
      const x = d.dps * dt;
      dd += x;
      if (d.by) statFor(d.by).dmg += x;
    }
    enemyGroup[di] -= dd;
    dotAcc[di] += dd;
    if (dotShowTimer >= 1 && dotAcc[di] >= 1) {
      const p = scene.enemyPos(di);
      scene.pushDamage(p.cx + 4, p.y + 8, Math.round(dotAcc[di]), { color: "#c86aff" });
      dotAcc[di] = 0;
    }
    enemyDots[di] = dots.filter((d) => d.t > 0);
    if (enemyGroup[di] <= 0) {
      enemyDots[di] = [];
      onEnemyDefeated(di);
    }
  }
  if (dotShowTimer >= 1) dotShowTimer = 0;

  // 通常攻撃(装備の攻撃速度×個体値(速度)×ヘイストで間隔が縮む)。先頭の生存敵を狙う。
  const attackInterval =
    PLAYER_ATTACK_INTERVAL / ((1 + partyAttackSpeed(state)) * partyIvAvg(state, "spd") * hasteBuff.mult);
  playerAttackTimer += dt;
  if (playerAttackTimer >= attackInterval) {
    playerAttackTimer = 0;
    const ti = targetIdx();
    if (ti !== -1) {
      // 属性相性込みのパーティ合計火力 × タイプ(役割)相性 × 難所「試練」補正 + 会心判定(会心バフ込み)
      const base =
        partyAtkVs(state, targetElement()) * atkBuff.mult * partyRoleMultVs(targetRole()) * trialPartyMult();
      const crit = Math.random() < Math.min(0.8, partyCritRate(state) + critBuff.add);
      const dmg = Math.round(
        base * (crit ? partyCritDmg(state) : 1) * (bossWave ? 1 + partyBossDmg(state) : 1),
      );
      enemyGroup[ti] -= dmg;
      applyLifesteal(dmg); // ユニーク限定「与ダメ吸収」
      attributeDamage(dmg); // ステージ結果: 与ダメを atk 比で記録
      // パーティ最強タスモンのレア度で通常攻撃FXの派手さが決まる
      const atkStars = Math.max(
        1,
        ...partyMonsters(state).map((m) => RARITY_META[SPECIES[m.speciesId].rarity].stars),
      );
      // 相性の有利不利でダメージ数字を色分け(通常攻撃はパーティ平均なので閾値ゆるめ)
      const mems = partyMonsters(state);
      const tElem = targetElement();
      const avgElem = mems.length
        ? mems.reduce((s, m) => s + elementMult(SPECIES[m.speciesId].element, tElem), 0) / mems.length
        : 1;
      scene.playerAttack(dmg, crit, atkStars, advClassOf(avgElem, partyRoleMultVs(targetRole()), 0.05));
      sfx(crit ? "crit" : "hit");
      if (enemyGroup[ti] <= 0) {
        onEnemyDefeated(ti);
        return;
      }
    }
  }

  // スキル発動(メンバーごとにCDを進め、0になったら発動)
  tickSkills(dt);
  updateSkillGauges();

  // 敵の攻撃(生存している敵からランダムな1体が攻撃。グループ全体のDPSは従来と同じ)
  const alive = enemyGroup.map((hp, i) => (hp > 0 ? i : -1)).filter((i) => i >= 0);
  if (alive.length > 0) {
    enemyAttackTimer += dt;
    if (enemyAttackTimer >= ENEMY_ATTACK_INTERVAL) {
      enemyAttackTimer = 0;
      // 攻撃してくる敵の属性で被ダメが変わる(弱点編成は痛い/耐性編成は硬い)
      const attacker = alive[Math.floor(Math.random() * alive.length)];
      const atkElem = ENEMY_ELEMENTS[waveVariants[attacker]] ?? null;
      const dmg = Math.round(
        enemyAtk(combatStage()) *
          (bossWave ? bossAtkMult() : 1) *
          partyDefenseMult(state, atkElem) *
          // かばう×防具の合算軽減は60%まで(2026-07-18 タンク無敵対策。
          // 属性耐性は戦略の報酬なのでフロアの外)
          Math.max(
            DEFENSE_REDUCTION_FLOOR,
            (1 - defBuff.cut) * (1 - partyDefenseCut(state)),
          ) *
          // 難所の被ダメ倍率(2026-07-24 FB「被ダメージも上がるようにして属性防御の
          // 必要性を上げる」)。partyDefenseMult(耐性編成0.7/属性防御-最大30%)の
          // 外側に掛かるので、対策すれば通れて無策だと通れない関係になる
          hazardTakenMult(state, currentGimmick()) *
          (isRookie(state) ? ROOKIE_DEF_MULT : 1), // 駆け出しの加護で半減
      );
      // バリア(shieldスキル)が先に吸収し、残りがHPへ通る
      let dmgIn = dmg;
      if (shieldHp > 0) {
        const absorbed = Math.min(shieldHp, dmgIn);
        shieldHp -= absorbed;
        dmgIn -= absorbed;
      }
      playerHp -= dmgIn;
      attributeTaken(dmgIn); // ステージ結果: 被ダメを maxHp 比で記録
      scene.enemyAttack(dmgIn, attacker);
      // かばう中の反撃(いばら系): 攻撃してきた敵にダメージを返す
      if (defBuff.counterDmg > 0 && enemyGroup[attacker] > 0) {
        enemyGroup[attacker] -= defBuff.counterDmg;
        if (enemyGroup[attacker] <= 0) onEnemyDefeated(attacker);
      }
      if (playerHp <= 0) onPlayerDefeated();
    }
  }
}

// スキルのクールダウンを進め、準備できたぶんを発動する(セット中の最大2つが独立CD)。
function tickSkills(dt) {
  const members = partyMonsters(state);
  for (let i = 0; i < members.length; i++) {
    const skills = equippedSkillsOf(members[i]);
    if (!Array.isArray(skillCd[i]) || skillCd[i].length !== skills.length) {
      skillCd[i] = skills.map((sk, s) => sk.cooldown * (0.3 + s * 0.5));
    }
    const cdr = 1 - partyCdr(state); // クールタイム短縮ぶん
    for (let s = 0; s < skills.length; s++) {
      skillCd[i][s] -= dt;
      if (skillCd[i][s] <= 0 && targetIdx() !== -1) {
        castSkill(i, members[i], skills[s]);
        skillCd[i][s] = skills[s].cooldown * cdr;
      }
    }
  }
}

// メンバー i のスキルを発動する。演出の豪華さはレア度の星数でスケールする。
function castSkill(i, monster, skill = effectiveSkill(monster)) {
  const a = skill.active;
  sfx(
    a.type === "nuke" ? "skillNuke"
    : a.type === "heal" ? "skillHeal"
    : a.type === "guard" ? "skillGuard"
    : "skillBuff",
  );
  const maxHp = partyMaxHp();
  // 演出の星はスキル自身のレア度(2026-07-23 Haru指示「スキルのレアリティが
  // 上がると派手に」)。種族レア度ではなくスキルの格が画面の格になる
  const stars = skillStars(skill.id);

  if (a.type === "nuke") {
    // kind(2026-07-11 スキル多様化): single(既定)/aoe(全体)/dot(継続)/drain(吸収)/execute(とどめ)/multi(多段 2026-07-21)
    let kind = a.kind ?? "single";
    // アクセ「スキル全体化」(2026-07-13): 単体攻撃スキルが威力xx%で全体ヒットになる
    const aoeConv = kind === "single" ? equipStat(monster, "skillAoe") : 0;
    if (aoeConv > 0) kind = "aoe";
    const powerMult = 1 + equipStat(monster, "skillPower") + perkStat(monster, "skillPower") + jobStat(monster, "skillPower");
    const crit = Math.random() < Math.min(0.8, partyCritRate(state) + critBuff.add);
    // 付随ヒール(active.heal)。攻撃スキルのオマケ回復で、説明文にも書いてある効果。
    // 2026-07-15 FB「説明通りに機能していないスキルがある」: 以前は分岐の末尾でしか
    // 適用しておらず、aoe/dot は途中で return するため回復が丸ごと飛んでいた
    // (genesisnova は kind=aoe で常に不発。goldenaura も「スキル全体化」アクセを
    //  付けると aoe に変換されて不発になっていた)。どの kind でも必ず通るようにする。
    const applySkillHeal = () => {
      if (!a.heal) return;
      // 付随ヒールもスキル威力依存。回復の毎秒上限(2026-07-15 FB)の対象
      const healed = grantSkillHeal(maxHp * a.heal * powerMult, monster.id);
      if (healed <= 0) return;
      scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "heal", color: "#7CFC98", name: "", stars });
    };
    // スロットごとの相性(全体攻撃は敵ごとに属性/ジョブ相性が変わる=編成の刺さり所)
    const baseFor = (slot) => {
      const eM = elementMult(SPECIES[monster.speciesId].element, ENEMY_ELEMENTS[waveVariants[slot]] ?? null);
      const rM = roleMult(roleOf(monster).key, enemyRoles[slot] ?? null);
      const bossMult = bossWave ? 1 + partyBossDmg(state) : 1; // ユニーク限定「ボス特効」
      const trialM = trialMultOf(monster); // 難所「属性の試練」: 有利属性以外は激減
      const elemB = eM > 1 ? 1 + equipStat(monster, "elemAtk") : 1; // 細工v3「属性攻撃力」(有利時のみ)
      return { raw: monsterAtk(monster) * a.power * powerMult * atkBuff.mult * eM * elemB * rM * bossMult * trialM, eM, rM };
    };
    if (kind === "aoe") {
      const aliveIdx = enemyGroup.map((hp, j) => (hp > 0 ? j : -1)).filter((j) => j >= 0);
      if (aliveIdx.length === 0) return;
      const dmgs = [null, null, null];
      const aoeScale = aoeConv > 0 ? aoeConv : 1; // 全体化アクセ経由は威力xx%
      for (const j of aliveIdx) {
        const dmgJ = Math.round(baseFor(j).raw * aoeScale * (crit ? partyCritDmg(state) : 1));
        enemyGroup[j] -= dmgJ;
        applyLifesteal(dmgJ);
        statFor(monster.id).dmg += dmgJ;
        dmgs[j] = dmgJ;
      }
      scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "nuke", fx: a.fx ?? "nova", color: a.color, name: T(skill.name), stars });
      scene.aoeStrike(a.color, stars, dmgs, crit);
      applySkillHeal(); // 撃破処理より先に(倒した瞬間に回復が消えないように)
      for (const j of aliveIdx) if (enemyGroup[j] <= 0) onEnemyDefeated(j);
      return;
    }
    if (kind === "multi") {
      // 多段攻撃(2026-07-21 FB): hits回分1発ずつ会心判定。倒したら残りのヒットは
      // 次の敵へ流れる(FF連撃)。撃破処理はaoeと同じく全ヒット後にまとめて
      const hitsN = a.hits ?? 3;
      const dmgs = [null, null, null];
      let anyCrit = false;
      for (let h = 0; h < hitsN; h++) {
        const tj = targetIdx();
        if (tj === -1) break;
        const critH = Math.random() < Math.min(0.8, partyCritRate(state) + critBuff.add);
        anyCrit = anyCrit || critH;
        const dmgH = Math.round(baseFor(tj).raw * (critH ? partyCritDmg(state) : 1));
        enemyGroup[tj] -= dmgH;
        applyLifesteal(dmgH);
        statFor(monster.id).dmg += dmgH;
        dmgs[tj] = (dmgs[tj] ?? 0) + dmgH;
      }
      scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "nuke", fx: a.fx ?? "slash", color: a.color, name: T(skill.name), stars });
      if (dmgs.some((d) => d != null)) scene.aoeStrike(a.color, stars, dmgs, anyCrit);
      applySkillHeal(); // 撃破処理より先に(倒した瞬間に回復が消えないように)
      for (let j = 0; j < enemyGroup.length; j++) if (dmgs[j] != null && enemyGroup[j] <= 0) onEnemyDefeated(j);
      return;
    }
    const ti = targetIdx();
    if (ti === -1) return;
    const b = baseFor(ti);
    if (kind === "dot") {
      // 総ダメージ(=power分)を duration 秒かけて削る毒/炎上。
      // 術者ごとに1本まで(2026-07-21): 別キャラのdotとは共存し、
      // 自分の再発動は自分の1本を更新する(=dot複数編成がビルドとして成立する)
      const total = Math.round(b.raw);
      const dur = a.duration ?? 6;
      const line = { dps: total / dur, t: dur, by: monster.id };
      const mine = enemyDots[ti].findIndex((d) => d.by === monster.id);
      if (mine >= 0) enemyDots[ti][mine] = line;
      else enemyDots[ti].push(line);
      scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element,
        type: "nuke", fx: a.fx ?? "shot", color: a.color, name: T(skill.name), stars,
        adv: advClassOf(b.eM, b.rM),
      });
      applySkillHeal();
      return;
    }
    let raw = b.raw;
    if (kind === "execute") {
      // トドメ: 敵HPが閾値未満なら大ダメージ(ボス削りの答え)
      const maxHp0 = bossWave ? currentEnemyMaxHp() : enemyMaxHp(combatStage());
      if (enemyGroup[ti] / maxHp0 < (a.execTh ?? 0.35)) raw *= a.execMult ?? 2.2;
    }
    const dmg = Math.round(raw * (crit ? partyCritDmg(state) : 1));
    enemyGroup[ti] -= dmg;
    applyLifesteal(dmg);
    statFor(monster.id).dmg += dmg; // スキル与ダメは発動者に加算
    if (kind === "drain") {
      // 吸収: 与ダメの一部をパーティHPへ(ヒーラー不在編成の生命線)。
      // 与ダメに比例するので「積むだけ」では伸びず、回復の毎秒上限の対象外。
      const healed = Math.min(maxHp - playerHp, dmg * (a.drain ?? 0.5));
      if (healed > 0) {
        playerHp += healed;
        statFor(monster.id).heal += healed;
        scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "heal", color: "#c86aff", name: "", stars });
      }
    }
    scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element,
      type: "nuke",
      fx: a.fx,
      color: a.color,
      name: T(skill.name),
      dmg,
      crit: crit || !!a.crit,
      stars,
      adv: advClassOf(b.eM, b.rM), // 相性の有利不利で数字を色分け
    });
    applySkillHeal();
    if (enemyGroup[ti] <= 0) onEnemyDefeated(ti);
  } else if (a.type === "heal") {
    // ヒール量はスキル威力に依存(2026-07-11 FB): 技の兆し/装備のスキル威力が回復も伸ばす
    const powerMult = 1 + equipStat(monster, "skillPower") + perkStat(monster, "skillPower") + jobStat(monster, "skillPower");
    if (a.kind === "regen") {
      // リジェネ(2026-07-15 スキル多様化): duration秒かけて合計 maxHp×power を回復。上書き式
      const dur = a.duration ?? 8;
      regenBuff = { hpsFrac: (a.power * powerMult) / dur, timer: dur, by: monster.id };
    } else {
      // 回復の毎秒上限(2026-07-15 FB)の対象。単発の大回復は貯金から満額で出る
      grantSkillHeal(maxHp * a.power * powerMult, monster.id);
    }
    scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "heal", color: a.color, name: T(skill.name), stars });
  } else if (a.type === "buff") {
    // kind: atk(既定)/haste(攻撃速度)/critup(会心率)
    if (a.kind === "haste") {
      hasteBuff = { mult: 1 + a.power, timer: a.duration };
    } else if (a.kind === "critup") {
      critBuff = { add: a.power, timer: a.duration };
    } else {
      atkBuff = { mult: 1 + a.power, timer: a.duration };
    }
    scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "buff", color: a.color, name: T(skill.name), stars });
  } else if (a.type === "guard") {
    const powerMult = 1 + equipStat(monster, "skillPower") + perkStat(monster, "skillPower") + jobStat(monster, "skillPower");
    if (a.kind === "shield") {
      // バリア: 最大HP×power ぶんの被ダメを先に吸収する使い捨てプール。
      // 回復のHEAL_CAPと同様にレート上限(CD1秒あたり1.25%)で頭打ち
      // (2026-07-18 「タンクがトーメントほぼノーダメ」対策。データ側もクランプ済みだが
      // スキル威力装備(powerMult)で上限を突き破らないよう実行時にも守る)。
      // 基準は細工HPを除いたHP(2026-07-21 FB「HP%盛り×HP比シールドで無敵」対策)
      shieldHp = Math.round(
        partySustainBasisHp() *
          Math.min(0.85, a.power * powerMult, SHIELD_CAP_PER_SEC * skill.cooldown),
      );
      shieldTimer = a.duration ?? 12;
    } else {
      // タンクのかばう: 被ダメ軽減+(counter持ちは)反撃。効果は上書き(後がち)
      defBuff = {
        cut: Math.min(GUARD_CUT_CAP, a.power),
        timer: a.duration,
        counterDmg: a.counter ? Math.round(monsterAtk(monster) * a.counter * powerMult) : 0,
      };
    }
    scene.castSkill(i, { sig: skill.id, elem: SPECIES[monster.speciesId].element, type: "buff", color: a.color, name: T(skill.name), stars });
  }
}

// クールダウンの充填率(0=発動直後, 1=発動可能)。FFウィンドウのゲージ表示に使う。
let lastGaugeFracs = []; // メンバーごと [スキル1の充填率, スキル2の充填率, ...]
function updateSkillGauges() {
  const members = partyMonsters(state);
  const fracs = members.map((m, i) => {
    const skills = equippedSkillsOf(m);
    return skills.map((sk, s) => {
      const cd = sk.cooldown;
      const remain = Math.max(0, skillCd[i]?.[s] ?? cd);
      return Math.max(0, Math.min(1, 1 - remain / cd));
    });
  });
  lastGaugeFracs = fracs;
  // シーン側のゲージは各メンバーの「一番たまっているスキル」を渡す(従来どおり)
  scene.setSkillGauges(fracs.map((arr) => (arr.length ? Math.max(...arr) : 0)));
}

// デイリーボス撃破: ステージ進行の外側で報酬だけ渡す(ゴールドどっさり+激レア報酬抽選)
function onDailyBossDefeated(idx) {
  scene.enemyDefeated(idx);
  scene.shake = Math.max(scene.shake, 0.4);
  scene.hitStop = Math.max(scene.hitStop, 0.1);
  const eff = combatStage();
  const gold = Math.round(goldReward(eff) * 40 * (1 + partyGoldBonus(state)));
  state.gold += gold;
  // ドロップ種別抽選(2026-08-04 Haru指示: コイン確定をやめてランダム化。
  // レア順=コイン>卵>装備直>進化石、白金以上コインは全体0.4%)
  const drop = rollDailyBossDrop(state, eff);
  // **報酬が確定したら、演出より先に保存する**(2026-08-13 実機クラッシュ報告)。
  // 挑戦権はボタンを押した時点で消費+保存済みなので、この下の演出・窓更新で
  // 例外が出て save() に届かないと「回数だけ消費されて報酬が消える」最悪の形になる
  // (実際に renderInventory 未定義の ReferenceError で2日連続これが起きた)。
  // 報酬(ゴールド・ドロップ)は state に入った直後のここで保存し、
  // 以降の表示まわりが何をしようと巻き戻らないようにする
  dailyBossActive = false;
  save();
  const nextNote = `次の挑戦は${new Date().getHours() < 12 ? "午後" : "明日の午前"}に`;
  if (drop.kind === "coin") {
    const coin = GACHA_COINS.find((c) => c.id === drop.coinId);
    addLog(state, { kind: "デイリーボス", rarity: "legend", text: `${coin.name} +${formatGold(gold)}G` });
    celebrateLoot({
      kicker: "デイリーボス討伐!!", icon: "🪙", title: coin.name,
      sub: `激レアドロップ!<br>+${formatGold(gold)} GP<br>${nextNote}`,
      rarity: coin.id === "divine" ? "cosmic" : coin.id === "astral" ? "century" : coin.id === "platinum" ? "beyond" : "immortal",
    });
  } else if (drop.kind === "egg") {
    addLog(state, { kind: "デイリーボス", rarity: drop.egg.rarity, text: `${rarityLabel(drop.egg.rarity)}の卵 +${formatGold(gold)}G` });
    celebrateLoot({
      kicker: "デイリーボス討伐!!", icon: "🥚", title: `${rarityLabel(drop.egg.rarity)}の卵`,
      sub: `卵を持ち帰った!<br>+${formatGold(gold)} GP<br>${nextNote}`,
      rarity: drop.egg.rarity,
    });
    if (openOrder.includes("eggs")) renderEggs();
  } else if (drop.kind === "item") {
    celebrateItem(drop.item, "デイリーボス");
    toast(`+${formatGold(gold)} GP ・ ${nextNote}`, "#ffd67a");
    // 2026-08-13 実機クラッシュ報告の実犯: ここが存在しない renderInventory を
    // 呼んでいた(正しくは renderInvWindow。他の全呼び出し箇所と同じ)。
    // `?.` は「未定義の識別子の参照」には効かず ReferenceError で即死する
    // (a?.() が守るのは「a が null/undefined の値を持つ」場合だけで、
    // 宣言そのものが無い裸の識別子は評価の時点で例外になる)。
    // 「装備ドロップ×持ち物窓が開いている」ときだけ通る枝だったため、
    // 全窓総当たりのスイープでも踏めていなかった
    if (openOrder.includes("inv")) renderInvWindow();
  } else {
    addLog(state, { kind: "デイリーボス", rarity: "immortal", text: `${EVO_STONES[drop.stoneKind].label} +${formatGold(gold)}G` });
    celebrateLoot({
      kicker: "デイリーボス討伐!!", icon: "🗿", title: EVO_STONES[drop.stoneKind].label,
      sub: `進化の備えが増えた!<br>+${formatGold(gold)} GP<br>${nextNote}`,
      rarity: "immortal",
    });
  }
  if (openOrder.includes("gacha")) renderGacha();
  if (openOrder.includes("log")) renderLog();
  // dailyBossActive の解除と save() は報酬確定直後(この関数の冒頭側)へ移動済み。
  // ここで2度目の save() はしない(表示だけの区間に保存を置くと、また「表示の例外で
  // 保存が飛ぶ」形が復活しかねないため、保存は報酬確定点の1か所に固定する)
  setTimeout(() => {
    // 700msのあいだにプレイヤーが次のデイリーボス(午後の枠)へ挑んでいたら
    // 潰さない(遅延スポーンの踏み潰し対策。下の通常ウェーブ側のコメント参照)
    if (dailyBossActive) return;
    spawnWave();
    enemyAttackTimer = -0.5;
  }, 700);
}

// ---- ステージ結果(item8): 各タスモンの与ダメ/回復/被ダメを集計して、
// ステージクリア/全滅ごとに貢献度ランキングを一定時間表示。履歴で見返せる。
let stageStats = {}; // monId -> {dmg, heal, taken}
let stageElapsed = 0; // 集計開始からの秒数(DPS算出用)
let stageResultLog = []; // 直近の結果履歴
const STAGE_RESULT_MAX = 20;

function resetStageStats() {
  stageStats = {};
  stageElapsed = 0;
}
function statFor(id) {
  return (stageStats[id] ??= { dmg: 0, heal: 0, taken: 0 });
}
// 与ダメは atk 比、被ダメは maxHp 比で各メンバーに割り振る(パーティ共有HPモデルの近似)
function attributeDamage(total) {
  const mons = partyMonsters(state);
  const shares = mons.map((m) => monsterAtk(m));
  const sum = shares.reduce((a, b) => a + b, 0) || 1;
  mons.forEach((m, i) => (statFor(m.id).dmg += (total * shares[i]) / sum));
}
function attributeTaken(total) {
  const mons = partyMonsters(state);
  const shares = mons.map((m) => monsterMaxHp(m));
  const sum = shares.reduce((a, b) => a + b, 0) || 1;
  mons.forEach((m, i) => (statFor(m.id).taken += (total * shares[i]) / sum));
}

// 結果を組み立てて履歴に積み、オーバーレイで表示する
function showStageResult(win, stageLabel) {
  // バトル窓を閉じて作業中はポップアップしない(2026-07-13 FB)
  if (!battleOpen) return;
  const mons = partyMonsters(state);
  const t = Math.max(1, stageElapsed);
  const rows = mons.map((m) => {
    const s = stageStats[m.id] ?? { dmg: 0, heal: 0, taken: 0 };
    // 貢献度: 与ダメ + 回復×1.5 + 被ダメ×0.5(前で受けたタンクも評価)
    const score = s.dmg + s.heal * 1.5 + s.taken * 0.5;
    return {
      name: monName(m),
      role: roleOf(m),
      dps: s.dmg / t,
      heal: s.heal,
      taken: s.taken,
      score,
    };
  });
  rows.sort((a, b) => b.score - a.score);
  const record = { win, stage: stageLabel, at: Date.now(), rows };
  stageResultLog.unshift(record);
  if (stageResultLog.length > STAGE_RESULT_MAX) stageResultLog.length = STAGE_RESULT_MAX;
  renderStageResultOverlay(record, true);
}

let stageResultHideTimer = null;
function stageResultEl() {
  let el = document.getElementById("stage-result");
  if (!el) {
    el = document.createElement("div");
    el.id = "stage-result";
    el.className = "hidden";
    el.addEventListener("click", (ev) => {
      if (ev.target === el || ev.target.classList.contains("sr-close")) hideStageResult();
    });
    document.body.appendChild(el);
  }
  return el;
}
function hideStageResult() {
  stageResultEl().classList.add("hidden");
  if (stageResultHideTimer) clearTimeout(stageResultHideTimer);
}
const MEDAL = ["🥇", "🥈", "🥉"];
function stageResultRowsHtml(rows) {
  return rows
    .map((r, i) => {
      const medal = MEDAL[i] ?? `${i + 1}位`;
      return (
        `<div class="sr-row">` +
        `<span class="sr-rank">${medal}</span>` +
        `<span class="sr-name" style="color:${r.role.color}">${roleIconHtml(r.role, 12)} ${r.name}</span>` +
        `<span class="sr-stat" title="DPS">⚔${formatNum(Math.round(r.dps))}</span>` +
        `<span class="sr-stat" title="回復量">✚${formatNum(Math.round(r.heal))}</span>` +
        `<span class="sr-stat" title="被ダメ">🛡${formatNum(Math.round(r.taken))}</span>` +
        `</div>`
      );
    })
    .join("");
}
// 1件の結果をオーバーレイ表示(autoHide=数秒で自動で消える)
function renderStageResultOverlay(record, autoHide) {
  const el = stageResultEl();
  const head = record.win
    ? `<div class="sr-head win">WIN!</div>`
    : `<div class="sr-head fail">FAILED…</div>`;
  el.innerHTML =
    `<div class="sr-card">` +
    head +
    `<div class="sr-stage">${record.stage}</div>` +
    `<div class="sr-cols"><span class="sr-rank"></span><span>貢献度順</span><span class="sr-stat">⚔DPS</span><span class="sr-stat">✚回復</span><span class="sr-stat">🛡被ダメ</span></div>` +
    stageResultRowsHtml(record.rows) +
    `<div class="sr-actions"><button class="sr-hist">📊 履歴</button><button class="sr-close">閉じる</button></div>` +
    `</div>`;
  el.classList.remove("hidden");
  el.querySelector(".sr-hist").addEventListener("click", (ev) => {
    ev.stopPropagation();
    renderStageResultHistory();
  });
  // 自動表示(勝利時)は最前面の大きな窓ではなく、戦闘画面の上に半透明で控えめに出す。
  if (autoHide) {
    el.classList.add("sr-battle");
    const bp = document.getElementById("battle-panel");
    if (bp && !bp.classList.contains("hidden")) {
      // rect=視覚px(zoom倍)、style.left等=レイアウトpx。割らずに代入すると
      // 拡大表示中はzoom倍ずれて戦闘窓の右下へはみ出す(2026-08-04 FB
      // 「リザルトが戦闘画面からはみ出てる」の実犯。規約: 代入時にzoomで割る)
      const r = bp.getBoundingClientRect();
      const z = uiZoom();
      Object.assign(el.style, {
        left: `${r.left / z}px`, top: `${r.top / z}px`,
        width: `${r.width / z}px`, height: `${r.height / z}px`, right: "auto", bottom: "auto",
      });
    }
  } else {
    el.classList.remove("sr-battle");
    Object.assign(el.style, { left: "", top: "", width: "", height: "", right: "", bottom: "" });
  }
  if (stageResultHideTimer) clearTimeout(stageResultHideTimer);
  if (autoHide) stageResultHideTimer = setTimeout(hideStageResult, 4000);
}
// 履歴一覧(見返し)。直近の結果をまとめて表示(こちらは従来どおり最前面の窓)
function renderStageResultHistory() {
  const el = stageResultEl();
  el.classList.remove("sr-battle");
  Object.assign(el.style, { left: "", top: "", width: "", height: "", right: "", bottom: "" });
  if (stageResultLog.length === 0) {
    el.innerHTML = `<div class="sr-card"><div class="sr-head">まだ結果がない</div><div class="sr-actions"><button class="sr-close">閉じる</button></div></div>`;
    el.classList.remove("hidden");
    return;
  }
  const items = stageResultLog
    .map((rec) => {
      const t = new Date(rec.at);
      const time = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
      return (
        `<div class="sr-hist-item">` +
        `<div class="sr-hist-head"><b class="${rec.win ? "win" : "fail"}">${rec.win ? "WIN" : "FAIL"}</b> ${rec.stage} <small>${time}</small></div>` +
        stageResultRowsHtml(rec.rows) +
        `</div>`
      );
    })
    .join("");
  el.innerHTML =
    `<div class="sr-card sr-card-hist">` +
    `<div class="sr-head">📊 ステージ結果の履歴</div>` +
    `<div class="sr-hist-list">${items}</div>` +
    `<div class="sr-actions"><button class="sr-close">閉じる</button></div>` +
    `</div>`;
  el.classList.remove("hidden");
  if (stageResultHideTimer) clearTimeout(stageResultHideTimer);
}

function onEnemyDefeated(idx) {
  if (dailyBossActive) {
    onDailyBossDefeated(idx);
    return;
  }
  scene.enemyDefeated(idx);
  const prevStage = state.stage;
  const prevKills = state.killsInStage;
  const prevDiff = state.difficulty;
  const wasBoss = bossWave;
  const lvSum0 = partyMonsters(state).reduce((s, m) => s + m.level, 0);
  const { egg, chest, firstClear, coinDrop, respecDrop, evoStoneDrop, keyBlocked, chestFullWait, usedKey, unlockedDifficulty, hazardFirst, expedSlotGranted } =
    applyKill(state);
  sfx(wasBoss ? "bossKill" : "kill");
  // タスモンパスの任務進捗(2026-07-20)。幕ボス撃破=幕ボス面での撃破
  passNotify(passProgress(state, "kills"));
  if (wasBoss) passNotify(passProgress(state, "boss"));
  if (partyMonsters(state).reduce((s, m) => s + m.level, 0) > lvSum0) {
    sfx("levelup");
    // 2026-08-10 FB「Lv10で初めてスキルを覚えられるようになった時にはでかく表示を出して」:
    // 通常のレベルアップは毎レベル起きるので演出を付けない(頻度の天井)が、
    // 「スキルの2択が初めて選べるようになった」だけは1回きりの節目なので別扱いする
    if (!state.skillUnlockIntroShown && partyMonsters(state).some((m) => pendingSkillPicks(m) > 0)) {
      state.skillUnlockIntroShown = true;
      celebrateLoot({
        kicker: "新機能解放!!",
        icon: "📖",
        title: "スキルを覚えられる!",
        sub: "Lv10で新しいスキルの2択が選べるようになった<br>「スキル」窓を開いて、どちらか1つを選んで習得しよう<br>(選び直しはできない)",
        rarity: "legend",
        persistent: true,
      });
    }
  }
  // ステージ(30体)をクリアした瞬間 = killsInStage が 0 にリセットされた
  if (state.killsInStage === 0 && prevKills > 0) {
    showStageResult(true, `STAGE ${prevStage}${wasBoss ? " 👑" : ""}`);
    resetStageStats();
  }
  const sourceName = wasBoss ? "👑ボス" : enemyNameOf(waveVariants[idx], enemyTier(combatStage()));
  if (wasBoss) {
    gainFloat("👑 BOSS撃破!!", "#ffcf4a");
    scene.shake = Math.max(scene.shake, 0.3);
    scene.hitStop = Math.max(scene.hitStop, 0.08);
    // ボス箱はその場で自動開封しない(2026-07-13 FB「勝手に開封される」)。
    // 宝箱バーに入り、手動開封 or 自動開封クールタイム(8分)に乗る。
    if (chest && chest.kind === "boss") {
      toast(
        firstClear ? "👑 幕ボス初クリア! ボスの宝箱×2を手に入れた!" : "👑 ボスの宝箱を 手に入れた!",
        "#ffcf4a",
      );
    }
  }
  if (unlockedDifficulty != null) {
    const dm = DIFFICULTIES[unlockedDifficulty];
    // 解放と同時に自動で突入済み(2026-07-13 FB)。演出とシーン側の同期
    celebrateLoot({
      kicker: "難易度解放!!",
      icon: "🔥",
      title: `${dm.name} へ突入!`,
      sub: `そのまま ${dm.name} 1-1 からスタート!<br>敵は強く、報酬とドロップは豪華に(前の難易度へはポータルから戻れる)`,
      rarity: "arcana",
    });
    // 孵化装置の枠は難易度クリアで増える(2026-07-29)。増えた瞬間をここで祝う
    // (ノーマル/ナイトメアのクリア=解放される難易度が1/2のとき。3枠で頭打ち)
    // (孵化装置は2026-08-01 Haru指示で機能ごと削除。枠解放の告知も撤去)
    playerHp = partyMaxHp();
    scene.setStage(state.stage);
    if (openOrder.includes("map")) renderMap();
    renderHud();
    // 細工の解禁(2026-07-19 バッチ2「各難易度で新しい遊びを1つ」)。
    // 解放時に説明を付ける(2026-07-19 FBの恒久パターン)。
    // 2026-08-10 説明文監査で発見: 解禁条件は2026-08-05に「ヘル到達→ノーマル全クリア」
    // (enhanceUnlocked = difficultyUnlocked(state, 1))へ前倒しされたのに、この告知の
    // 条件だけ古いunlockedDifficulty===2(ヘル到達)のまま残っていた=実際の解禁より
    // 1難易度ぶん遅れて(しかも実際には解禁の瞬間ではないタイミングで)出ていた
    if (unlockedDifficulty === 1) {
      celebrateLoot({
        kicker: "新機能解放!!",
        icon: "🗿",
        title: "細工 解放!",
        sub: "レジェンド等級以上の装備のスロットに ゴールドで強化行を抽選できる<br>合成窓の「🗿 細工」から。スキルや属性攻撃力が出ることも…?",
        rarity: "legend",
      });
      if (openOrder.includes("cube")) renderCube();
    }
  }
  if (keyBlocked) {
    toast("🗝 ボスの鍵がなく 幕ボスの間に入れない… 宝箱を開けて鍵を探そう", "#ff9a9a");
  }
  if (chestFullWait) {
    // 鍵は消費していない(2026-07-22 FB)。枠が空けば周回は自動で再開する
    toast("📦 ボス箱が満杯! 鍵を温存して手前で待機中(開ければ周回再開)", "#ffcf4a");
  }
  if (usedKey) {
    toast(`🗝 ${keyLabelOf(state.difficulty ?? 0)}を使って 幕ボスの間へ!(残り${bossKeyCount(state, state.difficulty ?? 0)}本)`, "#ffcf4a");
    renderHud(); // 鍵カウンタを即時更新(2026-07-18 FB「鍵使った後、更新しないと残ったままに見える」)
  }
  if (coinDrop) {
    gainFloat(`🪙 ${coinDrop.name}`, coinDrop.color, sourceName);
    // 白金以上のコインは事件なのでバナーでも祝う
    const bigCoin = ["platinum", "astral", "divine"].includes(coinDrop.id);
    if (bigCoin) {
      celebrateLoot({
        kicker: "レアコイン ドロップ!!",
        icon: "🪙",
        title: coinDrop.name,
        sub: "🪙のガチャ窓で使える<br>上位レア度の大チャンス",
        rarity: coinDrop.id === "divine" ? "cosmic" : coinDrop.id === "astral" ? "century" : "beyond",
      });
    }
    if (openOrder.includes("gacha")) renderGacha();
  }
  if (respecDrop) {
    // 激レア: 兆しを無料で振り直せる「叡智の水晶」
    celebrateLoot({
      kicker: "激レアドロップ!!",
      icon: crystalIconEl(52),
      title: "叡智の水晶",
      sub: `兆し(ステータス振り)を無料で振り直せる<br>所持 ${crystalCount(state)}個 ・ スフィア盤から使用`,
      rarity: "arcana",
    });
    if (openOrder.includes("detail")) renderDetail(currentDetailId);
  }
  if (evoStoneDrop) {
    // 進化石(2026-07-28): ランダム進化石は激レアなので水晶と同格に祝う。
    // ロール石は数が出るのでトーストに留める(毎回カードだと戦闘の邪魔)。
    // レア度は種類ごとに固定(2026-07-29: ロール=イモータル/ランダム=アルカナ)
    const stone = EVO_STONES[evoStoneDrop.kind];
    const srm = RARITY_META[evoStoneDrop.rarity] ?? RARITY_META.immortal;
    if (evoStoneDrop.kind === "random") {
      celebrateLoot({
        kicker: "激レアドロップ!!",
        icon: stoneIconEl("random", 52),
        title: `${stone.label} — ${srm.label}`,
        sub: `進化の「ランダム枠」に挑む鍵<br>所持 ${evoStoneCount(state, "random")}個`,
        rarity: "arcana",
      });
    } else {
      toast(`${stone.icon} ${stone.label}(${srm.label})を拾った!(所持 ${evoStoneCount(state, evoStoneDrop.kind)}個)`, stone.color);
    }
  }
  if (expedSlotGranted) {
    // 探索パーティ+1組(2026-08-06 Haru指示): 難易度を完全クリアした瞬間に付与
    celebrateLoot({
      kicker: "難易度制覇!!",
      icon: "🧭",
      title: "探索パーティ+1組!",
      sub: `探索に出せるパーティが1組増えた(現在 ${expeditionCapOf(state)}枠)`,
      rarity: "beyond",
    });
    sfx("banner");
    if (openOrder.includes("exped")) renderExpedition();
  }
  if (hazardFirst) {
    // 難所の初回踏破(2026-07-20 バッチ3): 報酬つきでしっかり祝う
    celebrateLoot({
      kicker: "難所踏破!!",
      icon: "⚠",
      title: `${hazardFirst.name} 初クリア!`,
      sub: `踏破報酬: 叡智の水晶×1${hazardFirst.key ? " + ボスの鍵×1" : ""}<br>難所は難易度が上がるほど強く、報酬も厚くなる`,
      rarity: "beyond",
    });
    sfx("banner");
  }
  if (egg) {
    renderEggs();
    celebrateEgg(egg, "卵 ドロップ", sourceName);
    // 卵は希少品(1.2%)なので、コモンでもトーストで必ず祝う(★3+はバナーも出る)
    const erm = RARITY_META[egg.rarity];
    toast(`🥚 ${erm.label}の卵を拾った!(${state.eggs.length}/${eggCapOf(state)})`, erm.color);
  }
  if (chest) {
    // 中身は開封まで秘密。箱の種類(木/レア/ボス)だけ見せて期待を煽る
    const km = CHEST_KINDS[chest.kind] ?? CHEST_KINDS.wood;
    gainFloat(`${km.icon}${km.label}`, km.color, sourceName);
    // 宝箱の保管数はthrottleRenderを待たず即座に反映する(2026-08-07 Haru指示
    // 「保管数が増えるのにラグがある」)。窓の全再構築は従来どおり間引いたまま、
    // 数字だけ文字差し替えで先に正しくする(#151と同じ型)
    refreshChestCountBadges();
    if (openOrder.includes("items")) renderItems();
  }
  if (state.stage !== prevStage) {
    // ステージクリアで全回復(2026-07-18 FB「クリアしたあとHPが回復しない」:
    // 幕ボス直後の面に低HPで入って即負けする事故の根絶)
    playerHp = partyMaxHp();
    scene.setStage(state.stage);
    toast(`STAGE ${stageLabel(state.stage)} へ 進んだ!`);
    if (openOrder.includes("map")) renderMap();
  }
  // ウェーブ全滅で次の3体が湧く(残っていればそのまま次の敵を殴る)
  if (enemyGroup.every((hp) => hp <= 0)) {
    setTimeout(() => {
      // 遅延スポーンの踏み潰し対策(2026-08-13 実機報告「回数消費されて報酬なし」の
      // 実犯②): ウェーブ全滅の450ms以内に「デイリーボスに挑む」を押すと、
      // このタイマーが後から発火して spawnWave()(先頭で dailyBossActive=false)が
      // 出現直後のデイリーボスを**通常ウェーブで上書き**していた。挑戦権はボタンの
      // 時点で消費+保存済みなので、戦闘も報酬も無いまま権利だけ消える。
      // デイリーボスが出ているあいだ、遅延スポーンは黙って身を引く
      if (dailyBossActive) return;
      spawnWave();
      enemyAttackTimer = -0.5;
    }, 450);
  }
}

// 全滅ペナルティ = ステージの最初からやり直し(+短い休息)。
// 「このステージをどう攻略するか」を試行錯誤させる設計(2026-07-06ユーザー確定)。
// 序盤に詰まないよう、仲間3体までは「駆け出しの加護」(被ダメ半減・自動回復・
// 卵3倍)ですんなり進み、パーティが形になってから本番の難易度になる
const DEFEAT_REST_SEC = 6;

function onPlayerDefeated() {
  playerHp = partyMaxHp();
  // デイリーボス戦の敗北: 挑戦権を返す(2026-07-18 FB「失敗するとおしまいがよくない」
  // → 同じ枠のうちは何度でも再挑戦できる。コインは勝利時だけ)
  if (dailyBossActive) {
    dailyBossActive = false;
    const refunded = refundDailyBoss(state);
    spawnWave();
    playerAttackTimer = -DEFEAT_REST_SEC;
    enemyAttackTimer = -DEFEAT_REST_SEC;
    toast(
      refunded
        ? "👹 デイリーボスに敗北… 挑戦権は戻った。編成を整えて再挑戦しよう"
        : "👹 デイリーボスに敗北… 次の挑戦で借りを返そう",
      "#ff9a9a",
    );
    if (openOrder.includes("map")) renderMap();
    save();
    return;
  }
  const wasBoss = isBossStage(state.stage);
  showStageResult(false, `STAGE ${stageLabel(state.stage)} 敗北`); // 全滅リザルト
  resetStageStats();
  state.killsInStage = 0;
  // 2026-07-09: 全滅したら自動で手前のステージへ後退して周回(鍛え直し)。
  // 2026-08-05 Haru指示「常に1段だけ戻るに統一していい」: 通常面の敗北も
  // ボス敗北(2026-07-13 FB由来)と同じ「常に1段だけ後退」に統一。旧実装は
  // 同じ壁で連敗するほど最大3段まで深く後退する仕様(2026-07-09〜2026-08-01)
  // だったが、ボス側だけ先に1段固定へ簡略化されて2経路の挙動が食い違っていた
  // (「ヘル2-5で負けたら2-2まで戻った」というFBの実体)。連続全滅の壁追跡
  // (連敗回数ぶん深く後退する仕組み)自体を廃止し、幕ボスの間だけ素通りする
  let retreated = false;
  if (wasBoss && state.stage > 1) {
    // 負けたら鍵は返却(2026-07-13 FB「ボス鍵は失敗したら消費されないように」)
    addBossKey(state, state.difficulty ?? 0);
    toast(`🗝 ${keyLabelOf(state.difficulty ?? 0)}は戻ってきた(倒せたときだけ消費)`, "#8ad8ff");
    state.stage -= 1; // x-10 → x-9(通常面)。再挑戦はポータルから
    // 自動周回はしない(2026-08-03 Haru指示「一個前に戻っても勝利したら通常通り進む」。
    // 2026-07-19の自動周回仕様はこの指示で廃止)
    scene.setStage(state.stage);
    if (openOrder.includes("map")) renderMap();
    retreated = true;
  } else if (!wasBoss && state.stage > 1) {
    let target = state.stage - 1;
    if (isBossStage(target) && target > 1) target -= 1; // 幕ボスの間は素通り
    target = Math.max(1, target);
    if (target < state.stage) {
      state.stage = target;
      // 自動周回はしない(2026-08-03 Haru指示: 勝てばそのまま先へ進んでいく)
      scene.setStage(state.stage);
      if (openOrder.includes("map")) renderMap();
      retreated = true;
    }
  }
  spawnWave();
  playerAttackTimer = -DEFEAT_REST_SEC;
  enemyAttackTimer = -DEFEAT_REST_SEC;
  toast(
    wasBoss
      ? `パーティが 倒れた… ${stageLabel(state.stage)} で立て直そう(ボス再挑戦はポータルから)`
      : retreated
        ? `パーティが 倒れた… 前のステージ ${stageLabel(state.stage)} から。勝てば また先へ進んでいく`
        : "パーティが 倒れた… ステージの最初から(編成・相性・装備を見直そう)",
    "#ff9a9a",
  );
  save();
}

// ---- HUD描画 ----
// ステージ表記はポータルと同じ「幕-面」(例: 3-4 = 第3幕の4面目)
const ENEMIES_PER_WAVE = 3;
const WAVES_PER_STAGE = KILLS_PER_STAGE / ENEMIES_PER_WAVE;

function stageLabel(stage) {
  return `${Math.floor((stage - 1) / 10) + 1}-${((stage - 1) % 10) + 1}`;
}

function renderHud() {
  // メインループが毎tick(50ms)呼ぶため間引く(2026-07-30 カクカクFB)。
  // タスクバー再構築+チップ更新を秒20回やる意味はない — 5回/秒で十分
  if (throttleRender(renderHud)) return;
  window.__rebuildBarTabs?.(true); // 段階的開放: 進行イベントごとに解放差分を確認
  // 難易度+幕-面+ウェーブ(幕ボスの間はBOSS戦、デイリーボスは討伐中)
  const dm = DIFFICULTIES[state.difficulty ?? 0];
  const wave = Math.min(WAVES_PER_STAGE, Math.floor(state.killsInStage / ENEMIES_PER_WAVE) + 1);
  const waveText = dailyBossActive
    ? " ・ 👹デイリーボス討伐中"
    : isBossStage(state.stage)
      ? " ・ 👑幕ボスの間"
      : ` ・ WAVE ${wave}/${WAVES_PER_STAGE}${wave === WAVES_PER_STAGE ? "👑" : ""}`;
  // ステージ/WAVEは戦闘画面(#battle-stage)に表示。タスクバー左のHUDは撤去済み
  const bs = $("battle-stage");
  if (bs) {
    // WAVEは数字でなくバーで(2026-07-12 FB / TBH式のセグメントバー)。
    // 幕ボス/デイリーボスは満タンの金バー+ラベルで見せる
    const bossMode = dailyBossActive || isBossStage(state.stage);
    const label = dailyBossActive
      ? `👹 ${dailyBossVariant()?.name ?? "デイリーボス"}`
      : isBossStage(state.stage)
        ? "👑 幕ボスの間"
        : "WAVE";
    // ボス戦はセグメントを出さずラベルのみ(相性図とのかぶり対策 2026-07-13 FB)
    const segs = [];
    if (!bossMode) {
      for (let w = 1; w <= WAVES_PER_STAGE; w++) {
        const on = w <= wave;
        const isLast = w === WAVES_PER_STAGE;
        segs.push(`<i class="ws${on ? " on" : ""}${isLast ? " last" : ""}${on && isLast ? " boss" : ""}"></i>`);
      }
    }
    bs.innerHTML =
      `<b style="color:${dm.color}">${dm.name} ${stageLabel(state.stage)}` +
      `${state.settings?.loopStage ? '<span class="loop-chip">🔁 周回中</span>' : ""}</b>` +
      `<span class="wave-bar" title="WAVE ${wave}/${WAVES_PER_STAGE}(最後のウェーブ=中ボス)">` +
      `${bossMode ? `<small>${label}</small>` : ""}${segs.join("")}</span>`;
  }
  // 称号の名乗り札(2026-07-22 FB): タスクバー右上のGPの左に常時表示。
  // 色は称号の色、クリックでパス窓(称号セクション)へ
  const plaque = $("title-plaque");
  if (plaque) {
    const tt = activeTitle(state);
    if (plaque.dataset.tid !== tt.id) {
      plaque.dataset.tid = tt.id;
      plaque.textContent = tt.label;
      plaque.style.setProperty("--tc", tt.color);
      plaque.onclick = () => openWindow("pass");
    }
  }
  el.gold.textContent = `${formatGold(state.gold)} GP`;
  const heroGold = $("hero-gold");
  if (heroGold) {
    heroGold.textContent = `💰 ${formatGoldChip(state.gold)}G`;
    heroGold.title = `所持ゴールド ${formatGold(state.gold)}G`;
  }
  // 卵/鍵カウンター(ゴールドの隣に浮遊表示)
  const eggCount = $("egg-count");
  if (eggCount) {
    eggCount.textContent = `🥚${state.eggs.length}/${eggCapOf(state)}`;
    eggCount.classList.toggle("has", state.eggs.length > 0);
    eggCount.classList.toggle("full", state.eggs.length >= eggCapOf(state));
  }
  const keyCount = $("key-count");
  if (keyCount) {
    // 今の難易度の鍵を表示(難易度別アイコン 2026-07-13)
    const kd = state.difficulty ?? 0;
    keyCount.innerHTML = `<img class="key-ico" src="assets/ui/keys/key_${Math.min(kd, 3)}.png" alt="鍵">${bossKeyCount(state, kd)}`;
    keyCount.title = `${keyLabelOf(kd)} ${bossKeyCount(state, kd)}本(この難易度の幕ボスの間に使える)`;
    keyCount.classList.toggle("has", bossKeyCount(state, state.difficulty ?? 0) > 0);
  }
  // 宝箱はタスクバーのミニ戦闘の右にチップで常時表示(クリックで開封)
  renderChestChips();
  updateChestCountdowns(Date.now());

  // 英雄ハブの丸アイコンに通知ドット+開いている画面の点灯
  const hasPendingPerk = Object.values(state.monsters).some(
    (m) => pendingPerks(m) > 0 || pendingSkillPicks(m) > 0,
  );
  const notifyMap = {
    eggs: state.eggs.length > 0,
    items: state.chests.length > 0,
    skills: hasPendingPerk,
    // 卵を孵化して未確認のタスモンがいると👥タブに赤ドット(見たら消える)
    box: Object.values(state.monsters).some((m) => m.isNew),
    // デイリー数限定ボスに挑めるあいだは🗺地図タブに通知(場所が分かるように)
    map: dailyBossAvailable(state) && !dailyBossActive,
  };
  for (const b of document.querySelectorAll(".hero-fn")) {
    const w = b.dataset.win;
    b.classList.toggle("notify", !!notifyMap[w]);
    b.classList.toggle("on", openOrder.includes(w));
  }
  // 青窓(パーティ小画面): 窓左上の1個ではなく「どの子か」が分かるよう行ごとに赤丸
  // (2026-07-17 FB「お知らせマークはキャラアイコンのところに出して」)
  const members = partyMonsters(state);
  const partyNeedsAttention = members.some((m) => pendingPerks(m) > 0 || pendingSkillPicks(m) > 0);
  members.forEach((m, i) => {
    const waiting = pendingPerks(m) > 0 || pendingSkillPicks(m) > 0;
    partyRowEls[i]?.row?.classList?.toggle("notify", waiting);
  });
  $("ff-party-win")?.classList.toggle("notify", partyNeedsAttention);
  // 2026-08-10 FB「パーティアイコン右上に何もお知らせがないのに赤丸点滅が付いてる」:
  // 卵の孵化待ち・宝箱未開封・パーティ外(ボックス内)モンスターの未消化スフィアまで
  // まとめて点灯条件にしていたため、パーティ自体は何も待っていなくても点いていた。
  // パーティタブ(装備・ステータス・スキルの管理)が指すのは常にパーティの中身なので、
  // 判定もパーティメンバーの未消化(スフィア/スキル選択)だけに絞る
  $("btn-hero").classList.toggle("notify", partyNeedsAttention);
  $("btn-hero").classList.toggle("win-open", openOrder.includes("detail"));
  const ti = targetIdx();
  const targetHp = ti === -1 ? 0 : enemyGroup[ti];
  el.enemyHpFill.style.width = `${Math.max(0, Math.min(1, targetHp / currentEnemyMaxHp())) * 100}%`;
  el.enemyHpFill.classList.toggle("boss", bossWave);
  // 敵の属性(有利なら▲、パーティが弱点を突かれていたら▼で警告)
  const tElem = targetElement();
  if (tElem) {
    const em = ELEMENT_META[tElem];
    const hasAdv = partyMonsters(state).some(
      (m) => elementMult(SPECIES[m.speciesId].element, tElem) > 1,
    );
    const unfav = partyDefenseMult(state, tElem) > 1.15; // 被ダメが重い編成
    // ジョブ表示は削除(2026-07-12 FB): 敵表示は属性のみ
    el.enemyElement.textContent = `敵:${em.label}${hasAdv ? "▲" : unfav ? "▼" : ""}`;
    el.enemyElement.style.color = unfav && !hasAdv ? "#ff8a7a" : em.color;
    el.enemyElement.style.borderColor = unfav && !hasAdv ? "#ff8a7a" : em.color;
    el.enemyElement.title = unfav && !hasAdv
      ? "この属性に弱いメンバーが多い(被ダメ増)。編成か面を変えよう"
      : hasAdv
        ? "有利属性のメンバーがいる(与ダメ増)"
        : "";
  } else {
    el.enemyElement.textContent = "";
  }
  renderFFWindows();
}

// ---- FF風の青ウィンドウ(左=敵一覧、右=パーティHP+スキルゲージ) ----
// パーティが変割ったときに行を作り直す(値の更新は renderFFWindows が毎tick行う)
function rebuildPartyWindow() {
  el.ffPartyWin.innerHTML = "";
  // パーティ総合戦力/目安/加護中は戦闘画面下部の #battle-power に表示(2026-07-08 移設)。
  // 青窓(タスクバー)には各メンバーのHP行だけ残す。
  partyPowerEl = $("battle-power");
  lastPowerText = "";
  partyRowEls = partyMonsters(state).map((m) => {
    const row = document.createElement("div");
    row.className = "ffp-row" + ((m.awakening ?? 0) > 0 ? " awakened-row" : "");
    // 顔(ポートレート)。参考画像の「顔・名前・属性・ジョブ・Lv」構成(2026-07-10)
    const face = document.createElement("span");
    face.className = "ffp-face";
    face.dataset.mon = m.id; // 自己監視スキャナ用
    face.dataset.uiKey = `${m.speciesId}|${m.evoSkin ?? ""}|${m.awakening ?? 0}`;
    face.appendChild(monIconCanvas(m, 22));
    // 属性アイコンのみ(ジョブ表示は削除 2026-07-12 FB)
    const elem = SPECIES[m.speciesId].element;
    const ec = document.createElement("span");
    ec.className = "ffp-elem";
    ec.innerHTML = iconImgHtml("element", elem, 16, "elem-ico");
    ec.title = ELEMENT_META[elem].label;
    const name = document.createElement("span");
    name.className = "ffp-name";
    name.textContent = baseNameOf(m);
    name.style.color = ELEMENT_META[elem].color; // 属性がひと目でわかる
    // 今の敵との相性倍率(属性×ジョブ)。renderFFWindowsが毎tick更新(2026-07-11)
    const adv = document.createElement("span");
    adv.className = "ffp-adv";
    adv.textContent = "×1.0";
    // HPバー(ゲージ+数値)。数値だけでなく視覚的にも残量が分かるように
    const hp = document.createElement("span");
    hp.className = "ffp-hp";
    const hpFill = document.createElement("i");
    const hpText = document.createElement("b");
    hp.append(hpFill, hpText);
    const lv = document.createElement("span");
    lv.className = "ffp-lv";
    // セットスキルの数だけCDゲージを並べる(2つなら2本、それぞれ独立にたまる)
    const cd = document.createElement("span");
    cd.className = "ffp-cd";
    const nSkills = Math.max(1, equippedSkillsOf(m).length);
    const gauges = [];
    for (let s = 0; s < nSkills; s++) {
      const g = document.createElement("span");
      g.className = "ffp-cd-gauge";
      const fill = document.createElement("div");
      g.appendChild(fill);
      cd.appendChild(g);
      gauges.push({ gauge: g, fill });
    }
    // 属性アイコン+名前+HP+Lv+CD(ジョブ表示は削除 2026-07-12 FB)
    row.append(ec, name, hp, lv, cd);
    // 戦闘中の味方行をクリックで そのタスモンのステータス窓を開く(QoL)
    row.style.cursor = "pointer";
    row.title = "クリックで ステータスを見る(ドラッグ/ドロップで入れ替え)";
    row.addEventListener("click", () => openCharacter(m.id));
    // 青窓の行もD&D対応: タスモンの子をここに落として即入れ替え、行同士で並べ替え
    const slotIndex = state.party.indexOf(m.id);
    makeDragSource(row, `mon:${m.id}`);
    makeDropTarget(row, (data) => {
      if (dropEquipTo(m.id, data)) return;
      dropMonToParty(data, slotIndex);
    });
    el.ffPartyWin.appendChild(row);
    // row: 行ごとの赤丸通知(2026-07-17 FB)用に参照を返す
    return { row, hpFill, hpText, lv, cd, gauges };
  });
}

function renderFFWindows() {
  // 敵ウィンドウ: 各敵のHPバーを更新(構造は rebuildEnemyWindow が spawn時に作る)。
  for (let i = 0; i < enemyRowEls.length; i++) {
    const e = enemyRowEls[i];
    const hp = enemyGroup[i] ?? 0;
    const frac = Math.max(0, Math.min(1, hp / (e.max || 1)));
    e.fill.style.width = `${Math.round(frac * 100)}%`;
    e.row.classList.toggle("dead", hp <= 0);
  }

  // パーティ総合戦力 / ステージ目安(値が変割ったときだけDOMを触る)
  const members = partyMonsters(state);
  if (partyPowerEl) {
    const rookie = isRookie(state);
    const pw = members.reduce((s, m) => s + powerScore(m), 0);
    const rec = recommendedPower(effectiveStage(state));
    const ok = pw >= rec;
    // 加護の常時表示は廃止(2026-07-17 FB「加護の表示を消す」)。効果は生きたまま、
    // 説明はホバー(title)だけに残す
    const text = `⚔ 戦力 ${formatNum(pw)} ／ 目安 ${formatNum(rec)}`;
    if (text !== lastPowerText) {
      // 加護が終わった瞬間を祝う+本番開始を告げる(表示は消したが節目のトーストは残す)
      if (wasRookie && !rookie) {
        toast("🎉 タスモンが3体そろった! 駆け出しの加護は終わり、ここからが本番", "#ffcf4a");
      }
      wasRookie = rookie;
      lastPowerText = text;
      partyPowerEl.innerHTML = text;
      partyPowerEl.classList.toggle("ok", ok);
      partyPowerEl.classList.toggle("low", !ok);
      partyPowerEl.title = rookie
        ? `駆け出しの加護: 仲間が3体そろうまで 被ダメ-${Math.round((1 - ROOKIE_DEF_MULT) * 100)}%・毎秒${Math.round(ROOKIE_REGEN_PER_SEC * 100)}%自動回復・卵ドロップ大幅UP`
        : ok
          ? "目安を超えている: このステージは概ね安定"
          : "目安に足りない: 育成・装備・属性相性で補おう";
    }
  }

  // パーティウィンドウ: 共有HPプールの割合を各メンバーの最大HPに割り付けて表示
  const ratio = Math.max(0, Math.min(1, playerHp / partyMaxHp()));
  for (let i = 0; i < partyRowEls.length; i++) {
    const row = partyRowEls[i];
    const m = members[i];
    if (!m) continue;
    const max = monsterMaxHp(m);
    row.hpFill.style.width = `${Math.round(ratio * 100)}%`;
    row.hpText.textContent = `${formatNum(Math.round(max * ratio))}/${formatNum(max)}`;
    row.lv.textContent = `L${m.level}`; // はみ出し対策(2026-07-13 FB): 3桁でも収まる短表記
    // 今の敵との相性倍率(属性×ジョブ)を可視化(2026-07-11)。値が変割ったときだけDOMを触る
    const tElem = targetElement();
    const tRole = targetRole();

    if (row.adv && tElem) {
      // ジョブ相性は削除(2026-07-12 FB): 倍率は属性のみ
      const total = elementMult(SPECIES[m.speciesId].element, tElem);
      const text = `×${total.toFixed(2)}`;
      if (text !== row.advText) {
        row.advText = text;
        row.adv.textContent = text;
        row.adv.className =
          "ffp-adv " + (total >= 1.5 ? "adv2" : total > 1.02 ? "adv1" : total < 0.98 ? "weak" : "even");
        row.adv.title = `今の敵への火力倍率(属性相性): ×${total.toFixed(2)}`;
      }
    }
    // セットスキルごとに独立したCDゲージを更新(2つなら2本)
    const gf = lastGaugeFracs[i] ?? [];
    for (let s = 0; s < row.gauges.length; s++) {
      const frac = Math.max(0, Math.min(1, gf[s] ?? 0));
      row.gauges[s].fill.style.width = `${frac * 100}%`;
      row.gauges[s].gauge.classList.toggle("full", frac >= 1);
    }
  }
}

// ---- 卵ウィンドウ ----
// 残り時間の数字表記(2:05:33)。数字だけにして翻訳レイヤーの対象外にする
// 受動再描画の間引き(2026-07-30 FB「戦闘がすごいカクカク」)。
// 周回中は撃破・ドロップ・ゴールド変化のたびに、開いている窓のDOMを丸ごと
// 作り直していた。DOMの全再構築は1回数十msで、rAF(戦闘キャンバス)と同じ
// スレッドを奪い、録画実測で15fps相当まで落ちていた。
// 使い方: 重い描画関数の先頭で `if (throttleRender(renderX)) return;`。
// 直近200ms以内の再呼び出しは「210ms後に1回」へまとめる(最後の状態は必ず描かれる)。
// クリック等の最初の呼び出しは素通し(leading edge)なので操作の体感は変わらない
function throttleRender(fn, args = []) {
  const now = performance.now();
  // ユーザー操作の直後は間引かない(2026-07-30 FB「孵化装置に入るまでラグがある」):
  // 毎秒の自動更新が先行枠を消費するため、クリック起点の再描画がほぼ毎回210ms
  // 後回しになっていた。操作への反応は即時が絶対 — 間引くのは受動更新だけ
  if (now - (throttleRender._userAt ?? -1e9) < 300) {
    fn._lastAt = now;
    return false;
  }
  if (now - (fn._lastAt ?? 0) >= 200) {
    fn._lastAt = now;
    return false;
  }
  fn._trailArgs = args;
  if (!fn._trail) {
    fn._trail = setTimeout(() => {
      fn._trail = null;
      fn._lastAt = performance.now();
      fn(...(fn._trailArgs ?? []));
    }, 210);
  }
  return true;
}
// クリック/キー操作の時刻(capture=ハンドラより先に記録される)
for (const ev of ["pointerdown", "click", "keydown"]) {
  document.addEventListener(ev, () => { throttleRender._userAt = performance.now(); }, true);
}

function renderEggs() {
  if (throttleRender(renderEggs)) return;
  el.eggSlots.innerHTML = "";
  // 孵化装置は削除(2026-08-01 Haru指示)。卵はクリックで即孵化
  const opsWrap = $("egg-ops");
  opsWrap.innerHTML = "";

  // 操作列: 枠を広げる。「まとめて孵化」は削除(2026-07-30 FB「いらない」—
  // 孵化装置の導入で孵化は装置スロットのクリック=個別が正規の導線になった)
  // 枠拡張ボタンは削除(2026-08-03 Haru指示「卵の枠拡張ボタンいらない」。
  // 拡張ロジック(buyEggSlot)は温存 — 復活時はここにボタンを戻すだけ)

  // 孵化装置は削除(2026-08-01 Haru指示)。卵は全部ここに並び、クリックで即孵化
  const idleEggs = state.eggs;
  for (let i = 0; i < eggCapOf(state); i++) {
    const slot = document.createElement("div");
    slot.className = "egg-slot";
    const egg = idleEggs[i];
    if (egg) {
      slot.classList.add("filled");
      const rm = RARITY_META[egg.rarity];
      if (rm && rm.stars >= 2) {
        slot.style.borderColor = rm.color;
        slot.style.boxShadow = `0 0 ${3 + rm.stars}px ${rm.color}`;
      }
      if (egg.bred) slot.classList.add("bred");
      if (egg.id === justBredEggId) slot.classList.add("just-bred");
      slot.appendChild(eggIconEl(egg.rarity, 36));
      // 卵ロックは削除(2026-07-30): 用途は「まとめて孵化からの保護」だけだったので、
      // まとめて孵化の削除と同時に役割を失った(egg.lockedのセーブ値は無害に残る)
      if (egg.bred) {
        const mark = document.createElement("span");
        mark.className = "egg-bred-mark";
        mark.textContent = "✦";
        slot.appendChild(mark);
      }
      const kind = egg.bred ? "配合の" : "野生の";
      // 配合卵は「誰が生まれるか」を予告(未発見種はシルエット風に???のまま)
      const bredChildLine = () => {
        if (!egg.bred || !egg.resultSpecies) return "";
        const csp = SPECIES[egg.resultSpecies];
        const known = !!state.dex?.[csp.id];
        const name = known ? csp.name : "？？？";
        const plusTag = (egg.plus ?? 0) > 0 ? ` <b class="plus-badge">+${egg.plus}</b>` : "";
        return `<div class="tt-opts">生まれる子: <b>${name}</b>${plusTag}${egg.recipe ? " ✦レシピ" : ""}</div>`;
      };
      bindCellTooltip(
        slot,
        () =>
          `<div class="tt-name" style="color:${rm.color}">${kind}${rarityLabel(egg.rarity)}の卵</div>` +
          `<div class="tt-opts">${"★".repeat(rm.stars)}</div>` +
          bredChildLine() +
          (egg.bred
            ? `<div class="tt-opts">親の個体値・スキル・覚醒チャンスを受けつぐ</div>`
            : "") +
          `<div class="tt-hint"><b>クリックで 孵化する!</b></div>`,
        () => {
          hideTooltip(true);
          onHatch(egg.id); // 装置は削除(2026-08-01 Haru指示)。クリックで即孵化
        },
      );
    }
    el.eggSlots.appendChild(slot);
  }
}

function spriteCanvas(sprite, size, hueShift = 0) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const g = spriteGrid(sprite);
  const scale = Math.max(1, Math.floor(size / g.cols));
  const w = g.cols * scale;
  const h = g.rows * scale;
  drawSprite(ctx, sprite, (size - w) / 2, (size - h) / 2, scale, { hueShift });
  return canvas;
}

// アイコン用の「上半身ズーム」。フルボディのアートは小さいマスだと細部が潰れるので、
// 画像の上側(頭〜胴)を正方形に切り出してマスいっぱいに拡大する(高レアも見やすく)。
// 個体→顔アイコンの唯一の入口(2026-07-30 FB「隠し職のアイコンが一致してない」)。
// 旧: 呼び出し側が speciesId/hue/進化段/スキン/職を**ばらで渡す**設計で、7か所中
// 6か所が職を渡し忘れ=専用キャラ(セラフ等)の顔が小アイコンだけ旧種族のままだった。
// 個体の見た目の決定はこの関数に集約する — 呼び出し側は個体と寸法だけ渡す
function monIconCanvas(mon, size) {
  return monPortraitCanvas(mon.speciesId, size, monHue(mon), evolveStage(mon), mon.evoSkin, mon.job);
}

function monPortraitCanvas(speciesId, size, hueShift = 0, evoStage = 0, skinId = null, jobId = null) {
  // レア職・隠し職は専用キャラを最優先(2026-07-28)
  const jobSprite = jobId && hasDedicatedChar(jobId) ? getJobSprite(jobId) : null;
  const sprite =
    jobSprite ??
    getEvolvedMonsterSprite(speciesId, evoStage) ??
    (skinId && SPECIES[skinId] ? getMonsterSprite(skinId) : getMonsterSprite(speciesId));
  if (!sprite.img) return spriteCanvas(sprite, size, hueShift); // ドット絵フォールバックは等倍
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = sprite.img;
  // 上から「幅と同じ高さ(=正方形)」を頭部基準で切り出す。縦長アートほどズームが効く
  const sw = img.width;
  const sh = Math.min(img.height, img.width * 1.05);
  const scale = size / sw;
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.imageSmoothingEnabled = img.width > 64;
  if (hueShift) ctx.filter = `hue-rotate(${hueShift}deg)`;
  ctx.drawImage(img, 0, 0, sw, sh, (size - dw) / 2, 0, dw, dh);
  return canvas;
}

// ステータス画面の大きな立ち絵(2026-07-12 FB「キャラ絵がどこかできれいに見えるといい」)。
// フルボディの生成アートを高解像度のまま滑らかに縮小して見せる(ドット絵化しない)
function monHeroCanvas(mon, w, h) {
  const sprite = monSpriteOf(mon);
  const hue = monHue(mon);
  if (!sprite.img) return spriteCanvas(sprite, Math.min(w, h), hue); // 内蔵ドット絵は等倍
  const canvas = document.createElement("canvas");
  const dpr = 2; // 2倍で描いてCSSで半分=くっきり
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (hue) ctx.filter = `hue-rotate(${hue}deg)`;
  let img = sprite.img;
  // 少し引きで見せる(2026-07-12 FB「立ち絵もう少し引きで」): 枠いっぱいでなく84%に収める
  const scale = Math.min((w * dpr) / img.width, (h * dpr) / img.height) * 0.84;
  // 低解像度アートは滑らかに拡大するとボケるので、くっきりのままにする
  if (img.width < 200) ctx.imageSmoothingEnabled = false;
  let dw = img.width * scale;
  let dh = img.height * scale;
  // 大きな縮小はエイリアスが出るので段階的に半分ずつ縮める(2026-07-12 立ち絵品質FB)
  while (img.width > dw * 2 && img.width > 4) {
    const half = document.createElement("canvas");
    half.width = Math.max(1, Math.floor(img.width / 2));
    half.height = Math.max(1, Math.floor(img.height / 2));
    const hc = half.getContext("2d");
    hc.imageSmoothingEnabled = true;
    hc.imageSmoothingQuality = "high";
    hc.drawImage(img, 0, 0, half.width, half.height);
    img = half;
  }
  ctx.drawImage(img, (w * dpr - dw) / 2, h * dpr - dh - 4 * dpr, dw, dh); // 足元を底辺にそろえる
  return canvas;
}

// ---- 孵化カットシーン ----
// 「まとめて孵化」は削除(2026-07-30 FB「いらない」)。孵化装置の導入で
// 孵化は装置スロットのクリック=1個ずつ演出つきが正規の導線になったため。
// 卵ロック(まとめて孵化からの保護が唯一の用途)も同時に削除した

// ---- スキル&兆しウィンドウ(詳細中のキャラに連動) ----
// スキル+兆しの中身(英雄ウィンドウの「スキル」タブとスキル窓で共用)
// TBH式の縦レベルトラック。左に赤いレール(現在Lvマーカー)、各スキル節目Lv(10/20/…)
// の行に、その節目で覚えたスキルの丸アイコン(未到達はロック)を並べる。

// スキルの効果種別を漢字ラベルで(説明のわかりやすさ 2026-07-11 FB)
function skillKindLabel(sk) {
  const a = sk?.active ?? {};
  const key = `${a.type}:${a.kind ?? "single"}`;
  const MAP = {
    "nuke:single": ["単体攻撃", "#ff8a6a"], "nuke:aoe": ["全体攻撃", "#ffb14a"],
    "nuke:dot": ["継続ダメージ", "#c88aff"], "nuke:drain": ["HP吸収", "#ff6ab4"],
    "nuke:execute": ["トドメ特化", "#ff5a4a"], "heal:single": ["回復", "#8af0a8"],
    "guard:single": ["かばう", "#8ab8ff"], "guard:shield": ["バリア", "#7ae0e0"],
    "buff:single": ["パーティ攻撃強化", "#ffd24a"], "buff:haste": ["パーティ攻速強化", "#ffe07a"],
    "buff:critup": ["パーティ会心強化", "#ffcf4a"],
    // 以下3つが抜けていて、内部名(nuke/guard/heal)がそのまま画面に出ていた
    // (2026-07-26 FB「三連斬の前が nuke ていう謎ワード」)。
    // 抜けを個別に足すだけだと同じことが起きるので、
    // test/skill-labels.test.mjs が全スキルの組み合わせを走査して固定する
    "nuke:multi": ["連続攻撃", "#ffa04a"],
    "guard:counter": ["反撃", "#6ad0ff"],
    "heal:regen": ["継続回復", "#8af0c8"],
  };
  // 保険: それでも抜けたときに内部名(nuke等)を出さない。テストが本命の防波堤
  const [label, color] = MAP[key] ?? ["特殊", "#e8e6df"];
  return `<span class="skill-kind-tag" style="color:${color};border-color:${color}">${label}</span>`;
}

function buildSkillRail(mon) {
  const rail = document.createElement("div");
  rail.className = "skill-rail";
  const learned = mon.learnedSkills ?? [SPECIES[mon.speciesId].skillId];
  const base = SPECIES[mon.speciesId].skillId;
  // 節目で覚えたスキル = learnedのうち base 以降の並び(継承ぶんを含む)。
  // 表示は「節目Lv → 覚えたスキル or 未習得」。現在Lvまでの節目+次の1つを見せる。
  const doneMilestones = skillMilestones(mon.level);
  const shown = Math.min(6, Math.max(doneMilestones + 1, 3));
  // baseを0段目(Lv1)に、以降の習得を各節目に対応づけ(継承も習得枠として並べる)。
  // 「覚えない」で見送った節目(mon.skillSkips)はスキルを消費しない(2026-07-12 FB)
  const acquired = learned.slice(1); // base以外(継承+節目習得)
  const skips = mon.skillSkips ?? [];
  // 消費済み節目なのに対応スキルがない=「4つ上限で入れ替えて忘れた枠」。
  // 従来はここが「習得できる(下で選ぶ)」と誤表示され、下に2択がなくて詰んで見えた
  // (Lv40以降のバグ 2026-07-12 FB)
  const picks = skillPicksOf(mon);
  const slotSkill = [];
  {
    let q = 0;
    for (let m = 1; m <= shown; m++) {
      if (skips.includes(m)) slotSkill[m] = "skip";
      else if (m <= picks) slotSkill[m] = acquired[q++] ?? "forgot";
      else slotSkill[m] = acquired[q++];
    }
  }
  // 4隅カード形式(2026-07-16 FB「左上/右上/左下/右下だけで表現できないか」):
  // 左上=節目Lv / 右上=★星 / 左下=種別タグ / 右下=セット中。中央にスキル名。
  // 未解放は🔒+「Lv.xxで解放」。長い説明はカーソルを合わせると全部出る(従来どおり)。
  rail.classList.add("skill-card-grid");
  for (let i = 0; i <= shown; i++) {
    const lv = i === 0 ? 1 : i * SKILL_PICK_INTERVAL;
    const reached = mon.level >= lv;
    const skipped = i > 0 && slotSkill[i] === "skip";
    const forgot = i > 0 && slotSkill[i] === "forgot";
    const skId = i === 0 ? base : skipped || forgot ? null : slotSkill[i];
    const equipped = (mon.equippedSkills ?? []).includes(skId);
    const card = document.createElement("div");
    card.className = "skill-card" + (reached ? "" : " locked");
    if (reached && mon.level < (i + 1) * SKILL_PICK_INTERVAL) card.classList.add("current");
    const corner = (cls, html) => {
      const s = document.createElement("span");
      s.className = `sc ${cls}`;
      s.innerHTML = html;
      return s;
    };
    card.appendChild(corner("sc-tl", i === 0 ? "Lv1" : `Lv${lv}`));
    const center = document.createElement("div");
    center.className = "sc-center";
    if (skId && SKILLS[skId]) {
      const sk2 = SKILLS[skId];
      center.textContent = sk2.name;
      card.appendChild(corner("sc-tr", `★${skillStars(skId)}`));
      card.appendChild(corner("sc-bl", skillKindLabel(sk2)));
      if (equipped) {
        card.classList.add("set");
        card.appendChild(corner("sc-br set", "セット中"));
      }
      // ホバーで全文(2026-07-11 FBを継承)
      card.addEventListener("mouseenter", (ev) =>
        showTooltip(
          `<div class="tt-name">${skillKindLabel(sk2)}${sk2.name} <small>★${skillStars(skId)}</small></div>` +
            `<div class="tt-opts">${sk2.desc}</div>` +
            `<div class="tt-hint">クリックで セット/解除 ・ 上のスキル欄へドラッグでもセットできる(最大2)</div>`,
          ev.clientX,
          ev.clientY,
        ),
      );
      card.addEventListener("mousemove", (ev) => positionTooltip(ev.clientX, ev.clientY));
      card.addEventListener("mouseleave", () => hideTooltip());
      card.classList.add("clickable");
      card.draggable = true;
      card.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/skill", skId);
        ev.dataTransfer.effectAllowed = "copy";
        hideTooltip();
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      card.addEventListener("click", () => {
        const result = toggleEquippedSkill(state, mon.id, skId);
        if (result.error) return void toast(result.error);
        toast(result.added ? `「${SKILLS[skId].name}」を セットした` : `「${SKILLS[skId].name}」を 外した`);
        resetSkillCooldowns();
        rebuildPartyWindow();
        renderSkills();
        if (openOrder.includes("detail")) renderDetail(mon.id);
        save();
      });
    } else if (skipped) {
      center.textContent = "見送った";
      center.classList.add("dim");
      card.title = "この節目は見送った(覚えない)";
    } else if (forgot) {
      center.textContent = "忘れた";
      center.classList.add("dim");
      card.title = "ここで覚えたスキルは入れ替えで忘れた";
    } else if (reached) {
      center.innerHTML = "＋<br><small>下で選ぶ</small>";
      center.classList.add("open");
      card.title = "習得できる(下の2択で選ぶ)";
    } else {
      center.innerHTML = `🔒<br><small>Lv${lv}で解放</small>`;
      center.classList.add("dim");
    }
    card.appendChild(center);
    rail.appendChild(card);
  }
  return rail;
}

// 新スキル習得のポップアップ(2026-07-17 FB「覚えた時だけポップアップ」)。
// 同じ節目は自動表示1回だけ(閉じたら、バナーから再表示できる)
const skillPopupSeen = new Set();
function showSkillLearnPopup(mon) {
  const panel = $("detail-panel");
  panel.querySelector(".sk4-popup")?.remove();
  const ov = document.createElement("div");
  ov.className = "cmp-help-overlay sk4-popup";
  ov.style.cursor = "default";
  ov.appendChild(buildSkillLearning(mon));
  const close = document.createElement("button");
  close.className = "compound-do";
  close.style.width = "100%";
  close.style.marginTop = "8px";
  close.textContent = "閉じる";
  close.addEventListener("click", () => ov.remove());
  ov.appendChild(close);
  panel.appendChild(ov);
}

function buildSkillsContent(mon) {
  const body = document.createElement("div");
  body.className = "skills-content";
  body.appendChild(buildCharSwitcher(mon));
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const skill = effectiveSkill(mon);
  const a = skill.active;
  const dps = a.type === "nuke" ? Math.round((monsterAtk(mon) * a.power) / skill.cooldown) : 0;

  const head = document.createElement("div");
  head.className = "skills-head";
  head.appendChild(spriteCanvas(monSpriteOf(mon), 40, monHue(mon)));
  head.insertAdjacentHTML(
    "beforeend",
    `<div><b style="color:${rm.color}">${sp.name}</b> ${elementChip(sp.element)}<br>` +
      `<small>Lv.${mon.level} ・ ${rm.label} ・ スキルの属性は本体と同じ</small></div>`,
  );
  body.appendChild(head);

  // ---- v2(2026-07-17 FB「覚えているスキル4つだけ表示。2つ選択=選択中、他は暗転。
  // 新スキル習得は覚えた時だけポップアップ。長い説明はカーソルのオーバーレイで」) ----
  const applySkillSet = (result, skId) => {
    if (result.error) return void toast(result.error);
    if (result.unchanged) return;
    toast(
      result.added
        ? `「${SKILLS[skId].name}」を セットした` +
            (result.replaced ? `(「${SKILLS[result.replaced].name}」は はずれた)` : "")
        : `「${SKILLS[skId].name}」を 外した`,
    );
    resetSkillCooldowns();
    rebuildPartyWindow();
    renderSkills();
    if (openOrder.includes("detail")) renderDetail(mon.id);
    save();
  };

  // 習得は下部の「次のスキル習得」枠に**選択肢ごと常設表示**する(2026-08-03 Haru指示
  // 「新しくスキル覚えた時はここに表示されるようにして」。ポップアップは廃止)
  const pend = pendingSkillPicks(mon);

  // 覚えているスキルのカード(セット中=選択中、他は暗転。クリックで入れ替え)
  // 2026-08-01 友人テストFB「4つのうち2つを装備できることを説明して選んでね」:
  // 説明は一覧の**上**に(下の注記だけでは読まれなかった)
  const eqNote = document.createElement("div");
  eqNote.className = "cmp-slot-hint sk4-eq-note";
  eqNote.innerHTML = `覚えたスキルのうち、戦闘に持てるのは<b style="color:#ffe9a8">${SKILL_LOADOUT_MAX}つ</b>。カードをクリックで入れ替え`;
  body.appendChild(eqNote);
  const TYPE_LABEL = { nuke: "攻撃", heal: "回復", guard: "守り", buff: "支援" };
  const learned = mon.learnedSkills ?? [SPECIES[mon.speciesId].skillId];
  const eqIds = mon.equippedSkills ?? [learned[0]];
  const grid = document.createElement("div");
  grid.className = "sk4-grid";
  // カードは4枚までだが、レア職/隠し職の専用スキル自動習得(evolveMonster)は
  // 4枠の上限を見ずに learnedSkills へ足すため、5件目以降になることがある。
  // 素の配列順で先頭4件だけ描画すると、その5件目がセット中でも枠から溢れて
  // カードごと消え、外すことも選び直すこともできなくなる(2026-08-05 FB「スキルが
  // 2つ目装備できないキャラがいる」の実犯: セット中1つが不可視のまま2枠目を
  // 占有し、見えている1枚を足そうとすると「2つまで」で弾かれていた)。
  // ただし「セット中を常に先頭へ」は装備を変えるたびカード位置が入れ替わり
  // 別のFB「スキル装備しても配置を変えないで」(2026-08-06)を生んだ。
  // learned <= 4 のときは4枚全部が常に表示できるので並べ替え不要(自然な習得順で固定)。
  // 5枚以上溢れるとき(隠し/レア職の専用スキルを持つ稀なケース)だけ、その回だけの
  // 応急でセット中を先頭へ回す(この場合のみ位置の入れ替わりを許容する)
  const displayOrder =
    learned.length <= 4
      ? learned
      : [...eqIds.filter((id) => learned.includes(id)), ...learned.filter((id) => !eqIds.includes(id))];
  for (const id of displayOrder) {
    if (grid.childElementCount >= 4) break;
    const base = SKILLS[id];
    if (!base) continue;
    const isOn = eqIds.includes(id);
    const sk = isOn ? equippedSkillsOf(mon)[eqIds.indexOf(id)] ?? base : base;
    const card = document.createElement("div");
    card.className = "sk4-card " + (isOn ? "on" : "off");
    const dps2 =
      sk.active.type === "nuke" ? Math.round((monsterAtk(mon) * skillNukePower(sk.active)) / sk.cooldown) : 0;
    // スキルのレア度(★)を表示(2026-07-18 FB「スキルのレア度がなくなった」:
    // sk4カード化のときに落としていた回帰。レア枠は色でも分かるように)
    const stars = skillStars(id);
    const monStars = RARITY_META[SPECIES[mon.speciesId].rarity].stars;
    const isRareSkill = stars > monStars + 1;
    if (isRareSkill) card.classList.add("rare");
    card.innerHTML =
      `<span class="sk4-type t-${sk.active.type}">${TYPE_LABEL[sk.active.type] ?? "特殊"}</span>` +
      `<span class="sk4-stars${isRareSkill ? " rare" : ""}">★${stars}</span>` +
      (isRareSkill ? `<span class="sk4-raretag">✨レア</span>` : "") +
      `<div class="sk4-name">${sk.name}</div>` +
      `<div class="sk4-line">CD ${sk.cooldown}秒${dps2 > 0 ? ` ・ DPS ${formatNum(dps2)}` : ""}</div>` +
      (isOn ? `<span class="sk4-badge">選択中</span>` : "");
    card.title = isOn ? "クリックで外す" : `クリックでセット(最大${SKILL_LOADOUT_MAX}つ)`;
    card.addEventListener("click", () => applySkillSet(toggleEquippedSkill(state, mon.id, id), id));
    // 長い説明はカーソルのオーバーレイで(2026-07-17 FB)
    const tip = (ev) =>
      showTooltip(
        `<b style="color:#8ad8ff">${sk.name}</b><div style="margin-top:3px">${sk.desc}</div>` +
          `<div class="tt-hint">CD ${sk.cooldown}秒${dps2 > 0 ? ` ・ スキルDPS ${formatNum(dps2)}` : ""} ・ ${isOn ? "セット中" : "未セット"}</div>`,
        ev.clientX,
        ev.clientY,
      );
    card.addEventListener("mouseenter", tip);
    card.addEventListener("mousemove", tip);
    card.addEventListener("mouseleave", () => hideTooltip(true));
    grid.appendChild(card);
  }
  // 覚えていない残りは空き枠として同じグリッドに並べる(2026-08-03 Haruモック:
  // 独立した「スキル枠」節は白塗り=削除指示。2×2の1枚のグリッドに統合する)
  while (grid.childElementCount < 4) {
    const cell = document.createElement("div");
    cell.className = "sk4-card empty";
    cell.innerHTML = `<span class="skill-slot-empty">空き枠</span><small>スキルを覚えると ここに並ぶ</small>`;
    grid.appendChild(cell);
  }
  body.appendChild(grid);

  // ---- 新しく覚えるスキル(2026-08-01 Haruモック: 次の習得をここに常設) ----
  const nextSec = document.createElement("div");
  nextSec.className = "skill-next-sec";
  if (pend > 0) {
    // 2択の選択UIをそのままこの枠に出す(クリックで習得→renderSkillsが再描画)
    nextSec.appendChild(buildSkillLearning(mon));
  } else {
    const nextLv = (skillPicksOf(mon) + 1) * SKILL_PICK_INTERVAL;
    nextSec.innerHTML = mon.level >= LEVEL_CAP
      ? `<div class="skill-next-note">✦ 覚えられるスキルは 全部そろった</div>`
      : `<div class="skill-next-note">✦ 次のスキル習得: <b>Lv${nextLv}</b>(あと${Math.max(0, nextLv - mon.level)}レベル)<br><small>節目のレベルで 2つから1つを選んで覚える</small></div>`;
  }
  body.appendChild(nextSec);

  // 兆し(スフィア盤)は独立タブへ移設(2026-07-10 v3)。ここには置かない
  return body;
}

// タブ内キャラ切替(2026-07-13 FB「スキル・スフィア盤のタブの中でキャラ変えられる
// ように。いちいちインベントリ戻ってキャラ選択するのだるい」)。
// ◀▶で手持ち全員(パーティ→レベル順)を巡回し、開いているタブのまま切り替える。
function buildCharSwitcher(mon) {
  const row = document.createElement("div");
  row.className = "char-switcher";
  // パーティ3人のみを巡回(2026-07-13 FB「パーティ3人のみでよい」)
  const mons = partyMonsters(state);
  const idx = Math.max(0, mons.findIndex((m) => m.id === mon.id));
  const go = (d) => {
    const next = mons[(idx + d + mons.length) % mons.length];
    if (!next || next.id === mon.id) return;
    currentDetailId = next.id;
    if (openOrder.includes("detail")) renderDetail(next.id);
    if (openOrder.includes("skills")) renderSkills();
    if (openOrder.includes("status")) renderStatus();
    // 2026-08-09 バグ修正: 持ち物窓を開いたままキャラを切り替えると、装備クリックの
    // ハンドラが古いキャラのidを束縛したままになり「別のキャラに装備される」原因になっていた
    if (openOrder.includes("inv")) renderInvWindow();
  };
  const prev = document.createElement("button");
  prev.className = "chip char-sw-btn";
  prev.textContent = "◀";
  prev.title = "前の子へ";
  prev.addEventListener("click", () => go(-1));
  const label = document.createElement("span");
  label.className = "char-sw-label";
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  label.appendChild(monMiniIcon(mon, 24));
  label.insertAdjacentHTML(
    "beforeend",
    `<b style="color:${rm.color}">${mon.shiny ? "★" : ""}${sp.name}</b><small> Lv.${mon.level}(${idx + 1}/${mons.length})</small>`,
  );
  const next = document.createElement("button");
  next.className = "chip char-sw-btn";
  next.textContent = "▶";
  next.title = "次の子へ";
  next.addEventListener("click", () => go(1));
  row.append(prev, label, next);
  return row;
}

// スフィア盤タブの中身(2026-07-10 v3: 独立タブ化)
function buildSphereContent(mon) {
  const body = document.createElement("div");
  body.className = "skills-content sphere-tab";
  body.appendChild(buildCharSwitcher(mon));
  body.appendChild(buildPerkAllocator(mon));
  return body;
}

function renderSkills() {
  // お任せ振り分け中は作り直さない(renderDetail と同じ理由。盤面はこの窓にも載る)
  if (sphereAutoBusy()) {
    sphereDeferredRender.skills = true;
    return;
  }
  if (throttleRender(renderSkills)) return;
  const body = $("skills-body");
  body.innerHTML = "";
  const mon = state.monsters[currentDetailId] ?? leader(state);
  if (!mon) {
    body.innerHTML = '<div class="box-hint">キャラが いない</div>';
    return;
  }
  body.appendChild(buildSkillsContent(mon));
}

async function onHatch(eggId) {
  if (hatching) return;
  // タスモン枠(2026-07-18): 満杯なら孵化できない(整理か枠解放を促す)
  if (boxCount(state) >= boxCapOf(state)) {
    toast(`タスモンが満杯(${boxCount(state)}/${boxCapOf(state)})。整理するか ＋枠 で解放しよう`, "#ff9a9a");
    return;
  }
  const idx = state.eggs.findIndex((e) => e.id === eggId);
  if (idx === -1) return;
  // 孵化装置は削除(2026-08-01 Haru指示)。卵はいつでもクリックで孵る
  hatching = true;
  // 演出のどこかで例外が出ても戦闘が止まりっぱなしにならないように(2026-07-13 FB
  // 「卵をふ化すると戦闘がストップするバグ」: hatchingが立ったまま残ると
  // tickBattleが永久停止する。try/finallyで必ず復帰させる)
  try {
    await runHatchCeremony(idx);
  } catch (e) {
    console.error("孵化演出でエラー(戦闘は再開します)", e);
    toast("孵化の演出でエラーが出たけど、子は無事うまれている", "#ff9a9a");
    renderBox();
    save();
  } finally {
    hatching = false;
    el.hatchOverlay.classList.add("hidden");
    el.hatchOverlay.classList.remove("awakened", "mega");
    if (!anyPanelOpen()) window.appControl?.closePanel();
  }
}

async function runHatchCeremony(idx) {
  const [egg] = state.eggs.splice(idx, 1);
  // 加護の短縮を1個ぶん消費(2026-07-30)。数えるのは**孵した数**なので、
  // 装置への出し入れを繰り返しても加護は減らない
  // (加護の孵化短縮は装置ごと削除。blessedHatchUsedの旧セーブ値は無害に残る)
  sfx("hatch");
  renderEggs();

  // 演出のためウィンドウを上に広げる
  window.appControl?.openPanel();

  // --ray-color はオーバーレイに設定 → 光条(#hatch-rays)とブルーム(#hatch-bloom)の両方が継承
  el.hatchOverlay.style.setProperty("--ray-color", RARITY_META[egg.rarity].glow);

  const ctx = el.hatchCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  el.hatchOverlay.classList.remove("hidden", "reveal", "flash");
  el.hatchCaption.classList.add("hidden");
  const eggSpr = eggSprite(egg.rarity);
  drawOnHatchCanvas(ctx, eggSpr);
  // タメは短く(だるさ対策): 低レア1回・中レア2回・星6+は3回まで
  const eggStars = RARITY_META[egg.rarity]?.stars ?? 1;
  const shakes = eggStars >= 6 ? 3 : eggStars >= 4 ? 2 : 1;
  for (let i = 0; i < shakes; i++) {
    el.hatchCanvas.classList.add("shake");
    await wait(300);
    el.hatchCanvas.classList.remove("shake");
    await wait(90);
  }

  el.hatchOverlay.classList.add("flash");
  ctx.clearRect(0, 0, 160, 160);
  await wait(140);
  el.hatchOverlay.classList.remove("flash");

  const { speciesId, iv, shiny, awakening, plus, inherited } = hatchEgg(egg);
  const mon = makeMonster(speciesId, iv, shiny, awakening, { plus, inherited });
  mon.isNew = true; // 新着マーク(タスモンでNEWバッジ、閲覧で消える)
  passNotify(passProgress(state, "hatch")); // タスモンパス任務(2026-07-20)
  // いま持っている全員より強い子か(高揚感: 「戦力更新!」を出す判定)
  const prevBest = Math.max(0, ...Object.values(state.monsters).map((m) => powerScore(m)));
  const newRecord = powerScore(mon) > prevBest;
  state.monsters[mon.id] = mon;
  const newDexEntry = registerDex(state, speciesId); // 図鑑に登録(初入手ならお祝い)
  if (newDexEntry) updateDexBadge(); // 赤丸=バフ未解放(2026-07-18)
  if (newDexEntry && openOrder.includes("dex")) renderDex();
  // 初登録のバフ表示はリザルトカード内(2026-07-17 FB「トーストが一瞬で分からん」)。
  // ここでは係数の即時反映だけ行う
  if (newDexEntry) syncDexBonus();
  const species = SPECIES[speciesId];
  const rm = RARITY_META[species.rarity];
  const grade = gradeFromIv(iv);
  const skill = effectiveSkill(mon);

  addLog(state, {
    kind: "孵化",
    rarity: species.rarity,
    text:
      `${species.name}(${grade.rank}ランク)` +
      (shiny ? " ★色違い" : "") +
      (awakening > 0 ? ` ⚡${AWAKENING.label[awakening]}` : ""),
  });
  if (openOrder.includes("log")) renderLog();

  // 覚醒個体は登場前にもうワンタメ: 赤金の後光に切り替わり、追い閃光が走る
  if (awakening > 0) {
    el.hatchOverlay.style.setProperty("--ray-color", "rgba(255,95,63,0.6)");
    el.hatchOverlay.classList.add("flash");
    await wait(140);
    el.hatchOverlay.classList.remove("flash");
    await wait(120);
  } else if (rm.stars >= 6) {
    // 星6以上(アルカナ帯〜)も二段タメ: 光条が強まり、二連閃光で「別格」を予告する
    el.hatchOverlay.classList.add("mega");
    for (let i = 0; i < 2; i++) {
      el.hatchOverlay.classList.add("flash");
      await wait(130);
      el.hatchOverlay.classList.remove("flash");
      await wait(100);
    }
  }

  el.hatchOverlay.classList.add("reveal");
  if (awakening > 0) el.hatchOverlay.classList.add("awakened");
  drawOnHatchCanvas(ctx, getMonsterSprite(speciesId), shiny ? SHINY_HUE : 0);
  el.hatchCanvas.classList.add("pop");
  // 2026-07-09「もっと豪華に」→ 粒子量を増量(基礎+レア度で大きく増やす)
  const starCount =
    18 + (RARITY_META[species.rarity]?.stars ?? 1) * 6 +
    (shiny ? 18 : 0) +
    (rm.stars >= 6 ? 22 : 0) +
    (awakening > 0 ? 26 : 0);
  spawnStars(starCount);
  await wait(420);
  el.hatchCanvas.classList.remove("pop");

  // リザルトカード: 「何が出た・どれだけ強い・何ができる子か」を一目で
  const shinyTag = shiny ? '<span class="shiny-tag">★色違い★</span> ' : "";
  const awakenTag =
    awakening > 0
      ? `<div class="hc-awaken">⚡ ${AWAKENING.label[awakening]}個体 ⚡</div>`
      : "";
  const role = roleOf(mon);
  // パーティ最弱(満員時の「交代」ボタン判定に使う。順位・戦力更新などの表示は廃止)
  const partyMons = partyMonsters(state).filter((p) => p.id !== mon.id);
  const weakest = partyMons.length
    ? partyMons.reduce((a, b) => (powerScore(a) <= powerScore(b) ? a : b))
    : null;
  const beatsWeakest = weakest && powerScore(mon) > powerScore(weakest);
  // 生まれつきの特殊スキル(覚醒個体の真スキル or 継承した特殊スキル)のときだけスキルを強調
  const bornSpecial = awakening > 0 || (inherited?.length ?? 0) > 0;
  const ivRow = (label, v) => ivBarHtml(label, v ?? 1);
  // 2026-08-10 FB「最初卵から孵化した時に基本システムを説明する表示を出してほしい」:
  // ジョブ/属性相性/覚醒/個体値/2段階進化(30・60)/進化の2択+レアジョブ・隠し職ルートを
  // まとめて1回だけ説明する(以後は state.hatchIntroShown で二度と出さない)。
  // 2026-08-11 FB「わかりやすいように解説表示して」: カード内の11px埋め込みでは
  // 手狭で読みにくかったため、カードを閉じた直後に専用の解説オーバーレイ(showHatchExplainer)
  // へ切り出した。表示予約だけここでしておく(表示自体はカードのcloseBtn後)
  const showHatchIntro = !state.hatchIntroShown;
  state.hatchIntroShown = true;
  // 2026-07-09: 孵化結果は「ステータス一覧」に。順位/戦力更新は撤去、個体値はステータス詳細と同表示、
  // スキルは生まれつきの特殊スキルのときだけ強調表示。レア度は大きく演出。
  el.hatchCaption.innerHTML =
    awakenTag +
    `<div class="hc-rarity" style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label} ${"★".repeat(rm.stars)}</div>` +
    `<div class="hc-name" style="color:${rm.color}">${shinyTag}${monName(mon)}</div>` +
    `<div class="hc-chips">${elementChip(species.element)}` +
    `<span class="role-chip" style="color:${role.color};border-color:${role.color}">${roleIconHtml(role)} ${role.label}</span>` +
    `<span class="grade" style="color:${grade.color}">個体 ${grade.rank}ランク</span></div>` +
    // 初登録は獲得バフをカード内に常設表示(2026-07-17 FB「トーストが一瞬で分からん。
    // 卵窓のステータス表示の中で表示して」)。カードは閉じるまで残るのでゆっくり読める
    (newDexEntry
      ? `<div class="hc-record" style="color:#8ad8ff;border-color:#8ad8ff">📖 図鑑に新登録! ` +
        `図鑑バフ解放可能: <b style="color:#8af0a8">${dexBuffOf(speciesId)?.label ?? ""}</b><small>(図鑑の🔴から受け取る)</small></div>`
      : "") +
    // 総合戦力だけ大きく1行(細かい数値/個体値は下で開く詳細・ステータス窓に一本化。
    // 2026-07-24 FB「もっと精度高くクオリティあげて」: カードとウィンドウの重複を解消)
    `<div class="hc-power">総合戦力 <b style="color:#ffe9a8">${formatNum(powerScore(mon))}</b></div>` +
    ((mon.plus ?? 0) > 0
      ? `<div class="hc-record" style="color:#ffd76a;border-color:#ffd76a">🧬 配合${mon.plus}世代 ・ 能力+${Math.round((mon.plus ?? 0) * PLUS_STAT_PER * 100)}%</div>`
      : "") +
    (bornSpecial
      ? (inherited?.length
          ? `<div class="hc-skill">継承特殊スキル: ${inherited.map((id) => `<b style="color:#c9a9ff">✦${SKILLS[id].name}</b>`).join(" ")}</div>`
          : "") +
        (awakening > 0
          ? `<div class="hc-skill"><b style="color:${skill.active.color}">✦ ${skill.name}(覚醒)</b> ${skill.desc}</div>`
          : "")
      : "");
  el.hatchCaption.classList.remove("hidden");
  // 孵化後は立ち絵窓+ステータス窓のペアを裏で開いておく(2026-08-01 Haru指示)。
  // オーバーレイを閉じた瞬間に、生まれた子の2枚が並んで見える(通常の詳細は1枚のまま)
  openHatchPair(mon.id);
  el.hatchCaption.style.borderColor = awakening > 0 ? AWAKENING.color : rm.color;
  el.hatchCaption.style.setProperty("--hc-glow", rm.glow);
  // その場でパーティへ: 空きがあれば「入れる」、満員でも最弱より強ければ「交代」
  if (state.party.length < MAX_PARTY) {
    const joinBtn = document.createElement("button");
    joinBtn.className = "hatch-join-btn";
    joinBtn.textContent = "⚔ いますぐパーティに入れる";
    joinBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (!togglePartyMember(state, mon.id)) {
        toast(`パーティは 最大 ${MAX_PARTY}体`);
        return;
      }
      playerHp = partyMaxHp();
      syncSceneParty();
      renderBox();
      joinBtn.textContent = "✓ パーティに入った!";
      joinBtn.disabled = true;
      save();
    });
    el.hatchCaption.appendChild(joinBtn);
  } else if (beatsWeakest) {
    const swapBtn = document.createElement("button");
    swapBtn.className = "hatch-join-btn";
    swapBtn.textContent = `⚔ ${baseNameOf(weakest)}(戦力${formatNum(powerScore(weakest))})と交代する`;
    swapBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const idx = state.party.indexOf(weakest.id);
      if (idx === -1) return;
      state.party[idx] = mon.id;
      playerHp = partyMaxHp();
      syncSceneParty();
      renderBox();
      if (openOrder.includes("detail")) renderDetail(currentDetailId);
      swapBtn.textContent = "✓ 交代してパーティに入った!";
      swapBtn.disabled = true;
      save();
    });
    el.hatchCaption.appendChild(swapBtn);
  }

  renderBox();
  save();

  // 結果カードは**閉じる操作を待つ**(2026-07-31 友人テストFB「操作し終わった後に
  // 自動で進むのはNG。閉じるボタンほしい」)。
  // 7/24に入れた自動送り(数秒で勝手に閉じる)は「まとめて孵化」の待ち時間対策
  // だったが、まとめて孵化は7/30に廃止済み。今の孵化は光った卵をクリックする
  // 手動操作なので、読み終わる前にカードが消えるのは事故でしかない
  // (パーティに入れるボタンが1.3秒で消えていた)。演出中も戦闘は裏で動き続ける
  const closeBtn = document.createElement("button");
  closeBtn.className = "hatch-close-btn";
  closeBtn.textContent = "✕ 閉じる";
  el.hatchCaption.appendChild(closeBtn);
  await new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.hatchOverlay.removeEventListener("click", finish);
      closeBtn.removeEventListener("click", finish);
      resolve();
    };
    closeBtn.addEventListener("click", finish);
    el.hatchOverlay.addEventListener("click", finish); // カード外クリックでも閉じる
  });
  el.hatchOverlay.classList.add("hidden");
  el.hatchOverlay.classList.remove("awakened", "mega");
  el.hatchCaption.style.borderColor = "";
  if (showHatchIntro) showHatchExplainer();
  // 生まれた子の立ち絵とステータスをすぐ見せる(2026-07-24 FB「卵から生まれたら
  // 立ち絵窓とステータス詳細窓をひらいてキャラと性能がちゃんと見えるように」)。
  // パーティ窓(detail)=大きな立ち絵+装備+パーティ操作、ステータス窓=数値の詳細。
  // 詳細窓は隣に、ステータス窓はさらに隣に並べる(既存の3窓レイアウトに乗る)
  currentDetailId = mon.id;
  openWindow("detail", { force: true });
  openWindow("status", { force: true });
  renderDetail(mon.id);
  if (openOrder.includes("status")) renderStatus();
  if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-09 別キャラ誤装着バグ修正
  // 後始末はonHatchのfinallyでも行う(例外時の保険)
}

// 初回孵化の解説オーバーレイ(2026-08-10導入・2026-08-11 FB「わかりやすいように解説表示
// して」で独立オーバーレイ化)。旧はhc-introとして孵化カードの末尾に11pxで埋め込んで
// いたが手狭で読みにくかった。カードを閉じた直後、世界観紹介(showWorldFeatureIntro)と
// 同じ「大きな1枚オーバーレイ」の型で、要点だけを短い解説文つきで見せる
function showHatchExplainer() {
  const intro = document.createElement("div");
  intro.className = "feed-overlay hatch-explainer-overlay";
  const ibox = document.createElement("div");
  ibox.className = "feed-box evolve-box hatch-explainer-box";
  ibox.innerHTML =
    `<div class="evolve-title">📖 タスモンの仕組み</div>` +
    `<div class="hc-intro">` +
    `<div class="hc-intro-row">🎭 ジョブ: 戦い方の役割が決まる(攻撃・防御・回復・支援)</div>` +
    `<div class="hc-intro-row">🔥 属性: 火・水・風・土・光・闇があり、有利不利で与ダメが変わる</div>` +
    `<div class="hc-intro-row">🎲 個体値: 同じ種族でも生まれつきの強さは1体ごとに違う</div>` +
    `<div class="hc-intro-row">⚡ 覚醒: 同じ個体を重ねる(配合)ほど覚醒が進み、スキルが「真→極→神」と強化され、戦闘中はオーラも纏う</div>` +
    `<div class="hc-intro-row">⬆ 進化: Lv30とLv60で2段階。進化のたびに2択、まれにレアジョブ・隠し職への特別ルートも</div>` +
    `</div>`;
  const closeBtn = document.createElement("button");
  closeBtn.className = "compound-do mission-intro-close";
  closeBtn.textContent = "わかった!";
  closeBtn.addEventListener("click", () => intro.remove());
  ibox.appendChild(closeBtn);
  intro.appendChild(ibox);
  document.body.appendChild(intro);
}

function drawOnHatchCanvas(ctx, sprite, hueShift = 0) {
  // スプライト幅に応じて160pxのキャンバスに収まる最大の整数スケールで描く
  const g = spriteGrid(sprite);
  const scale = Math.max(1, Math.floor(150 / g.cols));
  ctx.clearRect(0, 0, 160, 160);
  const w = g.cols * scale;
  const h = g.rows * scale;
  drawSprite(ctx, sprite, (160 - w) / 2, (160 - h) / 2, scale, { hueShift });
}

function spawnStars(count) {
  el.hatchStars.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = ["✦", "✧", "★"][i % 3];
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 60;
    star.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    star.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    star.style.animationDelay = `${Math.random() * 0.15}s`;
    el.hatchStars.appendChild(star);
  }
}

// ---- モンスタータスモン ----
let boxElemFilter = null; // 属性フィルタ(null = 全て)
let boxSort = "power"; // 並び替え(強さ / レア度 / Lv / 新着)
// BOXのページ制(2026-07-29 FB「BOXも倉庫と同じように2ページ目3ページ目って作る」)。
// 倉庫と同じ番号タブ方式。24体/ページ=マス目6行ぶん(拡張で枠を買うとページが増える)
let boxPage = 0;
const BOX_PAGE_SIZE = 24;
const BOX_SORTS = { power: "強さ", rarity: "レア度", level: "Lv", new: "新着" };

// 仲間タスモンの整理モード(いらない子をその場で逃がす)。誤タップ防止に2回押し
let releaseMode = false;
let releaseArmedId = null;

function tryReleaseFromBox(mon, cell) {
  const sp = SPECIES[mon.speciesId];
  if (state.party.includes(mon.id)) {
    toast("パーティ中の子は 逃がせない(先に外してね)");
    return;
  }
  if (releaseArmedId !== mon.id) {
    releaseArmedId = mon.id;
    cell.classList.add("release-armed");
    const price = Math.round((RELEASE_GOLD[sp.rarity] ?? 0) * (1 + (mon.level - 1) * 0.02));
    toast(`もう一度クリックで ${sp.name} を逃がす(+${formatGold(price)} GP)`, "#ff9a9a");
    setTimeout(() => {
      if (releaseArmedId === mon.id) releaseArmedId = null;
      cell.classList.remove("release-armed");
    }, 3000);
    return;
  }
  const result = releaseMonster(state, mon.id);
  releaseArmedId = null;
  if (result.error) {
    toast(result.error);
    return;
  }
  toast(`${sp.name} を逃がして ${formatGold(result.price)} GP を もらった`, "#ffe9a8");
  renderBox();
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  save();
}

function renderBox() {
  if (throttleRender(renderBox)) return;
  el.boxList.innerHTML = "";
  const header = document.createElement("div");
  header.className = "box-hint";
  const reserveCount = Object.values(state.monsters).filter((m) => !state.party.includes(m.id)).length;
  // タスモン枠(2026-07-18 FB「タスモン枠の解放がない」): N/枠 表示+＋枠ボタン
  const capNow = boxCapOf(state);
  const cntNow = boxCount(state);
  header.textContent =
    `タスモン ${cntNow}/${capNow} ・ パーティ ${state.party.length}/${MAX_PARTY}(使用中) ・ 控え ${reserveCount}体 ・ タップで詳細`;
  if (capNow < BOX_CAP_MAX) {
    const expand = document.createElement("button");
    expand.className = "chip box-expand-chip";
    expand.textContent = `＋枠(${formatGold(boxSlotCost(state))}G)`;
    expand.title = `タスモン枠を +${BOX_CAP_STEP} 解放する(最大${BOX_CAP_MAX})`;
    expand.addEventListener("click", () => {
      const r = buyBoxSlot(state);
      if (r.error) return void toast(r.error, "#ff9a9a");
      toast(`タスモン枠を解放! ${r.cap - BOX_CAP_STEP} → ${r.cap}(-${formatGold(r.cost)}G)`, "#8af0a8");
      renderBox();
      renderHud();
      save();
    });
    header.appendChild(expand);
  }
  el.boxList.appendChild(header);

  // 属性フィルタ(敵の属性に合わせた編成を組みやすくする)
  const owned = new Set(
    Object.values(state.monsters).map((m) => SPECIES[m.speciesId].element),
  );
  if (owned.size > 1) {
    const chips = document.createElement("div");
    chips.className = "filter-chips";
    const allChip = document.createElement("button");
    allChip.textContent = "全て";
    allChip.className = boxElemFilter === null ? "chip on" : "chip";
    allChip.addEventListener("click", () => {
      boxElemFilter = null;
      renderBox();
    });
    chips.appendChild(allChip);
    for (const [elem, em] of Object.entries(ELEMENT_META)) {
      if (!owned.has(elem)) continue;
      const chip = document.createElement("button");
      chip.textContent = em.label;
      chip.className = boxElemFilter === elem ? "chip on" : "chip";
      chip.style.color = em.color;
      chip.addEventListener("click", () => {
        boxElemFilter = boxElemFilter === elem ? null : elem;
        renderBox();
      });
      chips.appendChild(chip);
    }
    el.boxList.appendChild(chips);
  }

  // 並び替えチップ(強さ / レア度 / Lv / 新着)
  const sortChips = document.createElement("div");
  sortChips.className = "filter-chips";
  for (const [key, label] of Object.entries(BOX_SORTS)) {
    const chip = document.createElement("button");
    chip.textContent = label;
    chip.className = boxSort === key ? "chip on" : "chip";
    chip.addEventListener("click", () => {
      boxSort = key;
      renderBox();
    });
    sortChips.appendChild(chip);
  }
  // 整理モード: いらない子をその場で逃がしてGP化(パーティ中は保護)
  const relChip = document.createElement("button");
  relChip.textContent = releaseMode ? "✓ 整理中(クリックで逃がす)" : "整理(逃がす)";
  relChip.className = releaseMode ? "chip on release-chip" : "chip release-chip";
  relChip.addEventListener("click", () => {
    releaseMode = !releaseMode;
    renderBox();
  });
  sortChips.appendChild(relChip);
  // 装備一括解除(2026-07-17 FB): 控えの装備をまとめて外してインベへ。2度押しで確定
  const stripChip = document.createElement("button");
  stripChip.className = "chip";
  stripChip.textContent = "🧺 装備一括解除";
  stripChip.title = "控え(パーティ外)の子の装備を全部外して持ち物へ戻す";
  stripChip.addEventListener("click", () => {
    if (!stripChip.dataset.confirm) {
      stripChip.dataset.confirm = "1";
      stripChip.textContent = "控えの装備を全部外す?";
      stripChip.classList.add("on");
      setTimeout(() => {
        stripChip.dataset.confirm = "";
        stripChip.textContent = "🧺 装備一括解除";
        stripChip.classList.remove("on");
      }, 3000);
      return;
    }
    const r = unequipAllMonsters(state);
    if (r.count === 0) return void toast("控えに装備している子はいない");
    toast(`🧺 ${r.mons}体から装備${r.count}個を外して持ち物に戻した(パーティは保護)`, "#8ad8ff");
    refreshHeroInv();
    if (openOrder.includes("items")) renderItems();
    refreshMonViews();
    renderBox();
    save();
  });
  sortChips.appendChild(stripChip);
  el.boxList.appendChild(sortChips);
  if (releaseMode) {
    const warn = document.createElement("div");
    warn.className = "box-hint release-warn";
    warn.textContent = "整理モード: 同じ子を2回クリックで逃がす(レア度×Lvに応じたGP)。パーティ中は保護";
    el.boxList.appendChild(warn);
  }
  // 探索メンバー選択モード(2026-07-11: 探索窓の「タスモンから選ぶ」から入る)
  if (expedSelectMode) {
    const bar = document.createElement("div");
    bar.className = "box-hint exped-select-bar";
    bar.innerHTML = `🧭 <b>探索メンバー選択中(${expedSelIds.size}/${expedNextPartySize()})</b> — クリックで選ぶ/外す `;
    const doneBtn = document.createElement("button");
    doneBtn.className = "compound-do";
    doneBtn.textContent = "✓ 選び終わった(探索窓へ)";
    doneBtn.addEventListener("click", () => {
      expedSelectMode = false;
      openWindow("exped");
      renderExpedition();
      renderBox();
    });
    bar.appendChild(doneBtn);
    el.boxList.appendChild(bar);
  }

  const rarityRank = (m) => RARITY_ORDER.indexOf(SPECIES[m.speciesId].rarity);
  const monTs = (m) => parseInt(String(m.id).split("_")[1], 10) || 0; // idに入手時刻が入っている
  const sorters = {
    power: (x, y) => powerScore(y) - powerScore(x),
    rarity: (x, y) => (rarityRank(x) !== rarityRank(y) ? rarityRank(y) - rarityRank(x) : y.level - x.level),
    level: (x, y) => y.level - x.level,
    new: (x, y) => monTs(y) - monTs(x),
  };
  // パーティ入りの子も枠内に並べる(2026-07-24 FB「タスモンに配置してるタスモンも
  // 『使用中』って記載でタスモンの枠内に埋めれないかな」)。除外していると
  // 「手持ち全部が一覧で見える」感覚が壊れ、枠数(N/50)とも一致しなかった。
  // 並びは常にパーティが先頭(L→2→3)、以降は選んだ並び順。
  const base = sorters[boxSort] ?? sorters.power;
  const monsters = Object.values(state.monsters)
    .filter((m) => boxElemFilter === null || SPECIES[m.speciesId].element === boxElemFilter)
    .sort((x, y) => {
      const px = state.party.indexOf(x.id);
      const py = state.party.indexOf(y.id);
      if (px !== -1 || py !== -1) {
        if (px === -1) return 1;
        if (py === -1) return -1;
        return px - py;
      }
      return base(x, y);
    });

  // ページタブ(2026-07-29 FB): 倉庫と同じ番号タブ。ページ数は「枠数」基準なので、
  // ＋枠を買うとページも増える=拡張の見える化(2026-07-28 FB)とも噛み合う。
  // 属性フィルタ中はヒット数基準(空きセルを出さないため、枠基準だと空ページが並ぶ)
  const pageBasis = boxElemFilter === null ? Math.max(boxCapOf(state), monsters.length) : monsters.length;
  const boxPages = Math.max(1, Math.ceil(pageBasis / BOX_PAGE_SIZE));
  if (boxPage >= boxPages) boxPage = 0;
  if (boxPages > 1) {
    const tabRow = document.createElement("div");
    tabRow.className = "page-tabs";
    for (let p = 0; p < boxPages; p++) {
      const t = document.createElement("button");
      t.className = "page-tab" + (p === boxPage ? " on" : "");
      t.textContent = String(p + 1);
      const used = monsters.slice(p * BOX_PAGE_SIZE, (p + 1) * BOX_PAGE_SIZE).length;
      t.title = `ページ${p + 1}(${used}/${BOX_PAGE_SIZE})`;
      if (used > 0 && p !== boxPage) t.classList.add("has");
      t.addEventListener("click", () => {
        boxPage = p;
        renderBox();
      });
      tabRow.appendChild(t);
    }
    el.boxList.appendChild(tabRow);
  }
  const pageMons = monsters.slice(boxPage * BOX_PAGE_SIZE, (boxPage + 1) * BOX_PAGE_SIZE);

  // TBH風: スプライトのみのグリッド。ホバーで詳細、クリックで詳細画面。
  const grid = document.createElement("div");
  grid.className = "mon-grid";
  // パーティの子をここへドロップすると外れる(2026-08-13 Haru指示)。
  // 「パーティ枠から一覧へ戻す」= 外す、という直感どおりの操作
  makeDropTarget(grid, dropMonOutOfParty);
  for (const mon of pageMons) {
    // 見た目はbuildMonCellVisualへ集約(2026-08-06: パーティ編成のお気に入り一覧と共通化)。
    // box固有の状態(探索選択モード/調合セット中)はここで追加する
    const cell = buildMonCellVisual(mon, {
      size: 52,
      onFavToggle: () => {
        renderBox();
        // 2026-08-11 Haru指示「お気に入りがリアルタイムにパーティ窓へ反映されるように」:
        // パーティ窓の♥候補グリッドは別窓なので、ここで開いていれば即座に呼ぶ
        // (liveSignatureにもfavを足したので閉じていても次に開けば最新のまま/
        // 開いたままの取りこぼしはこの直呼びが埋める)
        if (openOrder.includes("detail")) renderDetail(currentDetailId);
      },
    });
    if (expedSelectMode && expedSelIds.has(mon.id)) {
      // 探索メンバーに選択中(金枠+🧭)
      cell.classList.add("exped-sel");
      const sb = document.createElement("span");
      sb.className = "mon-cell-exped";
      sb.textContent = "🧭✓";
      cell.appendChild(sb);
    }
    // 調合にセット中の子はバッジで見える化(2026-07-13 FB: タスモン連動方式)
    if (openOrder.includes("compound") && compoundMode !== "gacha") {
      const mark =
        mon.id === compoundBaseId
          ? "軸"
          : (compoundMode === "feed" && feedSelId === mon.id) ||
              (compoundMode === "ritual" && ritualFoodIds.has(mon.id)) ||
              (compoundMode === "convert" && convSelId === mon.id)
            ? "✓"
            : null;
      if (mark) {
        cell.classList.add("in-cube");
        const ck = document.createElement("span");
        ck.className = "cell-cube-check";
        ck.textContent = mark;
        ck.title = mark === "軸" ? "調合の軸(対象)にセット中" : "調合にセット中";
        cell.appendChild(ck);
      }
    }
    makeDragSource(cell, `mon:${mon.id}`);
    bindCellTooltip(
      cell,
      () =>
        monCompareTooltipHtml(mon) +
        `<div class="tt-hint">${
          expedSelectMode
            ? "クリックで 探索メンバーに選ぶ/外す"
            : releaseMode
              ? "クリックで 逃がす(2回押し)"
              : "クリック=詳細 ・ ダブルクリック=パーティ出し入れ"
        }</div>`,
      () => {
        hideTooltip(true);
        if (expedSelectMode) {
          // 探索メンバー選択(2026-07-11): 探索中の子は選べない
          if (onExpedition(state, mon.id)) return void toast("その子はいま探索中");
          if (expedSelIds.has(mon.id)) expedSelIds.delete(mon.id);
          else if (expedSelIds.size < expedNextPartySize()) expedSelIds.add(mon.id);
          else return void toast(`1パーティは ${EXPEDITION_PARTY_SIZE}体まで`);
          renderBox();
          if (openOrder.includes("exped")) renderExpedition();
          return;
        }
        if (releaseMode) {
          tryReleaseFromBox(mon, cell);
          return;
        }
        // 調合窓が開いているときはクリック=調合へセット(2026-07-13 FB
        // 「調合窓からキャラを選ぶ形式は削除。全部タスモンからD&Dか選択で」)
        // 交易船が開いているときはクリックで積む(2026-07-20 FB「タスモンからの移動でいい」)
        if (TRADE_ENABLED && openOrder.includes("trade")) {
          const r = loadTradeShipMonster(state, mon.id);
          if (r.error) return void toast(r.error);
          sfx("chest");
          toast(
            `⚓ ${baseNameOf(r.mon)} が新しい主のもとへ旅立つ準備をした` +
              (r.unequipped > 0 ? `(装備${r.unequipped}個は外して返した)` : ""),
            "#8ad8ff",
          );
          renderTrade();
          renderBox();
          refreshHeroInv();
          save();
          return;
        }
        if (openOrder.includes("compound") && compoundMode !== "gacha") {
          compoundPickFromBox(mon);
          return;
        }
        openCharacter(mon.id); // 詳細+ステータス窓
      },
    );
    // ダブルクリックでパーティに入れる/外す(入れ替えの手数を減らす)
    cell.addEventListener("dblclick", () => {
      hideTooltip(true);
      const inP = state.party.includes(mon.id);
      const okTgl = togglePartyMember(state, mon.id);
      if (!okTgl) {
        toast(inP ? "最低1体は パーティに 必要" : `パーティは 最大 ${MAX_PARTY}体`);
        return;
      }
      playerHp = partyMaxHp();
      syncSceneParty();
      renderBox();
      if (openOrder.includes("detail")) renderDetail(currentDetailId);
      toast(inP ? `${baseNameOf(mon)} をパーティから外した` : `${baseNameOf(mon)} をパーティに入れた!`, "#ffe9a8");
      save();
    });
    // 配合窓が開いているときは右クリックで親にセット(パーティ窓から選んで入れる)
    cell.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      if (openOrder.includes("breed")) {
        hideTooltip(true);
        breedAddMonster(mon.id);
      }
    });
    grid.appendChild(cell);
  }
  // 空き枠を薄いセルとして描画(2026-07-28 FB「拡張しても拡張できてるように
  // 見えない」)。ページ制(2026-07-29)なので「このページに割り当たる枠数」まで埋める。
  // 倉庫と同じく最終ページは容量を超える幻の枠を出さない。
  // 属性フィルタ中は「全体の空き」を出すと数が合わなく見えるので、最低行だけ埋める
  if (boxElemFilter === null) {
    const cellsThisPage = Math.min(
      BOX_PAGE_SIZE,
      Math.max(0, Math.max(boxCapOf(state), monsters.length) - boxPage * BOX_PAGE_SIZE),
    );
    for (let i = pageMons.length; i < cellsThisPage; i++) {
      const cell = document.createElement("div");
      cell.className = "mon-cell mon-cell-empty";
      cell.title = "空き枠(卵の孵化・配合で ここが埋まる)";
      grid.appendChild(cell);
    }
  } else {
    // フィルタ中: マス目の体裁だけ保つ(6列×最低3行)
    const MIN_CELLS = 18;
    const want = Math.max(MIN_CELLS, Math.ceil(pageMons.length / 6) * 6);
    for (let i = pageMons.length; i < want; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "mon-cell empty-cell";
      grid.appendChild(emptyCell);
    }
  }
  el.boxList.appendChild(grid);
}

// ---- キャラ詳細画面 ----
let heroTab = "party"; // パーティ窓タブ: "party"(編成・既定) | "skill"(スキル) | "sphere"(スフィア盤)。
// インベントリは2026-08-06に別窓(#inv-panel)へ外出し。ステータスは別窓
// ※旧「インベントリ」タブは装備欄と重複していたため撤去。装備は部位スロット
//   クリック→装備ピッカー、または「装備」窓から行う(#10)
// パーティ入れ替えピッカーの対象スロット(null=空き枠へ追加 / 数値=その枠を置換)。
// D&Dが使いづらい環境でも、枠の⇄ボタン→候補クリックだけで確実に入れ替えられる
let partyReplaceSlot = null;

// 兆しのアイコン(2026-07-09刷新: 絵文字/記号 → 兆しごとにテーマ色を持つSVGジェム)。
// currentColor がアクセント色に追従するので、node側の色で発光色も統一される。
// スフィア盤の背景アート(Gemini生成 2026-07-11)。盤面ワールドに固定=パン/ズーム追従
const sphereBgImg = new Image();
sphereBgImg.src = "assets/ui/winbg/spherebg.png";

const PERK_ACCENT = {
  atk: "#ff6a4a", // 力=紅
  hp: "#ff5a86", // 体力=薔薇
  skill: "#66d0ff", // 技=蒼
  speed: "#ffd24a", // 疾風=金黄
  drop: "#c88aff", // 運=紫
  gold: "#ffcf4a", // 商人=金
  def: "#7fd4a8", // 守り=翠
  cdr: "#8ae0e0", // 刹那=氷青
};
const PERK_SVG_PATH = {
  // 剣
  atk: '<path d="M19 3l-1.6 4.4-7.2 7.2 2.2 2.2 7.2-7.2L21 4z"/><path d="M8.6 15.5l-4.6 4.6 1.1 1.1 4.6-4.6z"/>',
  // ハート
  hp: '<path d="M12 21C6 16.8 3 13 3 9.6 3 7 5 5.1 7.4 5.1c1.7 0 3.2 1 3.6 2.1.4-1.1 1.9-2.1 3.6-2.1C20 5.1 21 7 21 9.6 21 13 18 16.8 12 21z"/>',
  // 4方の煌めき
  skill: '<path d="M12 2l2.1 6.6L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-3.4z"/>',
  // 稲妻
  speed: '<path d="M13 2L4 14h5.2l-1.2 8L20 9.5h-6z"/>',
  // 卵(しずく)
  drop: '<path d="M12 2.5c3.6 3.8 6 7.4 6 10.4a6 6 0 1 1-12 0c0-3 2.4-6.6 6-10.4z"/>',
  // コイン(リング+芯)
  gold: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 3.4a6.1 6.1 0 1 1 0 12.2 6.1 6.1 0 0 1 0-12.2z"/><circle cx="12" cy="12" r="2.3"/>',
  // 盾
  def: '<path d="M12 2l8 3v6c0 5-3.4 9.2-8 11-4.6-1.8-8-6-8-11V5z"/>',
  // 砂時計
  cdr: '<path d="M6 2h12v3.4l-4.4 4.9c-.3.4-.3 1 0 1.4L18 16.6V21H6v-4.4l4.4-4.9c.3-.4.3-1 0-1.4L6 5.4z"/>',
};
function perkIconSvg(id) {
  return (
    `<svg class="perk-svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">` +
    `${PERK_SVG_PATH[id] ?? PERK_SVG_PATH.skill}</svg>`
  );
}

// 兆しの現在の効果を「はっきりした数値アップ」で表す(%より嬉しい、というユーザー要望)。
// 攻撃/HPは実数値の増分、クリティカル系/加算系は%。1ポイント振ると増える量も出す。
function perkEffectHtml(mon, perkId, n) {
  const baseAtk = Math.round(monsterAtk(mon));
  const baseHp = monsterMaxHp(mon);
  // このperkのnポイントぶんの寄与(実数値)。mult系は現在値×(1-1/mult^n)で逆算
  if (perkId === "atk") {
    const per = PERKS.atk.mult.atk; // 1.015(2026-07-10 スフィア盤v2で刻み直し)
    const cur = Math.round(baseAtk * (1 - 1 / Math.pow(per, n)));
    const nxt = Math.round(baseAtk * per * (1 - 1 / Math.pow(per, n + 1)));
    return { now: `攻撃 +${formatNum(cur)}`, delta: `次で 攻撃 +${formatNum(Math.max(1, nxt - cur))}` };
  }
  if (perkId === "hp") {
    const per = PERKS.hp.mult.hp; // 1.017
    const cur = Math.round(baseHp * (1 - 1 / Math.pow(per, n)));
    const nxt = Math.round(baseHp * per * (1 - 1 / Math.pow(per, n + 1)));
    return { now: `HP +${formatNum(cur)}`, delta: `次で HP +${formatNum(Math.max(1, nxt - cur))}` };
  }
  // 加算系(スキル威力/攻撃速度/ドロップ/ゴールド)は%表示
  const per = PERKS[perkId].stat ? Object.values(PERKS[perkId].stat)[0] : 0;
  const pct = (v) => `${Math.round(v * 1000) / 10}%`;
  return { now: n > 0 ? `+${pct(per * n)}` : "—", delta: `次で +${pct(per)}` };
}

// スフィア盤(FF10方式 2026-07-10)。レベルごとの兆しポイントで、中心から伸びる8本の道と網目の
// 「隣のスフィア」を1個ずつ解放していく。リング4=大スフィア(3pt分)、終端=特殊能力。
// 検査用: 盤面を書き換えたあとに閉包(taken/planRoute)を作り直してから
// __debugSpherePlan を呼ぶためのフック(2026-08-05 ゲート ケース4)
window.__debugSphereRebuild = (m) => { try { buildPerkAllocator(m); } catch { /* 描画は捨てる */ } };
function buildPerkAllocator(mon) {
  const wrap = document.createElement("div");
  wrap.className = "perk-alloc sphere-alloc";
  const pend = pendingPerks(mon);
  let autoPlanIds = null; // お任せルートのプレビュー(draw()が薄い色で描く)

  // ヘッダ: 残ポイント
  const head = document.createElement("div");
  head.className = "perk-pending sphere-head";
  head.innerHTML =
    pend > 0
      ? `✦ スフィア盤: <b>${pend}ポイント</b> 振れる — 光っているスフィアをクリック`
      : `スフィア盤(レベル×1.5ポイント。つながったスフィアだけ解放できる)`;
  wrap.appendChild(head);

  // 🤖お任せモード(2026-07-12 FB): ジョブ(ロール)に合う領域へ自動でルートを引いて振る。
  // 優先順(2026-08-13 Haru指示で改訂): ①同系統の特殊スフィア(=目玉の解放条件。
  // 封印中は囲みから崩す) ②目玉(キーストーン) ③目玉を取ったら打ち切って方針選択
  // (制覇型=自領域の残りも選べる / 分散型)。旧: 領域の通常ノードを全部埋めてから
  // 目玉だったため、方針選択が遠かった
  if (pend > 0) {
    const auto = document.createElement("button");
    auto.className = "chip best-equip-chip sphere-auto-chip";
    const ROLE_SECTOR = { nuke: 0, guard: 1, heal: 2, buff: 3 };
    const KEYSTONE_BY_SECTOR = ["kattack", "ktank", "khealer", "kbuffer", "kutility"];
    const sec = ROLE_SECTOR[roleKeyOf(mon)] ?? 0;
    const secLabel = SPHERE_SECTORS[sec]?.label ?? "お勧め領域";
    auto.textContent = `🤖 お任せで振る(${secLabel})`;
    auto.title = "まずジョブに合う領域の目玉スフィア(特殊スフィア→目玉の順)へ一直線にルートを引く。目玉を取ったら、その後の方針を選べる";
    // ルート計算(シミュレーション。実際には振らない): 実行時とまったく同じ手順で
    // 「仮に取ったことにした集合」を進め、振る順番のノード列を返す
    const planRoute = () => {
      // 2026-08-01 Haru指示で全面改訂:
      //  ①まず**自分のジョブ領域だけ**を取る(旧: 系統の特殊スフィアへ他領域を
      //    踏んで直行=「アタッカーなのにタンク/ヒーラーの領域へ行く」の実犯)
      //  ②領域の締めに目玉(キーストーン)を取る
      //  ③そこで打ち切って方針選択(分散 or 制覇。制覇はどのジョブ方向かも選ぶ)
      //  経路探索も許可された領域の外を踏まない
      ownSectorDone = false;
      const taken = new Set(sphereTaken(mon));
      const isGoldNode = (nd) => nd.grants?.[0] === "gold" || nd.grants?.[0] === "sgold";
      const keystoneId = KEYSTONE_BY_SECTOR[sec];
      const pool = (SPHERE_SECTOR_SPECIALS[keystoneId] ?? []).filter((id) => id !== "sgold");
      const SECONDARY_SECTORS = { 0: [2, 1], 1: [2, 0], 2: [1, 0], 3: [2, 0] };
      // 全域(ジョブ島=sector未定義も含む)を通行可にする印。最後の受け皿で使う
      const ALL_SECTORS = { has: () => true };
      const pathToNearestSim = (goalSet, allowed) => {
        const passable = (nd) =>
          nd &&
          !(nd.jobLock && nd.jobLock !== mon.job) &&
          (goalSet.has(nd.id) || nd.type !== "special") &&
          (allowed.has(nd.sector) || goalSet.has(nd.id));
        const parent = new Map();
        let ids = Object.values(SPHERE_NODES)
          .filter((nd) => !taken.has(nd.id) && passable(nd) && nd.edges.some((e) => e === "start" || taken.has(e)))
          .map((nd) => nd.id);
        for (const id of ids) parent.set(id, null);
        while (ids.length) {
          const next = [];
          for (const id of ids) {
            if (goalSet.has(id)) {
              const path = [];
              for (let cur = id; cur != null; cur = parent.get(cur)) path.unshift(cur);
              return path;
            }
            for (const e of SPHERE_NODES[id].edges) {
              if (e === "start" || taken.has(e) || parent.has(e) || !passable(SPHERE_NODES[e])) continue;
              parent.set(e, id);
              next.push(e);
            }
          }
          ids = next;
        }
        return null;
      };
      // 領域内の残り(通常/ゴールド/その領域内の系統特殊)と目玉
      const sectorRemain = (s2) => {
        const nodes = Object.values(SPHERE_NODES).filter(
          (nd) => !taken.has(nd.id) && nd.sector === s2 && !(nd.jobLock && nd.jobLock !== mon.job),
        );
        return {
          specials: nodes.filter((nd) => nd.type === "special" && !nd.keystone && pool.includes(nd.grants[0])),
          normal: nodes.filter((nd) => nd.type !== "special" && !isGoldNode(nd)),
          gold: nodes.filter((nd) => nd.type !== "special" && isGoldNode(nd)),
        };
      };
      const keystoneOf = (s2) => {
        const kid = KEYSTONE_BY_SECTOR[s2];
        return Object.values(SPHERE_NODES).find((nd) => nd.keystone && nd.grants[0] === kid && !taken.has(nd.id));
      };
      const sectorComplete = (s2) => {
        const r = sectorRemain(s2);
        return r.specials.length === 0 && r.normal.length === 0 && r.gold.length === 0 && !keystoneOf(s2);
      };
      // 隠し/レア職の専用島(ジョブ島。JOB_ISLANDS)は0-4のどのsectorにも属さないため
      // (data.js側でnd.sectorを持たない)、sectorRemain/goalsForの領域ローテーションから
      // 恒久的に見落とされていた(2026-08-05 実機報告「17pt残ってるのにお任せで振れない」
      // の実犯: 通常5領域が尽きた後、色付きの島スフィアだけが残っていても永久に無視される)。
      // 島は5領域の外側の最後の受け皿として扱う
      const jobIslandRemain = () =>
        Object.values(SPHERE_NODES).filter((nd) => nd.jobLock === mon.job && !taken.has(nd.id));
      const jobIslandGoal = () => {
        if (!mon.job) return new Set();
        const remain = jobIslandRemain();
        if (!remain.length) return new Set();
        const normal = remain.filter((nd) => nd.type !== "special"); // コア(special)は最後に締める
        return new Set((normal.length ? normal : remain).map((nd) => nd.id));
      };
      // 「locked なら囲みのノードへ迂回」の共通形(goalsFor / goalsForKeystone が共用)
      const pickToward = (nodes, s2) => {
        const g = new Set();
        for (const nd of nodes) {
          if (!sphereLockReason(mon, nd.id, taken)) g.add(nd.id);
          else for (const e of nd.edges) if (e !== "start" && !taken.has(e) && SPHERE_NODES[e]?.sector === s2) g.add(e);
        }
        return g;
      };
      const goalsFor = (s2) => {
        // 領域内の順序: 系統特殊 → 通常 → ゴールド → 目玉(締め)
        const r = sectorRemain(s2);
        for (const group of [r.specials, r.normal, r.gold]) {
          const g = pickToward(group, s2);
          if (g.size > 0) return g;
        }
        const key = keystoneOf(s2);
        if (key && !sphereLockReason(mon, key.id, taken)) return new Set([key.id]);
        if (key) return pickToward([key], s2);
        return new Set();
      };
      // 自領域の第1フェーズ専用(2026-08-13 Haru指示「まずは自分の領域の目玉スフィアを
      // 取るための挙動をする」): 系統特殊(=目玉の解放条件)→目玉、へ一直線。
      // 領域内の通常/ゴールドは**目的地にしない**(通り道として必要なぶんだけ
      // pathToNearestSim が踏む)。目玉を取った時点で打ち切り、方針をユーザーに聞く
      const goalsForKeystone = () => {
        const r = sectorRemain(sec);
        if (r.specials.length > 0) {
          const g = pickToward(r.specials, sec);
          if (g.size > 0) return g;
        }
        const key = keystoneOf(sec);
        if (key && !sphereLockReason(mon, key.id, taken)) return new Set([key.id]);
        if (key) return pickToward([key], sec);
        return new Set();
      };
      const plan = [];
      let budget = pendingPerks(mon);
      let guard = 400;
      while (budget > 0 && guard-- > 0) {
        let goals = new Set();
        let allowed = new Set([sec]);
        if (keystoneOf(sec)) {
          // ①自領域の目玉(キーストーン)へ一直線(2026-08-13 Haru指示)。
          // 旧: 領域の通常ノードを全部埋めてから目玉、だったため方針選択が
          // 「自領域を取り切った後」まで来なかった。目玉を最優先で取り、
          // 取れた時点(次のループの分岐②)で打ち切って方針を聞く
          goals = goalsForKeystone();
        } else if (!mon.sphereContinueAsked) {
          ownSectorDone = true; // ②目玉を取った=方針選択で打ち切り
          break;
        } else if ((state.settings.sphereAutoMode ?? "spread") === "focus") {
          // 制覇型: 選んだ方向の領域だけを取り切る。取り切ったら次の方向を聞き直す。
          // 自分の領域の残り(通常/ゴールド)も方向として選べる(2026-08-13:
          // 目玉直行化で自領域に通常ノードが残るようになったため)
          const target = state.settings.sphereFocusSector ?? (SECONDARY_SECTORS[sec] ?? [2])[0];
          if (sectorComplete(target)) {
            mon.sphereContinueAsked = false; // 次の方向を選び直させる
            ownSectorDone = true;
            break;
          }
          allowed = new Set([sec, target]);
          goals = goalsFor(target);
        } else {
          // 分散型: 第2領域2つを1ptごとに交互(従来)。
          // 第2領域を取り切ったら**残っている全領域**へ広げる(2026-08-04 FB「ポイントが
          // 余ってるのにお任せで振れない」の実犯: 隣接表2領域が尽きると、タンクや
          // 便利(4)が丸ごと残っていても『振れるスフィアがない』で止まっていた)。
          // 広げる先には自分の領域の残りも含める(目玉直行化で残るようになったため)
          let secs = (SECONDARY_SECTORS[sec] ?? []).filter((s2) => !sectorComplete(s2));
          if (secs.length === 0) secs = [0, 1, 2, 3, 4].filter((s2) => !sectorComplete(s2));
          const ordered = plan.length % 2 === 0 ? secs : [...secs].reverse();
          allowed = new Set([sec, ...secs]);
          for (const s2 of ordered) {
            goals = goalsFor(s2);
            if (goals.size > 0) break;
          }
        }
        // 通常5領域が全部尽きた後の最後の受け皿: ジョブ島(上のコメント参照)。
        // passable()側がgoalSet自体で島を通行可にするので、allowedは変更不要
        if (goals.size === 0) goals = jobIslandGoal();
        let path = goals.size > 0 ? pathToNearestSim(goals, allowed) : null;
        // ---- 最後の受け皿: 方針・領域の絞り込みを**全部外して**盤面全体から探す ----
        // (2026-08-05 Haru「今後一生バグが発生しないように」)。
        // 「振れるスフィアがない」はこれまで3回、毎回**別の実犯**で再発した:
        //   ①SECONDARY_SECTORSに領域4が無い ②zoom座標のズレ ③ジョブ島にsectorが無い。
        // どれも「方針の都合で候補の集合が空になる/経路が通れない」形。個別に塞ぐ限り
        // 4つ目が必ず出るので、**方針を一切見ない全域プランナ**を最後に置く。
        // これで「盤面に振れる所があるのに振れない」は構造的に起こらない
        // (ゲート: tools/verify-sphere-auto.js ケース4=盤面をランダムに削った総当たり)
        // ①まず「目的地はそのまま・通り道の制限だけ外す」。方針(自領域優先など)を
        //   壊さずに、経路が引けないだけの詰まりを解く
        if ((!path || !path[0]) && goals.size > 0) path = pathToNearestSim(goals, ALL_SECTORS);
        // ②それでも駄目なら目的地も盤面全体へ広げる(最後の受け皿)
        if (!path || !path[0]) {
          const anywhere = new Set(
            Object.values(SPHERE_NODES)
              .filter((nd) => !taken.has(nd.id) && !sphereLockReason(mon, nd.id, taken))
              .map((nd) => nd.id),
          );
          if (anywhere.size > 0) path = pathToNearestSim(anywhere, ALL_SECTORS);
        }
        if (!path || !path[0]) break;
        plan.push(path[0]);
        taken.add(path[0]);
        budget--;
      }
      return plan;
    };
    // 検査用フック(2026-08-05): ゲートが盤面をランダムに削って
    // 「振れる所が1つでもあるのに計画0pt」を総当たりで探す。
    // 判定に必要なのは ①いま振れるノードがあるか ②計画が引けたか の2つだけ
    window.__debugSpherePlan = () => {
      const now = new Set(sphereTaken(mon));
      const anyOpen = Object.values(SPHERE_NODES).some(
        (nd) => !now.has(nd.id) && !sphereLockReason(mon, nd.id, now),
      );
      return { anyOpen, plan: planRoute().length };
    };
    // 自領域を取り切ってルートを打ち切ったか(上記④)。planRoute()が毎回書き換える
    let ownSectorDone = false;

    // 目玉スフィアを取ったところで止まったときの選択オーバーレイ(2026-07-22 FB /
    // 2026-08-13 Haru指示「目玉スフィアを取った後はそのあとの方針をユーザーに
    // 選択させる」で発火点を「自領域制覇後」から「目玉取得後」へ前倒し)。
    // 「どっちを選んでも損しない」ことが伝わるよう、両方の中身を並べて見せる
    const askContinuePolicy = () => {
      const ov = document.createElement("div");
      ov.className = "sphere-cont-overlay";
      ov.innerHTML =
        `<div class="sphere-cont-card">` +
        `<div class="sphere-cont-head">✦ 目玉スフィアを 手に入れた!</div>` +
        `<div class="sphere-cont-sub">ここから先の 使い道を選ぼう(後から変えられる)</div>` +
        `<div class="sphere-cont-opts">` +
        `<button class="sphere-cont-opt" data-mode="focus"><b>制覇型</b>` +
        `<small>選んだ領域を 1つずつ 取り切る(自分の領域の残りも選べる)</small></button>` +
        `<button class="sphere-cont-opt" data-mode="spread"><b>分散型</b>` +
        `<small>2つの領域を 半々で 取る。ステータスが かたよらない</small></button>` +
        `</div></div>`;
      for (const b of ov.querySelectorAll(".sphere-cont-opt")) {
        b.addEventListener("click", () => {
          state.settings.sphereAutoMode = b.dataset.mode;
          if (b.dataset.mode === "focus") {
            // 制覇型はどのジョブ方向かも選ばせる(2026-08-01 Haru指示)。
            // 便利(4)も候補に入れ、取り切った領域は出さない(2026-08-04 FB: 隣接表に
            // 4が無く、5領域あるのに4方向しか選べなかった)
            const card = ov.querySelector(".sphere-cont-card");
            const remainOf = (s2) =>
              Object.values(SPHERE_NODES).some(
                (nd) => nd.sector === s2 && !sphereTaken(mon).includes(nd.id) && !(nd.jobLock && nd.jobLock !== mon.job),
              );
            // 自分の領域も候補に入れる(2026-08-13: 目玉直行化で通常/ゴールドが
            // 自領域に残るようになった。先頭に置いて「残りを埋める」動線を最短にする)
            const dirs = [sec, ...[0, 1, 2, 3, 4].filter((s2) => s2 !== sec)].filter((s2) => remainOf(s2));
            card.innerHTML =
              `<div class="sphere-cont-head">🧭 制覇型: どの方向へ?</div>` +
              `<div class="sphere-cont-sub">選んだ領域を取り切ると、また方向を選び直せる</div>` +
              `<div class="sphere-cont-opts">` +
              dirs
                .map((s2) =>
                  `<button class="sphere-cont-opt" data-sector="${s2}"><b>${SPHERE_SECTORS[s2].label}</b>` +
                  (s2 === sec ? `<small>自分の領域の 残りを埋める</small>` : "") +
                  `</button>`)
                .join("") +
              `</div>`;
            for (const d of card.querySelectorAll(".sphere-cont-opt")) {
              d.addEventListener("click", () => {
                state.settings.sphereFocusSector = Number(d.dataset.sector);
                mon.sphereContinueAsked = true;
                ov.remove();
                modeBtn.textContent = autoModeLabel();
                sfx("banner");
                toast(`🧭 継続方針: 制覇型 — ${SPHERE_SECTORS[state.settings.sphereFocusSector].label}へ`, "#8ad8ff");
                save();
                draw();
              });
            }
            return;
          }
          mon.sphereContinueAsked = true; // 次からは止まらない
          ov.remove();
          modeBtn.textContent = autoModeLabel();
          sfx("banner");
          toast("🧭 継続方針: 分散型(2つの領域を半々で取る)", "#8ad8ff");
          save();
          draw();
        });
      }
      wrap.appendChild(ov);
    };

    // お任せの継続方針トグル(2026-07-20 FB)。プレビュー中に切り替えたら引き直す
    const modeBtn = document.createElement("button");
    modeBtn.className = "chip sphere-auto-mode";
    const autoModeLabel = () =>
      (state.settings.sphereAutoMode ?? "spread") === "focus"
        ? `継続: 制覇型(${SPHERE_SECTORS[state.settings.sphereFocusSector ?? 2]?.label ?? ""})`
        : "継続: 分散型";
    modeBtn.textContent = autoModeLabel();
    modeBtn.title = "目玉スフィアを取った後の方針。制覇型=選んだ領域を1つずつ取り切る(自領域の残りも選べる) / 分散型=2つの領域を半々で取る";
    modeBtn.addEventListener("click", () => {
      state.settings.sphereAutoMode =
        (state.settings.sphereAutoMode ?? "spread") === "focus" ? "spread" : "focus";
      modeBtn.textContent = autoModeLabel();
      autoPlanIds = null; // 方針が変わったのでプレビュー中のルートは無効
      spherePlanShownAt = 0;
      cancelBtn.style.display = "none";
      auto.textContent = `🤖 お任せで振る(${secLabel})`;
      toast(
        (state.settings.sphereAutoMode === "focus"
          ? "🧭 お任せの継続方針: 制覇型(隣のジョブ領域を1つずつ制覇)"
          : "🧭 お任せの継続方針: 分散型(2つの領域を半々で取る)"),
        "#8ad8ff",
      );
      draw();
      save();
    });
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "chip sphere-auto-cancel";
    cancelBtn.textContent = "キャンセル";
    cancelBtn.style.display = "none";
    cancelBtn.addEventListener("click", () => {
      autoPlanIds = null;
      spherePlanShownAt = 0;
      // 確認待ち中に先送りした再描画をここで流す(finish()と同じ約束)
      const d = sphereDeferredRender.detail;
      const k = sphereDeferredRender.skills;
      sphereDeferredRender.detail = false;
      sphereDeferredRender.skills = false;
      if (d) keepScroll(() => renderDetail(currentDetailId));
      if (k && openOrder.includes("skills")) renderSkills();
      cancelBtn.style.display = "none";
      auto.textContent = `🤖 お任せで振る(${secLabel})`;
      head.innerHTML = `✦ スフィア盤: <b>${pendingPerks(mon)}ポイント</b> 振れる — 光っているスフィアをクリック`;
      draw();
    });
    auto.addEventListener("click", () => {
      if (sphereAutoRunning) {
        // ゾンビフラグの自己回復(2026-07-29 FB)。正常な実行は340ms間隔で必ず
        // finish()に到達するので、15秒残っているフラグは事故の残骸と断定できる
        if (Date.now() - sphereAutoRunning < SPHERE_AUTO_STUCK_MS) return;
        console.warn("[UI自己監視] お任せの実行中フラグが残っていたため回復した");
        sphereAutoRunning = 0;
      }
      // 1回目: ルートを薄い色でプレビューして確認(2026-07-13 FB
      // 「一度薄い色でルート示して、このルートで振りますがよいですか?のメッセージ」)
      if (!autoPlanIds) {
        const plan = planRoute();
        // 自領域を取り切ったところで打ち切られた=方針を選ぶ分岐点(2026-07-22 FB)
        if (plan.length === 0 && ownSectorDone) return void askContinuePolicy();
        if (plan.length === 0) return void toast("今は 振れるスフィアがない", "#9aa4c8");
        autoPlanIds = plan;
        spherePlanShownAt = Date.now(); // 確認待ちの間は再描画を先送り(上の宣言参照)
        // ルート全体が入るまで引く(2026-07-17 FB「お任せモードもう少し引きで見せて」:
        // ルートの外接矩形からズームを逆算。中間ノード固定の0.9では端が見切れていた)
        const xs = plan.map((i) => SPHERE_NODES[i].x);
        const ys = plan.map((i) => SPHERE_NODES[i].y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        sphereView.cx = (minX + maxX) / 2;
        sphereView.cy = (minY + maxY) / 2;
        const cvEl = wrap.querySelector("canvas");
        const vw = cvEl?.clientWidth || 280, vh = cvEl?.clientHeight || 300;
        const fit = Math.min(
          vw / Math.max(1, maxX - minX + 120), // 両端に余白60px
          vh / Math.max(1, maxY - minY + 120),
        );
        sphereView.zoom = Math.max(0.3, Math.min(0.75, fit));
        head.innerHTML = `🤖 <b>このルート(水色の光)で ${plan.length}pt 振ります。よいですか?</b>`;
        auto.textContent = `✅ このルートで振る(${plan.length}pt)`;
        cancelBtn.style.display = "";
        draw();
        return;
      }
      // 2回目: 確定 → 1つずつ振る(進行した場所を画面中心に 2026-07-13 FB)
      const plan = autoPlanIds;
      autoPlanIds = null;
      spherePlanShownAt = 0; // 確認待ち終了(以降は実行フラグが守る)
      cancelBtn.style.display = "none";
      // 実行中はボタンがスキップに変わる(2026-07-13 FB「スキップできるように」)
      let skipping = false;
      auto.textContent = "⏭ スキップ(残りを一気に振る)";
      let spent = 0;
      let idx = 0;
      sphereAutoRunning = Date.now();
      const skipHandler = () => {
        skipping = true;
      };
      auto.addEventListener("click", skipHandler);
      const finish = () => {
        clearInterval(stepTimer);
        if (!sphereAutoRunning) return;
        sphereAutoRunning = 0;
        auto.removeEventListener("click", skipHandler);
        auto.textContent = `🤖 お任せで振る(${secLabel})`;
        // 実行中に先送りした再描画をここで1回だけ流す(2026-07-30 FB)。
        // spent===0 の早期リターンより前に置く=どの終わり方でも必ず流れる
        const flushDeferred = () => {
          const d = sphereDeferredRender.detail;
          const s = sphereDeferredRender.skills;
          sphereDeferredRender.detail = false;
          sphereDeferredRender.skills = false;
          if (d && openOrder.includes("detail")) renderDetail(currentDetailId);
          if (s && openOrder.includes("skills")) renderSkills();
        };
        if (spent === 0) {
          flushDeferred();
          return void toast("今は 振れるスフィアがない", "#9aa4c8");
        }
        sfx("banner");
        toast(`🤖 ${secLabel}へ お任せで${spent}pt 振った`, "#8ad8ff");
        // 自領域を取り切って止まったなら、続きの方針をその場で聞く
        if (ownSectorDone && pendingPerks(mon) > 0) setTimeout(askContinuePolicy, 350);
        playerHp = Math.min(playerHp, partyMaxHp());
        const container = wrap.closest("#hero-tab-body, #skills-body");
        if (canvas.isConnected && container) {
          const sc = container.scrollTop;
          container.replaceChildren(buildSphereContent(mon));
          container.scrollTop = sc;
          sphereDeferredRender.detail = false; // 盤面は今作り直した
        } else if (openOrder.includes("detail")) {
          renderDetail(mon.id);
          sphereDeferredRender.detail = false;
        }
        flushDeferred();
        renderHud();
        save();
      };
      const stepTimer = setInterval(() => {
        try {
        // 続ける条件は「盤面を載せている窓が開いているか」。キャンバスがDOMに
        // 付いているかで判定すると、戦闘中の再描画で差し替わった瞬間に自分で
        // 止まってしまう(2026-07-30 FB「お任せにすると途中で止まる」)。
        // 窓を閉じたときだけ中断する(ユーザーの意思とみなす)
        const hostOpen = openOrder.includes("detail") || openOrder.includes("skills");
        if (!hostOpen || pendingPerks(mon) <= 0 || idx >= plan.length) return finish();
        sphereAutoRunning = Date.now(); // 心拍(生きている印。長いルートでもゾンビ扱いされない)
        if (skipping) {
          // 残りを一気に振って終了(2026-07-13 FB)
          while (idx < plan.length && pendingPerks(mon) > 0) {
            const rr = sphereActivate(state, mon.id, plan[idx++]);
            if (rr.error) break;
            spent++;
          }
          return finish();
        }
        const id = plan[idx++];
        const r = sphereActivate(state, mon.id, id);
        if (r.error) return finish();
        spent++;
        const nd = SPHERE_NODES[id];
        sphereView.cx = nd.x;
        sphereView.cy = nd.y;
        if (sphereView.zoom < 1.1) sphereView.zoom = 1.1;
        takenSet.add(id);
        frontier.clear();
        for (const f of sphereFrontier(mon)) frontier.add(f);
        head.innerHTML = `🤖 お任せ振り分け中… 残り <b>${pendingPerks(mon)}pt</b>`;
        if (canvas.isConnected) draw(); // 外れている間は描かないだけ(振り分けは続ける)
        } catch (e) {
          // 1ステップの例外で永久に「実行中」のまま固まらない(2026-07-29 FB)。
          // 途中まで振ったぶんは有効のまま、きちんと終了処理へ落とす
          console.error("お任せ振り分けでエラー(終了処理へ)", e);
          finish();
        }
      }, 340);
    });
    // お任せはスクロールしても見える位置に固定(2026-07-16 FB「下の方にいっちゃう」)。
    // 実行中は head.innerHTML が書き換わるため、ボタンは兄弟のバーに入れて巻き込まれない
    const autoBar = document.createElement("div");
    autoBar.className = "sphere-auto-bar";
    autoBar.append(auto, modeBtn, cancelBtn);
    wrap.appendChild(autoBar);
  }

  // 盤面キャンバス(v3: 約370ノードの星図。ホイールでズーム・ドラッグでパン)
  // 幅344は窓の内寸(実測337)を7pxはみ出していた(2026-08-04 verify-langsの
  // スフィアタブ実走査で検出)。CSSで縮めると座標変換(toWorld)が狂うので論理幅ごと縮める
  const W = 336;
  const H = 372;
  const canvas = document.createElement("canvas");
  canvas.className = "sphere-board";
  canvas.width = W * 2; // 高DPI対策(2倍で描いてCSSで半分)
  canvas.height = H * 2;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const minZoom = Math.min(W / SPHERE_BOARD_SIZE.w, H / SPHERE_BOARD_SIZE.h) * 0.95;
  const MAX_ZOOM = 2.4;
  if (!sphereView) sphereView = { cx: SPHERE_START.x, cy: SPHERE_START.y, zoom: 0.9 };
  const clampView = () => {
    sphereView.zoom = Math.max(minZoom, Math.min(MAX_ZOOM, sphereView.zoom));
    sphereView.cx = Math.max(0, Math.min(SPHERE_BOARD_SIZE.w, sphereView.cx));
    sphereView.cy = Math.max(0, Math.min(SPHERE_BOARD_SIZE.h, sphereView.cy));
  };
  const toScreen = (wx, wy) => ({
    x: (wx - sphereView.cx) * sphereView.zoom + W / 2,
    y: (wy - sphereView.cy) * sphereView.zoom + H / 2,
  });
  const toWorld = (sx, sy) => ({
    x: (sx - W / 2) / sphereView.zoom + sphereView.cx,
    y: (sy - H / 2) / sphereView.zoom + sphereView.cy,
  });
  const takenSet = new Set(sphereTaken(mon));
  const frontier = new Set(sphereFrontier(mon));
  // ジョブ島(jobLock)は自分のジョブの島だけ見える(他ジョブの島は存在ごと隠す 2026-07-11)
  const nodeVisible = (n) => !n.jobLock || n.jobLock === mon.job;
  // 目玉スフィアの解放条件(2026-08-12 FB「どれが同系統かわからない」)。
  // SPHERE_SECTOR_SPECIALSは幾何的な近さでなく効果IDで紐づくため、条件の特殊スフィアが
  // 盤面上で離れた場所に散らばっていることがある。keystoneId→[効果IDの配列]から、
  // 実在するノードid(目玉本体+特殊スフィア群)を1回だけ引けるようにしておく
  const keystoneGroups = Object.entries(SPHERE_SECTOR_SPECIALS).map(([keystoneId, perkIds]) => {
    const keystoneNode = Object.values(SPHERE_NODES).find((nd) => nd.keystone && nd.grants[0] === keystoneId);
    const companionIds = Object.values(SPHERE_NODES)
      .filter((nd) => nd.type === "special" && !nd.keystone && perkIds.includes(nd.grants[0]))
      .map((nd) => nd.id);
    return keystoneNode ? { keystoneId: keystoneNode.id, companionIds } : null;
  }).filter(Boolean);
  // ホバー中のノードが参加している同系統グループ(目玉本体でも特殊スフィアでもヒットする)
  const keystoneGroupOf = (nodeId) =>
    keystoneGroups.find((g) => g.keystoneId === nodeId || g.companionIds.includes(nodeId)) ?? null;
  let hoverId = null;
  const draw = () => {
    clampView();
    const z = sphereView.zoom;
    const c = canvas.getContext("2d");
    c.setTransform(2, 0, 0, 2, 0, 0);
    c.clearRect(0, 0, W, H);
    const pad = 30; // 画面外カリングの余白(world px×zoom)
    const onScreenR = (p, r) => p.x > -r && p.x < W + r && p.y > -r && p.y < H + r;
    // ---- FF10風の背景(2026-07-11): 宇宙グラデ+系統色の星雲+星屑 ----
    {
      const bgGrad = c.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0a0c1a");
      bgGrad.addColorStop(0.6, "#0e1024");
      bgGrad.addColorStop(1, "#141130");
      c.fillStyle = bgGrad;
      c.fillRect(0, 0, W, H);
      // 星図アート(生成画像): 画面全面カバー+軽いパララックス(端で切れない 2026-07-11 FB)
      if (sphereBgImg.complete && sphereBgImg.naturalWidth > 0) {
        c.imageSmoothingEnabled = true;
        c.imageSmoothingQuality = "high";
        const cover = Math.max(W / sphereBgImg.naturalWidth, H / sphereBgImg.naturalHeight) * 1.25;
        const iw = sphereBgImg.naturalWidth * cover;
        const ih = sphereBgImg.naturalHeight * cover;
        // 視点中心に応じて最大±10%だけ流す(奥行き感)。はみ出し分に収まるようクランプ
        const px = ((sphereView.cx / SPHERE_BOARD_SIZE.w) - 0.5) * (iw - W) * 0.45;
        const py = ((sphereView.cy / SPHERE_BOARD_SIZE.h) - 0.5) * (ih - H) * 0.45;
        c.globalAlpha = 0.85;
        c.drawImage(sphereBgImg, (W - iw) / 2 - px, (H - ih) / 2 - py, iw, ih);
        c.globalAlpha = 1;
      }
      for (const sec of SPHERE_SECTORS) {
        const nxp = toScreen(
          SPHERE_START.x + Math.cos(sec.angle) * 340,
          SPHERE_START.y + Math.sin(sec.angle) * 300,
        );
        const rad = Math.max(60, 330 * z);
        if (!onScreenR(nxp, rad)) continue;
        const col = PERK_ACCENT[sec.stat] ?? "#ffd67a";
        const neb = c.createRadialGradient(nxp.x, nxp.y, 0, nxp.x, nxp.y, rad);
        neb.addColorStop(0, col + "24");
        neb.addColorStop(0.65, col + "0c");
        neb.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = neb;
        c.fillRect(nxp.x - rad, nxp.y - rad, rad * 2, rad * 2);
      }
      // 星屑(worldに固定=パンで流れる)
      for (let i = 0; i < 110; i++) {
        const h = perkHash("bgstar:" + i);
        const sw = toScreen((h % 2300) - 100, ((h >> 7) % 1900) - 100);
        if (!onScreenR(sw, 4)) continue;
        c.globalAlpha = 0.12 + ((h >> 15) % 45) / 130;
        c.fillStyle = (h >> 3) % 7 === 0 ? "#ffe9b0" : "#cdd8ff";
        const s = 0.6 + ((h >> 19) % 9) / 9;
        c.fillRect(sw.x, sw.y, s, s);
      }
      c.globalAlpha = 1;
    }
    const onScreen = (p) => p.x > -pad && p.x < W + pad && p.y > -pad && p.y < H + pad;
    // エッジ
    c.lineWidth = Math.max(0.7, 1.4 * z);
    for (const n of Object.values(SPHERE_NODES)) {
      if (!nodeVisible(n)) continue;
      const p = toScreen(n.x, n.y);
      for (const e of n.edges) {
        const qn = e === "start" ? SPHERE_START : SPHERE_NODES[e];
        const q = toScreen(qn.x, qn.y);
        if (!onScreen(p) && !onScreen(q)) continue;
        const lit = takenSet.has(n.id) && (e === "start" || takenSet.has(e));
        if (lit) {
          c.save();
          c.shadowColor = "rgba(255,214,122,0.9)";
          c.shadowBlur = 6;
          c.strokeStyle = "rgba(255,224,150,0.95)";
          c.lineWidth = Math.max(1, 2 * z);
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(q.x, q.y);
          c.stroke();
          c.restore();
          c.lineWidth = Math.max(0.7, 1.4 * z);
        } else {
          c.strokeStyle = "rgba(150,160,190,0.26)";
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(q.x, q.y);
          c.stroke();
        }
      }
    }
    // 中心(start)
    const sp0 = toScreen(SPHERE_START.x, SPHERE_START.y);
    c.fillStyle = "#ffd67a";
    c.beginPath();
    c.arc(sp0.x, sp0.y, Math.max(3.5, 9 * z), 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#2a2214";
    c.lineWidth = 2;
    c.stroke();
    // 5系統のセクターラベル(引きのズームで方角の見出しを出す 2026-07-11)
    if (z < 0.75) {
      c.font = "bold 12px sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      for (const sec of SPHERE_SECTORS) {
        const lx = SPHERE_START.x + Math.cos(sec.angle) * 430;
        const ly = SPHERE_START.y + Math.sin(sec.angle) * 380;
        const p = toScreen(lx, ly);
        if (!onScreen(p)) continue;
        c.fillStyle = "rgba(0,0,0,0.55)";
        // canvas描画はDOM自動翻訳の外なので明示的にT()を通す(2026-08-04 Steam審査FB
        // 「スフィア盤の一部が日本語のまま」の実犯。canvas文字はverify-langsのフックが監視)
        const secLabel2 = T(sec.label);
        const tw = c.measureText(secLabel2).width;
        c.fillRect(p.x - tw / 2 - 6, p.y - 9, tw + 12, 18);
        c.fillStyle = PERK_ACCENT[sec.stat] ?? "#ffd67a";
        c.fillText(secLabel2, p.x, p.y);
      }
    }
    // ホバー中のノードが目玉スフィアか、その条件になっている特殊スフィアなら、
    // 同系統一式(目玉+条件の特殊スフィア)をこの1回の描画ぶんだけ光らせる
    const hoverGroup = hoverId ? keystoneGroupOf(hoverId) : null;
    // ノード(ズームに応じてサイズ・マークを調整)
    for (const n of Object.values(SPHERE_NODES)) {
      if (!nodeVisible(n)) continue;
      const p = toScreen(n.x, n.y);
      if (!onScreen(p)) continue;
      const accent = PERK_ACCENT[n.stat] ?? "#ffd67a"; // 特殊(stat=null)は金
      const rw = n.type === "special" ? 11 : n.type === "big" ? 8.5 : 5;
      const r = Math.max(n.type === "small" ? 1.6 : 2.6, rw * z);
      const taken = takenSet.has(n.id);
      // 特殊は封印条件つき(2026-07-12): 囲み全解放(核)/領域の特殊全解放(目玉)
      const locked = !taken && n.type === "special" && sphereLockReason(mon, n.id) != null;
      const avail = frontier.has(n.id) && pend > 0 && !locked;
      c.beginPath();
      if (n.type === "special") {
        c.moveTo(p.x, p.y - r);
        c.lineTo(p.x + r, p.y);
        c.lineTo(p.x, p.y + r);
        c.lineTo(p.x - r, p.y);
        c.closePath();
      } else {
        c.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      if (taken) {
        const orb = c.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 0, p.x, p.y, r * 1.1);
        orb.addColorStop(0, "#ffffff");
        orb.addColorStop(0.45, accent);
        orb.addColorStop(1, accent);
        c.fillStyle = orb;
        c.shadowColor = accent;
        c.shadowBlur = 12;
        c.fill();
        c.shadowBlur = 0;
      } else {
        c.fillStyle = avail ? "rgba(22,26,42,0.96)" : "rgba(16,18,28,0.88)";
        c.fill();
      }
      c.lineWidth = avail ? 2 : 1;
      c.strokeStyle = taken ? "rgba(255,255,255,0.8)" : avail ? accent : "rgba(120,128,148,0.4)";
      c.stroke();
      if (avail) {
        // 解放できるノードは外周リングで誘う(FF10のキラ玉風)
        c.beginPath();
        c.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
        c.strokeStyle = accent + "55";
        c.lineWidth = 1.5;
        c.stroke();
      }
      // ズームが十分あるときだけ ＋/★/🔒 マーク(引きでは潰れるので省略)
      if (n.type !== "small" && r >= 5) {
        c.fillStyle = taken ? "#1a1206" : avail ? accent : "rgba(150,158,175,0.55)";
        c.font = `bold ${Math.max(7, Math.round(8 * z))}px sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(locked ? "🔒" : n.type === "big" ? "＋" : n.keystone ? "◉" : "★", p.x, p.y + 0.5);
      }
      // 目玉スフィア(キーストーン)は未解放でも一回り大きい金の二重リングで存在を主張
      if (n.keystone && !taken) {
        c.beginPath();
        c.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
        c.strokeStyle = locked ? "rgba(255,214,122,0.35)" : "rgba(255,214,122,0.8)";
        c.lineWidth = 1.5;
        c.setLineDash(locked ? [4, 4] : []);
        c.stroke();
        c.setLineDash([]);
      }
      // 同系統ハイライト(2026-08-12 FB「目玉スフィアの条件がどれかわからない」):
      // ホバー中のノードが目玉/その条件の特殊スフィアなら、シアンの光輪で同系統全部を
      // 目立たせる。効果IDで紐づくため盤面上で離れていることがあり、金の通常アクセントとは
      // 別の強い色でひと目で見分けられるようにする
      if (hoverGroup && (n.id === hoverGroup.keystoneId || hoverGroup.companionIds.includes(n.id))) {
        c.beginPath();
        c.arc(p.x, p.y, r + 8, 0, Math.PI * 2);
        c.strokeStyle = "#7af8ff";
        c.lineWidth = 2.5;
        c.shadowColor = "#7af8ff";
        c.shadowBlur = 16;
        c.stroke();
        c.shadowBlur = 0;
      }
    }
    // ホバー中の同系統グループ: 目玉スフィアから各特殊スフィアへ光の糸を結ぶ
    // (盤面上で離れて配置されていることがあるので、線で「これとこれが同じ組」と示す)
    if (hoverGroup) {
      const kNode = SPHERE_NODES[hoverGroup.keystoneId];
      const kp = toScreen(kNode.x, kNode.y);
      c.strokeStyle = "rgba(122, 248, 255, 0.55)";
      c.lineWidth = Math.max(1.5, 2 * z);
      c.setLineDash([3, 5]);
      for (const cid of hoverGroup.companionIds) {
        const cNode = SPHERE_NODES[cid];
        if (!cNode || !nodeVisible(cNode)) continue;
        const cp = toScreen(cNode.x, cNode.y);
        c.beginPath();
        c.moveTo(kp.x, kp.y);
        c.lineTo(cp.x, cp.y);
        c.stroke();
      }
      c.setLineDash([]);
    }
    // ---- お任せルートのプレビュー(2026-07-13 FB「一度薄い色でルート示して」) ----
    if (autoPlanIds && autoPlanIds.length > 0) {
      c.strokeStyle = "rgba(140, 220, 255, 0.45)";
      c.lineWidth = Math.max(2, 3 * z);
      c.setLineDash([5, 4]);
      c.beginPath();
      let prev = null;
      for (const id of autoPlanIds) {
        const nd = SPHERE_NODES[id];
        const pt = toScreen(nd.x, nd.y);
        if (prev) {
          c.moveTo(prev.x, prev.y);
          c.lineTo(pt.x, pt.y);
        }
        prev = pt;
      }
      c.stroke();
      c.setLineDash([]);
      for (const id of autoPlanIds) {
        const nd = SPHERE_NODES[id];
        const pt = toScreen(nd.x, nd.y);
        c.beginPath();
        c.arc(pt.x, pt.y, Math.max(4, 7 * z), 0, Math.PI * 2);
        c.fillStyle = "rgba(140, 220, 255, 0.22)";
        c.fill();
        c.strokeStyle = "rgba(140, 220, 255, 0.6)";
        c.lineWidth = 1.5;
        c.stroke();
      }
    }
  };
  draw();
  if (!sphereBgImg.complete) sphereBgImg.addEventListener("load", () => draw(), { once: true });
  // ---- 操作: ホイールズーム(カーソル基準)・ドラッグパン・クリック解放 ----
  // ポインタ座標→盤面論理座標(0..W/H)の正規化(2026-08-04 FB「押してるところと違う
  // スフィアが解放される」)。表示サイズ(CSS zoom)中は clientX/rect が視覚px=論理px×zoom
  // になり、そのままtoWorldへ渡すと中心から離れるほどずれて隣のノードに当たっていた。
  // rect実寸との比で割り戻せば、zoomでもmax-width縮みでも常に論理座標に戻る
  const toBoard = (ev) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left) * (W / rect.width),
      y: (ev.clientY - rect.top) * (H / rect.height),
      kx: W / rect.width, // パンの変位換算にも同じ比を使う
    };
  };
  const nodeAt = (ev) => {
    const b = toBoard(ev);
    const w = toWorld(b.x, b.y);
    let best = null;
    let bd = 14 / sphereView.zoom; // 当たり判定はworld座標で
    for (const n of Object.values(SPHERE_NODES)) {
      if (n.jobLock && n.jobLock !== mon.job) continue; // 見えない島は当たらない
      const d = Math.hypot(n.x - w.x, n.y - w.y);
      if (d < bd) {
        bd = d;
        best = n;
      }
    }
    return best;
  };
  canvas.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      const b = toBoard(ev);
      const mx = b.x;
      const my = b.y;
      const before = toWorld(mx, my);
      sphereView.zoom *= Math.exp(-ev.deltaY * 0.0012);
      clampView();
      // カーソル下のワールド座標が動かないように中心を補正
      sphereView.cx = before.x - (mx - W / 2) / sphereView.zoom;
      sphereView.cy = before.y - (my - H / 2) / sphereView.zoom;
      draw();
    },
    { passive: false },
  );
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  canvas.addEventListener("pointerdown", (ev) => {
    // 2026-08-07 Haru指示「マウスホイールのクリックで動く機能を消して」:
    // button判定が無く、中クリック(1)・右クリック(2)でもパンが始まっていた。
    // 左クリック/タッチ(button===0)だけを盤面パンの起点にする
    if (ev.button !== 0) return;
    dragging = true;
    moved = 0;
    lastX = ev.clientX;
    lastY = ev.clientY;
    try {
      canvas.setPointerCapture(ev.pointerId);
    } catch {
      /* 合成イベント等でpointerIdが無効なときは無視(パンは動く) */
    }
  });
  // ホバーで効果ツールチップ(装備と同じ見た目。「何の効果か分かるように」2026-07-11)
  const nodeTipHtml = (n) => {
    const taken = takenSet.has(n.id);
    const avail = frontier.has(n.id);
    const stateLine = taken
      ? '<span style="color:#8af0a8">✓ 解放済み</span>'
      : avail
        ? pend > 0
          ? '<span style="color:#ffd67a">クリックで解放できる(1pt)</span>'
          : '<span style="color:#ff9a9a">ポイントがない(レベルアップで獲得)</span>'
        : (() => {
            // 少し先のノード: ポイントが足りればクリックで自動ルート(2026-07-12 FB)
            const p2 = spherePathTo(n.id);
            return p2 && pend >= p2.length
              ? `<span style="color:#8ad8ff">クリックで ここまで自動で振る(${p2.length}pt)</span>`
              : p2
                ? `<span style="color:#8b95a8">ここまで${p2.length}pt(いま${pend}pt)</span>`
                : '<span style="color:#8b95a8">まだ届かない(隣のスフィアから道をつなごう)</span>';
          })();
    if (n.type === "special") {
      const p = PERKS[n.grants[0]];
      // 封印条件(2026-07-12): 核=囲み全解放 / 目玉=領域の特殊全解放。開示はツールチップで
      const lock = taken ? null : sphereLockReason(mon, n.id);
      const lockLine = lock
        ? lock.kind === "keystone"
          ? `<span style="color:#ff9a9a">🔒 封印中: 同系統の特殊スフィアを全部解放すると開く(あと${lock.missing}/${lock.total}個)</span>`
          : `<span style="color:#ff9a9a">🔒 封印中: 周りのスフィアを全部解放すると開く(あと${lock.missing}個)</span>`
        : null;
      // どれが同系統かを見た目でも分かるようにするヒント(2026-08-12 FB)。目玉本体・
      // その条件になっている特殊スフィアのどちらをホバーしても、盤面上でシアンに光る
      const groupHint = keystoneGroupOf(n.id)
        ? '<br><span style="color:#7af8ff">✦ 同系統の組はホバーで盤面上に光って表示される</span>'
        : "";
      return (
        `<div class="tt-name" style="color:#ffd67a">${n.keystone ? "◉ 目玉スフィア" : "◆ 特殊スフィア"}【${p.label}】</div>` +
        `<div class="tt-opts">${p.desc}</div><div class="tt-hint">${lockLine ?? stateLine}${groupHint}</div>`
      );
    }
    if (n.type === "big") {
      // 「兆し×3」の違和感を解消(2026-07-16 FB): 超兆しの名で、最初から3回分の
      // 合計値を直接見せる(複利のmult系は m³ で正確に計算。×3の掛け算をさせない)
      const p = PERKS[n.stat];
      const tripled = (() => {
        if (p.mult) {
          const [k, m] = Object.entries(p.mult)[0];
          const total = (Math.pow(m, 3) - 1) * 100;
          return `${k === "hp" ? "最大HP" : "攻撃"} +${Math.round(total * 10) / 10}%`;
        }
        const [, v] = Object.entries(p.stat)[0];
        const total = v * 3 * 100;
        // 元のdescの表現(被ダメージ -/クールタイム短縮 +等)を数字だけ3倍にして使う
        return p.desc.replace(/[-+][\d.]+%/, (s) => `${s[0]}${Math.round(total * 100) / 100}%`);
      })();
      const superLabel = p.label.replace("の兆し", "の超兆し");
      return (
        `<div class="tt-name" style="color:${PERK_ACCENT[n.stat]}">＋ 超スフィア【${superLabel}】</div>` +
        `<div class="tt-opts">${tripled}</div><div class="tt-hint">${stateLine}</div>`
      );
    }
    const p = PERKS[n.stat];
    return (
      `<div class="tt-name" style="color:${PERK_ACCENT[n.stat]}">● ${p.label}</div>` +
      `<div class="tt-opts">${p.desc}</div><div class="tt-hint">${stateLine}</div>`
    );
  };
  canvas.addEventListener("pointermove", (ev) => {
    if (dragging) {
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = ev.clientX;
      lastY = ev.clientY;
      if (moved > 4) {
        hideTooltip();
        hoverId = null;
        // 変位も視覚px→論理pxへ換算してからworldへ(zoom中のパン速度ずれ防止)
        const kx = toBoard(ev).kx;
        sphereView.cx -= (dx * kx) / sphereView.zoom;
        sphereView.cy -= (dy * kx) / sphereView.zoom;
        draw();
      }
      return;
    }
    const n = nodeAt(ev);
    if (!n) {
      if (hoverId) {
        const hadGroup = keystoneGroupOf(hoverId);
        hideTooltip();
        hoverId = null;
        if (hadGroup) draw(); // 同系統ハイライト中に盤面外へ抜けたら消す
      }
    } else if (hoverId !== n.id) {
      const hadGroup = hoverId ? keystoneGroupOf(hoverId) : null;
      hoverId = n.id;
      showTooltip(nodeTipHtml(n), ev.clientX, ev.clientY);
      // 目玉/特殊スフィアの出入りだけ再描画する(無関係なノードのホバーでは描き直さない)
      if (hadGroup || keystoneGroupOf(hoverId)) draw();
    } else {
      positionTooltip(ev.clientX, ev.clientY); // 同じノード内はカーソル追従だけ
    }
    canvas.style.cursor = n && frontier.has(n.id) && pend > 0 ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerleave", () => {
    const hadGroup = hoverId ? keystoneGroupOf(hoverId) : null;
    hideTooltip();
    hoverId = null;
    if (hadGroup) draw();
  });
  // 「少し先」のノードへの最短ルート(未解放ノード列、末尾=target)。
  // 特殊/目玉は経由しない(1ptずつ価値が高いものを勝手に消費しない)。届かなければnull
  const spherePathTo = (targetId) => {
    const taken = new Set(sphereTaken(mon));
    const passable = (nd) =>
      nd && !(nd.jobLock && nd.jobLock !== mon.job) && (nd.id === targetId || nd.type !== "special");
    // 2026-08-04 FB「ここまで自動で振るとかしても他のところに行ったりする」:
    // 旧BFSはホップ数だけの最短で、同距離の候補は**定義順**で選ばれるため、
    // 目的地と関係ない隣の領域を横切るルートが普通に出た。
    // 経路コスト = 1歩1.0 + 目的地の領域外なら+0.01。ペナルティは歩数(=消費pt)と
    // 絶対に交換されない大きさに抑える(盤面最長でも50歩×0.01=0.5<1)。
    // 歩数最短のまま、同歩数なら「目的地の領域に沿う道」が必ず勝つ(ダイクストラ)
    const targetSec = SPHERE_NODES[targetId]?.sector;
    const stepCost = (nd) => 1 + (nd.sector === targetSec || nd.id === targetId ? 0 : 0.01);
    const dist = new Map();
    const parent = new Map();
    const queue = [];
    for (const nd of Object.values(SPHERE_NODES)) {
      if (taken.has(nd.id) || !passable(nd)) continue;
      if (!nd.edges.some((e) => e === "start" || taken.has(e))) continue;
      dist.set(nd.id, stepCost(nd));
      parent.set(nd.id, null);
      queue.push(nd.id);
    }
    while (queue.length) {
      queue.sort((a, b) => dist.get(a) - dist.get(b)); // 盤面は数百ノード=素朴で十分
      const id = queue.shift();
      if (id === targetId) {
        const path = [];
        for (let cur = id; cur != null; cur = parent.get(cur)) path.unshift(cur);
        return path;
      }
      for (const e of SPHERE_NODES[id].edges) {
        if (e === "start" || taken.has(e) || !passable(SPHERE_NODES[e])) continue;
        const nd2 = dist.get(id) + stepCost(SPHERE_NODES[e]);
        if (nd2 < (dist.get(e) ?? Infinity)) {
          dist.set(e, nd2);
          parent.set(e, id);
          if (!queue.includes(e)) queue.push(e);
        }
      }
    }
    return null;
  };
  canvas.addEventListener("pointerup", (ev) => {
    const wasDrag = moved > 4;
    dragging = false;
    if (wasDrag) return; // パン操作はクリック扱いしない
    const n = nodeAt(ev);
    if (!n) return;
    let result = sphereActivate(state, mon.id, n.id);
    if (result.error && result.error.includes("繋がっていない")) {
      // 少し先のスフィア: ポイントが足りればそこまで自動でルートを振る(2026-07-12 FB)
      const path = spherePathTo(n.id);
      if (!path) return void toast(result.error);
      if (pend < path.length)
        return void toast(`ここまで${path.length}pt 必要(あと${path.length - pend}pt 足りない)`, "#ff9a9a");
      // 行き先が封印中の特殊なら、ルートを振っても開かない=先に無駄振りさせない
      if (n.type === "special") {
        const virt = new Set([...sphereTaken(mon), ...path]);
        const stillLocked = n.keystone
          ? (SPHERE_SECTOR_SPECIALS[n.grants[0]] ?? []).some(
              (pid) =>
                !Object.values(SPHERE_NODES).some(
                  (nd) => nd.grants[0] === pid && nd.type === "special" && !nd.keystone && virt.has(nd.id),
                ),
            )
          : n.edges.some((e) => e !== "start" && !virt.has(e));
        if (stillLocked)
          return void toast(
            n.keystone
              ? "目玉スフィアは封印中: 同系統の特殊スフィアを全部解放すると開く"
              : "特殊スフィアは封印中: 周りのスフィアを全部解放すると開く",
            "#ff9a9a",
          );
      }
      for (const id of path) {
        result = sphereActivate(state, mon.id, id);
        if (result.error) return void toast(result.error);
      }
      toast(`🔮 ルートを自動でつないだ(${path.length}pt)`, "#8ad8ff");
    }
    if (result.error) return void toast(result.error);
    // 手動クリックは「お任せ」の確認待ち(プレビュー)を暗黙にキャンセルする(2026-08-12
    // バグ報告「お任せ→手動クリックで、スフィア盤から戻れなくなる」)。renderDetail/
    // renderSkillsはsphereAutoBusy()(spherePlanShownAtが立っている間)で自分自身の
    // 再描画を先送りする仕組みで、これは「いずれユーザーが確認かキャンセルを押す」
    // 前提だった。だが手動クリックはどちらも押さないままボード状態を変えてしまうため、
    // 確認待ちフラグだけが最大60秒(SPHERE_PLAN_WAIT_MS)残り続け、その間パーティ/
    // スキルタブへの切替クリックが黙って効かなくなる(heroTabは即座に書き換わるが
    // renderDetailが先送りされてDOMは古いまま=画面が固まって見える)。
    // 手動で盤面を動かした時点でプレビューは意味を失うので、ここで確実に閉じる
    spherePlanShownAt = 0;
    {
      const d = sphereDeferredRender.detail;
      const s = sphereDeferredRender.skills;
      sphereDeferredRender.detail = false;
      sphereDeferredRender.skills = false;
      if (s && openOrder.includes("skills")) renderSkills();
    }
    hideTooltip(true); // 盤面を作り直すのでホバー中のツールチップを片付ける
    const names = result.perks.map((p) => p.label);
    toast(
      n.type === "special"
        ? `★ 特殊スフィア【${names[0]}】を解放!!`
        : n.type === "big"
          ? `＋ 大スフィア解放! ${names[0]}×3`
          : `✦ ${names[0]} を解放`,
      PERK_ACCENT[n.stat] ?? "#ffd67a",
    );
    playerHp = Math.min(playerHp, partyMaxHp());
    // 連続で振れるようにスフィアタブの中身だけ差し替え(ビューはsphereViewで維持)
    const container = canvas.closest("#hero-tab-body, #skills-body");
    if (container) {
      const sc = container.scrollTop;
      container.replaceChildren(buildSphereContent(mon));
      container.scrollTop = sc;
    } else if (openOrder.includes("detail")) {
      renderDetail(mon.id);
    }
    if (openOrder.includes("box")) renderBox();
    save();
  });
  wrap.appendChild(canvas);
  // ズーム操作ボタン(＋/−/全体/中心へ)
  const zoomBar = document.createElement("div");
  zoomBar.className = "sphere-zoombar";
  const zBtn = (label, title, fn) => {
    const b = document.createElement("button");
    b.className = "sphere-zbtn";
    b.textContent = label;
    b.title = title;
    b.addEventListener("click", () => {
      fn();
      clampView();
      draw();
    });
    zoomBar.appendChild(b);
  };
  zBtn("＋", "拡大", () => (sphereView.zoom *= 1.3));
  zBtn("−", "縮小", () => (sphereView.zoom /= 1.3));
  zBtn("全体", "盤面全体を見る", () => {
    sphereView.zoom = minZoom;
    sphereView.cx = SPHERE_BOARD_SIZE.w / 2;
    sphereView.cy = SPHERE_BOARD_SIZE.h / 2;
  });
  zBtn("中心", "スタート地点へ", () => {
    sphereView.cx = SPHERE_START.x;
    sphereView.cy = SPHERE_START.y;
    sphereView.zoom = Math.max(sphereView.zoom, 0.9);
  });
  wrap.appendChild(zoomBar);

  // 凡例+現在の合計効果
  const legend = document.createElement("div");
  legend.className = "sphere-legend";
  legend.innerHTML =
    SPHERE_STATS.map(
      (st) => `<span class="sphere-key" style="color:${PERK_ACCENT[st]}">●${PERKS[st].label.replace("の兆し", "")}</span>`,
    ).join("") +
    `<span class="sphere-key dim">盤面は5方向に大別: 北=アタッカー/北東=タンク/南東=ヒーラー/南西=バッファー/北西=便利(卵・金)。` +
    `＋=大スフィア(3pt分) 金◆=特殊。全${Object.keys(SPHERE_NODES).length}スフィア>100pt=育てる方向を選ぶ。` +
    `ホイールで拡大縮小・ドラッグで移動</span>`;
  wrap.appendChild(legend);
  const counts = {};
  for (const p of mon.perks ?? []) counts[p.id] = (counts[p.id] ?? 0) + 1;
  const effParts = [];
  for (const id of ["atk", "hp", "skill", "speed", "drop", "gold"]) {
    const n = counts[id] ?? 0;
    if (n > 0) effParts.push(`${PERKS[id].label.replace("の兆し", "")}×${n}`);
  }
  for (const [id, perk] of Object.entries(PERKS)) {
    if (perk.special && (counts[id] ?? 0) > 0) effParts.push(`★${perk.label}`);
  }
  if (effParts.length > 0) {
    const eff = document.createElement("div");
    eff.className = "sphere-effects";
    eff.textContent = `現在の効果: ${effParts.join(" ・ ")}`;
    wrap.appendChild(eff);
  }
  // スフィア初期化(2026-07-13 FB「やりづらい。初期化アイテムx/x表示付きで
  // 分かりやすい位置に常設+初期化確認もほしい」)
  // → 最下部に常時表示(sticky)。所持x/必要1を明示し、2度押しで確認してから実行
  const spent = mon.perks?.length ?? 0;
  const footer = document.createElement("div");
  footer.className = "perk-footer sphere-reset-bar";
  const tokens = crystalCount(state);
  const resetBtn = document.createElement("button");
  resetBtn.className = "perk-reset perk-token";
  const baseLabel = `${crystalIconHtml(15)} スフィア初期化(叡智の水晶 ${tokens}/1)`;
  resetBtn.innerHTML = baseLabel;
  resetBtn.disabled = tokens < 1 || spent === 0;
  resetBtn.title =
    spent === 0
      ? "まだポイントを振っていない"
      : tokens < 1
        ? "叡智の水晶は 幕ボス(まれ)・中ボス(ごくまれ)からドロップする激レア品"
        : "叡智の水晶を1個使って 振ったポイントを全部戻す";
  resetBtn.addEventListener("click", () => {
    if (!resetBtn.dataset.confirm) {
      resetBtn.dataset.confirm = "1";
      resetBtn.classList.add("danger");
      resetBtn.innerHTML = `本当に初期化? ${spent}pt戻る(水晶1個消費) — もう一度クリック`;
      setTimeout(() => {
        resetBtn.dataset.confirm = "";
        resetBtn.classList.remove("danger");
        resetBtn.innerHTML = baseLabel;
      }, 4000);
      return;
    }
    const result = resetPerksWithToken(state, mon.id);
    if (result.error) {
      toast(result.error);
      return;
    }
    toast(`🔮 初期化した(${result.refunded}ポイント 戻った・水晶 残り${result.remaining}個)`, "#c88aff");
    playerHp = Math.min(playerHp, partyMaxHp());
    if (openOrder.includes("detail")) renderDetail(mon.id);
    if (openOrder.includes("skills")) renderSkills();
    if (openOrder.includes("box")) renderBox();
    renderHud();
    save();
  });
  footer.appendChild(resetBtn);
  // 説明文は削除(2026-07-17 FB「スフィア初期化のメッセージ文削除」)。
  // 水晶の入手法などはボタンのx/1表示と水晶アイテムのツールチップが伝える
  resetBtn.title = "ポイントはレベル×1.5。初期化は「🔮叡智の水晶」でのみ(ボス撃破で入手)";
  wrap.appendChild(footer);
  return wrap;
}

// スキル習得の2択+セット管理(スキルウィンドウ用)
function buildSkillLearning(mon) {
  const wrap = document.createElement("div");
  wrap.className = "skill-learning";
  const stars = RARITY_META[SPECIES[mon.speciesId].rarity].stars;
  const learned = mon.learnedSkills ?? [SPECIES[mon.speciesId].skillId];
  const equipped = mon.equippedSkills ?? [learned[0]];

  // 未習得の節目があれば2択を出す
  const pend = pendingSkillPicks(mon);
  if (pend > 0) {
    const milestone = skillPicksOf(mon) + 1; // 継承スキルは節目を消費しない(learnSkillと同じ計算)
    const head = document.createElement("div");
    head.className = "perk-pending";
    // 2026-08-01 友人テストFB「どっちか一つ選んでねって表示」: 1行に詰めず、
    // 指示文を独立させて誰でも迷わない形に
    head.innerHTML =
      `✦ Lv${milestone * SKILL_PICK_INTERVAL} で新しいスキルを覚える!(残り${pend}回)` +
      `<br><b style="color:#ffe9a8">下の2つから どちらか1つを選んで習得</b><small>(選び直しはできない)</small>`;
    wrap.appendChild(head);
    const row = document.createElement("div");
    row.className = "skill-choice-row";
    for (const id of skillChoices(mon.id, milestone, stars, learned, roleKeyOf(mon), SPECIES[mon.speciesId].element)) {
      const sk = SKILLS[id];
      const b = document.createElement("button");
      b.className = "skill-choice";
      // 自分の星を超えるスキル=レア枠。光らせて「引き」の高揚感を出す
      const isRare = skillStars(id) > stars + 1;
      if (isRare) b.classList.add("rare");
      b.innerHTML =
        (isRare ? `<span class="rare-skill-tag">✨ レアスキル!</span><br>` : "") +
        `${skillKindLabel(sk)}` +
        `<b>${sk.name}</b> <small>★${skillStars(id)}</small><br><small>${sk.desc}</small>`;
      b.addEventListener("click", () => {
        const doLearn = (forgetId = null) => {
          const result = learnSkill(state, mon.id, id, forgetId);
          if (result.needForget) {
            showForgetPicker(id); // 4つ埋まっている→忘れるスキルを選ぶ
            return;
          }
          if (result.error) {
            toast(result.error);
            return;
          }
          celebrateLoot({
            kicker: "スキル習得!",
            icon: "✦",
            title: result.skill.name,
            sub: result.skill.desc,
            rarity: RARITY_ORDER[Math.min(skillStars(id), RARITY_ORDER.length) - 1],
          });
          renderSkills();
          if (openOrder.includes("detail")) renderDetail(mon.id);
          save();
        };
        // 覚えているスキルを忘れて枠を空けるUI。ポップアップで1枚だけ出す
        // (2026-07-11 FB: インライン追記だと押した回数ぶん積まれて気持ち悪い)
        const showForgetPicker = (learnId) => {
          document.querySelector(".forget-overlay")?.remove(); // 二重表示を防ぐ
          const overlay = document.createElement("div");
          overlay.className = "feed-overlay forget-overlay";
          const box = document.createElement("div");
          box.className = "feed-box evolve-box";
          box.innerHTML =
            `<div class="evolve-title">スキルは4つまで</div>` +
            `<div class="evolve-note">「${SKILLS[learnId].name}」を覚えるには どれか1つ忘れる</div>`;
          // 基本スキルも候補に出す(2026-07-28 FB「初期スキルを忘れることができない」)
          for (const fid of mon.learnedSkills ?? []) {
            const fb = document.createElement("button");
            fb.className = "evolve-card";
            fb.innerHTML =
              `<span class="evolve-kind">忘れる</span>` +
              `<b>${SKILLS[fid].name} <small>★${skillStars(fid)}</small></b>` +
              `<small>${SKILLS[fid].desc}</small>`;
            fb.addEventListener("click", () => {
              overlay.remove();
              doLearn(fid);
            });
            box.appendChild(fb);
          }
          const cancel = document.createElement("button");
          cancel.className = "compound-do evolve-cancel";
          cancel.textContent = "キャンセル";
          cancel.addEventListener("click", () => overlay.remove());
          box.appendChild(cancel);
          overlay.appendChild(box);
          overlay.addEventListener("click", (ev2) => {
            if (ev2.target === overlay) overlay.remove();
          });
          document.body.appendChild(overlay);
        };
        doLearn();
      });
      row.appendChild(b);
    }
    // 「覚えない」(2026-07-12 FB): この節目を見送る選択肢。節目は消費されやり直し不可
    const skipBtn = document.createElement("button");
    skipBtn.className = "skill-choice skill-skip";
    skipBtn.textContent = "覚えない";
    skipBtn.title = "この節目は見送る(やり直し不可)";
    skipBtn.addEventListener("click", () => {
      const r = skipSkillPick(state, mon.id);
      if (r.error) return void toast(r.error);
      toast(`Lv${r.milestone * SKILL_PICK_INTERVAL} のスキル習得を見送った`, "#9aa4c8");
      renderSkills();
      if (openOrder.includes("detail")) renderDetail(mon.id);
      save();
    });
    row.appendChild(skipBtn);
    wrap.appendChild(row);
  }

  // 覚えたスキル一覧(クリックでセット/外す)。セット中のスキルを上に並べて見やすく。
  // 覚えたスキル一覧はスキル解放レベル(レール)に統合(2026-07-11 FB)。
  // セット/解除はレールの行クリックで行う
  return wrap;
}

// 装備+兆し由来のボーナス行(0なら出さない)。「装備がステータスに効いている」ことを見せる
function bonusRow(label, v) {
  if (!v || v <= 0.0005) return "";
  const pct = Math.round(v * 1000) / 10;
  return `<div class="sheet-row"><span>${label}</span><b class="diff-up">+${pct}%</b></div>`;
}

// タスモン窓(box)とパーティ編成のお気に入り一覧で見た目を完全に共通化するための
// セル生成(2026-08-06夜 FB「お気に入りのキャラはタスモン窓のキャラ表示と一緒にして、
// 枠のサイズも一緒にして」)。枠色・光る演出・使用中/探索中/新着/お気に入り/役割/戦力値
// などの視覚要素を1か所に集約。クリック/ドラッグ/ダブルクリック等の挙動は文脈依存なので
// 呼び出し側(renderBoxの本体ループ / buildPartyPicker)で個別に付ける
function buildMonCellVisual(mon, { size = 52, onFavToggle } = {}) {
  const species = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const em = ELEMENT_META[species.element];
  const partyIndex = state.party.indexOf(mon.id);
  const cell = document.createElement("div");
  cell.className = "mon-cell";
  cell.style.borderColor = rm.color;
  cell.style.background = rarityCellBg(rm);
  if (rm.stars >= 4) cell.style.boxShadow = `0 0 ${rm.stars}px ${rm.color}66`;
  if (partyIndex !== -1) cell.classList.add("in-party");
  cell.dataset.mon = mon.id; // 自己監視スキャナ用
  cell.dataset.uiKey = `${mon.speciesId}|${mon.evoSkin ?? ""}|${mon.awakening ?? 0}`;
  cell.appendChild(monIconCanvas(mon, size));
  if (partyIndex !== -1) {
    const badge = document.createElement("span");
    badge.className = "mon-cell-badge";
    badge.textContent = partyIndex === 0 ? "Ｌ" : String(partyIndex + 1);
    cell.appendChild(badge);
    // 「使用中」帯(2026-07-24 FB)。探索中と同じ位置・同じ読み方で状態を1語で示す
    const use = document.createElement("span");
    use.className = "mon-cell-use-label";
    use.textContent = "使用中";
    cell.appendChild(use);
  }
  if (onExpedition(state, mon.id)) {
    cell.classList.add("on-exped");
    const ex = document.createElement("span");
    ex.className = "mon-cell-exped";
    ex.textContent = "🧭";
    ex.title = "探索中(帰還までパーティ/調合に使えない)";
    cell.appendChild(ex);
    const lb = document.createElement("span");
    lb.className = "mon-cell-exped-label";
    lb.textContent = "探索中";
    cell.appendChild(lb);
  }
  if (canEvolve(mon)) {
    const ev = document.createElement("span");
    ev.className = "mon-cell-evolve";
    ev.textContent = "⤴";
    ev.title = `第${evolveStage(mon) + 1}進化できる!(パーティ窓から)`;
    cell.appendChild(ev);
  }
  if (pendingPerks(mon) > 0 || pendingSkillPicks(mon) > 0) {
    cell.classList.add("notify");
    cell.title =
      (cell.title ? cell.title + " / " : "") +
      [
        pendingSkillPicks(mon) > 0 ? `スキル習得 ${pendingSkillPicks(mon)}` : null,
        pendingPerks(mon) > 0 ? `スフィア ${pendingPerks(mon)}pt` : null,
      ]
        .filter(Boolean)
        .join(" ・ ");
  }
  // お気に入り(2026-07-13 FB): Ctrl+クリックで♥切替。逃がす/調合の自動候補から保護
  if (mon.fav) {
    const fv = document.createElement("span");
    fv.className = "mon-cell-fav";
    fv.textContent = "♥";
    cell.appendChild(fv);
  }
  cell.addEventListener(
    "click",
    (ev2) => {
      if (!ev2.ctrlKey) return;
      ev2.stopPropagation();
      ev2.preventDefault();
      mon.fav = !mon.fav;
      toast(mon.fav ? `♥「${baseNameOf(mon)}」をお気に入りにした(逃がす・調合候補から保護)` : `「${baseNameOf(mon)}」のお気に入りを外した`);
      onFavToggle?.();
      save();
    },
    true,
  );
  if (mon.isNew) {
    cell.classList.add("is-new");
    const nb = document.createElement("span");
    nb.className = "mon-cell-new";
    nb.textContent = "NEW";
    cell.appendChild(nb);
    // 詳細を開かなくてもNEWが消えない不具合対策: カーソルを合わせた=見た時点で消す(2026-07-09)
    cell.addEventListener(
      "mouseenter",
      () => {
        if (!mon.isNew) return;
        mon.isNew = false;
        cell.classList.remove("is-new");
        nb.remove();
        save();
      },
      { once: true },
    );
  }
  if ((mon.awakening ?? 0) > 0) {
    // 覚醒個体はオーラ+キラキラで別格に見せる(2026-07-09)
    cell.classList.add("awakened");
    if ((mon.awakening ?? 0) >= 4) cell.classList.add("awakened2");
    const aw = document.createElement("span");
    aw.className = "mon-cell-awaken";
    aw.textContent = "⚡";
    cell.appendChild(aw);
    const spark = document.createElement("span");
    spark.className = "awaken-spark";
    cell.appendChild(spark);
  }
  if ((rm?.stars ?? 1) >= 6) {
    cell.classList.add("high-rare");
    cell.style.setProperty("--rare-glow", rm.color);
    const rs = document.createElement("span");
    rs.className = "rare-spark";
    cell.appendChild(rs);
  }
  if ((mon.awakening ?? 0) >= 4 || (rm?.stars ?? 1) >= 8) {
    const ring = document.createElement("span");
    ring.className = "cell-ring";
    ring.style.setProperty("--fx-color", (mon.awakening ?? 0) >= 4 ? "#ffd67a" : rm.color);
    if ((mon.awakening ?? 0) >= AWAKEN_MAX || (rm?.stars ?? 1) >= 10) ring.classList.add("rainbow");
    cell.appendChild(ring);
  }
  if (pendingPerks(mon) > 0) {
    const pk = document.createElement("span");
    pk.className = "mon-cell-perk";
    pk.textContent = "✦";
    pk.title = "兆しを選べる!";
    cell.appendChild(pk);
  }
  const eDot = document.createElement("span");
  eDot.className = "mon-cell-elem";
  eDot.style.backgroundImage = `url(${iconUrl("element", species.element)})`;
  eDot.title = em.label;
  cell.appendChild(eDot);
  const rl = roleOf(mon);
  const roleTag = document.createElement("span");
  roleTag.className = "mon-cell-role";
  roleTag.innerHTML = `${iconImgHtml("role", roleKeyOf(mon), 12, "role-ico")}${rl.label}`;
  roleTag.style.color = rl.color;
  roleTag.style.borderColor = rl.color;
  cell.appendChild(roleTag);
  const pw = document.createElement("span");
  pw.className = "mon-cell-power";
  pw.textContent = formatNum(powerScore(mon));
  cell.appendChild(pw);
  return cell;
}

// パーティ配置ピッカー: パーティ外の仲間を選んで空きスロットへ入れる
// お気に入りパーティ(プリセット)の保存/呼出(2026-07-13 FB)
function buildPartyPresets() {
  const row = document.createElement("div");
  row.className = "party-presets";
  state.partyPresets = state.partyPresets ?? [null, null, null];
  for (let i = 0; i < 3; i++) {
    const box = document.createElement("div");
    box.className = "party-preset";
    const label = document.createElement("span");
    const preset = state.partyPresets[i];
    label.className = "party-preset-label";
    label.textContent = preset
      ? preset.map((id) => SPECIES[state.monsters[id]?.speciesId]?.name?.slice(0, 3) ?? "×").join("/")
      : `プリセット${i + 1}`;
    const loadBtn = document.createElement("button");
    loadBtn.className = "chip";
    loadBtn.textContent = "呼出";
    loadBtn.disabled = !preset;
    loadBtn.addEventListener("click", () => {
      const ids = (state.partyPresets[i] ?? []).filter((id) => state.monsters[id] && !onExpedition(state, id));
      if (ids.length === 0) return void toast("プリセットの子が いない(探索中かも)");
      state.party = ids.slice(0, MAX_PARTY);
      playerHp = partyMaxHp();
      syncSceneParty();
      refreshMonViews();
      renderHud();
      toast(`⚔ プリセット${i + 1}を呼び出した(${ids.length}体)`, "#8ad8ff");
      save();
    });
    const saveBtn = document.createElement("button");
    saveBtn.className = "chip";
    saveBtn.textContent = "保存";
    saveBtn.title = "今のパーティをこの枠に保存";
    saveBtn.addEventListener("click", () => {
      state.partyPresets[i] = [...state.party];
      toast(`💾 今のパーティを プリセット${i + 1}に保存した`);
      refreshMonViews();
      save();
    });
    box.append(label, loadBtn, saveBtn);
    row.appendChild(box);
  }
  return row;
}

function buildPartyPicker(mon) {
  const wrap = document.createElement("div");
  wrap.className = "hero-inv";
  const hint = document.createElement("div");
  hint.className = "box-hint";
  // 2026-08-06 FB: 全タスモン一覧だと窓の下が間延びする+選びにくいため、
  // お気に入り(♥)だけに絞った並び替え候補にした。アイコンはタスモン窓(box)と
  // 同じ52px(.mon-cell/.mon-gridを共有しているのでCSS側の変更は不要)
  const candidates = Object.values(state.monsters).filter((m) => !state.party.includes(m.id) && m.fav);
  const replacing = partyReplaceSlot != null && state.party[partyReplaceSlot];
  const outgoing = replacing ? state.monsters[state.party[partyReplaceSlot]] : null;
  hint.textContent =
    candidates.length === 0
      ? "お気に入りの タスモンが いない(♥はタスモン窓でCtrl+クリック)"
      : replacing
        ? `クリックで「${baseNameOf(outgoing)}」と入れ替え`
        : `クリックで パーティに入れる(${state.party.length}/${MAX_PARTY})・外すときはパーティ枠を右クリック`;
  wrap.appendChild(hint);
  const grid = document.createElement("div");
  // fav-grid: 2026-08-06夜 FB「5キャラ横に並ぶサイズ感に整理して」で5列専用に
  // (.mon-gridの既定4列のままだと窓幅に対してタスモン窓と同じ52pxは大きすぎた)
  grid.className = "mon-grid fav-grid";
  // パーティ枠からここへドロップしても外せる(2026-08-13 Haru指示)。
  // パーティ列のすぐ上にある候補一覧なので、いちばん距離が短い「外す」操作になる
  makeDropTarget(grid, dropMonOutOfParty);
  candidates.sort((x, y) => powerScore(y) - powerScore(x));
  for (const m of candidates) {
    // 見た目はタスモン窓(box)と同じbuildMonCellVisualを流用(バッジ・演出は共通のまま)。
    // サイズだけ5列に収まるよう44pxへ調整(枠のCSSは.fav-gridで別サイズ指定)
    const cell = buildMonCellVisual(m, { size: 44, onFavToggle: () => renderDetail(mon.id) });
    bindCellTooltip(
      cell,
      () =>
        `<div class="mon-info tt-mon">${monsterInfoHtml(m)}</div>` +
        `<div class="tt-hint">${
          onExpedition(state, m.id)
            ? "🧭 探索中(帰還までパーティに入れない)"
            : replacing
              ? "クリックで 入れ替え"
              : "クリックで パーティに入れる"
        }</div>`,
      () => {
        // お気に入り一覧は探索中でも表示され続ける(🧭バッジで分かるように)が、
        // 選ぶこと自体は他の探索中ガード(box窓・探索メンバー選択等)と同じく禁止する
        // (2026-08-12 バグ報告: 探索中のお気に入りをパーティに入れられてしまい、
        // 入れ替え時の全回復と組み合わさって実質無限回復になっていた)
        if (onExpedition(state, m.id)) return void toast("🧭 探索中の子は選べない(帰還を待って)");
        if (partyReplaceSlot != null && state.party[partyReplaceSlot]) {
          // 指定枠を置換(満員でも確実に交代できる)。外れた子は手持ちに残る
          state.party[partyReplaceSlot] = m.id;
        } else if (!togglePartyMember(state, m.id)) {
          toast(`パーティは 最大 ${MAX_PARTY}体`);
          return;
        }
        partyReplaceSlot = null;
        hideTooltip(true);
        playerHp = partyMaxHp();
        syncSceneParty();
        resetSkillCooldowns();
        toast(`${baseNameOf(m)} が パーティにはいった!`, RARITY_META[monRarityOf(m)].color);
        heroTab = state.party.length >= MAX_PARTY ? "stat" : "party";
        renderDetail(mon.id);
        if (openOrder.includes("box")) renderBox();
        save();
      },
    );
    grid.appendChild(cell);
  }
  // 空き枠(2026-08-06 FB「いなくても空欄の枠だけは配置して」): タスモン窓の空き枠と
  // 同じ見た目を、お気に入りが0でも最低1行(5枠)は敷き詰める
  const wantCells = Math.max(5, Math.ceil(candidates.length / 5) * 5);
  for (let i = candidates.length; i < wantCells; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "mon-cell mon-cell-empty";
    emptyCell.title = "お気に入り(♥)が ここに並ぶ";
    grid.appendChild(emptyCell);
  }
  wrap.appendChild(grid);
  // 「戻る」ボタンは撤去(2026-08-07 Haru指示「パーティ窓の戻るボタンいらない」)。
  // パーティ編成タブは既定表示そのものなので、ここに専用の戻り導線は不要だった
  return wrap;
}

// 英雄(タスモン)ウィンドウのインベントリタブ。装備窓を撤廃した代わりに
// ここが唯一の持ち物一覧(装備アイテム+記念コイン)。売却は合成の錬金へ。
function buildHeroInventory(mon) {
  // 2026-08-06: インベントリを別窓(#inv-panel)へ外出ししたため、装備・D&D後の
  // 再描画は「パーティ窓(装備スロット・ステ)」と「インベントリ窓(グリッド)」の
  // 両方に効かせる必要がある。片方しか開いていなくても無害(openOrder判定あり)
  const refreshBoth = () => {
    if (openOrder.includes("detail")) renderDetail(mon.id);
    if (openOrder.includes("inv")) renderInvWindow();
  };
  const wrap = document.createElement("div");
  wrap.className = "hero-inv";
  const hint = document.createElement("div");
  hint.className = "box-hint";
  // 操作ヒントの常時表示は廃止(2026-07-13 FB「表記いらない」)。空のときだけ案内
  if (state.items.length === 0 && !hasAnyCoin()) {
    hint.textContent = "持ち物がない(宝箱を開けよう)";
    wrap.appendChild(hint);
  }
  // 並び行はソート不要でも「+枠(インベ拡張)」ボタンの置き場として常設(2026-07-10)
  if (state.items.length > 1 || invCapOf(state) < INV_CAP_MAX) {
    wrap.appendChild(sortChipsRow(refreshBoth));
  }

  const grid = document.createElement("div");
  grid.className = "inv-grid";
  // 鍵/水晶は1個ずつの個別セル(2026-07-13 FB「まとめないで装備と同じように並べて」)。
  // 持ち物窓と同じ部品を使う(2026-07-15: 倉庫へ右クリックで預けられるように。
  // 以前はここに別実装のセルがあり、倉庫移動のハンドラが付いていなかった)
  // 2026-08-07 FB「インベントリ内のアイテムの大きさ元に戻して」: タスモン窓と揃える
  // 変更(52px)を撤回し、既定サイズ(itemCell=36/preciousCells=32/coinCell=36)に戻した
  for (const cell of preciousCells({ stored: false })) grid.appendChild(cell);
  // 記念コインを先頭に(1枚=1マス。×Nで重ねない=装備と同じ数え方 #11)。クリックで1枚使う
  for (const coin of GACHA_COINS) {
    const owned = state.coins?.[coin.id] ?? 0;
    for (let i = 0; i < owned; i++) grid.appendChild(coinCell(coin, mon));
  }
  // 装備アイテム(クリック=詳細/ダブルクリック=装備、ドラッグ対応)
  for (const item of sortItems(state.items)) {
    grid.appendChild(
      itemCell(item, () => {
        // 倉庫が開いているときは装備より倉庫への移動を優先(2026-07-16 FB)
        if (openOrder.includes("storage")) {
          const r = moveToStorage(state, item.id);
          if (r.error) return void toast(r.error);
          hideTooltip(true);
          toast(`「${item.name}」を倉庫に預けた`);
          keepScroll(() => refreshInvViews());
          save();
          return;
        }
        const result = equipItem(state, mon.id, item.id);
        if (result.error) {
          toast(result.error);
          return;
        }
        hideTooltip(true);
        if (result.swapped) toast(`「${result.swapped.name}」と 入れ替えた`);
        playerHp = Math.min(playerHp, partyMaxHp());
        refreshBoth();
        save();
      }),
    );
  }
  // 空き枠: 「持てる総量(INV_CAP)」ぶん常に空マスで見せる(2026-07-08:
  // アイテムが無くてもストック上限が一目で分かるように)。コインぶんは加算。
  const filled = state.items.length + totalCoins();
  const cellsWanted = totalCoins() + invCapOf(state);
  for (let i = filled; i < cellsWanted; i++) {
    const blank = document.createElement("div");
    blank.className = "inv-cell slot-blank";
    grid.appendChild(blank);
  }
  // 倉庫のアイテム/貴重品をこのグリッドへドロップで持ち物に移動(D&D網羅 2026-07-10)
  makeDropTarget(grid, (data) => {
    const [kind, id, loc] = data.split(":");
    if (loc !== "storage") return;
    if (kind === "item") {
      const r = moveToInventory(state, id);
      if (r.error) return void toast(r.error);
      toast("持ち物に移した", "#ffe9a8");
    } else if (kind === "precious") {
      // 鍵/水晶の引き出し(2026-07-16 FB: 預け入れと対で)
      const r = movePreciousToInventory(state, id);
      if (r.error) return void toast(r.error);
      toast("貴重品を 持ち物へ", "#8ad8ff");
    } else return;
    refreshBoth();
    if (openOrder.includes("storage")) renderStorage();
    save();
  });
  wrap.appendChild(grid);
  // 持ち物拡張(ゴールド)をこの場から直接: 倉庫窓を開かなくても広げられるように(2026-07-09)
  const invActions = document.createElement("div");
  invActions.className = "hero-inv-actions";
  if (invCapOf(state) >= INV_CAP_MAX) {
    const maxBtn = document.createElement("button");
    maxBtn.className = "inv-expand-btn";
    maxBtn.textContent = `持ち物は最大(${INV_CAP_MAX})`;
    maxBtn.disabled = true;
    invActions.appendChild(maxBtn);
  } else {
    const expandBtn = document.createElement("button");
    expandBtn.className = "inv-expand-btn";
    expandBtn.textContent = `＋ 持ち物を広げる +${INV_CAP_STEP}(${formatGold(invSlotCost(state))}G)`;
    expandBtn.disabled = state.gold < invSlotCost(state);
    expandBtn.title = state.gold < invSlotCost(state) ? `ゴールドが ${formatNum(invSlotCost(state))} 必要` : "";
    expandBtn.addEventListener("click", () => {
      const r = buyInvSlot(state);
      if (r.error) return void toast(r.error);
      toast(`持ち物を ${r.cap}枠に広げた!`, "#ffcf4a");
      bumpMissionCounter(state, "expand"); // チュートリアル: 拡張を買った
      bumpMissionCounter(state, "expandInv"); // 種類別(持ち物)
      refreshHeroInv();
      renderHud();
      if (openOrder.includes("storage")) renderStorage();
      save();
    });
    invActions.appendChild(expandBtn);
  }
  wrap.appendChild(invActions);
  // 排出確率リンクは撤去(2026-08-01 FB「一番下の排出確率を見るはいらない」)。
  // 開示の入口は⚙メニューの「排出確率」に一本化(規制対応の開示自体は維持)
  return wrap;
}

// インベントリ専用窓(2026-08-06 Haru指示「パーティ窓からインベントリを
// 外出しできるように」)。中身はbuildHeroInventory(mon)をそのまま流用するので、
// 装備クリック/ソート/D&D等の挙動はパーティ窓に埋め込まれていた頃と完全に同じ。
// ダメだった場合の戻し方: ①ui.js内でrenderers.inv/windows.invの2行を消す
// ②tInvのクリックハンドラをopenWindow("inv")からheroTab="inv"+renderDetail(mon.id)へ戻す
// ③renderDetail内の「heroTab "inv" は何も出さない」の分岐にtabBody.appendChild(
//   buildHeroInventory(mon))を戻す ④index.html/style.cssのinv-panel関連は残しても無害
function renderInvWindow() {
  if (throttleRender(renderInvWindow)) return;
  const host = $("inv-body");
  if (!host) return;
  const mon = state.monsters[currentDetailId] ?? leader(state);
  if (!mon) {
    host.innerHTML = '<div class="box-hint">キャラが いない</div>';
    return;
  }
  // 再構築のたびにスクロール位置が先頭へ戻らないように保存→復元(#detail-body方式を踏襲)
  const prevScroll = host.scrollTop;
  host.innerHTML = "";
  // 2026-08-09 バグ修正: 対象キャラが画面上どこにも出ていなかったため、複数窓を
  // 開いたままキャラを切り替えると「見えているキャラと違う相手に装備される」誤操作の
  // 温床になっていた。持ち物窓に対象キャラ名を常時表示して取り違えを目視で防ぐ
  const invTarget = document.createElement("div");
  invTarget.className = "inv-target-hero";
  invTarget.appendChild(monIconCanvas(mon, 22));
  const invTargetName = document.createElement("span");
  invTargetName.textContent = `装備先: ${monName(mon)}`;
  invTarget.appendChild(invTargetName);
  host.appendChild(invTarget);
  host.appendChild(buildHeroInventory(mon));
  if (prevScroll) {
    requestAnimationFrame(() => {
      const nb = $("inv-body");
      if (nb) nb.scrollTop = prevScroll;
    });
  }
}

// #RRGGBB を amt(-1..1)だけ明暗する。coinの金属グラデ用の自己完結ヘルパー
function shadeHex(hex, amt) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round(r + (t - r) * p);
  g = Math.round(g + (t - g) * p);
  b = Math.round(b + (t - b) * p);
  return `rgb(${r},${g},${b})`;
}

// 星型パスを塗る(コインの刻印に使う)
function fillStar(g, cx, cy, spikes, outer, inner, fill) {
  g.beginPath();
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  g.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    g.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
    g.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  }
  g.closePath();
  g.fillStyle = fill;
  g.fill();
}

// 記念コインのアイコン(金貨/メダル風。縁の刻み・金属グラデ・彫り込んだ星の刻印つき)。
// ベタ塗りの円だった旧デザイン(.coin-disc)を置き換える。
function coinIconCanvas(coin, size = 36) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d");
  const cx = size / 2, cy = size / 2, R = size * 0.45;
  const base = coin.color;
  const light = shadeHex(base, 0.55);
  const dark = shadeHex(base, -0.42);
  const darker = shadeHex(base, -0.64);
  // 落ち影
  g.beginPath();
  g.arc(cx, cy + size * 0.035, R, 0, Math.PI * 2);
  g.fillStyle = "rgba(0,0,0,0.4)";
  g.fill();
  // 外周リング(縁)
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.fillStyle = darker;
  g.fill();
  // 縁の刻み(リッジ): 放射状の目盛り
  g.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    g.lineTo(cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85);
    g.strokeStyle = i % 2 ? shadeHex(base, -0.15) : darker;
    g.stroke();
  }
  // コイン面(金属ラジアルグラデ)
  const rIn = R * 0.8;
  const grad = g.createRadialGradient(cx - rIn * 0.35, cy - rIn * 0.4, rIn * 0.1, cx, cy, rIn);
  grad.addColorStop(0, light);
  grad.addColorStop(0.55, base);
  grad.addColorStop(1, dark);
  g.beginPath();
  g.arc(cx, cy, rIn, 0, Math.PI * 2);
  g.fillStyle = grad;
  g.fill();
  // 内周の溝
  g.beginPath();
  g.arc(cx, cy, rIn * 0.88, 0, Math.PI * 2);
  g.strokeStyle = shadeHex(base, -0.28);
  g.lineWidth = 1;
  g.stroke();
  // 彫り込んだ星: 影(下)→面(上のハイライト)の2枚重ねで凹凸を出す
  fillStar(g, cx, cy + rIn * 0.08, 5, rIn * 0.52, rIn * 0.22, shadeHex(base, -0.5));
  fillStar(g, cx, cy, 5, rIn * 0.52, rIn * 0.22, shadeHex(base, 0.5));
  // 上部の光沢
  g.beginPath();
  g.ellipse(cx - rIn * 0.26, cy - rIn * 0.44, rIn * 0.52, rIn * 0.24, -0.5, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.26)";
  g.fill();
  return cv;
}

// 記念コインのカスタムアイコン(assets/icons/coin/<id>.png)。無ければ描画コインに戻す。
function coinIconEl(coin, size = 36) {
  const img = document.createElement("img");
  img.className = "game-icon coin-ico";
  img.src = iconUrl("coin", coin.id);
  img.width = img.height = size;
  img.draggable = false;
  img.onerror = () => img.replaceWith(coinIconCanvas(coin, size));
  return img;
}

// 記念コインのマス目(1枚=1マス)。クリックで1枚使って装備を引く。ホバーで確率。
function coinCell(coin, mon, iconSize = 36) {
  const owned = state.coins?.[coin.id] ?? 0;
  const cell = document.createElement("div");
  cell.className = "inv-cell coin-cell";
  // レア度グラデ背景で装備と統一(2026-07-29)。枠線はコイン自体の色を残す
  const corm = RARITY_META[coin.rarity] ?? RARITY_META.legend;
  cell.style.borderColor = corm.color;
  cell.style.background = rarityCellBg(corm);
  cell.appendChild(coinIconEl(coin, iconSize));
  // 倉庫へ送れるようD&D対応(coin:<id> をドロップ先が処理)
  makeDragSource(cell, `coin:${coin.id}`);
  // 右クリック: 倉庫が開いていれば倉庫へ預ける(合成対象ではないのでキューブは無視)
  cell.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    if (openOrder.includes("storage")) {
      hideTooltip(true);
      depositCoin(coin.id);
    }
  });
  const oddsHtml = RARITY_ORDER.filter((r) => coin.weights[r])
    .map((r) => `<span style="color:${RARITY_META[r].color}">${RARITY_META[r].label} ${coin.weights[r]}%</span>`)
    .join(" ・ ");
  bindCellTooltip(
    cell,
    () =>
      `<div class="tt-name" style="color:${coin.color}">${coin.name}(所持${owned})</div>` +
      `<div class="tt-opts">${oddsHtml}</div>` +
      `<div class="tt-hint">クリックで 調合窓のガチャを開く(そこで1枚使う)</div>`,
    () => {
      // 2026-07-09: コインは貴重品。クリック即開封は廃止し、調合窓のガチャタブへ誘導。
      hideTooltip(true);
      compoundMode = "gacha";
      openWindow("compound");
      renderCompound();
    },
  );
  return cell;
}

// コインを倉庫へ預ける/引き出す(UI側の共通処理。全ビューを最新化)。
function depositCoin(coinId) {
  const r = moveCoinToStorage(state, coinId);
  if (r.error) {
    toast(r.error);
    return;
  }
  const coin = GACHA_COINS.find((c) => c.id === coinId);
  toast(`${coin?.name ?? "コイン"}を倉庫に預けた`, coin?.color ?? "#ffe9a8");
  refreshInvViews();
  save();
}

function withdrawCoin(coinId) {
  const r = moveCoinToInventory(state, coinId);
  if (r.error) {
    toast(r.error);
    return;
  }
  const coin = GACHA_COINS.find((c) => c.id === coinId);
  toast(`${coin?.name ?? "コイン"}を引き出した`, coin?.color ?? "#ffe9a8");
  refreshInvViews();
  save();
}

function totalCoins() {
  return GACHA_COINS.reduce((n, c) => n + (state.coins?.[c.id] ?? 0), 0);
}

function hasAnyCoin() {
  return totalCoins() > 0;
}

// 詳細(拠点)窓の情報バンド: ジョブ・属性・総合戦闘力・セットスキルを常時表示。
function buildDetailInfo(mon) {
  const sp = SPECIES[mon.speciesId];
  const role = roleOf(mon);
  const skillChips =
    equippedSkillsOf(mon)
      .map(
        (sk) =>
          `<span class="mss-chip">${iconImgHtml("role", sk.active.type, 11, "mss-ico")}${sk.name}</span>`,
      )
      .join("") || `<span class="mss-label">なし</span>`;
  const div = document.createElement("div");
  div.className = "detail-info";
  // 並びはモック準拠(2026-07-11): 総合戦闘力 → ジョブ/属性チップ → セットスキル(縦積み)
  div.innerHTML =
    `<div class="di-power">総合戦闘力 <b>${formatNum(powerScore(mon))}</b></div>` +
    `<div class="di-row">` +
    `<span class="role-chip" style="color:${role.color};border-color:${role.color}">${roleIconHtml(role)} ${role.label}</span>` +
    elementChip(sp.element) +
    `</div>` +
    `<div class="di-skills"><span class="mss-label">セットスキル</span>${skillChips}</div>`;
  return div;
}

function renderDetail(monId) {
  // お任せ振り分け中はこの窓を作り直さない(2026-07-30 FB)。作り直すと盤面の
  // キャンバスが差し替わり、振り分けの途中経過(ルート・残りpt)が消える
  if (sphereAutoBusy()) {
    sphereDeferredRender.detail = true;
    return;
  }
  const mon = state.monsters[monId];
  const panel = $("detail-panel");
  if (!mon) {
    // 対象がいない(配合・逃がす等)→ リーダーに切り替える(ハブなので閉じない)
    const fallback = state.party[0];
    if (fallback && state.monsters[fallback] && fallback !== monId) {
      currentDetailId = fallback;
      renderDetail(fallback);
      if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-09 別キャラ誤装着バグ修正
    } else {
      closeWindow("detail");
    }
    return;
  }
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const grade = gradeFromIv(mon.iv);
  const skill = effectiveSkill(mon);
  const partyIndex = state.party.indexOf(mon.id);
  const inParty = partyIndex !== -1;

  const big = monHeroCanvas(mon, 120, 96); // ステータス窓と同じ高精細立ち絵(2026-07-13 FB)
  if ((mon.awakening ?? 0) > 0) big.classList.add("awakened-sprite"); // 立ち絵にオーラ

  // ステ振り等で作り直すたびにスクロール位置が戻らないよう保存→復元する(QoL)
  const prevScroll = document.getElementById("detail-body")?.scrollTop || 0;
  if (prevScroll) {
    requestAnimationFrame(() => {
      const nb = document.getElementById("detail-body");
      if (nb) nb.scrollTop = prevScroll;
    });
  }

  panel.innerHTML = "";
  const header = document.createElement("div");
  header.id = "detail-header";
  header.className = "win-header";
  header.innerHTML =
    `<span class="win-title" style="color:${rm.color}">詳細</span>` +
    `<span id="hero-gold" class="hero-gold" title="所持ゴールド ${formatGold(state.gold)}G">💰 ${formatGoldChip(state.gold)}G</span>` +
    `<button id="btn-detail-pin" class="win-pin${winPinned("detail") ? " pin-on" : ""}" title="この窓を固定(×やタブで閉じないようにする)">📌</button>` +
    `<button id="btn-detail-close" class="win-close">×</button>`;
  panel.appendChild(header);
  decorateHeader("detail", panel); // ヘッダーを作り直すたびに左上アイコンを付け直す

  const body = document.createElement("div");
  body.id = "detail-body";
  body.classList.add("hero-layout");

  // ---- TBH英雄式: 部位スロット3段 | ポートレート | 部位スロット3段 ----
  const heroTop = document.createElement("div");
  heroTop.className = "hero-top";
  makeDropTarget(heroTop, (data) => dropEquipTo(mon.id, data));
  const makeEquipCell = (part, slotIdx = 0) => {
    const pm2 = PARTS[part];
    // アクセサリー(charm)の3枠は イヤリング / ネックレス / リング(2026-07-13 FB修正:
    // 旧実装がイヤリング/リング/リングと重複していた)。空きスロットの絵柄も種別どおり。
    // (2026-07-15 FB修正: 枠は「装備順の配列位置」でなく種別で固定。装備中の実際の
    // 種別と表示枠を必ず一致させる=種別の異なる装備が別枠に紛れ込むバグの修正)
    const isAcc = part === "charm";
    const ACC_SLOT_LABELS = { earring: "イヤリング", necklace: "ネックレス", ring: "リング" };
    const accKind = isAcc ? (CHARM_SLOT_KINDS[slotIdx] ?? "ring") : null;
    const slotLabel = isAcc ? (ACC_SLOT_LABELS[accKind] ?? "リング") : pm2.label;
    const cell = document.createElement("div");
    cell.className = "inv-cell hero-equip-cell";
    // 御守り(アクセサリー)は枠ごとに段階解放(Lv30/45/60=Lv60で全解放 2026-07-11)
    const lockLv = isAcc ? CHARM_SLOT_UNLOCK[slotIdx] : PART_UNLOCK[part];
    if (mon.level < lockLv) {
      // 未解放の部位/枠(レベルで解放される)
      cell.classList.add("locked");
      cell.innerHTML = `🔒<span class="lock-lv">Lv${lockLv}</span>`;
      bindCellTooltip(
        cell,
        () =>
          `<div class="tt-name">${slotLabel}(ロック中)</div>` +
          `<div class="tt-opts">Lv${lockLv} で解放される</div>`,
        () => {},
      );
      return cell;
    }
    // 部位ごとに複数枠(アクセサリー)対応: アクセサリーは種別(イヤリング/ネックレス/
    // リング)が一致する装備をこのマスに表示(旧: 配列位置のずれで別種別が紛れ込んだ)。
    const item = isAcc
      ? (mon.equipment ?? []).find((it) => (it.part ?? "weapon") === "charm" && charmKindOf(it) === accKind)
      : (mon.equipment ?? []).filter((it) => (it.part ?? "weapon") === part)[slotIdx];
    if (item) {
      const irm = RARITY_META[item.rarity];
      cell.style.borderColor = irm.color;
      cell.style.background = rarityCellBg(irm);
      // 装備中は実物のアートを表示(旧: スロット用の別絵を出していて
      // 「取り込みがおかしい」ように見えた 2026-07-13 FB)
      cell.appendChild(itemIconCanvas(item, 44));
      // マテリア玉(細工スロット持ちの装備 2026-07-21 FB。空きは穴として見せる)
      const materia = materiaColEl(item);
      if (materia) {
        cell.classList.add("has-sockets");
        if (itemHasMateria(item)) cell.classList.add("has-materia");
        cell.appendChild(materia);
      }
      // 装備レベルのバッジ(2026-07-16 FB「装備に入っちゃうとアイテムレベル表示がなくなった」)
      const lvb = document.createElement("span");
      lvb.className = "cell-lv";
      lvb.textContent = `L${item.lv ?? 1}`;
      cell.appendChild(lvb);
      // 進化でロールが変わり武器/サブ武器が「専用不一致」のままの装備には⚠を出す(2026-07-13)
      const mismatch =
        item.role && (part === "weapon" || part === "sub") && jobRoleOf(mon) !== item.role;
      if (mismatch) {
        const warn = document.createElement("span");
        warn.className = "cell-role-warn";
        warn.textContent = "⚠";
        warn.title = `ジョブ不一致: この${PARTS[part].label}は【${ROLE_WEAPONS[item.role]?.label}】専用(外すと付け直せない)`;
        cell.appendChild(warn);
      }
      // 個別の維持ロック(2026-07-29 FB「維持ロックは個別の装備ごとにしたい。
      // Ctrl+クリックで個別維持ロック」)。既存の item.locked を使う —
      // 最強装備が触らない・売却/合成から守るのと同じ1つのロック(概念を増やさない)
      if (item.locked) {
        const lk = document.createElement("span");
        lk.className = "cell-lock-badge";
        lk.textContent = "🧷";
        cell.appendChild(lk);
      }
      cell.addEventListener(
        "click",
        (ev) => {
          if (!ev.ctrlKey) return;
          ev.stopPropagation();
          ev.preventDefault();
          item.locked = !item.locked;
          toast(
            item.locked
              ? (BEST_EQUIP_UI_ENABLED
                  ? `🛡 「${item.name}」を保護した(売却・合成・最強装備から守る)`
                  : `🛡 「${item.name}」を保護した(売却・合成から守る)`)
              : `「${item.name}」の保護を外した`,
            item.locked ? "#ffe9a8" : "#9aa4c8",
          );
          hideTooltip(true);
          renderDetail(mon.id);
          save();
        },
        true,
      );
      // 装備中のものも掴んで持ち出せる(2026-07-22 FB「全部ドラッグアンドドロップを
      // 有効にして」)。合成の枠・倉庫・別のキャラへ直接ドラッグできる
      makeDragSource(cell, `item:${item.id}:equipped`);
      bindCellTooltip(
        cell,
        () =>
          itemTooltipHtml(item, false) +
          (mismatch
            ? `<div class="tt-hint" style="color:#ff8a7a">⚠ ジョブ不一致(【${ROLE_WEAPONS[item.role]?.label}】専用)。外すと付け直せない</div>`
            : `<div class="tt-hint">クリックで 外す / ドラッグで 持ち出す ・ <b>Ctrl+クリックで${item.locked ? "保護解除" : "保護"}</b></div>`),
        () => {
          hideTooltip(true);
          unequipItem(state, mon.id, item.id);
          playerHp = Math.min(playerHp, partyMaxHp());
          renderDetail(mon.id);
          save();
        },
      );
    } else {
      cell.classList.add("empty");
      cell.appendChild(isAcc ? accessoryIconEl(accKind, null, 36) : partIconEl(part, 40));
      bindCellTooltip(
        cell,
        () =>
          `<div class="tt-name">${slotLabel}(なし)</div>` +
          `<div class="tt-hint">クリックで 装備を 選ぶ</div>`,
        () => {
          hideTooltip(true);
          renderEquipPicker(mon.id, part, accKind); // その部位(+アクセは種別)に絞った装備ピッカー
        },
      );
    }
    return cell;
  };
  // 左列=ぶき/よろい/かぶと/盾、右列=くつ/御守り×3(アクセサリーは複数枠)。左右4枠ずつ。
  const slotL = document.createElement("div");
  slotL.className = "hero-slot-col";
  for (const part of ["weapon", "armor", "helm", "sub"]) slotL.appendChild(makeEquipCell(part));

  const slotR = document.createElement("div");
  slotR.className = "hero-slot-col";
  slotR.appendChild(makeEquipCell("boots"));
  for (let s = 0; s < (PART_SLOTS.charm ?? 1); s++) slotR.appendChild(makeEquipCell("charm", s));

  const portraitBox = document.createElement("div");
  portraitBox.className = "hero-portrait";
  const nameBand = document.createElement("div");
  nameBand.className = "hero-name-band";
  // 覚醒個体は名前が七色に流れる(パーティ窓も豪華に 2026-07-10)。
  // 名前はmonName()で解決する(進化スキン/専用ジョブキャラ名/配合+N込み)。
  // 2026-08-07 FB「リザルトとパーティで名前が違う」— ここが素のsp.nameを直接
  // 表示しており、リザルト等が使うmonName()の解決結果(進化スキン・専用キャラ名)を
  // 無視していたのが実犯。パーティ窓の立ち絵は既にmonSpriteOf()で進化スキン/専用キャラの
  // 見た目を出しているので、名前だけ素の種族名のままだと「絵と名前が食い違う」状態だった
  if ((mon.awakening ?? 0) > 0) {
    nameBand.innerHTML = `<span class="rainbow-name">${mon.shiny ? "★" : ""}${monName(mon)}</span>`;
  } else {
    nameBand.textContent = `${mon.shiny ? "★" : ""}${monName(mon)}`;
  }
  portraitBox.appendChild(nameBand);
  big.classList.add("detail-sprite");
  portraitBox.appendChild(big);
  // 覚醒/高レアの豪華演出(2026-07-17 FB): 立ち絵の上に回転リング+浮遊✦+呼吸グロー。
  // ※ラップ方式はNG: .hero-portraitのグリッドは「> .detail-sprite」で列を組んでおり、
  //   間に要素を挟むと右カラムが潰れてはみ出す(スキャンで実証)。絶対配置で重ねる
  const dAw = mon.awakening ?? 0;
  const dStars = rm?.stars ?? 1;
  if (dAw > 0 || dStars >= 6) {
    const fx = document.createElement("span");
    fx.className = "portrait-fx fx-glow";
    fx.style.setProperty("--fx-color", dAw > 0 ? "#ffb46a" : rm.color);
    if (dAw >= 4 || dStars >= 8) fx.classList.add("fx-ring");
    if (dAw >= AWAKEN_MAX || dStars >= 10) fx.classList.add("fx-rainbow");
    fx.innerHTML = `<i class="fx-star s1">✦</i><i class="fx-star s2">✦</i><i class="fx-star s3">✦</i>`;
    portraitBox.appendChild(fx);
    // 立ち絵の実座標に重ねる(レイアウト確定後。座標系は物理px→zoomで割る)。
    // ※rAFでなくsetTimeout: バックグラウンド描画等でrAFが発火しない環境がある(実測)
    setTimeout(() => {
      if (!fx.isConnected || !big.isConnected) return;
      const br = big.getBoundingClientRect();
      const pr = portraitBox.getBoundingClientRect();
      const z = uiZoom();
      fx.style.left = `${(br.left - pr.left) / z - 7}px`;
      fx.style.top = `${(br.top - pr.top) / z - 7}px`;
      fx.style.width = `${br.width / z + 14}px`;
      fx.style.height = `${br.height / z + 14}px`;
    }, 0);
  }
  const lvRow = document.createElement("div");
  lvRow.className = "hero-lv";
  lvRow.innerHTML =
    `<span class="rar-chip" style="color:${rm.color};border-color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}</span>` +
    ` LV.${mon.level}`;
  portraitBox.appendChild(lvRow);
  // 次のレベルまでの経験値メーター(2026-07-11 FB「あとどのくらいかメーターで知りたい」)
  const expRow = document.createElement("div");
  expRow.className = "hero-exp";
  if (mon.level >= LEVEL_CAP) {
    expRow.innerHTML = `<span class="hero-exp-bar"><i></i></span><small>レベル最大</small>`;
    expRow.querySelector("i").style.width = "100%";
  } else {
    const need = expToNext(mon.level);
    const cur = Math.max(0, mon.exp ?? 0);
    // 2026-08-11 Haru指示「低レベルの新しい子を入れづらい。パーティ最高Lvの90%になる
    // まで経験値ブースト」: 対象の子には倍率を明示する(黙って増えるとわかりにくい)
    const catchup = isCatchingUp(state, mon);
    expRow.innerHTML =
      `<span class="hero-exp-bar${catchup ? " catchup" : ""}"><i></i></span>` +
      `<small>次のLvまで ${formatNum(Math.max(0, need - cur))} EXP` +
      (catchup ? ` <b class="catchup-tag">⚡EXP ${PARTY_CATCHUP_EXP_MULT}倍中</b>` : "") +
      `</small>`;
    expRow.querySelector("i").style.width = `${Math.min(100, Math.floor((cur / need) * 100))}%`;
  }
  portraitBox.appendChild(expRow);
  // 次の進化レベルの予告(2026-08-04 Haru指示「次何レベルで進化するかわかるように」)。
  // 進化ボタンが出る前(未達)のときだけ出す=出しっぱなしのノイズにしない
  {
    const stage = evolveStage(mon);
    if (stage < EVOLVE_LEVELS.length && (mon.level ?? 1) < EVOLVE_LEVELS[stage] && !(mon.evoFailed ?? []).includes(stage)) {
      const hint = document.createElement("div");
      hint.className = "evo-next-hint";
      // 2026-08-05 Haru指示「折り返さないで。あとxxの表示はいらない」
      hint.textContent = `⤴ 第${stage + 1}進化は Lv${EVOLVE_LEVELS[stage]}`;
      portraitBox.appendChild(hint);
    }
  }
  // ジョブ/属性/総合戦闘力/セットスキルは枠内に収める(2026-07-11 FB「上の枠内に収まるように」)。
  // 並び(2026-08-05 Haru指示・添付画像どおり): 立ち絵の右に情報列(総合戦闘力→チップ→
  // セットスキル)、その下に全幅で ★レア度/LV → 次のLvまで → ⤴進化の予告 → 職名。
  // **情報列をLV行より前に置く**ことで、下の3行が情報列の下へ回り込む
  const infoInFrame = buildDetailInfo(mon);
  infoInFrame.classList.add("in-frame");
  portraitBox.insertBefore(infoInFrame, lvRow);
  // 進化できるならポートレート直下に大きく出す(「どこで進化するか分からない」対策 2026-07-11)
  if (canEvolve(mon)) {
    const evo = document.createElement("button");
    evo.className = "compound-do evolve-btn hero-evolve-btn";
    // 金額は短縮表記(2026-07-30 FB「言語変えると文字飛び出てる」: 進化費用が8桁になり、
    // 独語等の長い訳と合わさって窓からはみ出した。11,915,000→11.9M)
    evo.textContent = `⤴ 第${evolveStage(mon) + 1}進化できる!(${formatGoldShort(evolveCost(mon))}G)`;
    evo.addEventListener("click", () => openEvolvePicker(mon.id));
    portraitBox.appendChild(evo);
  } else if (canPinnacle(mon)) {
    // 極み(第3の節目 2026-07-11): 最上位職のLv90で最後の選択
    const pin = document.createElement("button");
    pin.className = "compound-do evolve-btn hero-evolve-btn";
    pin.textContent = `🌟 極みの進化(${formatGoldShort(pinnacleCost(mon))}G)`;
    pin.addEventListener("click", () => openPinnaclePicker(mon.id));
    portraitBox.appendChild(pin);
  } else if (JOBS[mon.job]) {
    const jb = document.createElement("div");
    const j = JOBS[mon.job];
    jb.className = "hero-job-line" + (j.tier >= 4 ? " rainbow-name" : "");
    jb.textContent = `${j.label}${j.tier >= 4 ? "(隠し職)" : j.tier === 3 ? "(最上位職)" : ""}`;
    portraitBox.appendChild(jb);
  }
  heroTop.append(slotL, portraitBox, slotR);

  // ---- パーティ列: 3スロット固定。空きスロットをクリックで仲間を配置できる ----
  const partyRow = document.createElement("div");
  partyRow.className = "hero-party";
  const members = partyMonsters(state);
  // パーティ総合戦力(2026-08-05 Haru指示「パーティの総合戦力が分かりやすいように
  // パーティ窓に反映して」): 従来の di-power は選択中の1体だけの表示で、
  // パーティ全体の強さがひと目で分からなかった。3体の powerScore を合算し、
  // パーティ列の直上に大きく出す(個別の総合戦闘力と並べて混同しないよう別行にする)
  const partyTotalRow = document.createElement("div");
  partyTotalRow.className = "hero-party-total";
  partyTotalRow.innerHTML =
    `<span>👥 パーティ総合戦力</span><b>${formatNum(members.reduce((s, m) => s + powerScore(m), 0))}</b>`;
  for (let i = 0; i < MAX_PARTY; i++) {
    const pm = members[i];
    const c = document.createElement("div");
    if (pm) {
      c.className = "hero-party-cell" + (pm.id === mon.id ? " on" : "");
      c.dataset.mon = pm.id; // 自己監視スキャナ用
      c.dataset.uiKey = `${pm.speciesId}|${pm.evoSkin ?? ""}|${pm.awakening ?? 0}`;
      c.appendChild(monIconCanvas(pm, 30));
      const pElem = ELEMENT_META[SPECIES[pm.speciesId].element];
      c.style.borderBottom = `3px solid ${pElem.color}`; // 属性の下線
      c.title = `${baseNameOf(pm)}(${pElem.label}属性・クリックでステータス。⇄で入れ替え。右クリックでパーティから外す。一覧へドラッグでも外せる)`;
      c.addEventListener("click", () => openCharacter(pm.id));
      // 右クリックでパーティから外す(2026-08-13 Haru指示「キャラをパーティから
      // 外せないので右クリックでパーティから外れるようにしてほしい」)。
      // これまでは「⇄で別の子と入れ替える」か「🧺全部外す」しか無く、
      // **1体だけ抜いて2人で回す**ができなかった
      c.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        hideTooltip(true);
        removeFromParty(pm.id);
      });
      makeDragSource(c, `mon:${pm.id}`); // パーティ内の枠もドラッグ元(並べ替え/入れ替え/外す)
      makeDropTarget(c, (data) => {
        if (dropEquipTo(pm.id, data)) return;
        dropMonToParty(data, i);
      });
      if (isCatchingUp(state, pm)) {
        // 2026-08-11 Haru指示「低レベルの新しい子を入れづらい」対策のEXPブースト中バッジ
        const cu = document.createElement("span");
        cu.className = "mon-cell-catchup";
        cu.textContent = "⚡";
        cu.title = `経験値ブースト中(パーティ最高Lvの${Math.round(PARTY_CATCHUP_THRESHOLD * 100)}%になるまでEXP${PARTY_CATCHUP_EXP_MULT}倍)`;
        c.appendChild(cu);
      }
      if (canEvolve(pm)) {
        // 進化できる子はパーティ枠でもお知らせ(2026-07-13 FB: アイコン上に)
        const ev = document.createElement("span");
        ev.className = "mon-cell-evolve";
        ev.textContent = "⤴";
        ev.title = `第${evolveStage(pm) + 1}進化できる!(クリックでステータスへ)`;
        c.appendChild(ev);
      }
      // スキル習得/スフィア割り振り待ちの子は赤丸(2026-07-15 FB「パーティ窓のパーティ
      // キャラアイコンのところにも赤丸お知らせが出るように」)
      if (pendingPerks(pm) > 0 || pendingSkillPicks(pm) > 0) {
        c.classList.add("notify");
      }
      // 入れ替えボタン(⇄): この枠を対象にピッカーを開く。D&Dなしで確実に交代できる
      const swap = document.createElement("button");
      swap.className = "party-swap-btn";
      swap.textContent = "⇄";
      swap.title = "この枠のタスモンを 入れ替える";
      swap.addEventListener("click", (ev) => {
        ev.stopPropagation();
        partyReplaceSlot = i;
        heroTab = "party";
        renderDetail(mon.id);
      });
      c.appendChild(swap);
    } else {
      c.className = "hero-party-cell empty";
      c.textContent = "＋";
      c.title = "タスモンを パーティに入れる(ドロップでもOK)";
      c.addEventListener("click", () => {
        heroTab = "party";
        renderDetail(mon.id);
      });
      makeDropTarget(c, (data) => dropMonToParty(data, null));
    }
    partyRow.appendChild(c);
  }
  // ⚡最強装備 / 🧺全部外す はパーティ列の右の空きスペースに縦2段で(2026-07-13 FB)
  {
    const btnCol = document.createElement("div");
    btnCol.className = "hero-party-btns";
    const bestBtn = document.createElement("button");
    bestBtn.className = "chip best-equip-chip";
    bestBtn.textContent = "⚡ 最強装備";
    bestBtn.title = "部位ごとにスコア最上位の装備を自動で付け替える";
    bestBtn.addEventListener("click", () => {
      bumpMissionCounter(state, "bestgear"); // チュートリアル: 一括装備を使った
      const r = autoEquipBest(state, mon.id);
      if (r.error) return void toast(r.error);
      toast(r.changed > 0 ? `⚡ 最強装備に ${r.changed}箇所 付け替えた!` : "既に最強装備", r.changed > 0 ? "#ffd67a" : "#9aa4c8");
      playerHp = Math.min(playerHp, partyMaxHp());
      renderDetail(mon.id);
      renderHud();
      save();
    });
    const stripBtn = document.createElement("button");
    stripBtn.className = "chip best-equip-chip";
    stripBtn.textContent = "🧺 全部外す";
    stripBtn.title = "このタスモンの装備を全て外して持ち物へ戻す";
    stripBtn.addEventListener("click", () => {
      const eq = [...(mon.equipment ?? [])];
      if (eq.length === 0) return void toast("装備を 付けていない");
      let n = 0;
      for (const it of eq) {
        if (!unequipItem(state, mon.id, it.id).error) n++;
      }
      toast(`🧺 装備を ${n}個 外した`, "#9aa4c8");
      playerHp = Math.min(playerHp, partyMaxHp());
      renderDetail(mon.id);
      renderHud();
      save();
    });
    // 維持ロック(2026-07-28 FB「最強装備を押しても変わらないような維持ロックが欲しい」)。
    // ON中はこの子の装備一式が最強装備の対象外になる(手での付け替えは自由)
    const keepBtn = document.createElement("button");
    keepBtn.className = "chip best-equip-chip" + (mon.equipLock ? " keep-lock-on" : "");
    keepBtn.textContent = mon.equipLock ? "🧷 維持ロック中" : "🧷 維持ロック";
    keepBtn.title = "ON: この子の装備一式を「⚡最強装備」の入れ替えから守る(手での付け替えは自由)";
    keepBtn.addEventListener("click", () => {
      mon.equipLock = !mon.equipLock;
      toast(
        mon.equipLock
          ? "🧷 維持ロック ON(この子の装備は 最強装備で変わらない)"
          : "🧷 維持ロック OFF(最強装備の対象に 戻った)",
        mon.equipLock ? "#ffd67a" : "#9aa4c8",
      );
      renderDetail(mon.id);
      save();
    });
    // 2026-08-05 Haru指示で最強装備/維持ロックのボタンは非表示(BEST_EQUIP_UI_ENABLED参照)。
    // 「全部外す」は対象外(隠す指示が出ていない)なので常に残す
    if (BEST_EQUIP_UI_ENABLED) btnCol.append(bestBtn, stripBtn, keepBtn);
    else btnCol.append(stripBtn);
    partyRow.appendChild(btnCol);
  }

  // スキル/スフィア盤タブのときは装備グリッド+パーティ行を畳んで、中身に窓の全高を与える
  // (畳まないと表示枠が183pxしかなく、習得ボタンや盤面に届かず「機能してない」に見える)。
  if (heroTab !== "skill" && heroTab !== "sphere") {
    body.appendChild(heroTop);
    body.appendChild(partyTotalRow);
    body.appendChild(partyRow);
  }

  // ---- TBH式タブの中身置き場(インベントリ / スキル) ----
  const tabBody = document.createElement("div");
  tabBody.id = "hero-tab-body";
  body.appendChild(tabBody);
  panel.appendChild(body);

  // タブの中身を流し込む(パーティ編成 / スキル / スフィア盤)。ステータスは別窓へ移設
  if (heroTab === "skill") {
    tabBody.appendChild(buildSkillsContent(mon));
  } else if (heroTab === "sphere") {
    tabBody.appendChild(buildSphereContent(mon));
  } else {
    // 既定(heroTab="party"/旧"inv"/"stat"など未対応値も含む全ての受け皿)。
    // 2026-08-06 インベントリを別窓化した際に「既定タブが空白で戻れない・
    // 窓の下が余りすぎ」というFBが出たため、既定表示をパーティ編成に統一した。
    // プリセット(呼出/保存)は同日夜のFBで「いらない」と指摘されたため非表示化
    // (buildPartyPresetsは削除せず温存。戻すならこの行を復活させるだけでよい)
    tabBody.appendChild(buildPartyPicker(mon));
  }

  // ---- TBH式タブ行(パーティ編成 / インベントリ / スキル / スフィア盤) ----
  const tabRow = document.createElement("div");
  tabRow.className = "hero-tabs";
  // パーティ編成タブ(2026-08-06 追加): インベントリ外出しでheroTab既定値に
  // 戻る専用ボタンが無くなっていた(skill/sphereから抜けられない)ので新設。
  // 上のtabBody分岐と同じ「skill/sphere以外は全部これ」の判定に揃える
  // (news/mailは2026-08-11に#notice-panelへ分離。この判定からは対象外)
  const tParty = document.createElement("button");
  const onParty = !["skill", "sphere"].includes(heroTab);
  tParty.className = "hero-tab" + (onParty ? " on" : "");
  tParty.textContent = "パーティ編成";
  tParty.addEventListener("click", () => {
    heroTab = "party";
    renderDetail(mon.id);
  });
  // 2026-08-06 Haru指示: インベントリはこの窓に埋め込まず、別窓(#inv-panel)を開く
  // 専用ボタンにする(旧: heroTab="inv"にしてここへ描画。戻すときはコメント参照)
  const tInv = document.createElement("button");
  tInv.className = "hero-tab" + (openOrder.includes("inv") ? " on" : "");
  // 2026-08-06夜 FB: 個数バッジで文字がはみ出るため削除。開閉トグルにも対応
  tInv.textContent = "持ち物";
  // 2026-08-11 FB「装備が新しく持ち物に入ったのに赤丸が付かない」: 宝箱開封時に
  // item.isNew=trueが付く(9968行)ので、未読みが1個でもあればタブに赤丸を出す
  // (見たら消える=タスモン窓のNEWバッジと同じ仕組み)
  if ((state.items ?? []).some((it) => it?.isNew)) tInv.classList.add("notify");
  tInv.addEventListener("click", () => {
    if (openOrder.includes("inv")) {
      closeWindow("inv"); // 閉じる側でパーティ窓のハイライトも更新される(closeWindow内)
    } else {
      openWindow("inv", { force: true });
      renderDetail(mon.id); // ボタンの点灯(on)状態を即座に反映
    }
  });
  const tSkill = document.createElement("button");
  tSkill.className = "hero-tab" + (heroTab === "skill" ? " on" : "");
  tSkill.textContent = "スキル";
  if (pendingSkillPicks(mon) > 0) tSkill.classList.add("notify");
  tSkill.addEventListener("click", () => {
    heroTab = "skill";
    bumpMissionCounter(state, "skillview"); // チュートリアル: スキルを確認した
    renderDetail(mon.id);
  });
  // スフィア盤(2026-07-10 v3: 独立タブ)。未使用ポイントがあれば赤ドット
  const tSphere = document.createElement("button");
  tSphere.className = "hero-tab" + (heroTab === "sphere" ? " on" : "");
  tSphere.textContent = "スフィア盤";
  if (pendingPerks(mon) > 0) tSphere.classList.add("notify");
  tSphere.addEventListener("click", () => {
    heroTab = "sphere";
    renderDetail(mon.id);
  });
  // ステータスはタスモンをクリックで開く(専用タブは不要)。所持Gはヘッダー(一番上)に常設
  // 2026-08-06夜 FB「インベントリボタン一番右にして」
  tabRow.append(tParty, tSkill, tSphere, tInv);

  panel.appendChild(tabRow);

  $("btn-detail-close").addEventListener("click", () => closeWindow("detail"));
  $("btn-detail-pin").addEventListener("click", () => {
    state.settings.pinnedWins = state.settings.pinnedWins ?? {};
    const on = !winPinned("detail");
    state.settings.pinnedWins.detail = on;
    $("btn-detail-pin").classList.toggle("pin-on", on);
    toast(on ? "📌 パーティ窓を固定した(×やタブでは閉じない)" : "📌 パーティ窓の固定を解除した", "#ffd67a");
    save();
  });
}

// ---- お知らせタブ(2026-07-11): アップデート履歴を週ごとに読み返せる ----
function buildNewsContent() {
  const wrap = document.createElement("div");
  wrap.className = "news-content";
  if (UPDATE_FEED.length === 0) {
    wrap.innerHTML = `<div class="box-hint">お知らせはまだない(リリース後、毎週月曜にアップデートが届く)</div>`;
    return wrap;
  }
  const seasons = [...new Set(UPDATE_FEED.map((i) => i.season))];
  for (const season of seasons) {
    const sec = document.createElement("div");
    sec.className = "news-season";
    sec.innerHTML =
      `<div class="news-season-head">📢 アップデート <b>${season}</b>${season === LATEST_SEASON ? ' <span class="news-newtag">最新</span>' : ""}</div>` +
      UPDATE_FEED.filter((i) => i.season === season)
        .map((i) => `<div class="un-row"><span class="un-ico">${i.icon}</span><span>${i.text}</span></div>`)
        .join("");
    wrap.appendChild(sec);
  }
  return wrap;
}

// ---- メールタブ(2026-07-11): 運営からのメール。既読はlocalStorageで管理 ----
const MAIL_READ_KEY = "taskbar-idle-rpg-mail-read";
function readMailSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(MAIL_READ_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
// DLC購入の「受け取り方」案内(2026-08-12)。DLC_RECEIVE_MAILはui.js下部(DLC一覧の
// すぐ近く)で定義されるが、この関数の呼び出しは全部イベント発火後(async/クリック)
// なので、宣言順は問題にならない(save()等と同じ扱い)
function dlcMailIds() {
  const sent = state.settings?.dlcMailSent ?? {};
  return Object.keys(DLC_RECEIVE_MAIL).filter((id) => sent[id] === true);
}
function unreadMailCount() {
  const read = readMailSet();
  return (
    GAME_MAILS.filter((m) => !read.has(m.id)).length +
    fetchedGifts.length +
    dlcMailIds().filter((id) => !read.has(`dlc-purchase-${id}`)).length
  );
}

// 運営プレゼント(2026-08-09): サーバーから取得した「受け取っていないプレゼント」の
// キャッシュ。目安箱の週次報告(fetchMeyasuReport)と同じくfire-and-forgetで
// 取得するだけの薄い層 — 取得できなくてもゲームは通常どおり遊べる
let fetchedGifts = [];
async function refreshGifts() {
  fetchedGifts = await fetchGifts();
  updateMailBadge();
  if (openOrder.includes("notice") && noticeTab === "mail") renderNotice();
}

// プレゼントを受け取る。サーバー側で先にclaimを確定させてから中身をもらう方式なので、
// 通信が途中で切れても「受け取った扱いなのに中身が届かない」以上の二重付与は起きない
async function handleClaimGift(gift) {
  const res = await claimGift(gift.id);
  if (res.error) {
    toast(res.error === "already_claimed" ? "もう受け取り済み" : "受け取りに失敗した。もう一度試して");
    if (res.error === "already_claimed") {
      fetchedGifts = fetchedGifts.filter((g) => g.id !== gift.id);
      renderNotice();
    }
    return;
  }
  const granted = applyGiftItem(state, res.item ?? gift.item ?? {});
  if (granted.egg) {
    const egg = makeEgg(granted.egg);
    state.eggs = state.eggs ?? [];
    state.eggs.push(egg);
    celebrateEgg(egg, "運営プレゼント");
  }
  const parts = [];
  if (granted.gold) parts.push(`+${formatGold(granted.gold)}G`);
  if (granted.key) parts.push(`鍵+${granted.key}`);
  if (granted.crystal) parts.push(`水晶+${granted.crystal}`);
  if (granted.coin) parts.push(`記念コイン+${granted.coin}`);
  if (granted.evoStone) parts.push(`進化石+${granted.evoStone}`);
  toast(`🎁 ${gift.title}${parts.length ? "(" + parts.join(" ") + ")" : ""}`);
  sfx("get");
  fetchedGifts = fetchedGifts.filter((g) => g.id !== gift.id);
  save();
  updateMailBadge();
  renderNotice();
}
// 未読メールの赤丸(2026-07-31: ✉が⚙メニュー内へ移動したので、閉じていても
// 気づけるように⚙ボタン本体とメニューの✉の両方に付ける)
function updateMailBadge() {
  const has = unreadMailCount() > 0;
  $("btn-settings")?.classList.toggle("notify", has);
  $("btn-mail")?.classList.toggle("notify", has);
}
let mailOpenId = null;
function buildMailContent() {
  const wrap = document.createElement("div");
  wrap.className = "mail-content";
  // 運営プレゼントは最上部に出す(受け取り待ちの用件が主役。Haru品質基準
  // 「情報の主役が最上部に来ているか」に沿う)
  for (const gift of fetchedGifts) {
    const row = document.createElement("div");
    row.className = "mail-row gift-row unread";
    const head = document.createElement("div");
    head.className = "mail-head";
    head.innerHTML =
      `<span class="mail-dot">🎁</span><span class="mail-title">${gift.title}</span>` +
      `<small class="mail-meta">運営</small>`;
    row.appendChild(head);
    if (gift.body) {
      const bodyEl = document.createElement("div");
      bodyEl.className = "mail-body";
      bodyEl.textContent = gift.body;
      row.appendChild(bodyEl);
    }
    const btn = document.createElement("button");
    btn.className = "chip gift-claim-btn";
    btn.textContent = "受け取る";
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      btn.disabled = true;
      handleClaimGift(gift);
    });
    row.appendChild(btn);
    wrap.appendChild(row);
  }
  const read = readMailSet();
  // DLC購入の受け取り方案内(2026-08-12)。所有を検知した回だけ1通届く(applyOwned側で
  // state.settings.dlcMailSent に記録)。プレゼント同様「今すぐ受け取れる用件」に近いので
  // ゲーム内お知らせ(GAME_MAILS)より上・プレゼントより下に置く
  for (const id of dlcMailIds()) {
    const info = DLC_RECEIVE_MAIL[id];
    if (!info) continue;
    const mailId = `dlc-purchase-${id}`;
    const row = document.createElement("div");
    const isRead = read.has(mailId);
    const isOpen = mailOpenId === mailId;
    row.className = "mail-row" + (isRead ? "" : " unread") + (isOpen ? " open" : "");
    row.innerHTML =
      `<div class="mail-head"><span class="mail-dot">${isRead ? "" : "●"}</span>` +
      `<span class="mail-title">${info.icon} ${info.title}</span>` +
      `<small class="mail-meta">運営</small></div>` +
      (isOpen ? `<div class="mail-body">${String(info.body).replace(/\n/g, "<br>")}</div>` : "");
    row.addEventListener("click", () => {
      mailOpenId = isOpen ? null : mailId;
      if (!isRead) {
        read.add(mailId);
        try {
          localStorage.setItem(MAIL_READ_KEY, JSON.stringify([...read]));
        } catch {}
      }
      renderNotice();
    });
    wrap.appendChild(row);
  }
  for (const m of GAME_MAILS) {
    const row = document.createElement("div");
    const isRead = read.has(m.id);
    const isOpen = mailOpenId === m.id;
    row.className = "mail-row" + (isRead ? "" : " unread") + (isOpen ? " open" : "");
    row.innerHTML =
      `<div class="mail-head"><span class="mail-dot">${isRead ? "" : "●"}</span>` +
      `<span class="mail-title">${m.title}</span>` +
      `<small class="mail-meta">${m.from ?? "運営"} ・ ${m.date ?? m.season ?? ""}</small></div>` +
      (isOpen ? `<div class="mail-body">${String(m.body).replace(/\n/g, "<br>")}</div>` : "");
    row.addEventListener("click", () => {
      mailOpenId = isOpen ? null : m.id;
      if (!isRead) {
        read.add(m.id);
        try {
          localStorage.setItem(MAIL_READ_KEY, JSON.stringify([...read]));
        } catch {}
      }
      renderNotice();
    });
    wrap.appendChild(row);
  }
  return wrap;
}

// お知らせ・メール窓(2026-08-11 Haru指示でパーティ窓から独立)。
// 内部に2タブ(📢お知らせ/✉メール)を持つ、既存のタブ切替(hero-tabsと同じ見た目)を流用
let noticeTab = "news";
function renderNotice() {
  const tabsEl = $("notice-tabs");
  tabsEl.innerHTML = "";
  const tNews = document.createElement("button");
  tNews.className = "hero-tab" + (noticeTab === "news" ? " on" : "");
  tNews.textContent = "📢 お知らせ";
  tNews.addEventListener("click", () => {
    noticeTab = "news";
    renderNotice();
  });
  const tMail = document.createElement("button");
  tMail.className = "hero-tab" + (noticeTab === "mail" ? " on" : "");
  tMail.textContent = "✉ メール";
  if (unreadMailCount() > 0) tMail.classList.add("notify");
  tMail.addEventListener("click", () => {
    noticeTab = "mail";
    updateMailBadge(); // 開いたら既読分を即反映
    renderNotice();
  });
  tabsEl.append(tNews, tMail);

  const body = $("notice-body");
  body.innerHTML = "";
  body.appendChild(noticeTab === "mail" ? buildMailContent() : buildNewsContent());
}

// タスモンをクリックしたときの入口: 詳細(ステータス)を別窓で開く。
// タスモン(hero)窓はインベントリ/スキルの管理ハブ、ステータスは独立窓に分離。
function openCharacter(monId) {
  currentDetailId = monId;
  if (state.monsters[monId]?.isNew) {
    state.monsters[monId].isNew = false; // 見たら新着マークを消す
    if (openOrder.includes("box")) renderBox();
  }
  openWindow("status"); // 通常は元どおり1枚(立ち絵ペアは孵化直後だけ 2026-08-01改訂)
  if (openOrder.includes("detail")) renderDetail(monId); // 開いていれば連動更新
  if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-09 別キャラ誤装着バグ修正
}

// 孵化直後だけの2枚ペア表示(立ち絵窓+ステータス窓 2026-08-01 Haru指示)。
// 2026-08-01 FB「孵化した時の表示がおかしい/立ち絵→ステータスの並びにして」:
// 旧実装は「開いていれば据え置き」だったため、直前にステータス窓を開いていると
// 並びが逆になり、throttleの間引きで別キャラの表示が残ることもあった。
// 毎回いったん閉じてから 立ち絵→ステータス の順で開き直し、描画も強制する
// 孵化ペア(立ち絵+ステータス)を「卵窓から開いたか」。閉じたら卵窓へ戻すために使う
// (2026-08-05 Haru指示「閉じるボタン押したらもとの卵ウィンドウに戻る挙動にして」)
let hatchPairFromEggs = false;
function openHatchPair(monId) {
  hatchPairFromEggs = openOrder.includes("eggs");
  currentDetailId = monId;
  if (state.monsters[monId]?.isNew) {
    state.monsters[monId].isNew = false;
    if (openOrder.includes("box")) renderBox();
  }
  closeWindow("portrait", { force: true }); // ペア連動でstatusも閉じる
  closeWindow("status", { force: true });
  portraitMemo = ""; // 前のキャラのmemoを破棄して必ず描き直す
  openWindow("portrait"); // 左=立ち絵
  openWindow("status"); // 右=ステータス
  renderStatus._lastAt = 0; // throttleの間引きを飛ばして今のキャラで即描画
  renderStatus();
  if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-09 別キャラ誤装着バグ修正
}

function openDetail(monId) {
  currentDetailId = monId;
  openWindow("detail");
  if (openOrder.includes("skills")) renderSkills(); // スキル窓は選択キャラに連動
  if (openOrder.includes("status")) renderStatus(); // ステータス窓も連動
  if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-09 別キャラ誤装着バグ修正
}

// 装備ピッカー: 詳細パネルの中身を持ち物一覧に差し替える。
// part を渡すとその部位の装備だけに絞る(空きスロットのクリックから使う)。
// accKind を渡すと(part="charm"のとき)その種別(イヤリング/ネックレス/リング)
// だけにさらに絞る(2026-07-15 FB修正: 枠ごとに正しい種別しか選べないようにする)。
function renderEquipPicker(monId, part = null, accKind = null) {
  const mon = state.monsters[monId];
  const panel = $("detail-panel");
  if (!mon) return;

  panel.innerHTML = "";
  const header = document.createElement("div");
  header.id = "detail-header";
  const partLabelText = accKind
    ? (CHARM_KINDS[accKind]?.label ?? "御守り")
    : part ? PARTS[part]?.label ?? "" : "";
  header.innerHTML =
    `<span>${part ? `${partLabelText}を 選ぶ` : "装備を 選ぶ"}</span>` +
    `<button id="btn-picker-back">戻る</button>`;
  panel.appendChild(header);

  const list = document.createElement("div");
  list.id = "equip-list";
  // 部位指定があればその部位の装備だけに絞る(空きスロットからの装備選び)。
  // アクセサリーはさらに種別で絞る(イヤリング枠にはイヤリングだけ出す)
  const pool = part
    ? state.items.filter(
        (it) =>
          (it.part ?? inferPart(it)) === part &&
          (part !== "charm" || !accKind || charmKindOf(it) === accKind),
      )
    : [...state.items];
  if (pool.length === 0) {
    const empty = document.createElement("div");
    empty.className = "box-hint";
    empty.textContent = part
      ? `${partLabelText}の 持ち物が ない(宝箱・倉庫から 補充しよう)`
      : "持ち物が ない(敵を 倒すと ドロップするよ)";
    list.appendChild(empty);
  }
  // レア度が高い順のアイコングリッド。ホバーで詳細、クリックで装備。
  const items = pool.sort(
    (x, y) => RARITY_ORDER.indexOf(y.rarity) - RARITY_ORDER.indexOf(x.rarity),
  );
  const grid = document.createElement("div");
  grid.className = "inv-grid";
  for (const item of items) {
    grid.appendChild(
      itemCell(item, () => {
        const result = equipItem(state, monId, item.id);
        if (result.error) {
          toast(result.error);
          return;
        }
        hideTooltip(true);
        playerHp = Math.min(playerHp, partyMaxHp());
        renderDetail(monId);
        save();
      }),
    );
  }
  list.appendChild(grid);
  panel.appendChild(list);

  $("btn-picker-back").addEventListener("click", () => renderDetail(monId));
}

// ---- 配合パネル ----
let breedSel = [null, null]; // 選んだ親のモンスターID
let breedSkillSel = [null, null]; // 親A/親Bから継承するスキルID(null=星最高の自動)
let justBredEggId = null; // 直近で配合した卵(トレイで強調する)

// タスモンを配合の親スロットにセット(D&D・右クリック・自動入力から共通で呼ぶ)
function breedAddMonster(monId) {
  const mon = state.monsters[monId];
  if (!mon) return;
  if (breedSel.includes(monId)) return; // 既にセット済み
  if (!breedSel[0]) {
    breedSel[0] = monId;
    breedSkillSel[0] = null;
  } else if (!breedSel[1]) {
    breedSel[1] = monId;
    breedSkillSel[1] = null;
  } else {
    breedSel[1] = monId; // 2枠埋まっていたら親Bを差し替え
    breedSkillSel[1] = null;
  }
  if (openOrder.includes("breed")) renderBreed();
  toast(`${baseNameOf(mon)} を親にセット`, "#c8f0a8");
}

// 片親プレビュー(DQM式): 親を1体だけ入れたとき「この子＋相手で何が生まれるか」を
// 子ごとにまとめて一覧化する。未発見種は？？？+シルエット。行クリックで相手をセット。
function renderSingleParentPreview(preview, fixedId) {
  const fixed = state.monsters[fixedId];
  preview.innerHTML = "";
  const head = document.createElement("div");
  head.className = "breed-single-head";
  head.innerHTML = `<b style="color:#ffe9a8">${baseNameOf(fixed)}</b> ＋ <b>？</b> で生まれる子ども`;
  preview.appendChild(head);
  // 配合できる相手を集め、生まれる子種でグルーピング
  const partners = Object.values(state.monsters).filter(
    (m) => m.id !== fixedId && canBreed(state, fixedId, m.id).ok,
  );
  if (partners.length === 0) {
    const none = document.createElement("div");
    none.className = "odds";
    none.textContent = "配合できる相手がいない(パーティ外のタスモンを増やそう)";
    preview.appendChild(none);
    return;
  }
  const byChild = new Map(); // childSpeciesId -> [partner...]
  for (const p of partners) {
    const child = breedResultSpecies(fixed, p).speciesId;
    if (!byChild.has(child)) byChild.set(child, []);
    byChild.get(child).push(p);
  }
  // 子レア度が高い順(高みが上に来る)
  const entries = [...byChild.entries()].sort(
    (x, y) =>
      RARITY_ORDER.indexOf(SPECIES[y[0]].rarity) - RARITY_ORDER.indexOf(SPECIES[x[0]].rarity),
  );
  const list = document.createElement("div");
  list.className = "breed-outcomes";
  for (const [childId, plist] of entries) {
    const csp = SPECIES[childId];
    const crm = RARITY_META[csp.rarity];
    const known = !!state.dex?.[childId];
    // 相手は一番弱い個体を代表に(整理向き)。クリックでそれを親Bにセット。
    const partner = plist.slice().sort((a, b) => powerScore(a) - powerScore(b))[0];
    const row = document.createElement("button");
    row.className = "breed-outcome-row";
    row.style.borderColor = crm.color;
    row.appendChild(
      known ? spriteCanvas(getMonsterSprite(childId), 38) : silhouetteCanvas(childId, 38),
    );
    const info = document.createElement("div");
    info.className = "breed-outcome-info";
    const jp = Math.round(breedJumpChance(fixed, partner) * 100);
    info.innerHTML =
      `<span class="breed-outcome-name" style="color:${crm.color}">${known ? csp.name : "？？？"}</span>` +
      `<span class="mon-sub"><span class="rar-chip" style="color:${crm.color};border-color:${crm.color}">${"★".repeat(crm.stars)} ${crm.label}</span></span>` +
      `<span class="odds">相手 ${plist.length}体候補 ・ ⚡覚醒配合 ${jp}%</span>`;
    row.appendChild(info);
    row.title = `${baseNameOf(partner)} を親Bにセット`;
    row.addEventListener("click", () => breedAddMonster(partner.id));
    list.appendChild(row);
  }
  preview.appendChild(list);
}

function renderBreed() {
  // 親スロット
  for (let i = 0; i < 2; i++) {
    const slot = $(`breed-slot-${i}`);
    slot.innerHTML = "";
    slot.classList.remove("filled");
    slot.onclick = null;
    // パーティ窓からドラッグして親をセットできる
    if (!slot.dataset.dropWired) {
      slot.dataset.dropWired = "1";
      makeDropTarget(slot, (data) => {
        if (data.startsWith("mon:")) breedAddMonster(data.slice(4));
      });
    }
    const id = breedSel[i];
    const mon = id && state.monsters[id];
    if (mon) {
      slot.classList.add("filled");
      slot.appendChild(
        spriteCanvas(monSpriteOf(mon), 64, monHue(mon)),
      );
      const label = document.createElement("span");
      // 種族名だけ切り詰め、+値は必ず残す(「フロストウルフ+7」の+7が欠けないように)
      const plusTag = (mon.plus ?? 0) > 0 ? `+${mon.plus}` : "";
      label.textContent = `${baseNameOf(mon).slice(0, 6)}${plusTag} Lv.${mon.level}`;
      slot.appendChild(label);
      slot.title = "クリックで 外す";
      slot.onclick = () => {
        breedSel[i] = null;
        breedSkillSel[i] = null;
        renderBreed();
      };
    } else {
      const empty = document.createElement("span");
      empty.className = "slot-empty";
      empty.textContent = i === 0 ? "親A" : "親B";
      slot.appendChild(empty);
      slot.title = "パーティ窓からドラッグ";
    }
  }

  // プレビュー + 実行ボタン
  const preview = $("breed-preview");
  const btn = $("btn-breed-go");
  const [idA, idB] = breedSel;
  const check = canBreed(state, idA, idB);
  preview.innerHTML = "";
  const oneFilled = !!idA !== !!idB;
  if (!idA && !idB) {
    preview.innerHTML =
      '<span class="odds">親を2体選ぶと 子どもが決まる(DQM式)<br>' +
      "子は両親のスキルを受けつぎ、<b>+値</b>(配合世代)で強くなる<br>" +
      "✦特別レシピの組み合わせは 大きくジャンプ ・ ⚡覚醒配合で超低確率の格上も</span>";
    btn.disabled = true;
    btn.textContent = "親を2体選ぶ";
  } else if (oneFilled) {
    // 片親プレビュー(DQM式): この子＋相手で何が生まれるかを一覧化。未発見は？？？
    renderSingleParentPreview(preview, idA || idB);
    btn.disabled = true;
    btn.textContent = "もう1体 選ぶ";
  } else if (!check.ok) {
    preview.innerHTML = `<span class="odds">配合できない: ${check.reason}</span>`;
    btn.disabled = true;
    btn.textContent = "配合する";
  } else {
    const a = state.monsters[idA];
    const b = state.monsters[idB];
    const ivAtk = Math.round(((a.iv.atk + b.iv.atk) / 2) * 100);
    const ivHp = Math.round(((a.iv.hp + b.iv.hp) / 2) * 100);
    // DQM式: 生まれる子は組み合わせで確定。ただし未発見の種は
    // シルエット+???で「何が生まれるかは生んでみてのお楽しみ」にする
    const resInfo = breedResultSpecies(a, b);
    const rsp = SPECIES[resInfo.speciesId];
    const rrm = RARITY_META[rsp.rarity];
    const known = !!state.dex?.[rsp.id];
    const card = document.createElement("div");
    card.className = "breed-child-card";
    card.style.setProperty("--child-glow", rrm.glow);
    // 子のスプライト(未発見はシルエット=DQMの「なにが生まれる…?」のドキドキ)
    const spriteWrap = document.createElement("div");
    spriteWrap.className = "breed-child-sprite" + (known ? "" : " unknown");
    spriteWrap.appendChild(known ? spriteCanvas(getMonsterSprite(rsp.id), 64) : silhouetteCanvas(rsp.id, 64));
    card.appendChild(spriteWrap);
    const info = document.createElement("div");
    info.className = "breed-child-info";
    const recipeTag = resInfo.recipe
      ? ' <span class="recipe-tag">✦特別レシピ!</span>'
      : "";
    const childPlusVal = childPlus(a, b);
    // 覚醒チャンス: 親の覚醒数で確率が跳ね上がる。両親覚醒なら二重覚醒の芽も。
    const awakenedParents = [a, b].filter((p) => (p.awakening ?? 0) > 0).length;
    const awakenPct = Math.round(AWAKENING.chanceBred[awakenedParents] * 100);
    const awakenLine =
      awakenedParents === 2
        ? `<span class="awaken-odds">⚡覚醒 ${awakenPct}%! 二重覚醒の芽あり!</span>`
        : awakenedParents === 1
          ? `<span class="awaken-odds">⚡覚醒 ${awakenPct}%</span>`
          : `<span class="odds">覚醒 ${awakenPct}%</span>`;
    const rate = breedSuccessRate(a, b);
    const rateLine =
      rate >= 1
        ? '<span class="odds">成功率 100%</span>'
        : `<span class="awaken-odds" style="color:#ff9a9a">成功率 ${Math.round(rate * 100)}%(失敗すると1段下の子)</span>`;
    // 覚醒配合(ジャンプアップ): 超低確率で1段上のレア度が生まれる。確率を明示。
    const jumpPct = Math.round(breedJumpChance(a, b) * 100);
    const jumpTgt = SPECIES[breedResultSpecies(a, b).speciesId].rarity;
    const jumpRank = RARITY_ORDER.indexOf(jumpTgt);
    const jumpLabel =
      jumpRank < RARITY_ORDER.length - 1 ? RARITY_META[RARITY_ORDER[jumpRank + 1]].label : "最上位";
    const jumpLine = `<span class="jump-odds">⚡覚醒配合 ${jumpPct}% <small>→ ${jumpLabel}へジャンプ</small></span>`;
    info.innerHTML =
      `<span class="breed-child-name" style="color:${rrm.color}">${known ? rsp.name : "？？？"}` +
      `<b class="plus-badge">+${childPlusVal}</b></span>` +
      `<span class="mon-sub"><span class="rar-chip" style="color:${rrm.color};border-color:${rrm.color}">${"★".repeat(rrm.stars)} ${rrm.label}</span>` +
      (known ? elementChip(rsp.element) : "") + recipeTag + `</span>` +
      `<span class="mon-sub">${rateLine}　${awakenLine}</span>` +
      `<span class="mon-sub">${jumpLine}</span>` +
      `<span class="odds">個体値の下限 攻${ivAtk}%/HP${ivHp}% ・ +${childPlusVal}で能力+${Math.round(childPlusVal * PLUS_STAT_PER * 100)}%</span>`;
    card.appendChild(info);
    preview.appendChild(card);

    // スキル継承の選択(DQMの決断: 親A・親Bから1つずつ何を残すか)。
    // 未選択は星最高の自動選択。チップをクリックで差し替えられる
    const pickWrap = document.createElement("div");
    pickWrap.className = "inherit-pick";
    [a, b].forEach((parent, pi) => {
      const choices = inheritChoices(parent, rsp.id);
      const row = document.createElement("div");
      row.className = "inherit-pick-row";
      const label = document.createElement("span");
      label.className = "inherit-pick-label";
      label.textContent = `${baseNameOf(parent).slice(0, 6)}から継承:`;
      row.appendChild(label);
      if (choices.length === 0) {
        const none = document.createElement("span");
        none.className = "odds";
        none.textContent = "なし(子が同じスキルを持っている)";
        row.appendChild(none);
      }
      const effective =
        breedSkillSel[pi] && choices.includes(breedSkillSel[pi])
          ? breedSkillSel[pi]
          : defaultInheritPick(parent, rsp.id);
      for (const id of choices) {
        const chip = document.createElement("button");
        chip.className = "inherit-chip pickable" + (id === effective ? " sel" : "");
        chip.textContent = `✦${SKILLS[id].name} ★${skillStars(id)}`;
        chip.title = SKILLS[id].desc;
        chip.addEventListener("click", () => {
          breedSkillSel[pi] = id;
          renderBreed();
        });
        row.appendChild(chip);
      }
      pickWrap.appendChild(row);
    });
    preview.appendChild(pickWrap);
    btn.disabled = false;
    btn.textContent = `配合する (${formatGold(check.cost)} GP)`;
  }

  // モンスター一覧(親候補): アイコングリッド。ホバーで詳細、クリックで選択。
  const list = $("breed-list");
  list.innerHTML = "";
  // 自動入力(合成のオート入力と同じ発想): パーティ外の一番弱い2体を親にセット。
  // 低ランクの整理を手数なく回せる。
  const autoBtn = document.createElement("button");
  autoBtn.className = "breed-auto-btn";
  autoBtn.textContent = "⚡ 自動入力(弱い2体)";
  autoBtn.title = "パーティ外の 一番弱いタスモン2体を 親にセット";
  autoBtn.addEventListener("click", () => {
    const cands = Object.values(state.monsters)
      .filter((m) => !state.party.includes(m.id))
      .sort((a, b) => powerScore(a) - powerScore(b));
    let picked = null;
    for (let i = 0; i < cands.length && !picked; i++) {
      for (let j = i + 1; j < cands.length; j++) {
        if (canBreed(state, cands[i].id, cands[j].id).ok) {
          picked = [cands[i].id, cands[j].id];
          break;
        }
      }
    }
    if (!picked) {
      toast("自動入力できる2体が いない(パーティ外のタスモンが 足りない)");
      return;
    }
    breedSel = picked;
    breedSkillSel = [null, null];
    renderBreed();
  });
  // パーティ窓を開くボタン(そこから親を選んで入れる)
  const openBoxBtn = document.createElement("button");
  openBoxBtn.className = "breed-open-box-btn";
  openBoxBtn.textContent = "👥 パーティ窓を開いて親を選ぶ";
  openBoxBtn.addEventListener("click", () => openWindow("box"));
  list.appendChild(openBoxBtn);
  const hint = document.createElement("div");
  hint.className = "box-hint";
  hint.innerHTML =
    "親スロットに <b>タスモンをドラッグ</b>、またはパーティ窓で <b>右クリック</b>で親に追加。<br>" +
    "自動入力で弱い2体をまとめてセットもできます。";
  list.appendChild(hint);

  // ---- レシピ手帳(DQMの配合表): 発見済みは全公開、未発見は子のシルエット+??? ----
  const foundCount = RECIPE_LIST.filter((r) => state.recipesFound?.[r.key]).length;
  const bookHead = document.createElement("div");
  bookHead.className = "recipe-book-head";
  bookHead.innerHTML = `✦ レシピ手帳 <small>${foundCount} / ${RECIPE_LIST.length} 発見</small>`;
  list.appendChild(bookHead);
  const book = document.createElement("div");
  book.className = "recipe-book";
  // レシピは子のレア度順(上に行くほど高み)。未発見が下に沈まないよう順序は固定
  const rows = RECIPE_LIST.slice().sort(
    (x, y) =>
      RARITY_ORDER.indexOf(SPECIES[x.child].rarity) -
      RARITY_ORDER.indexOf(SPECIES[y.child].rarity),
  );
  for (const r of rows) {
    const found = !!state.recipesFound?.[r.key];
    const child = SPECIES[r.child];
    const crm = RARITY_META[child.rarity];
    const row = document.createElement("div");
    row.className = "recipe-row" + (found ? " found" : "");
    // 親側: 発見済みなら名前、未発見でも「図鑑にいる種」はヒントとして名前を出す
    // (両親を持っているのに組み合わせに気づいていない=試したくなる)
    const parentLabel = (pid) => {
      if (found || state.dex?.[pid]) return SPECIES[pid].name;
      return "？？？";
    };
    const childIcon = found ? spriteCanvas(getMonsterSprite(child.id), 30) : silhouetteCanvas(child.id, 30);
    row.appendChild(childIcon);
    const txt = document.createElement("span");
    txt.className = "recipe-text";
    txt.innerHTML =
      `<b style="color:${found ? crm.color : "#8890a5"}">${found ? child.name : "？？？"}</b>` +
      `<small> = ${parentLabel(r.parents[0])} × ${parentLabel(r.parents[1])}</small>`;
    row.appendChild(txt);
    const star = document.createElement("span");
    star.className = "recipe-star";
    star.style.color = crm.color;
    star.textContent = "★".repeat(crm.stars);
    row.appendChild(star);
    book.appendChild(row);
  }
  list.appendChild(book);
}

function doBreed() {
  const [idA, idB] = breedSel;
  const result = breed(state, idA, idB, Math.random, breedSkillSel);
  if (result.error) {
    toast(`配合できない: ${result.error}`);
    return;
  }
  breedSel = [null, null];
  breedSkillSel = [null, null];
  justBredEggId = result.egg.id;
  if (result.recipeFound) {
    // レシピ初発見はこのシステム最大の祝福(手帳に永久に刻まれる)
    const child = SPECIES[result.egg.resultSpecies];
    celebrateLoot({
      kicker: "✦ 特別レシピ発見! ✦",
      icon: state.dex?.[child.id] ? spriteCanvas(getMonsterSprite(child.id), 52) : silhouetteCanvas(child.id, 52),
      title: state.dex?.[child.id] ? child.name : "？？？",
      sub: `レシピ手帳に記録された!<br>${RARITY_META[child.rarity].label}の血統が ここに始まる`,
      rarity: child.rarity,
    });
  }
  if (result.egg.breedFailed) {
    toast(`⚠ 配合は成功率を外した… 子は1段下の ${RARITY_META[result.egg.rarity].label} に(卵はできた)`, "#ff9a9a");
    celebrateEgg(result.egg, "配合(格落ち)");
  } else if (!result.recipeFound) {
    celebrateEgg(result.egg, "配合 成功");
  }
  // 親が消えてパーティ/図鑑が変わるので総合的に更新
  syncSceneParty();
  playerHp = partyMaxHp();
  renderEggs();
  renderBox();
  renderBreed();
  save();
  // 強調は数秒で解除
  setTimeout(() => {
    if (justBredEggId === result.egg.id) {
      justBredEggId = null;
      renderEggs();
    }
  }, 6000);
}

// ---- ユーティリティ ----
function rarityLabel(rarity) {
  return RARITY_META[rarity]?.label ?? rarity;
}

// 総合戦力: 攻撃+スキルDPS+耐久を1つの数字に(比較用の目安)。
// スキルの型から職業を出す(孵化リザルトや一覧で「何ができる子か」を一目で)
// 手持ち全体での強さ順位(1はじまり)
function powerRankOf(mon) {
  const all = Object.values(state.monsters).map((m) => powerScore(m)).sort((a, b) => b - a);
  return all.indexOf(powerScore(mon)) + 1;
}

// nukeの実効威力(multi=多段は合計威力power×hitsで数える 2026-07-21)
function skillNukePower(a) {
  return a.kind === "multi" ? a.power * (a.hits ?? 3) : a.power;
}
function powerScore(mon) {
  const skill = effectiveSkill(mon);
  const a = skill.active;
  const atk = monsterAtk(mon);
  const skillDps = a.type === "nuke" ? (atk * skillNukePower(a)) / skill.cooldown : 0;
  return Math.round(atk + skillDps + monsterMaxHp(mon) / 10);
}
// その装備一式を「仮に着けたら」の総合戦闘力(装備配列を差し替えた浅いコピーで測る。
// state.js の powerWith と同じ考え方をUI表示側の powerScore にも適用)
function powerScoreWith(mon, equipment) {
  return powerScore({ ...mon, equipment });
}

// 個体ランクのバッジ(2026-08-01 友人テストFB「詳細画面で2つ異なる表記がある」:
// 独自の6段ランクを新設してしまい、既存の個体ランク(S/A/B/C=gradeFromIv、
// 調合のランクアップ抽選と同じ物差し)と食い違っていた。表記は既存の1本に統一)
function ivRankHtml(iv) {
  const g = gradeFromIv(iv);
  return `<span class="iv-rank" style="color:${g.color}">ランク ${g.rank} ${"★".repeat(g.stars)}</span>`;
}
// 個体値の品質バー(85%〜130%のどこにいるか)。当たり個体がひと目でわかる。
function ivBarHtml(label, iv) {
  const q = Math.max(0, Math.min(1, (iv - 0.85) / (1.3 - 0.85)));
  const qClass = iv >= 1.15 ? "q-max" : iv >= 1.05 ? "q-high" : "";
  return (
    `<div class="tt-opt">` +
    `<span class="tt-opt-label">${label}</span>` +
    `<b class="tt-opt-val ${qClass}">${ivPercent(iv)}${iv >= 1.15 ? " ✦" : ""}</b>` +
    `<span class="tt-qbar"><i class="${qClass}" style="width:${Math.round(q * 100)}%"></i></span>` +
    `</div>`
  );
}

// 属性チップのHTML。
// カスタムアイコン(assets/icons/<cat>/<name>.png)。ローカル画像はimgで安全に表示。
function iconUrl(cat, name) {
  return `assets/icons/${cat}/${name}.png`;
}
function iconImgHtml(cat, name, size, cls = "") {
  return `<img class="game-icon ${cls}" src="${iconUrl(cat, name)}" width="${size}" height="${size}" alt="" draggable="false" onerror="this.style.display='none'">`;
}
// ジョブの役割タイプ(nuke/heal/guard/buff)を返す。役割アイコンのファイル名にも一致。
// 職業は基本スキルで固定(装備で変わらない)。
function roleKeyOf(mon) {
  return baseRoleType(mon);
}
// 卵アイコン(レア度別のカスタム画像)。無ければプロシージャル卵にフォールバック。
function eggIconEl(rarity, size) {
  const img = document.createElement("img");
  img.className = "game-icon egg-ico";
  img.src = iconUrl("egg", rarity);
  img.width = img.height = size;
  img.draggable = false;
  img.onerror = () => img.replaceWith(spriteCanvas(eggSprite(rarity), size));
  return img;
}
// アクセサリー(イヤリング/リング)のレア度別アイコン(2026-07-08 切り出し画像)。
// rarity=null は空きスロット用(薄く表示)。celestial等は最上位のcosmic画像で代用。
const ACC_RARITIES = ["common", "rare", "ultra", "legend", "immortal", "arcana", "beyond", "century", "cosmic"];
function accessoryIconEl(kind, rarity, size) {
  const rar = ACC_RARITIES.includes(rarity) ? rarity : rarity ? "cosmic" : "common";
  const img = document.createElement("img");
  img.className = "game-icon acc-ico" + (rarity ? "" : " faded");
  img.src = `assets/icons/accessory/${kind}_${rar}.png`;
  img.width = img.height = size;
  img.draggable = false;
  // 画像が無い種類は汎用の装備アイコンへフォールバック(2026-07-19 FB「空き枠の
  // アイコンが表示されていないものがある」: 旧実装はdisplay:noneで丸ごと消していた)
  img.onerror = () => {
    img.onerror = null;
    img.src = iconUrl("equip", kind === "earring" ? "ring" : kind); // equipにearringは無い
  };
  return img;
}
// 宝箱アイコン(種類別のカスタム画像)。無ければプロシージャル宝箱にフォールバック。
// 通常=素朴な木箱 / レア=黄金箱 / ボス=宝石箱(最上位・ひと目で別格)。
// 3段の見た目差(茶→金→宝石)でボス箱を明確に区別する(2026-07-08)。
const CHEST_ICON = { wood: "wood", rare: "golden", boss: "jeweled" };
function chestIconEl(kind, size) {
  const img = document.createElement("img");
  img.className = "game-icon chest-ico";
  img.src = iconUrl("chest", CHEST_ICON[kind] ?? "wood");
  img.width = img.height = size;
  img.draggable = false;
  img.onerror = () => img.replaceWith(spriteCanvas(chestSprite(kind), size));
  return img;
}
// 部位アイコン(装備セット枠の空きに表示)。カスタム装備画像があれば使い、
// 無い部位(くつ)は従来のプロシージャル部位アイコンにフォールバック。
const PART_ICON = { weapon: "sword", armor: "armor", helm: "helm", sub: "shield", charm: "necklace" };
function partIconEl(part, size) {
  // 空きスロットの「ここに◯◯を装備」ヒント。装備済みと紛らわしくないよう
  // 薄く・軽くグレーにして「まだ何も付いていない」ことが一目で分かるようにする。
  if (!PART_ICON[part]) {
    const cv = partIconCanvas(part, size);
    cv.style.opacity = "0.32";
    cv.style.filter = "grayscale(0.5)";
    return cv;
  }
  const img = document.createElement("img");
  img.className = "game-icon part-ico part-ico-empty";
  img.src = iconUrl("equip", PART_ICON[part]);
  img.width = img.height = size;
  img.draggable = false;
  img.onerror = () => {
    const cv = partIconCanvas(part, size);
    cv.style.opacity = "0.32";
    cv.style.filter = "grayscale(0.5)";
    img.replaceWith(cv);
  };
  return img;
}

function elementChip(element) {
  const em = ELEMENT_META[element];
  if (!em) return "";
  return `<span class="elem-chip" style="color:${em.color};border-color:${em.color}">${iconImgHtml("element", element, 14, "elem-ico")}${em.label}</span>`;
}

// 進化後の「素の名前」。
// 2026-07-28 FB「キャラ名は進化後のキャラ名にして(ジョブは別で表示)」で
// 職名+元種族名の複合(「剣聖フレイムウルフ」)をやめた、までは良かったが、
// その実装が `SPECIES[mon.evoSkin].name` = **実在する別キャラの名前**を
// そのまま流用していた(2026-08-13 Haru報告「進化キャラが別のキャラの名前に
// なっている・かぶっている」の実犯)。evoSkin は「上位レア度の"姿"を借りる」
// ためのIDであって名前ではない。
// 進化名は evoSkin から切り離し、元の種族と進化段だけから決定的に作る
// (evolution-names.js。全種族×全段で一意・既存種族名とも重複しないことを保証)
function baseNameOf(mon) {
  // レア職・隠し職は専用キャラの名前(2026-07-28 FB「専用のキャラを用意して」)
  const charName = JOBS[mon?.job]?.charName;
  if (charName && hasDedicatedChar(mon.job)) return charName;
  return evolvedNameOf(mon.speciesId, evolveStage(mon));
}

// モンスター1体の情報HTML(名前=レア度色 / レア度チップ / 属性 / 個体ランク星 / スキル)。
// DQM式の+値つき名前(「フレイムウルフ+3」)。+値は配合世代の勲章
function monName(mon) {
  const plus = mon.plus ?? 0;
  return baseNameOf(mon) + (plus > 0 ? `+${plus}` : "");
}

// 進化バナー等で使う「進化後の名前」。中身は素の名前と同じ(職名は付けない)
function evolvedName(mon) {
  return monName(mon);
}

function monsterInfoHtml(mon) {
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const grade = gradeFromIv(mon.iv);
  const skill = effectiveSkill(mon);
  const shiny = mon.shiny ? '<span class="shiny-badge">★色違い</span>' : "";
  const awaken =
    (mon.awakening ?? 0) > 0
      ? `<span class="awaken-badge">⚡${AWAKENING.label[mon.awakening]}</span>`
      : "";
  const role = roleOf(mon);
  // セットしているスキル(装備スキル最大2枠)を役割アイコンつきで一覧表示
  const setSkills = equippedSkillsOf(mon);
  const skillChips = setSkills
    .map(
      (sk) =>
        `<span class="mss-chip">${iconImgHtml("role", sk.active.type, 11, "mss-ico")}${sk.name}</span>`,
    )
    .join("");
  return (
    `<span class="mon-top"><span class="mon-name" style="color:${rm.color}">${monName(mon)}</span>${awaken}${shiny} <span class="mon-lv">Lv.${mon.level}</span></span>` +
    `<span class="mon-sub"><span class="rar-chip" style="color:${rm.color};border-color:${rm.color}">${rm.label}</span>` +
    // ジョブ(役割)と属性
    `<span class="role-chip" style="color:${role.color};border-color:${role.color}">${roleIconHtml(role)}${role.label}</span>` +
    elementChip(sp.element) +
    `<span class="grade" style="color:${grade.color}">${grade.rank}ランク ${"★".repeat(grade.stars)}</span></span>` +
    // 総合戦闘力
    `<span class="mon-sub">総合戦闘力 <b class="mon-power">${formatNum(powerScore(mon))}</b></span>` +
    // セットスキル一覧
    `<span class="mon-setskills"><span class="mss-label">セット</span>${skillChips}</span>` +
    `<span class="mon-skill">${skill.name} — ${skill.desc}</span>`
  );
}

// 入れ替え対象=現パーティで最も戦力の低いメンバー(満員なら押し出される枠)。
function swapTarget(mon) {
  if (state.party.includes(mon.id)) return null;
  const members = partyMonsters(state).filter((m) => m && m.id !== mon.id);
  if (members.length === 0) return null;
  // いま見ているタスモン(currentDetailId)がパーティにいればそれと比較(=選んだ相手)。
  // いなければパーティで最も戦力の低いメンバー(満員なら押し出される枠)と比較。
  const sel = members.find((m) => m.id === currentDetailId);
  return sel ?? members.reduce((a, b) => (powerScore(b) < powerScore(a) ? b : a));
}

// タスモンの比較カード(装備の itemPanelHtml と同じ ip-panel レイアウトを流用)。
// opts.tag=右上の小見出し / opts.equipped=「配置中」帯を出す。
function monPanelHtml(mon, opts = {}) {
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const grade = gradeFromIv(mon.iv);
  const role = roleOf(mon);
  const setSkills = equippedSkillsOf(mon);
  const skillChips =
    setSkills
      .map(
        (sk) =>
          `<span class="mss-chip">${iconImgHtml("role", sk.active.type, 11, "mss-ico")}${sk.name}</span>`,
      )
      .join("") || `<span class="mss-label">なし</span>`;
  const awaken = (mon.awakening ?? 0) > 0 ? ` ⚡${AWAKENING.label[mon.awakening]}` : "";
  const portrait = monIconCanvas(mon, 44).toDataURL();
  return (
    `<div class="ip-panel">` +
    `<div class="ip-name" style="color:${rm.color};border-color:${rm.color}">${monName(mon)}` +
    (opts.tag ? `<span class="ip-tag">${opts.tag}</span>` : "") +
    `</div>` +
    `<div class="ip-head">` +
    `<span class="ip-icon" style="border-color:${rm.color};background:${rarityCellBg(rm)}">` +
    `<img src="${portrait}" width="44" height="44" style="image-rendering:pixelated"></span>` +
    `<div class="ip-head-info">` +
    `<div class="ip-grade" style="color:${rm.color}">${rm.label}等級 ${"★".repeat(Math.min(rm.stars, 5))}${awaken} <span class="ip-lv">Lv.${mon.level}</span></div>` +
    `<div class="ip-main"><span>総合戦闘力</span><b>${formatNum(powerScore(mon))}</b></div>` +
    `<div class="ip-score">個体ランク <b style="color:${grade.color}">${grade.rank} ${"★".repeat(grade.stars)}</b></div>` +
    `</div></div>` +
    `<div class="ip-sec">ジョブ・属性</div>` +
    `<div class="mon-panel-tags"><span class="role-chip" style="color:${role.color};border-color:${role.color}">${roleIconHtml(role)}${role.label}</span>${elementChip(sp.element)}</div>` +
    `<div class="ip-sec">セットスキル</div>` +
    `<div class="mon-setskills">${skillChips}</div>` +
    (opts.equipped ? `<div class="ip-equipped">配置中</div>` : "") +
    `</div>`
  );
}

// パーティ入れ替えの差分サマリ(戦力/攻撃/HP/役割 + 総評)。
function partySwapDiffHtml(mon, target) {
  const rows = [
    ["戦力", powerScore(mon), powerScore(target)],
    ["攻撃", monsterAtk(mon), monsterAtk(target)],
    ["最大HP", monsterMaxHp(mon), monsterMaxHp(target)],
  ]
    .map(([label, a, b]) => {
      const d = Math.round(a) - Math.round(b);
      const cls = d > 0 ? "diff-up" : d < 0 ? "diff-down" : "";
      const sign = d > 0 ? "+" : d < 0 ? "" : "±";
      return (
        `<div class="tt-diff-row"><span>${label}</span>` +
        `<b class="${cls}">${formatNum(Math.round(a))} <small>(${sign}${d === 0 ? "0" : formatNum(d)})</small></b></div>`
      );
    })
    .join("");
  const rCand = roleOf(mon);
  const rTgt = roleOf(target);
  const roleNote =
    rCand.label !== rTgt.label
      ? `<div class="tt-diff-row"><span>役割</span><b style="color:${rCand.color}">${rTgt.label} → ${rCand.label}</b></div>`
      : "";
  const better = powerScore(mon) >= powerScore(target);
  // 2026-08-11 FB「戦力ダウンの横にどのくらいダウンするか数字で表記して」
  const powerDelta = Math.round(powerScore(mon)) - Math.round(powerScore(target));
  const deltaLabel = `(${powerDelta > 0 ? "+" : powerDelta < 0 ? "" : "±"}${powerDelta === 0 ? "0" : formatNum(powerDelta)})`;
  return (
    `<div class="tt-compare swap-compare">` +
    `<div class="tt-compare-head">▶ ${SPECIES[target.speciesId].name}と入れ替えると</div>` +
    rows +
    roleNote +
    `<div class="swap-verdict ${better ? "up" : "down"}">${better ? "⬆ 戦力アップ" : "⬇ 戦力ダウン"} ${deltaLabel}</div>` +
    `</div>`
  );
}

// タスモンのホバー用: 装備比較とまったく同じ「2枚横並びカード + 差分」オーバーレイ。
// パーティ外のタスモンなら 候補 | 配置中(最弱枠) を並べて比較する。
function monCompareTooltipHtml(mon) {
  const target = swapTarget(mon);
  if (!target) {
    return `<div class="mon-info tt-mon">${monsterInfoHtml(mon)}</div>`;
  }
  return (
    `<div class="ip-compare tt-compare-wide">` +
    monPanelHtml(mon, { tag: "▶ 選択中" }) +
    monPanelHtml(target, { equipped: true, tag: SPECIES[target.speciesId].name.slice(0, 5) }) +
    `</div>` +
    partySwapDiffHtml(mon, target)
  );
}

function ivPercent(iv) {
  return `${Math.round(iv * 100)}%`;
}

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// アプリのバージョン(package.json と合わせる)。目安箱のctxに乗せて、
// 「どの版で出た声か」を週次クラスタが区別できるようにする。
const APP_VERSION = "0.1.0";

// サーバー由来の文字列をHTMLに差し込む前のエスケープ。
// 目安箱の週次報告はAIが書いた文章だが、外部から来る以上そのまま innerHTML に入れない。
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

// お金はM/K省略せずフル桁+カンマ区切りで見せる(2026-07-12 FB「Mとか省略しないで」)
function formatGold(n) {
  return Math.floor(n).toLocaleString("en-US");
}

// 詳細窓タイトルの💰チップ用: 1億以上はフル桁だと窓タイトルと重なる(はみ出し
// ゲート検出 2026-07-21)ので短縮表記に切り替える。正確な値はtitle属性で見られる。
// 倉庫チップの「100万以上は短縮」と同じ既例パターン
function formatGoldChip(n) {
  return n >= 100_000_000 ? formatNum(Math.floor(n)) : formatGold(n);
}

// 幅の限られたボタン/チップ用: 100万以上は常に短縮(11,915,000→11.9M)。
// 2026-07-30 FB「言語変えると文字飛び出てる」: 進化ボタンはフル桁+長い訳で
// 窓を突き抜けた。formatGoldChip(1億から短縮)では進化費用(数百万〜)に効かない
function formatGoldShort(n) {
  return n >= 1_000_000 ? formatNum(Math.floor(n)) : formatGold(n);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// msgHistory / MSG_HISTORY_MAX はファイル先頭に巻き上げ済み(TDZ回避)
function toast(msg, color = null) {
  el.toast.textContent = msg;
  el.toast.style.color = color ?? "";
  el.toast.style.borderColor = color ?? "";
  el.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.add("hidden"), 2500);
  // 履歴に積む(同じ文言の連続はまとめる)
  const last = msgHistory[msgHistory.length - 1];
  if (last && last.msg === msg) last.n = (last.n ?? 1) + 1;
  else msgHistory.push({ msg, color, t: Date.now(), n: 1 });
  if (msgHistory.length > MSG_HISTORY_MAX) msgHistory.shift();
  if (!$("msg-history").classList.contains("hidden")) renderMsgHistory();
}

function renderMsgHistory() {
  const list = $("msg-history-list");
  const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 8;
  list.innerHTML = msgHistory
    .map((m) => {
      const time = new Date(m.t).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      // 色つきメッセージは左に色帯+文字色でカテゴリをひと目で追える
      const rowStyle = m.color ? ` style="border-left-color:${m.color}"` : "";
      const txtStyle = m.color ? ` style="color:${m.color}"` : "";
      const cnt = m.n > 1 ? `<b class="msg-x">×${m.n}</b>` : "";
      return (
        `<div class="msg-row${m.color ? " has-col" : ""}"${rowStyle}>` +
        `<span class="msg-time">${time}</span>` +
        `<span class="msg-txt"${txtStyle}>${m.msg}</span>${cnt}</div>`
      );
    })
    .join("") || `<div class="box-hint">まだ メッセージが ない</div>`;
  if (atBottom) list.scrollTop = list.scrollHeight; // 最新へ追従(遡り中はそのまま)
}

// ---- 獲得フロート(TBH式: タスクバー直上を「◯◯を獲得」が流れて消える) ----
const FLOAT_MAX = 5;
function floatNotify(html) {
  const area = $("float-area");
  const line = document.createElement("div");
  line.className = "float-line";
  line.innerHTML = html;
  area.appendChild(line);
  while (area.children.length > FLOAT_MAX) area.removeChild(area.firstChild);
  setTimeout(() => line.remove(), 2600);
}

// 「<色付き名前>を獲得 (出どころ)」の定型フロート。
function gainFloat(name, color, source = null) {
  floatNotify(
    `<b style="color:${color}">${name}</b>を獲得` +
      (source ? `<span class="float-src">(${source})</span>` : ""),
  );
}

// ---- 獲得演出バナー ----
// ★3以上の獲得(ドロップ・合成・配合)で画面中央に祝福バナーを出す。★5以上はメガ演出。
const CELEBRATE_MIN_STARS = 4; // ★4以上だけ中央バナー(それ未満はフロートのみ=邪魔しない)
let lootTimer = null;

// persistent=true: 自動で消さず、閉じるボタンを押すまで表示し続ける
// (2026-08-10 FB「新機能解放の表示が消えるのが早い。閉じるまで消えないように」)
function celebrateLoot({ kicker, icon, title, sub, rarity, persistent = false }) {
  sfx("banner");
  const rm = RARITY_META[rarity];
  const ov = $("loot-overlay");
  ov.style.setProperty("--loot-color", rm.color);
  ov.style.setProperty("--loot-glow", rm.glow);
  $("loot-kicker").textContent = kicker;
  const iconEl = $("loot-icon");
  iconEl.innerHTML = "";
  if (typeof icon === "string") iconEl.textContent = icon;
  else iconEl.appendChild(icon);
  $("loot-stars").textContent = "★".repeat(rm.stars);
  $("loot-title").textContent = title;
  $("loot-sub").innerHTML = sub;
  $("loot-close").classList.toggle("hidden", !persistent);
  // アニメーションを最初から再生し直す
  ov.classList.add("hidden");
  ov.classList.toggle("mega", rm.stars >= 5);
  void ov.offsetWidth;
  ov.classList.remove("hidden");
  clearTimeout(lootTimer);
  if (!persistent) {
    lootTimer = setTimeout(() => ov.classList.add("hidden"), 1500 + rm.stars * 150);
  }
}

$("loot-close")?.addEventListener("click", () => $("loot-overlay").classList.add("hidden"));

// 装備獲得の共通演出(ドロップ・キューブ合成)。履歴にも残す。
function celebrateItem(item, kicker) {
  const irm = RARITY_META[item.rarity];
  addLog(state, {
    kind: kicker,
    rarity: item.rarity,
    text: `${item.name} — ${item.opts.map(describeOpt).join(" / ")}`,
  });
  if (openOrder.includes("log")) renderLog();
  gainFloat(item.name, irm.color);
  if (irm.stars >= CELEBRATE_MIN_STARS) {
    // そうてい相場をバナーに出す: 「売れるかも」の期待が獲得の興奮になる
    const hot = itemQuality(item) >= 0.85;
    celebrateLoot({
      kicker,
      icon: itemIconCanvas(item, 52),
      title: item.name,
      sub: `${irm.label}<br>${item.opts.map(describeOpt).join("<br>")}`,
      rarity: item.rarity,
    });
  }
}

// 卵獲得の共通演出(ドロップ・配合)。履歴にも残す。
function celebrateEgg(egg, kicker, source = null) {
  const rm = RARITY_META[egg.rarity];
  addLog(state, { kind: kicker, rarity: egg.rarity, text: `${rm.label}の卵` });
  gainFloat(`${rm.label}の卵`, rm.color, source);
  if (openOrder.includes("log")) renderLog();
  // パス卵の上振れ(2026-07-29: 3%で1段上)。当たった瞬間は星数に関係なく必ず祝う
  if (egg.passUpgraded) {
    celebrateLoot({
      kicker: "上振れ!!",
      icon: spriteCanvas(eggSprite(egg.rarity), 52),
      title: `${rm.label}の卵`,
      sub: "3%の当たり — 表記より1段上のレア度!",
      rarity: egg.rarity,
    });
    sfx("banner");
    return;
  }
  if (rm.stars >= CELEBRATE_MIN_STARS) {
    celebrateLoot({
      kicker,
      icon: spriteCanvas(eggSprite(egg.rarity), 52),
      title: `${rm.label}の卵`,
      sub: "卵タブで 孵化しよう",
      rarity: egg.rarity,
    });
  }
}

// ---- セーブ ----
function save() {
  state.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY, serialize(state));
}
setInterval(save, 5000);
// バックアップは1分ごと(メインが破損したときの復旧元。少し古くても壊れていないことが大事)
setInterval(() => {
  const main = localStorage.getItem(SAVE_KEY);
  if (main && deserialize(main)) localStorage.setItem(BACKUP_KEY, main);
}, 60_000);

// 孵化装置のカウントダウン(2026-07-29)。卵窓が開いているときだけ毎秒、
// 装置の残り時間表示と「うまれる!」への切り替わりを更新する。
// renderEggs全体の再描画はツールチップ表示中に困るので、タイマー部分だけ触る
setInterval(() => {
  if (!openOrder.includes("eggs")) return;
}, 1000);
window.addEventListener("beforeunload", save);

// 検証モードの切替(2026-07-26 / 2026-07-27に製品ゲートを追加)。
// Ctrl+Shift+D で 🧪検証用パネルの表示をON/OFFする。
//
// **鍵ごと製品から外すこと**が要点。以前は3キーのリスナーを無条件に登録していたが、
// 検証パネルには「🎁 有料含め全開放」があるので、誰でも3キーで有料DLC・
// プレミアムパス・限定テーマをタダにできる状態だった(F2P+DLC販売なので実害が大きい)。
// いまは起動引数 `--tbm-dev` が付いた環境でしかリスナーを登録しない。
// 効果側(dlc.js/state.js)も devUnlockActive() で同じ許可を見るので、
// フラグ入りのセーブを持ち込まれても許可のない環境では効かない。
if (isDevAllowed()) {
  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || !e.shiftKey || e.code !== "KeyD") return;
    e.preventDefault();
    const on = localStorage.getItem("tbm-dev") !== "1";
    if (on) localStorage.setItem("tbm-dev", "1");
    else localStorage.removeItem("tbm-dev");
    toast(on ? "🧪 検証モード ON(地図に検証用パネルが出る)" : "🧪 検証モード OFF", on ? "#8af0a8" : "#9aa4c8");
    if (openOrder.includes("map")) keepScroll(renderMap);
  });
}

// ---- マップ(ステージ選択) ----
// バイオームは battle-scene と同じ10ステージ周期(草原/洞窟/火山/雪原)
const BIOME_NAMES = ["草原", "洞窟", "火山", "雪原"]; // 漢字表記(2026-07-21 FB)

// TBHのポータルを再現: モード帯 → 幕タブ → 羊皮紙の地図に縦に蛇行するステージノード。
// ノードは下から上へ [幕-面] 形式。現在地は赤旗+緑リング、未到達はロック。
let portalArea = null; // 表示中の幕(null = 現在地の幕)

function renderMap() {
  if (throttleRender(renderMap)) return;
  const body = $("map-body");
  body.innerHTML = "";

  const curArea = Math.floor((state.stage - 1) / 10);
  const maxArea = Math.floor((maxStageOf(state) - 1) / 10);
  // 全10幕まで到達に応じて表示(旧: 3幕固定キャップ→第4幕以降が選べないバグ 2026-07-12)
  const shownAreas = Math.min(STAGES_PER_DIFFICULTY / 10, maxArea + 1);
  if (portalArea === null || portalArea > maxArea) portalArea = curArea;

  // 難易度帯(ノーマル→ナイトメア→ヘル→トーメント。前の10-10クリアで解放)
  const mode = document.createElement("div");
  mode.className = "portal-mode";
  for (const dm of DIFFICULTIES) {
    const pill = document.createElement("button");
    const unlocked = difficultyUnlocked(state, dm.id);
    pill.className =
      "portal-mode-pill" + (state.difficulty === dm.id ? " on" : "") + (unlocked ? "" : " locked");
    pill.textContent = unlocked ? `⚔ ${dm.name}` : `🔒 ${dm.name}`;
    pill.style.color = unlocked ? dm.color : "";
    pill.title = unlocked
      ? `${dm.name}(実効ステージ ${dm.id * STAGES_PER_DIFFICULTY + 1}〜${(dm.id + 1) * STAGES_PER_DIFFICULTY}相当の強さと報酬)`
      : "前の難易度の 10-10(幕ボス)をクリアで解放";
    pill.addEventListener("click", () => {
      if (state.difficulty === dm.id) return;
      const result = setDifficulty(state, dm.id);
      if (result.error) {
        toast(result.error);
        return;
      }
      interruptDailyBoss(); // 戦闘中のデイリーボスは挑戦権を返して中断(黙って上書きしない)
      portalArea = null;
      playerHp = partyMaxHp();
      playerAttackTimer = 0;
      enemyAttackTimer = 0;
      scene.setStage(state.stage);
      spawnWave();
      toast(`難易度を ${dm.name} に切り替えた(${stageLabel(state.stage)} から)`, dm.color);
      renderMap();
      renderHud();
      save();
    });
    mode.appendChild(pill);
  }
  body.appendChild(mode);

  // デイリーボス(1日2回・午前/午後): 勝てば激レア報酬のチャンス
  const daily = document.createElement("div");
  daily.className = "portal-daily";
  const remainAM = dailyBossAvailable(state, new Date().setHours(6));
  const remainPM = dailyBossAvailable(state, new Date().setHours(18));
  const remainNow = dailyBossAvailable(state);
  const dailyBtn = document.createElement("button");
  dailyBtn.className = "portal-daily-btn" + (remainNow ? " ready" : "");
  // 推奨戦力(2026-07-11 FB): 敵ATK×2.5/HP×10のボスなので通常目安の1.5倍を推奨として表示
  const dailyRec = Math.round(recommendedPower(effectiveStage(state)) * 1.5);
  const myPw = partyMonsters(state).reduce((s, m) => s + powerScore(m), 0);
  const recHtml = `<span class="daily-rec ${myPw >= dailyRec ? "ok" : "low"}">推奨戦力 ${formatNum(dailyRec)}(現在 ${formatNum(myPw)})</span>`;
  dailyBtn.innerHTML = remainNow
    ? `👹 ${dailyBossVariant()?.name ?? "デイリーボス"}に挑む <small>勝てば激レア報酬のチャンス・今日 ${(remainAM ? 1 : 0) + (remainPM ? 1 : 0)}回</small>${recHtml}`
    : `👹 デイリーボス <small>${new Date().getHours() < 12 ? "午後にまた挑める" : "また明日(午前/午後で各1回)"}</small>${recHtml}`;
  dailyBtn.disabled = !remainNow || dailyBossActive;
  dailyBtn.addEventListener("click", () => {
    if (!consumeDailyBoss(state)) {
      toast("今はデイリーボスに挑めない(午前/午後で各1回)");
      return;
    }
    spawnDailyBoss();
    renderMap();
    renderHud();
    save();
  });
  daily.appendChild(dailyBtn);
  body.appendChild(daily);

  // 鍵の自動周回トグル(2026-07-18 FB「鍵の周回ありなし選択」)。
  // OFF(既定): クリア済みの幕ボスの間へは自動入場しない=x-9周回中に鍵が黙って減らない。
  // 未クリアのボスへの自動入場(進行)は設定に関わらず従来どおり
  const keyOpt = document.createElement("label");
  keyOpt.className = "portal-keyfarm";
  const keyChk = document.createElement("input");
  keyChk.type = "checkbox";
  keyChk.checked = !!state.settings.keyFarm;
  keyOpt.appendChild(keyChk);
  keyOpt.appendChild(
    document.createTextNode(" 🗝 クリア済みの幕ボスも鍵で自動周回する"),
  );
  keyOpt.title =
    "ON: 手前の面(x-9)をクリアするたび鍵を1本使って幕ボスの間へ自動入場する\nOFF: クリア済みの間には地図から手動で入る(鍵の節約)。はじめての幕ボスへは設定に関わらず自動で挑む";
  keyChk.addEventListener("change", () => {
    state.settings.keyFarm = keyChk.checked;
    toast(
      keyChk.checked
        ? "🗝 クリア済みの幕ボスにも鍵で自動入場する(周回あり)"
        : "🗝 クリア済みの幕ボスへの自動入場をやめた(地図から手動で)",
      "#ffcf4a",
    );
    save();
  });
  body.appendChild(keyOpt);

  // 幕タブ
  const tabs = document.createElement("div");
  tabs.className = "portal-tabs";
  for (let a = 0; a < shownAreas; a++) {
    const tab = document.createElement("button");
    tab.className = "portal-tab" + (a === portalArea ? " on" : "");
    tab.textContent = `第${a + 1}幕`;
    tab.addEventListener("click", () => {
      portalArea = a;
      renderMap();
    });
    tabs.appendChild(tab);
  }
  body.appendChild(tabs);

  // 羊皮紙の地図
  const map = document.createElement("div");
  map.className = "portal-map";
  const ribbon = document.createElement("div");
  ribbon.className = "portal-ribbon";
  ribbon.textContent = `第${portalArea + 1}幕 ${BIOME_NAMES[portalArea % BIOME_NAMES.length]}`;
  map.appendChild(ribbon);
  // 幕ごとの地形すかし(羊皮紙に薄く大きく描く)
  const deco = document.createElement("div");
  deco.className = "portal-deco";
  deco.textContent = ["🌲", "🏜", "🌋", "🏔", "🌊", "🏰"][portalArea % 6];
  map.appendChild(deco);

  const trail = document.createElement("div");
  trail.className = "portal-trail";
  // 下から上へ [a-1]→[a-10]。左右に蛇行させる
  for (let i = 9; i >= 0; i--) {
    const s = portalArea * 10 + i + 1;
    const row = document.createElement("div");
    row.className = "portal-row";
    row.style.paddingLeft = `${34 + Math.sin(i * 1.05) * 26}px`;

    const node = document.createElement("button");
    node.className = "portal-node";
    const isBossNode = i === 9; // 各幕の最後(x-10)は幕ボスの間
    if (isBossNode) node.classList.add("boss-node");
    const gim = stageGimmick(state.difficulty ?? 0, s); // 難所(ナイトメア以降 4-5/8-5)
    if (gim) node.classList.add("gimmick-node");
    const label = `${portalArea + 1}-${i + 1}`;
    // 幕ボスの間は「手前の面に到達していれば」鍵で入れる(進行が鍵待ちでも挑める)
    const reachable = s <= maxStageOf(state) || (isBossNode && s - 1 <= maxStageOf(state));
    if (!reachable) {
      node.classList.add("locked");
    } else if (s === state.stage) {
      node.classList.add("current");
      // 「▶ いまここ」はDOMで入れる(CSS contentだと自動翻訳が届かない)
      node.innerHTML = `<span class="portal-here">🚩 いまここ</span>`;
    } else if (s < state.stage || s <= maxStageOf(state)) {
      node.classList.add("cleared");
    }
    if (isBossNode) {
      const crown = document.createElement("span");
      crown.className = "portal-boss-mark";
      crown.textContent = "👑";
      node.appendChild(crown);
    }
    if (gim) {
      const mark = document.createElement("span");
      mark.className = "portal-gimmick-mark";
      mark.textContent = gim.icon;
      node.appendChild(mark);
    }
    const tag = document.createElement("span");
    tag.className = "portal-node-label";
    tag.innerHTML =
      `[${label}]` +
      (isBossNode ? ` 👑BOSS(${keyIconHtml(state.difficulty ?? 0, 13)})` : "") +
      (gim ? ` <span class="portal-gimmick-tag">⚠${gim.name}</span>` : "");
    // 現在地ノードにはライブ進行(WAVE/討伐数)を出す。中身は liveMapFollow が
    // 毎秒文字だけ差し替える(2026-07-30 FB「リアルタイムに更新して今いる場所を表示」)
    if (s === state.stage) {
      const live = document.createElement("span");
      live.className = "portal-live";
      live.textContent = mapLiveText();
      tag.appendChild(live);
    }
    if (reachable) {
      bindCellTooltip(
        node,
        () => {
          const se = stageElement(s);
          const ce = counterElement(se);
          const effS = (state.difficulty ?? 0) * STAGES_PER_DIFFICULTY + s;
          const pw = partyMonsters(state).reduce((sum, m) => sum + powerScore(m), 0);
          const rec = recommendedPower(effS);
          const pwColor = pw >= rec ? "#8af0a8" : "#ff8a7a";
          return (
            `<div class="tt-name">ステージ ${label}</div>` +
            `<div class="tt-opts">目安戦力 <b style="color:${pwColor}">${formatNum(rec)}</b>(今のパーティ ${formatNum(pw)})<br>` +
            `敵HP ${formatNum(enemyMaxHp(effS))} ・ 攻撃 ${formatNum(enemyAtk(effS))}<br>` +
            `ゴールド ${formatNum(goldRewardOf(effS))}/体<br>` +
            `支配属性 <b style="color:${ELEMENT_META[se].color}">${ELEMENT_META[se].label}</b>` +
            (ce ? ` → <b style="color:${ELEMENT_META[ce].color}">${ELEMENT_META[ce].label}</b>属性が刺さる` : "") +
            `<br>` +
            (gim
              ? `<span style="color:${gim.kind === "abyss" ? "#ff6a8a" : "#ff9a5a"}">${gim.icon} 難所「${gim.name}」: ${gimmickHint(gim, ce)}</span><br>`
              : "") +
            (isBossNode
              ? `<span style="color:#ffcf4a">👑 幕ボスの間: 入場に🗝1本・ウェーブなしのボス一騎打ち・ボス箱確定(初回×2)</span>`
              : `👑 最後の1体は中ボス`) +
            `</div>` +
            `<div class="tt-hint">${s === state.stage ? "いまここ" : isBossNode ? `🗝${keyLabelOf(state.difficulty ?? 0)}を1本使って入る(所持 ${bossKeyCount(state, state.difficulty ?? 0)})` : "クリックで 入る"}</div>`
          );
        },
        () => {
          hideTooltip(true);
          onSelectStage(s);
        },
      );
    }
    row.appendChild(node);
    row.appendChild(tag);
    // 周回トグル: このステージを farm しつづける(クリアしても進まず同じ面へ戻る)。
    // 幕ボスの間はクリア済みなら周回できる(2026-07-19 FB。1周ごとに🗝1本消費)
    const bossLoopOk = isBossStage(s) && s <= bossClearedOf(state);
    if (s <= maxStageOf(state) && (!isBossStage(s) || bossLoopOk)) {
      const looping = state.settings.loopStage === s;
      const loopBtn = document.createElement("button");
      loopBtn.className = "portal-loop" + (looping ? " on" : "");
      loopBtn.textContent = "🔁";
      loopBtn.title = looping
        ? "周回をやめる(クリアで先へ進む)"
        : bossLoopOk
          ? "このボスを周回する(1周ごとに🗝1本消費・切れたら手前へ)"
          : "このステージを周回する";
      loopBtn.addEventListener("click", () => {
        if (looping) {
          state.settings.loopStage = null;
          toast("周回をやめた(クリアで先へ進む)");
        } else {
          state.settings.loopStage = s;
          state.missionCounters = state.missionCounters ?? {};
          state.missionCounters.loopUsed = (state.missionCounters.loopUsed ?? 0) + 1;
          if (state.stage !== s) onSelectStage(s);
          toast(`STAGE ${stageLabel(s)} を周回モードにした 🔁`, "#ffcf4a");
        }
        renderMap();
        renderHud();
        save();
      });
      row.appendChild(loopBtn);
    }
    trail.appendChild(row);
  }
  map.appendChild(trail);
  body.appendChild(map);

  // ---- 検証用ブースト ----
  // 製品ゲート(2026-07-26 導入 / 2026-07-27 に二重化)。
  // このパネルには「🎁 有料含め全開放」があり、出荷ビルドで開けてしまうと
  // **誰でも有料コンテンツを無料にできる**。条件は2つとも必要:
  //   ① isDevAllowed() = 起動引数 --tbm-dev が付いている(プレイヤーの手元では立たない)
  //   ② localStorage の tbm-dev = 許可された環境の中での ON/OFF(Ctrl+Shift+D)
  // 撮影モードでも出さない(ストアスクショに「🧪検証用」が写る事故防止 2026-07-24)
  // (returnにしない: この後に「現在地へスクロール」があり、飛ばすと地図の挙動が変わる)
  if (isDevAllowed() && localStorage.getItem("tbm-dev") === "1" && !window.__hideDebugForShot) {
  const dbg = document.createElement("div");
  dbg.className = "debug-boosts";
  dbg.innerHTML = `<div class="debug-boosts-head">🧪 検証用ブースト(×${DEBUG_BOOST_MULT}。テスト専用)</div>`;
  const dbgRow = document.createElement("div");
  dbgRow.className = "debug-boosts-row";
  for (const [key, label] of [
    ["egg", "🥚 卵ドロップ"],
    ["exp", "⭐ 経験値"],
    ["gold", "💰 ゴールド"],
  ]) {
    const b = document.createElement("button");
    const refresh = () => {
      const on = !!state.debugBoosts?.[key];
      b.className = "debug-boost-btn" + (on ? " on" : "");
      b.textContent = `${label}: ${on ? "ON" : "OFF"}`;
    };
    refresh();
    b.addEventListener("click", () => {
      const on = toggleDebugBoost(state, key);
      toast(`🧪 ${label}ブースト ${on ? "ON(×" + DEBUG_BOOST_MULT + ")" : "OFF"}`, on ? "#8af0a8" : "#9aa4c8");
      refresh();
      save();
    });
    dbgRow.appendChild(b);
  }
  dbg.appendChild(dbgRow);
  // 倍速モード(2026-07-13 FB「検証用に倍速モードを追加。2倍、5倍、10倍」)
  const spdRow = document.createElement("div");
  spdRow.className = "debug-boosts-row";
  const spdBtns = [];
  for (const mult of [1, 2, 5, 10]) {
    const b = document.createElement("button");
    const refresh = () => {
      const cur = state.debugBoosts?.speed || 1;
      b.className = "debug-boost-btn" + (cur === mult ? " on" : "");
      b.textContent = mult === 1 ? "⏩ 等速" : `⏩ ×${mult}`;
    };
    refresh();
    b.addEventListener("click", () => {
      state.debugBoosts = state.debugBoosts ?? {};
      state.debugBoosts.speed = mult;
      toast(`🧪 倍速モード ${mult === 1 ? "OFF(等速)" : "×" + mult}(戦闘・CD・演出・卵タイマーが加速)`, mult === 1 ? "#9aa4c8" : "#8af0a8");
      for (const fn of spdBtns) fn();
      save();
    });
    spdBtns.push(refresh);
    spdRow.appendChild(b);
  }
  dbg.appendChild(spdRow);
  // 検証用その3(2026-07-21 FB): 探索の即時完了+細工無料。テスト専用
  const utilRow = document.createElement("div");
  utilRow.className = "debug-boosts-row";
  const expedBtn = document.createElement("button");
  expedBtn.className = "debug-boost-btn";
  expedBtn.textContent = "🧭 探索を即時完了";
  expedBtn.addEventListener("click", () => {
    const flying = expeditionsOf(state);
    if (!flying.length) return void toast("探索隊は 出ていない");
    for (const ex of flying) ex.startedAt = Date.now() - (ex.hours ?? 12) * 3600000;
    toast("🧪 探索を即時完了にした(探索窓で受け取れる)", "#8af0a8");
    if (openOrder.includes("exped")) renderExpedition();
    renderHud();
    save();
  });
  utilRow.appendChild(expedBtn);
  // 記念コインを配る(2026-07-22 コイン投入口の検証用)。コインは実測1万キルに1枚級で
  // 落ちる貴重品なので、手で確かめる手段がないとUIを検品できない
  const coinBtn = document.createElement("button");
  coinBtn.className = "debug-boost-btn";
  coinBtn.textContent = "🪙 記念コイン+3";
  coinBtn.addEventListener("click", () => {
    state.coins = state.coins ?? {};
    for (const c of GACHA_COINS) state.coins[c.id] = (state.coins[c.id] ?? 0) + 3;
    toast("🧪 記念コインを 各3枚 足した", "#8af0a8");
    if (openOrder.includes("compound")) renderCompound();
    renderHud();
    save();
  });
  utilRow.appendChild(coinBtn);
  // 撮影・検証用: 合成素材(コモン装備9個=1回ぶん)を配る。
  // 実プレイの産出は1時間1個程度で、撮影時間内に9個は物理的に貯まらない
  const matBtn = document.createElement("button");
  matBtn.className = "debug-boost-btn";
  matBtn.textContent = "🧰 コモン装備+9";
  matBtn.addEventListener("click", () => {
    for (let i = 0; i < 9; i++) state.items.push(rollItemOfRarity("common", Math.random, 10));
    toast("🧪 コモン装備を 9個 足した(合成1回分)", "#8af0a8");
    if (openOrder.includes("cube")) renderCube();
    if (openOrder.includes("items")) renderItems();
    renderHud();
    save();
  });
  utilRow.appendChild(matBtn);
  // 撮影・検証用: 宝箱の在庫を配る。通常ドロップは4.5%/撃破しかないので、
  // 撮影時間(十数秒)では「連続開封」の絵に必要な数が物理的に貯まらない
  const chestBtn = document.createElement("button");
  chestBtn.className = "debug-boost-btn";
  chestBtn.textContent = "🎁 宝箱+12";
  chestBtn.addEventListener("click", () => {
    const eff = effectiveStage(state);
    for (let i = 0; i < 4; i++) {
      state.chests.push({
        id: `chest_dbg_${Date.now()}_${i}`,
        kind: "boss",
        item: rollBossChestItem(eff, Math.random),
        obtainedAt: Date.now(),
      });
    }
    for (let i = 0; i < 8; i++) {
      const item = rollNormalChestItem(eff, Math.random);
      state.chests.push({
        id: `chest_dbgn_${Date.now()}_${i}`,
        kind: item.rarity === "common" ? "wood" : "rare",
        item,
        obtainedAt: Date.now(),
      });
    }
    toast("🧪 宝箱を 12個 足した(ボス4+通常8)", "#8af0a8");
    renderHud();
    save();
  });
  utilRow.appendChild(chestBtn);
  // 検証・撮影用: 進化石を配る(2026-07-28 進化石ゲート導入に伴い必須。
  // 実プレイの産出は時間あたり数個なので、撮影時間内には貯まらない)
  const stoneBtn = document.createElement("button");
  stoneBtn.className = "debug-boost-btn";
  stoneBtn.textContent = "🪨 進化石+5";
  stoneBtn.addEventListener("click", () => {
    for (const kind of EVO_STONE_ROLES) addEvoStone(state, kind, 5);
    addEvoStone(state, "random", 3);
    toast("🧪 進化石を配った(各ロール+5・ランダム+3)", "#8af0a8");
    if (openOrder.includes("items")) renderItems();
    save();
  });
  utilRow.appendChild(stoneBtn);
  // 撮影用: 進化のランダム枠を隠し職に固定(セッション限定・セーブに残らない)。
  // 抽選は個体IDの決定的ハッシュ(1%)なので、狙って撮る手段がこれしかない
  const hidBtn = document.createElement("button");
  const refreshHid = () => {
    hidBtn.className = "debug-boost-btn" + (devFlags.forceHiddenEvo ? " on" : "");
    hidBtn.textContent = "🎭 進化候補=隠し職";
  };
  refreshHid();
  hidBtn.addEventListener("click", () => {
    devFlags.forceHiddenEvo = !devFlags.forceHiddenEvo;
    toast(`🧪 進化のランダム枠を隠し職に固定 ${devFlags.forceHiddenEvo ? "ON" : "OFF"}`, devFlags.forceHiddenEvo ? "#8af0a8" : "#9aa4c8");
    refreshHid();
  });
  utilRow.appendChild(hidBtn);
  const freeBtn = document.createElement("button");
  const refreshFree = () => {
    freeBtn.className = "debug-boost-btn" + (state.settings.debugFreeEnhance ? " on" : "");
    freeBtn.textContent = "🗿 細工無料";
  };
  refreshFree();
  freeBtn.addEventListener("click", () => {
    state.settings.debugFreeEnhance = !state.settings.debugFreeEnhance;
    toast(`🧪 細工無料 ${state.settings.debugFreeEnhance ? "ON(抽選0G)" : "OFF"}`, state.settings.debugFreeEnhance ? "#8af0a8" : "#9aa4c8");
    refreshFree();
    if (openOrder.includes("cube")) renderCube();
    save();
  });
  utilRow.appendChild(freeBtn);
  // 有料コンテンツ全開放(2026-07-24 FB「最終検証用に有料コンテンツ含め全部見れるように」)。
  // DLC所有判定/機能の段階的開放/難易度の解放を一括で通す検証スイッチ。
  // 実体は settings.debugUnlockAll の1フラグで、判定側(dlc.js/state.js)が見る
  const allBtn = document.createElement("button");
  const refreshAll = () => {
    allBtn.className = "debug-boost-btn" + (state.settings.debugUnlockAll ? " on" : "");
    allBtn.textContent = "🎁 有料含め全開放";
  };
  refreshAll();
  allBtn.addEventListener("click", () => {
    state.settings.debugUnlockAll = !state.settings.debugUnlockAll;
    const on = state.settings.debugUnlockAll;
    toast(
      on
        ? "🧪 全開放 ON(パス/スターターの有料テーマ・称号・全機能・全難易度が使える)"
        : "🧪 全開放 OFF(通常の所有判定に戻る)",
      on ? "#8af0a8" : "#9aa4c8",
    );
    refreshAll();
    window.__rebuildBarTabs?.(true);
    // 開いている窓を**全部**描き直す。以前は地図とHUDだけを更新していたので、
    // パス窓を開いたままトグルしても有料トラックがロック表示のまま残っていた
    // (2026-07-26 FB「バトルパスとか有料UIとか解放されてなかったよ」)。
    // 所有判定はテーマ・称号・パス・ガチャ・交易船と広範囲に効くため、
    // 個別に列挙すると必ず取りこぼす。既存の renderers 表を使って一括で回す
    keepScroll(() => {
      for (const id of openOrder) {
        try {
          renderers[id]?.();
        } catch (e) {
          console.warn("unlockAll re-render failed:", id, e);
        }
      }
    });
    renderHud();
    save();
  });
  utilRow.appendChild(allBtn);
  dbg.appendChild(utilRow);

  // ---- 検証用その4(2026-07-25 FB「最終調整するから有料コンテンツ含め全部検証用に」) ----
  // 「全開放」だけでは終盤を実際に触れない。難所(深淵/巨壁)の手応えを確かめるには
  //   ①その場所まで行ける ②耐えられる戦力がある ③鍵と水晶がある
  // の3つが要る。到達に20日かかる物を手で作れないと最終調整そのものができないので、
  // 検証用に一括で用意する。全部このパネル(撮影モードでは非表示)からしか触れない
  const endRow = document.createElement("div");
  endRow.className = "debug-boosts-row";

  const jumpBtn = document.createElement("button");
  jumpBtn.className = "debug-boost-btn";
  jumpBtn.textContent = "🗺 全ステージ到達済みに";
  jumpBtn.addEventListener("click", () => {
    state.maxStageD = [100, 100, 100, 100];
    state.bossClearedD = [100, 100, 100, 100];
    toast("🧪 全難易度を到達済みにした(地図から難所へ直接飛べる)", "#8af0a8");
    window.__rebuildBarTabs?.(true);
    renderMap();
    renderHud();
    save();
  });
  endRow.appendChild(jumpBtn);

  // 図鑑を全登録(2026-08-05)。図鑑は「捕まえた種族だけ」を出す仕様(2026-08-01の軽量化)
  // なので、終盤パーティを作っても中身は空のまま=図鑑バフも確率表も検証できないし、
  // 広報の「156種以上」の絵も撮れない(実際に真っ黒な図鑑のShortsを作ってしまった)
  const dexBtn = document.createElement("button");
  dexBtn.className = "debug-boost-btn";
  dexBtn.textContent = "📖 図鑑を全登録";
  dexBtn.addEventListener("click", () => {
    let n = 0;
    for (const id of Object.keys(SPECIES)) if (registerDex(state, id)) n++;
    toast(`🧪 図鑑に${n}種を登録した(全${Object.keys(SPECIES).length}種)`, "#8af0a8");
    if (openOrder.includes("dex")) renderDex();
    renderHud();
    save();
  });
  endRow.appendChild(dexBtn);

  const keyBtn = document.createElement("button");
  keyBtn.className = "debug-boost-btn";
  keyBtn.textContent = "🗝 鍵・水晶+10";
  keyBtn.addEventListener("click", () => {
    for (let d = 0; d < DIFFICULTIES.length; d++) for (let i = 0; i < 10; i++) addBossKey(state, d);
    for (let i = 0; i < 10; i++) addCrystal(state);
    toast("🧪 各難易度の鍵と叡智の水晶を10個ずつ足した", "#8af0a8");
    renderHud();
    if (openOrder.includes("box")) renderBox();
    save();
  });
  endRow.appendChild(keyBtn);

  // 終盤パーティ: 難所の被ダメ倍率(深淵3.8倍)を実際に食らって確かめるための戦力。
  // 属性防御(elemDef)を上限ぶん積んだ細工つき装備を全部位に付けるので、
  // 「属性防御を盛れば通れる/盛らないと死ぬ」の境目をその場で比較できる
  const partyBtn = document.createElement("button");
  partyBtn.className = "debug-boost-btn";
  partyBtn.textContent = "⚔ 終盤パーティを作る";
  partyBtn.addEventListener("click", () => {
    const made = grantDebugEndgameParty(state);
    toast(`🧪 Lv${LEVEL_CAP}のコズミック3体+属性防御つき装備一式を用意した(${made}体)`, "#8af0a8");
    window.__rebuildBarTabs?.(true);
    renderBox();
    renderHud();
    save();
  });
  endRow.appendChild(partyBtn);

  // パスEXPを進める(2026-07-26)。「全開放」だけではパスを検証できない:
  // ランク0だと受け取れる段が1つも無いので、押しても何も起きず
  // 「開放されていない」ように見える(実際にその報告を受けた)。
  // 任務でEXPを貯めるには実時間で何日もかかるため、検証用に直接進める
  const passBtn = document.createElement("button");
  passBtn.className = "debug-boost-btn";
  passBtn.textContent = "🎖 パスEXP+5段";
  passBtn.addEventListener("click", () => {
    const p = passState(state);
    p.exp = Math.min(PASS_MAX_TIER * PASS_TIER_EXP, p.exp + 5 * PASS_TIER_EXP);
    toast(`🧪 パスEXPを足した(ランク ${passTier(state)}/${PASS_MAX_TIER})`, "#8af0a8");
    if (openOrder.includes("pass")) keepScroll(renderPass);
    renderHud();
    save();
  });
  endRow.appendChild(passBtn);
  dbg.appendChild(endRow);
  body.appendChild(dbg);
  } // __hideDebugForShot
  // いまいるステージ(🚩)を画面内へ(2026-07-13 FB「いまいるステージの場所を表示」)。
  // ただし**ユーザーが自分でスクロールした位置は奪わない**(2026-07-29 FB「検証部分に
  // スクロールすると勝手に元の位置に戻る」: 撃破・解放イベントのたびに renderMap が
  // 走り、毎回ここで現在地へ飛ばされていた)。前回のスクロール位置を復元し、
  // 現在地への自動ジャンプは「開いた直後」と「ステージが変わったとき」だけにする
  const stageKey = `${state.difficulty ?? 0}:${state.stage}`;
  renderMap._liveKey = stageKey; // liveMapFollow(毎秒の現在地追従)の比較キー
  // 直近10秒以内に手でスクロールしていたら、ステージが進んでも奪わない
  // (周回中は数十秒ごとに進むので、猶予なしだと検証パネルが読めない)
  const userBusy = Date.now() - (renderMap._userScrollAt ?? 0) < 10_000;
  if (renderMap._lastScroll != null && (renderMap._stageKey === stageKey || userBusy)) {
    body.scrollTop = renderMap._lastScroll;
    renderMap._stageKey = stageKey;
  } else {
    renderMap._stageKey = stageKey;
    requestAnimationFrame(() => {
      body.querySelector(".portal-node.current")?.scrollIntoView({ block: "center", behavior: "instant" });
    });
  }
  if (!renderMap._scrollHooked) {
    renderMap._scrollHooked = true;
    body.addEventListener("scroll", () => {
      renderMap._lastScroll = body.scrollTop;
      renderMap._userScrollAt = Date.now();
    });
  }
}

// ---- 目安箱(2026-07-15) ----
// プレイヤーの声を集めて、AIが週次でまとめ、実装して、結果を返す。
// 「ユーザーが作り上げるゲーム」を運営の手間を増やさずに成立させるための入口。
//
// 設計上の要点:
//  ・他人の投稿は絶対に表示しない。一覧を見せた瞬間にUGCとなりモデレーション義務
//    (誹謗中傷・未成年保護・マーケットがあるため詐欺誘導)が発生し、1人開発では
//    24時間の監視当番を背負うことになる。入口は開けて、出口は閉じる。
//  ・表示するのはAIが書いた要約と結果だけなので、表示物がUGCにならない。
//  ・約束するのは「実装」ではなく「毎週の返事」。返事はAIのクラスタ結果を出すだけで
//    コストがほぼゼロなうえ、絶対に破れない約束になる。
let meyasuCategory = MEYASUBAKO_CATEGORIES[0].id;
let meyasuDraft = "";
let meyasuReport = null;
let meyasuReportLoaded = false;
// 直近の実行時エラーを1件だけ覚えておく(バグ報告に自動添付する)。
// これがあると「ヘル7-3・Lv62・この編成で落ちた」が再現条件つきで流れてくる。
let lastRuntimeError = null;
window.addEventListener("error", (e) => {
  lastRuntimeError = String(e.error?.stack ?? e.message ?? "").slice(0, 200);
});
window.addEventListener("unhandledrejection", (e) => {
  lastRuntimeError = String(e.reason?.stack ?? e.reason ?? "").slice(0, 200);
});

// ---- ミッション窓(2026-07-31 友人テストFB: 段階制チュートリアル) ----
// 挑戦中の1ミッションだけを見せる(全部並べると初心者向けの導線にならない)。
// v4(2026-08-04): クエストは各5つ・個別報酬なし・達成は✓表示のみ。
// 3つ全部達成でミッション達成報酬(ここに報酬を集約)→次のミッションが開く(v5)
function renderMission() {
  if (throttleRender(renderMission)) return;
  const body = $("mission-body");
  if (!body) return;
  const sc = body.scrollTop;
  body.innerHTML = "";
  const v = missionView(state);
  if (v.done) {
    body.innerHTML =
      `<div class="mission-alldone">🎉 全ミッション達成!<br><small>ここまで来たらもう一人前。あとは思うまま冒険しよう</small></div>`;
    return;
  }
  const m = v.mission;
  const head = document.createElement("div");
  head.className = "mission-head";
  head.innerHTML =
    `<div class="mission-no">ミッション${m.id}<small>/${v.total}</small></div>` +
    `<div class="mission-title">${m.title}</div>` +
    `<div class="mission-count">${v.quests.filter((q) => q.done).length}/${v.quests.length} 達成</div>`;
  body.appendChild(head);
  // クエスト行はv4(2026-08-04 Haru指示)で簡潔に: 1行=アイコン+名前+進捗+✓。
  // 説明(hint)は常設せず、装備と同じホバーのオーバーレイで見せる
  for (const q of v.quests) {
    const row = document.createElement("div");
    row.className = "mission-row" + (q.done ? " done" : "");
    const prog = q.prog && !q.done ? `<small class="mq-prog">${formatNum(q.prog.cur)}/${formatNum(q.prog.goal)}</small>` : "";
    row.innerHTML =
      `<span class="mq-ico">${q.icon}</span>` +
      `<span class="mq-main"><b>${q.label}</b>${prog}</span>` +
      `<span class="mq-state">${q.done ? "✓ 達成" : "…"}</span>`;
    const tip = (ev) =>
      showTooltip(
        `<div class="tt-name" style="color:${q.done ? "#8af0a8" : "#ffd67a"}">${q.icon} ${q.label}</div>` +
          `<div style="margin-top:3px">${q.hint}</div>` +
          (q.prog ? `<div class="tt-hint">進捗: ${formatNum(q.prog.cur)} / ${formatNum(q.prog.goal)}</div>` : "") +
          `<div class="tt-hint">${q.done ? "✓ 達成済み(取り消されない)" : "達成すると ✓ が付く"}</div>`,
        ev.clientX,
        ev.clientY,
      );
    row.addEventListener("mouseenter", tip);
    row.addEventListener("mousemove", tip);
    row.addEventListener("mouseleave", () => hideTooltip(true));
    body.appendChild(row);
  }
  // ミッション達成報酬の行(クエスト個別報酬は廃止=報酬はここに集約)
  const foot = document.createElement("div");
  const eggN = m.reward.egg ? (m.reward.eggs ?? 1) : 0;
  // 2026-08-07 FB「受け取って次のミッションへが押せない/進まない」: 3クエスト全部
  // 達成済みでもclaimMission側は卵報酬が卵枠に収まらないと黙ってエラーを返す仕様
  // (経済上、卵枠を無視して押し込むのは不可)。以前はボタンが「押せる見た目」の
  // まま裏でエラーが返り、トーストが一瞬光るだけだったので「反応しない」に見えた。
  // 卵枠が足りないことが分かっている間はボタン自体に理由を出し、達成済みなのに
  // 押せない不安を解消する(倉庫+80ボタンの「倉庫は最大」と同じ型)
  const eggBlocked = eggN > 0 && (state.eggs?.length ?? 0) + eggN > eggCapOf(state);
  foot.className = "mission-foot" + (v.allDone && !eggBlocked ? " ready" : "");
  foot.innerHTML = `<span>🎁 ミッション達成報酬: <b>${m.reward.label}</b></span>`;
  const mbtn = document.createElement("button");
  mbtn.className = "compound-do mission-claim-btn";
  if (!v.allDone) {
    mbtn.textContent = `${v.quests.length}つ全部達成すると開く`;
  } else if (eggBlocked) {
    mbtn.textContent = "🥚 卵の枠が満杯(卵タブで孵してから)";
  } else {
    mbtn.textContent = "🎁 受け取って次のミッションへ";
  }
  mbtn.disabled = !v.allDone || eggBlocked;
  mbtn.addEventListener("click", () => {
    const r = claimMission(state, {
      eggCapOf,
      addBossKey,
      // 進化石はリーダーの役割の石(チュートリアルの出口=最初の進化に直結)
      addStone: (st) => {
        const lead = st.monsters[st.party?.[0]] ?? Object.values(st.monsters)[0];
        addEvoStone(st, lead ? baseRoleType(lead) : "nuke", 1);
      },
    });
    if (r.error) return void toast(r.error, "#ff9a9a");
    // 2026-08-07 FB「受け取って次のミッションへが押せない/進まない」: 以前はsaveが
    // このハンドラの最後にあり、この下の演出/再描画のどこかで例外が起きると
    // save()まで届かず、達成は内部では成立しているのに保存されず、再読み込みで
    // ミッションが元に戻る(=見た目上「進まない」)という壊れ方をしていた。
    // state変更(claimMission)が終わった直後にsaveし、以降の見た目だけの処理は
    // 失敗しても達成そのものが失われないようにする
    save();
    try {
      sfx("banner");
      if (r.egg) {
        celebrateEgg(r.egg, "ミッション報酬");
        if (openOrder.includes("eggs")) renderEggs();
      }
      toast(`🎉 ミッション${r.missionId} 達成! ${m.reward.label} を受け取った`, "#ffd67a");
      updateMissionBadge();
      keepScroll(renderMission);
      renderHud();
    } catch (e) {
      console.error("ミッション受け取り後の演出/再描画で例外", e);
    }
  });
  foot.appendChild(mbtn);
  body.appendChild(foot);
  body.scrollTop = sc;
}

// タブの赤丸(受け取れる報酬があるとき)。イベントのたびに呼ぶと重いので
// renderHud と同じく軽量に、クリック時+定期更新のシグネチャ側から呼ばれる
function updateMissionBadge() {
  const n = missionClaimableCount(state);
  document.querySelector('.bar-tab[data-win="mission"]')?.classList.toggle("tab-alert", n > 0);
}

function renderMeyasubako() {
  const body = $("meyasu-body");
  body.innerHTML = "";

  // 週次報告は開いたときに一度だけ取りにいく(失敗しても黙ってフォームだけ出す)
  if (!meyasuReportLoaded) {
    meyasuReportLoaded = true;
    fetchMeyasuReport().then((r) => {
      meyasuReport = r;
      if (openOrder.includes("meyasu")) renderMeyasubako();
    });
  }

  // ---- レイアウト(2026-07-21 FB「相変わらず見づらい。最大限見やすく」) ----
  // 主目的=声を送ることなので、投稿フォームを最上部・報告は下の別セクションに分離
  const formSlot = document.createElement("div");
  body.appendChild(formSlot);

  // ---- 試用中のアップデート(2026-07-22 試用システム) ----
  // 週次サイクル: 日曜締切 → 水曜実装 → 1週間試用 → ここの投票で採用/不採用が決まる。
  // 採用は本実装、不採用は次の週次アップデートで削除(補償つき回収)
  {
    const head = document.createElement("div");
    head.className = "meyasu-sec-head";
    head.textContent = "🧪 試用中のアップデート";
    body.appendChild(head);
    const sec = document.createElement("div");
    sec.className = "meyasu-trials";
    const trials = activeTrials();
    if (trials.length === 0) {
      // リリース(8/10)前は具体日付を出さない。発売前のビルドに「次の締切: 7/26」と
      // 出ると意味不明(2026-07-26 FB)。サイクルはリリース日から回り始める
      const schedule = trialCycleStarted()
        ? (() => {
            const dl = new Date(nextDeadline());
            const rl = new Date(nextRelease());
            return `次の締切: ${dl.getMonth() + 1}/${dl.getDate()}(日) ・ 次の実装: ${rl.getMonth() + 1}/${rl.getDate()}(水)`;
          })()
        : `最初のサイクルはリリース後に始まる`;
      // 文ごとに<br>で区切る=テキストノード単位が辞書キーと一致してENに置き換わる
      sec.innerHTML =
        `<div class="meyasu-trial-empty">今は試用中の内容はない。` +
        `<br><small>毎週 日曜までの声で次の内容を決めて、水曜の週次アップデートで「試用」として実装。<br>` +
        `1週間みんなで遊んで、ここで採用/不採用を投票で決める(不採用は削除・補償あり)。<br>` +
        `${schedule}</small></div>`;
    } else {
      state.settings.trialVotes = state.settings.trialVotes ?? {};
      for (const t of trials) {
        const open = votingOpen(t);
        const remain = trialRemainMs(t);
        const days = Math.max(0, Math.ceil(remain / 86400000));
        const my = state.settings.trialVotes[t.id] ?? null;
        const card = document.createElement("div");
        card.className = "meyasu-trial-card";
        card.innerHTML =
          `<div class="meyasu-trial-name"><b>${t.name}</b>` +
          `<span class="meyasu-trial-remain">${open ? `投票あと${days}日` : "集計中"}</span></div>` +
          `<div class="meyasu-trial-desc">${t.desc ?? ""}</div>` +
          // 出品の話は交易品の実装まで出さない(2026-08-05 Haru指示・TRADE_ENABLED)
          (t.marketSensitive && TRADE_ENABLED
            ? `<div class="meyasu-trial-lock">⚓ 採用が決まるまで この内容の装備/タスモンは出品できない</div>`
            : "");
        const row = document.createElement("div");
        row.className = "meyasu-trial-vote";
        for (const [v, label, color] of [["adopt", "👍 採用", "#8af0c0"], ["reject", "👎 不採用", "#ff9a9a"]]) {
          const b = document.createElement("button");
          b.textContent = label;
          b.className = my === v ? "sel" : "";
          b.disabled = !open;
          b.addEventListener("click", () => {
            state.settings.trialVotes[t.id] = v;
            submitTrialVote(t.id, v);
            toast(v === "adopt" ? `👍「${t.name}」に採用の1票を入れた` : `👎「${t.name}」に不採用の1票を入れた`, color);
            save();
            keepScroll(renderMeyasubako);
          });
          row.appendChild(b);
        }
        card.appendChild(row);
        if (my) {
          const note = document.createElement("div");
          note.className = "meyasu-trial-voted";
          note.textContent = "投票済み(押し直しで変更できる)";
          card.appendChild(note);
        }
        sec.appendChild(card);
      }
    }
    body.appendChild(sec);
  }

  const repHead = document.createElement("div");
  repHead.className = "meyasu-sec-head";
  repHead.textContent = "📊 今週の報告";
  body.appendChild(repHead);

  // ---- 今週の報告(AIの要約と結果。生の投稿は入っていない) ----
  const rep = document.createElement("div");
  rep.className = "meyasu-report";
  if (meyasuReport?.themes?.length || meyasuReport?.shipped?.length) {
    // 週と件数はセクション見出しの添え字にする(見出しの二重表示を避ける 2026-07-21レビュー)
    if (meyasuReport.week || meyasuReport.total) {
      const sub = document.createElement("small");
      const parts = [];
      if (meyasuReport.week) parts.push(meyasuReport.week);
      if (meyasuReport.total) parts.push(`届いた声 ${formatNum(meyasuReport.total)}件`);
      sub.textContent = parts.join(" ・ ");
      repHead.appendChild(sub);
    }
    // サンプル表示の注記(2026-07-17 FB「目安箱の動きを見たい」: サーバー未接続の見本)
    if (meyasuReport.sample) {
      const sm = document.createElement("div");
      sm.className = "box-hint";
      sm.innerHTML =
        `<small>📎 これは<b>見本</b>(実際に届いた要望で作った実演)。` +
        `サーバー接続後は毎週の実際の集計に置き換わります</small>`;
      rep.appendChild(sm);
    }

    if (meyasuReport.themes?.length) {
      const t = document.createElement("div");
      t.className = "meyasu-rep-sec";
      t.innerHTML =
        `<div class="meyasu-rep-label">多かった声</div>` +
        meyasuReport.themes
          .slice(0, 3)
          .map(
            (x, i) =>
              `<div class="meyasu-theme"><i>${i + 1}</i><span>${escapeHtml(x.label)}</span><em>${x.count}件</em></div>`,
          )
          .join("");
      rep.appendChild(t);
    }
    if (meyasuReport.shipped?.length) {
      const s = document.createElement("div");
      s.className = "meyasu-rep-sec";
      s.innerHTML =
        `<div class="meyasu-rep-label">今週の実装</div>` +
        meyasuReport.shipped
          .map(
            (x) =>
              `<div class="meyasu-shipped">→ ${escapeHtml(x.what)}` +
              (x.from ? `<small>「${escapeHtml(x.from)}」の声から</small>` : "") +
              `</div>`,
          )
          .join("");
      rep.appendChild(s);
    }
    if (meyasuReport.planned?.length) {
      const p = document.createElement("div");
      p.className = "meyasu-rep-sec";
      p.innerHTML =
        `<div class="meyasu-rep-label">検討中</div>` +
        meyasuReport.planned.map((x) => `<div class="meyasu-planned">→ ${escapeHtml(x)}</div>`).join("");
      rep.appendChild(p);
    }
  } else {
    rep.innerHTML =
      `<div class="meyasu-rep-empty">まだ報告がありません。<br>` +
      `<small>毎週月曜に「多かった声」と「実装したもの」をここでお知らせします</small></div>`;
  }
  body.appendChild(rep);

  // ---- 投稿フォーム(最上部) ----
  const form = document.createElement("div");
  form.className = "meyasu-form";
  const formHead = document.createElement("div");
  formHead.className = "meyasu-sec-head";
  formHead.textContent = "📮 意見を送る";
  form.appendChild(formHead);
  const lead = document.createElement("div");
  lead.className = "meyasu-lead";
  lead.textContent = "毎週まとめて読み、実装できたものから入れていきます。";
  form.appendChild(lead);

  const cats = document.createElement("div");
  cats.className = "meyasu-cats";
  for (const c of MEYASUBAKO_CATEGORIES) {
    const b = document.createElement("button");
    b.className = "chip meyasu-cat" + (c.id === meyasuCategory ? " on" : "");
    b.textContent = c.label;
    b.title = c.hint;
    b.addEventListener("click", () => {
      meyasuCategory = c.id;
      renderMeyasubako();
    });
    cats.appendChild(b);
  }
  form.appendChild(cats);

  const hint = document.createElement("div");
  hint.className = "meyasu-hint";
  hint.textContent = MEYASUBAKO_CATEGORIES.find((c) => c.id === meyasuCategory)?.hint ?? "";
  form.appendChild(hint);

  const ta = document.createElement("textarea");
  ta.className = "meyasu-text";
  ta.maxLength = MEYASU_TEXT_MAX;
  ta.placeholder = "例: 合成の周回が単調なので、まとめて合成できるボタンが欲しい";
  ta.value = meyasuDraft;
  form.appendChild(ta);

  const bar = document.createElement("div");
  bar.className = "meyasu-bar";
  const count = document.createElement("span");
  count.className = "meyasu-count";
  const updateCount = () => {
    count.textContent = `${ta.value.length} / ${MEYASU_TEXT_MAX}`;
  };
  updateCount();
  ta.addEventListener("input", () => {
    meyasuDraft = ta.value;
    updateCount();
    send.disabled = !ta.value.trim() || !canPostSuggestion();
  });

  const send = document.createElement("button");
  send.className = "compound-do meyasu-send";
  const postable = canPostSuggestion();
  send.textContent = postable ? "送る" : "今日はもう送りました";
  send.disabled = !postable || !meyasuDraft.trim();
  if (!postable) {
    const h = Math.max(1, Math.ceil((nextPostableAt() - Date.now()) / 3600000));
    send.title = `1日1通までです(あと約${h}時間)`;
  }
  send.addEventListener("click", () => {
    const ctx = buildMeyasuCtx(state, APP_VERSION, meyasuCategory === "bug" ? lastRuntimeError : null);
    const r = submitSuggestion({ category: meyasuCategory, text: ta.value, ctx });
    if (r.error) {
      toast(r.error);
      return;
    }
    meyasuDraft = "";
    bumpMissionCounter(state, "meyasupost"); // チュートリアル: 目安箱に投稿した
    sfx("skillBuff");
    toast("📮 受け付けました。毎週月曜に結果を報告します", "#8af0d8");
    renderMeyasubako();
  });
  bar.append(count, send);
  form.appendChild(bar);

  const note = document.createElement("div");
  note.className = "meyasu-note";
  note.innerHTML =
    `今の進行状況(${DIFFICULTIES[state.difficulty ?? 0]?.name ?? ""} ${stageLabel(state.stage)}・Lv${
      Math.max(0, ...Object.values(state.monsters ?? {}).map((m) => m.level ?? 1))
    })が自動で付きます。<br>` +
    `他の人の投稿は表示されません。集まった声はまとめてお返しします。` +
    (MEYASUBAKO_ENDPOINT ? "" : "<br><small>(今はテスト中のため送信先が未設定です)</small>");
  form.appendChild(note);

  formSlot.appendChild(form); // フォームは最上部(2026-07-21 FB)
}

// ---- 探索(遠征)ウィンドウ(2026-07-11 別窓化) ----
// Steamロゴの簡易SVG(2026-07-17 FB「インベとマーケットのアイコンはスチームのアイコンに」)
const STEAM_SVG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" ' +
  'style="vertical-align:-2px;margin-right:4px"><path d="M12 2a10 10 0 1 1-9.9 11.6l4.3 1.8a2.7 2.7 0 0 0 5.2-.9v-.2l3.8-2.7h.1a3.7 3.7 0 1 0-3.7-3.7v.1l-2.7 3.9h-.2c-.6 0-1.1.2-1.6.5l-5.2-2.2A10 10 0 0 1 12 2zm-3.1 13.7 1.2.5a2 2 0 1 1-1.2-.5zm6.9-10.3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 .9a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>';

// ---- 交易船(Steamマーケット出品UI 2026-07-13) ----
// TBH形式: 船内アート+積み荷グリッド。装備を積み込むと出品予定になる。
// 実際のSteamマーケット出品はSteamworks(Inventory Service)連携後に有効化。
function renderTrade() {
  const body = $("trade-body");
  body.innerHTML = "";
  state.tradeShip = state.tradeShip ?? [];

  // 船内アート(案内メッセージ類は全て撤去 2026-07-17 FB「メッセージ系も消して
  // バランスも整えて」。出品条件・枠はエラートーストとボタンtitleが伝える)
  const art = document.createElement("div");
  art.className = "trade-art";
  body.appendChild(art);

  // 操作列(2026-07-17 FB「Steamの自分のインベントリとこのゲームのマーケットに飛ぶ」):
  // どちらも既定ブラウザでSteamを開く。アプリ外(プレビュー)では新規タブにフォールバック
  const openSteam = (url) => {
    if (window.appControl?.openExternal) window.appControl.openExternal(url);
    else window.open(url, "_blank");
  };
  const controls = document.createElement("div");
  controls.className = "cube-controls";
  const invBtn = document.createElement("button");
  invBtn.innerHTML = `${STEAM_SVG}インベ`;
  invBtn.title = "Steamの自分のインベントリをブラウザで開く";
  // ※App ID取得後: /my/inventory/#<appid> でこのゲームのタブを直接開く
  invBtn.addEventListener("click", () => openSteam("https://steamcommunity.com/my/inventory/"));
  controls.appendChild(invBtn);
  const mktBtn = document.createElement("button");
  mktBtn.innerHTML = `${STEAM_SVG}マーケット`;
  mktBtn.title = "Steamコミュニティマーケット(このゲームの出品一覧)をブラウザで開く";
  // ※App ID取得後: /market/search?appid=<appid> に差し替え
  mktBtn.addEventListener("click", () => openSteam("https://steamcommunity.com/market/"));
  controls.appendChild(mktBtn);
  body.appendChild(controls);

  // 積み荷グリッド(2026-07-17 FB「最初から4つでなく順番に。装備とタスモン合わせてmax4」):
  // 解放済みの枠(出品枠ラダーと同数)だけ使え、未解放は🔒で見せる。装備もタスモンも同じ枠
  state.tradeShipMons = state.tradeShipMons ?? [];
  const tok = tradeTokenState(state);
  const cargo = [
    ...state.tradeShip.map((it) => ({ kind: "item", it })),
    ...state.tradeShipMons.map((m) => ({ kind: "mon", m })),
    ...(state.tradeShipPrecious ?? []).map((p) => ({ kind: "precious", p })),
  ];
  const grid = document.createElement("div");
  grid.id = "trade-grid";
  for (let i = 0; i < MARKET_SLOT_MAX; i++) {
    const slot = document.createElement("div");
    slot.className = "cube-slot";
    const c = cargo[i];
    if (i >= tok.slots) {
      slot.classList.add("trade-locked");
      slot.innerHTML = "🔒";
      slot.title = "難易度をクリアすると枠が解放される";
    } else if (c && c.kind === "item") {
      const item = c.it;
      const irm = RARITY_META[item.rarity];
      slot.classList.add("filled");
      slot.style.borderColor = irm.color;
      slot.appendChild(itemIconCanvas(item, 36));
      const lvb = document.createElement("span");
      lvb.className = "cell-lv";
      lvb.textContent = `L${item.lv ?? 1}`;
      slot.appendChild(lvb);
      bindCellTooltip(
        slot,
        () =>
          itemTooltipHtml(item, false) +
          `<div class="tt-hint">想定相場 ${formatGold(marketValueEstimate(item))} G ・ クリックで降ろす</div>`,
        () => {
          const r = unloadTradeShip(state, item.id);
          if (r.error) return void toast(r.error);
          hideTooltip(true);
          renderTrade();
          if (openOrder.includes("items")) renderItems();
          refreshHeroInv();
          save();
        },
      );
    } else if (c && c.kind === "mon") {
      const cargoMon = c.m;
      slot.classList.add("filled");
      slot.appendChild(monMiniIcon(cargoMon, 36));
      slot.title = `${SPECIES[cargoMon.speciesId].name} Lv.${cargoMon.level} — クリックで降ろす`;
      slot.style.cursor = "pointer";
      slot.addEventListener("click", () => {
        const r = unloadTradeShipMonster(state, cargoMon.id);
        if (r.error) return void toast(r.error);
        toast(`🐾 ${SPECIES[r.mon.speciesId].name} が船から降りた`, "#8ad8ff");
        renderTrade();
        refreshMonViews();
        save();
      });
    } else if (c && c.kind === "precious") {
      const p = c.p;
      const rm = RARITY_META[preciousRarityOf(p)];
      slot.classList.add("filled");
      slot.style.borderColor = rm.color;
      slot.appendChild(p.stone ? stoneIconEl(p.stone, 32) : p.difficulty !== undefined ? keyIconEl(p.difficulty, 32) : crystalIconEl(32));
      slot.title =
        `${p.difficulty !== undefined ? keyLabelOf(p.difficulty) : "叡智の水晶"}(${rm.label}等級) — ` +
        `想定相場 ${formatGold(preciousMarketEstimate(p))} G ・ クリックで降ろす`;
      slot.style.cursor = "pointer";
      slot.addEventListener("click", () => {
        const r = unloadTradeShipPrecious(state, p.id);
        if (r.error) return void toast(r.error);
        toast("貴重品を 船から降ろした", "#8ad8ff");
        renderTrade();
        refreshInvViews();
        save();
      });
    } else {
      // 空き枠の「＋」(2026-07-18 スクショ検品FB: 中身がなく欠けた黒い箱に見えていた)
      slot.innerHTML = `<span class="cmp-plus">＋</span>`;
      slot.style.display = "flex";
      slot.style.alignItems = "center";
      slot.style.justifyContent = "center";
      slot.title = "装備・鍵・水晶=持ち物からドラッグか右クリック / タスモン=タスモンの子をクリック";
      makeDropTarget(slot, (data) => {
        if (data.startsWith("item:")) return void tradeLoadItem(data.split(":")[1]);
        if (data.startsWith("mon:")) return void loadMon(data.slice(4));
        if (data.startsWith("precious:")) return void tradeLoadPrecious(data.split(":")[1]);
      });
    }
    grid.appendChild(slot);
  }
  body.appendChild(grid);

  // 積めるタスモン候補(覚醒0・パーティ外・探索外)。クリックで積む
  const loadMon = (id) => {
    if (!TRADE_ENABLED) return; // 同上
    const r = loadTradeShipMonster(state, id);
    if (r.error) return void toast(r.error);
    sfx("chest");
    toast(
      `⚓ ${baseNameOf(r.mon)} が新しい主のもとへ旅立つ準備をした` +
        (r.unequipped > 0 ? `(装備${r.unequipped}個は外して返した)` : ""),
      "#8ad8ff",
    );
    renderTrade();
    refreshMonViews();
    refreshHeroInv();
    save();
  };
  // タスモン候補行は撤去(2026-07-20 FB「キャラの表示いらない。タスモンからの移動でいい」)。
  // 積み込みはタスモンの子をクリック(交易船が開いているとき)/装備・貴重品はドラッグか右クリック

  // 出品(Steamworks連携後に有効化)
  const listBtn = document.createElement("button");
  listBtn.className = "compound-do";
  listBtn.disabled = true;
  // 「今後のアップデートで開放」は正式版で未完成を宣言する言い方になるので使わない
  // (事実は「Steam連携の開始待ち」であって、作りかけではない 2026-07-27)
  listBtn.textContent = "⚓ 出品する(Steamマーケット連携の開始後)";
  listBtn.title = "出品はSteamマーケット連携の開始後にご利用いただけます。積み荷はそのまま保存されます";
  body.appendChild(listBtn);

  const note = document.createElement("div");
  note.className = "cube-note";
  note.innerHTML = `<small>積み込み: 装備・鍵・水晶・進化石(レジェンド以上)=持ち物から右クリック ・ タスモン=タスモンの子をクリック(交易船を開いた状態で)</small>`;
  body.appendChild(note);
}

// 貴重品(鍵/水晶)を交易船へ(ドラッグ/右クリック共通 2026-07-20)
function tradeLoadPrecious(id) {
  if (!TRADE_ENABLED) return; // 交易品の実装まで機能ごと止める(2026-08-05 Haru指示)
  const r = loadTradeShipPrecious(state, id);
  if (r.error) return void toast(r.error);
  sfx("chest");
  toast("⚓ 貴重品を交易船に積み込んだ", "#8ad8ff");
  renderTrade();
  refreshInvViews();
  save();
}

// インベ/倉庫から交易船へ積む(右クリック/ドラッグ共通)
function tradeLoadItem(itemId) {
  if (!TRADE_ENABLED) return; // 同上
  const r = loadTradeShip(state, itemId);
  if (r.error) return void toast(r.error);
  sfx("chest");
  toast(`⚓ ${r.item.name} を交易船に積み込んだ`, "#8ad8ff");
  if (openOrder.includes("trade")) renderTrade();
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("storage")) renderStorage();
  refreshHeroInv();
  save();
}

function renderExpedition() {
  const body = $("exped-body");
  body.innerHTML = "";
  const exped = document.createElement("div");
  exped.className = "portal-exped exped-window";
  // 複数パーティ化(2026-08-13 Haru指示「3体1組の探索パーティは変えずに、
  // もう1つ探索パーティを増やせるようにする」): 出発中の全パーティをカードで並べ、
  // 組数に空きがあれば下に「次のパーティ」の編成エリアを出す
  const infos = expeditionInfos(state);
  const partyCount = expeditionPartyCount(state);
  const nextSize = expedNextPartySize();
  const fmtRemain = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}時間${m}分` : `${m}分`;
  };
  // 探索枠の＋ボタン(2026-07-13 FB)。2026-07-15 FB「探索に出してしまうと探索枠の拡張が
  // できなくなるのをやめて」: 以前は出発前の画面にしか置いていなかったため、出したあとは
  // 帰還まで枠を広げられなかった(次の探索の準備ができない)。出発中/帰還後にも出す。

  // 探索メンバー枠へのドロップ投入(2026-07-22 FB「探索の枠にD&Dで入れられるように」)。
  // タスモン窓のセルから引っ張って直接メンバーに追加できる。パーティの子は
  // 探索に出せない仕様なので、理由つきで弾く
  const expedDropAdd = (data) => {
    if (!data.startsWith("mon:")) return;
    const id = data.slice(4);
    const m = state.monsters[id];
    if (!m) return;
    if (state.party.includes(id)) return void toast("パーティの子は 探索に出せない(外してから)", "#ff9a9a");
    if (onExpedition(state, id)) return void toast("🧭 その子はもう探索中", "#ff9a9a");
    if (expedSelIds.size >= nextSize && !expedSelIds.has(id)) {
      return void toast(`1パーティは ${EXPEDITION_PARTY_SIZE}体まで`, "#ff9a9a");
    }
    expedSelIds.add(id);
    renderExpedition();
    if (openOrder.includes("box")) renderBox();
  };
  const makeSlotBtn = () => {
    if (expeditionCapOf(state) >= EXPEDITION_SLOT_MAX) return null;
    const slotBtn = document.createElement("button");
    slotBtn.className = "chip best-equip-chip";
    slotBtn.textContent = `＋枠(${formatGold(expedSlotCost(state))}G)`;
    slotBtn.title = `探索枠を+1(いま${expeditionCapOf(state)}枠・最大${EXPEDITION_SLOT_MAX}枠)`;
    slotBtn.addEventListener("click", () => {
      const r = buyExpedSlot(state);
      if (r.error) return void toast(r.error);
      sfx("coin");
      toast(`🧭 探索枠が ${r.cap}枠に拡張された!(-${formatGold(r.cost)}G)`, "#ffe9a8");
      renderExpedition();
      renderHud();
      save();
    });
    return slotBtn;
  };
  // ---- 見出し: 何組出せるか+枠の拡張 ----
  {
    const head = document.createElement("div");
    head.className = "exped-head";
    head.textContent =
      infos.length > 0
        ? `🧭 探索パーティ ${infos.length}/${partyCount}組が出発中`
        : `🧭 探索: 使っていない子に 宝とEXPを持ち帰らせる(3体1組×${partyCount}組まで)`;
    const slotBtn = makeSlotBtn();
    if (slotBtn) {
      const capNote = document.createElement("span");
      capNote.className = "exped-cap-note";
      capNote.textContent = `枠 ${expeditionCapOf(state)}/${EXPEDITION_SLOT_MAX}`;
      head.append(" ", capNote, slotBtn);
    }
    exped.appendChild(head);
  }
  // ---- 出発中の各パーティ(1組=1カード。それぞれ独立に帰還・受け取り) ----
  for (const info of infos) {
    const card = document.createElement("div");
    card.className = "exped-party-card" + (info.done ? " done" : "");
    const head = document.createElement("div");
    head.className = "exped-subhead" + (info.done ? " done" : "");
    head.textContent = info.done
      ? `🧭 第${info.index + 1}隊が帰ってきた!`
      : `🧭 第${info.index + 1}隊 探索中 — 帰還まで ${fmtRemain(info.remain)}`;
    card.appendChild(head);
    // 旅程バー: どこまで進んだかを一目で(残り時間の数字だけだと進捗が掴めない)
    const bar = document.createElement("div");
    bar.className = "exped-progress";
    const barPct = document.createElement("span");
    barPct.className = "exped-progress-pct";
    if (!info.done) {
      const p0 = Math.max(0, Math.min(1, 1 - info.remain / (info.hours * 3600000)));
      bar.style.setProperty("--p", `${(p0 * 100).toFixed(1)}%`);
      barPct.textContent = `${Math.floor(p0 * 100)}%`;
      bar.appendChild(barPct);
      card.appendChild(bar);
      // 残り時間を毎秒書き換える(2026-07-22 FB)。窓を閉じたら自分で止まる(isConnected)
      const tick = setInterval(() => {
        if (!head.isConnected) return clearInterval(tick);
        const now = expeditionInfos(state).find((x) => x.startedAt === info.startedAt);
        if (!now) return clearInterval(tick);
        if (now.done) {
          clearInterval(tick);
          if (openOrder.includes("exped")) renderExpedition();
          return;
        }
        head.textContent = `🧭 第${info.index + 1}隊 探索中 — 帰還まで ${fmtRemain(now.remain)}`;
        const pct = Math.max(0, Math.min(1, 1 - now.remain / (now.hours * 3600000)));
        bar.style.setProperty("--p", `${(pct * 100).toFixed(1)}%`);
        barPct.textContent = `${Math.floor(pct * 100)}%`;
      }, 1000);
    }
    const row = document.createElement("div");
    row.className = "exped-row";
    if (!info.done) {
      // 隊列は「旅の途中」に見せる: 道の上を歩く一団+先頭に羅針盤
      const trip = document.createElement("div");
      trip.className = "exped-trip";
      const crew = document.createElement("div");
      crew.className = "exped-trip-crew";
      for (const id of info.monIds) {
        const m = state.monsters[id];
        if (m) crew.appendChild(monMiniIcon(m, 30));
      }
      trip.appendChild(crew);
      row.appendChild(trip);
    } else {
      // 帰還セレモニー(2026-07-19 FB「帰還表示→クリックで結果」)。
      // AFK系RPGの「帰還した隊が宝箱を差し出す」型: 隊列+ゆれる包み。包みクリックで開封
      const camp = document.createElement("div");
      camp.className = "exped-return";
      const crew = document.createElement("div");
      crew.className = "exped-return-crew";
      for (const id of info.monIds) {
        const m = state.monsters[id];
        if (m) crew.appendChild(monMiniIcon(m, 30));
      }
      camp.appendChild(crew);
      const bundle = document.createElement("button");
      bundle.className = "exped-bundle";
      bundle.innerHTML = `<span class="exped-bundle-icon">🎁</span><b>ただいま!</b><small>クリックして 包みを開ける</small>`;
      bundle.addEventListener("click", () => {
        const r = claimExpedition(state, info.index);
        if (r.error) return void toast(r.error);
        // 開封演出: 何が出たかを1枚のリザルトで見せる(2026-07-11 FB)
        expedRevealOverlay(r);
        celebrateItem(r.item, "🧭 探索の戦利品");
        passNotify(passProgress(state, "exped", r.hours)); // 時間分進む(2026-07-21 FB: 回数制の不平等を解消)
        expedNotified = false;
        if (!expeditionInfos(state).some((x) => x.done)) {
          document.querySelector('.bar-tab[data-win="exped"]')?.classList.remove("tab-alert");
        }
        refreshMonViews();
        refreshHeroInv();
        if (openOrder.includes("box")) renderBox();
        save();
        renderExpedition();
      });
      camp.appendChild(bundle);
      row.appendChild(camp);
    }
    card.appendChild(row);
    exped.appendChild(card);
  }
  // ---- 次のパーティの編成(組数と枠に空きがあるときだけ) ----
  if (nextSize > 0) {
    for (const id of [...expedSelIds]) {
      if (!state.monsters[id] || state.party.includes(id) || onExpedition(state, id)) expedSelIds.delete(id);
    }
    // 選びすぎていたら後ろから外す(枠の縮小や出発で上限が下がることがある)
    while (expedSelIds.size > nextSize) expedSelIds.delete([...expedSelIds].pop());

    // メンバー(タスモンから選ぶ)。アイコンクリックで外す
    const memHead = document.createElement("div");
    memHead.className = "exped-subhead";
    const memLabel = infos.length > 0 ? `第${infos.length + 1}隊` : "メンバー";
    memHead.textContent =
      `${memLabel}(${expedSelIds.size}/${nextSize}) — レア度と育成レベルが高いほど宝が上振れ`;
    exped.appendChild(memHead);
    const memRow = document.createElement("div");
    memRow.className = "exped-row";
    makeDropTarget(memRow, expedDropAdd);
    for (const id of expedSelIds) {
      const m = state.monsters[id];
      const ic = monMiniIcon(m, 34);
      ic.title = `${baseNameOf(m)} Lv.${m.level}(クリックで外す)`;
      ic.style.cursor = "pointer";
      ic.addEventListener("click", () => {
        expedSelIds.delete(id);
        renderExpedition();
      });
      memRow.appendChild(ic);
    }
    // 空き枠を破線タスモンで見える化(2026-07-19 FB)
    for (let i = expedSelIds.size; i < nextSize; i++) {
      const empty = document.createElement("span");
      empty.className = "exped-empty-slot";
      empty.title = "空き枠(📦から選ぶ)";
      memRow.appendChild(empty);
    }
    exped.appendChild(memRow);
    // キャラ枠の下の独立行(2026-08-13 Haru指示)
    const pickRow = document.createElement("div");
    pickRow.className = "exped-pick-row";
    const pick = document.createElement("button");
    pick.className = "compound-do exped-pick";
    pick.textContent = expedSelIds.size === 0 ? "📦 タスモンから選ぶ" : "📦 選び直す";
    pick.addEventListener("click", () => {
      expedSelectMode = true;
      openWindow("box");
      renderBox();
      toast(`タスモンでメンバーをクリックして選ぶ(${nextSize}体まで)`, "#8ad8ff");
    });
    pickRow.appendChild(pick);
    exped.appendChild(pickRow);

    // 探索時間(3/6/12時間)。長いほど1時間あたりの効率も少し良い
    const durRow = document.createElement("div");
    durRow.className = "exped-durs";
    for (const h of EXPEDITION_HOURS) {
      const b = document.createElement("button");
      b.className = "compound-tab exped-dur" + (expedHours === h ? " on" : "");
      b.textContent = `${h}時間`;
      b.addEventListener("click", () => {
        expedHours = h;
        renderExpedition();
      });
      durRow.appendChild(b);
    }
    exped.appendChild(durRow);

    // 今週の探索先(隔週アップデートで増える探索コンテンツ。ボーナスは見込みに込み)
    const spot = activeExpeditionSpot();
    if (spot) {
      const sp = document.createElement("div");
      sp.className = "exped-spot";
      const bl = [];
      if (spot.bonus?.itemStage) bl.push(`宝の上振れ+${spot.bonus.itemStage}`);
      if (spot.bonus?.expMult) bl.push(`EXP+${Math.round(spot.bonus.expMult * 100)}%`);
      if (spot.bonus?.eggChance) bl.push(`卵+${Math.round(spot.bonus.eggChance * 100)}%`);
      sp.innerHTML =
        `<b>🗺 今週の探索先: ${spot.name}</b>` +
        `<small>${spot.desc ?? ""}${bl.length ? ` ・ ${bl.join(" / ")}` : ""}</small>`;
      exped.appendChild(sp);
    }
    // 持ち帰る可能性のあるもの(選抜と時間から実値でプレビュー)
    const outlook = expeditionOutlook(state, [...expedSelIds], expedHours);
    const ol = document.createElement("div");
    ol.className = "exped-outlook";
    const w = bossChestWeights(outlook.itemStage);
    const total = Object.values(w).reduce((s, v) => s + v, 0);
    // 出やすい順に上位4レア度を見せる(星の低い順に並べ直して読みやすく)
    const topRarities = [...RARITY_ORDER]
      .filter((r) => w[r] > 0)
      .sort((a, b) => w[b] - w[a])
      .slice(0, 4)
      .sort((a, b) => RARITY_META[a].stars - RARITY_META[b].stars)
      .map((r) => `<span style="color:${RARITY_META[r].color}">${RARITY_META[r].label} ${((w[r] / total) * 100).toFixed(1).replace(/\.0$/, "")}%</span>`)
      .join(" / ");
    ol.innerHTML =
      `<div class="exped-outlook-title">🎁 持ち帰るもの(${expedHours}時間・★合計${outlook.starSum}・Lv合計${outlook.lvSum})</div>` +
      `<div class="exped-outlook-row">🗡 装備×${outlook.itemCount ?? 1} 確定 — ${topRarities || "?"}</div>` +
      `<div class="exped-outlook-row">✨ 経験値 +${formatNum(outlook.expGain)}(1体あたり)</div>` +
      `<div class="exped-outlook-row">🥚 お土産卵 ${Math.round(outlook.eggChance * 100)}%</div>`;
    exped.appendChild(ol);

    const go = document.createElement("button");
    go.className = "compound-do exped-go";
    go.textContent = `🧭 出発する(${expedSelIds.size}/${nextSize}体・${expedHours}時間)`;
    go.disabled = expedSelIds.size === 0;
    go.addEventListener("click", () => {
      const r = startExpedition(state, [...expedSelIds], expedHours);
      if (!r?.error) bumpMissionCounter(state, "expedstart"); // チュートリアル: 探索に出した
      if (r.error) return void toast(r.error);
      toast(`🧭 ${r.monIds.length}体が探索に出発! ${r.hours}時間後に帰ってくる`, "#8ad8ff");
      expedSelIds.clear();
      expedSelectMode = false;
      expedNotified = false;
      if (openOrder.includes("box")) renderBox();
      save();
      renderExpedition();
    });
    exped.appendChild(go);
  }
  body.appendChild(exped);
}

// 探索の戦利品を「包みを開ける」演出で見せる(2026-07-11 FB: 開封+何が出たか分かるように)
function expedRevealOverlay(r) {
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay exped-reveal";
  const box = document.createElement("div");
  box.className = "feed-box evo-box";
  const title = document.createElement("div");
  title.className = "evolve-title";
  title.textContent = `🧭 探索の戦利品(${r.hours}時間)`;
  box.appendChild(title);
  const list = document.createElement("div");
  list.className = "exped-loot";
  // 装備: 小セルのグリッド(2026-07-21 FB「枠に収まってない。装備はもっと小さく、
  // 装備オーバーレイで仕様が確認できるように」)。クリックで仕様パネル(itemPanelHtml)
  // を開閉。個数は時間比例(3h=1/6h=2/12h=4)
  const items = (r.items ?? [r.item]).filter(Boolean);
  list.insertAdjacentHTML(
    "beforeend",
    `<div class="exped-loot-sec">🗡 装備 ×${items.length}<small>クリックで仕様を確認</small></div>`,
  );
  const grid = document.createElement("div");
  grid.className = "exped-loot-grid";
  const spec = document.createElement("div");
  spec.className = "exped-item-spec";
  spec.hidden = true;
  for (const it of items) {
    const rm = RARITY_META[it.rarity];
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "exped-cell";
    cell.style.borderColor = rm.color;
    // titleは装備名のみ(合成語にすると自動翻訳の装備名ルールが効かない 2026-07-21)
    cell.title = it.name;
    cell.appendChild(itemIconCanvas(it, 34));
    cell.insertAdjacentHTML("beforeend", `<i class="exped-cell-lv">Lv.${it.lv}</i>`);
    cell.addEventListener("click", () => {
      // 同じセルをもう一度クリックで閉じる。別セルなら差し替え
      if (!spec.hidden && spec.dataset.for === String(it.id)) {
        spec.hidden = true;
        cell.classList.remove("sel");
        return;
      }
      spec.dataset.for = String(it.id);
      spec.innerHTML = itemPanelHtml(it);
      spec.hidden = false;
      grid.querySelectorAll(".exped-cell").forEach((c) => c.classList.toggle("sel", c === cell));
      spec.scrollIntoView({ block: "nearest" });
    });
    grid.appendChild(cell);
  }
  list.appendChild(grid);
  list.appendChild(spec);
  // EXP: 見出し1行+メンバーごとに顔アイコン+レベルアップのバッジ
  list.insertAdjacentHTML(
    "beforeend",
    `<div class="exped-loot-sec">✨ 経験値 +${formatNum(r.expGain)}<small>(1体あたり)</small></div>`,
  );
  for (const lv of r.levels) {
    const row = document.createElement("div");
    row.className = "exped-loot-row exped-loot-member";
    const mon = state.monsters[lv.id];
    if (mon) row.appendChild(monMiniIcon(mon, 26));
    row.insertAdjacentHTML(
      "beforeend",
      `<span class="exped-member-name">${lv.name}</span>` +
        (lv.levels > 0 ? `<b class="exped-lvup">Lv+${lv.levels}!</b>` : ""),
    );
    list.appendChild(row);
  }
  // 卵
  if (r.egg) {
    const erm = RARITY_META[r.egg.rarity];
    list.insertAdjacentHTML(
      "beforeend",
      `<div class="exped-loot-row exped-loot-egg"><span>🥚 お土産: <b style="color:${erm.color}">${erm.label}の卵</b></span></div>`,
    );
  }
  box.appendChild(list);
  // RPGのリザルトのように戦利品を1行ずつ順に見せる(2026-07-19 FB)
  [...list.children].forEach((rowEl, i) => {
    rowEl.classList.add("loot-in");
    rowEl.style.animationDelay = `${0.15 + i * 0.3}s`;
  });
  const ok = document.createElement("button");
  ok.className = "compound-do evo-ok";
  ok.textContent = "受け取る";
  ok.addEventListener("click", () => overlay.remove());
  box.appendChild(ok);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

function goldRewardOf(effStage) {
  return goldReward(effStage);
}

function onSelectStage(stage) {
  if (stage === state.stage) return;
  const result = setStage(state, stage);
  if (result.error) {
    toast(result.error);
    return;
  }
  interruptDailyBoss(); // 戦闘中のデイリーボスは挑戦権を返して中断(黙って上書きしない)
  playerAttackTimer = 0;
  enemyAttackTimer = 0;
  playerHp = partyMaxHp();
  scene.setStage(state.stage);
  spawnWave();
  toast(
    result.usedKey
      ? `🗝 ${keyLabelOf(state.difficulty ?? 0)}を1本使って 幕ボスの間へ!(残り${bossKeyCount(state, state.difficulty ?? 0)}本)`
      : `STAGE ${stageLabel(stage)} へ 移動した`,
    result.usedKey ? "#ffcf4a" : undefined,
  );
  bumpMissionCounter(state, "stagemove"); // チュートリアル: 地図で移動した
  renderMap();
  renderHud();
  save();
}

// ---- ホバー詳細ツールチップ(TBH風: グリッドはアイコンのみ、重ねると詳細) ----
const tooltip = document.createElement("div");
tooltip.id = "tooltip";
tooltip.className = "ff-panel hidden";
document.body.appendChild(tooltip);
let tooltipPinned = false; // クリックで固定(操作ボタンつき)

function positionTooltip(x, y) {
  // x/y(clientX)・getBoundingClientRect・innerWidthは全て物理px。
  // 物理pxで境界計算し、最後にzoomで割ってレイアウトpxとして代入する(2026-07-17)
  const pad = 8;
  const r = tooltip.getBoundingClientRect();
  let left = x + 14;
  let top = y - r.height - 10;
  if (left + r.width > window.innerWidth - pad) left = x - r.width - 14;
  if (top < pad) top = y + 16;
  if (top + r.height > window.innerHeight - pad) top = window.innerHeight - r.height - pad;
  if (left < pad) left = pad;
  tooltip.style.left = `${left / uiZoom()}px`;
  tooltip.style.top = `${top / uiZoom()}px`;
}

function showTooltip(content, x, y, { pinned = false } = {}) {
  // 空内容の枠は出さない(2026-08-13 FB「なんか変な枠出てくるけどこれ何?」:
  // コインの投入枠は結果の装備が入っているときだけ中身を返すので、空のときに
  // 中身ゼロの ff-panel(ツールチップの枠)だけがホバーで浮いていた)。
  // 呼び出し側で分岐させると次の空文字で再発するので、入口で一律に弾く
  if (content == null || (typeof content === "string" && !content.trim())) return void hideTooltip();
  tooltipPinned = pinned;
  tooltip.innerHTML = "";
  if (typeof content === "string") tooltip.innerHTML = content;
  else tooltip.appendChild(content);
  tooltip.classList.remove("hidden");
  tooltip.classList.toggle("pinned", pinned);
  positionTooltip(x, y);
}

function hideTooltip(force = false) {
  if (tooltipPinned && !force) return;
  tooltipPinned = false;
  tooltip.classList.add("hidden");
}

// 固定中にグリッド外をクリックしたら閉じる
document.addEventListener("click", (ev) => {
  if (!tooltipPinned) return;
  if (tooltip.contains(ev.target)) return;
  if (ev.target.closest?.(".inv-cell, .mon-cell")) return;
  hideTooltip(true);
});

// グリッドセルにホバー/クリックのツールチップ挙動をつける
function bindCellTooltip(cell, hoverHtml, onClick) {
  cell.addEventListener("mouseenter", (ev) => {
    if (!tooltipPinned) showTooltip(hoverHtml(), ev.clientX, ev.clientY);
  });
  cell.addEventListener("mousemove", (ev) => {
    if (!tooltipPinned) positionTooltip(ev.clientX, ev.clientY);
  });
  cell.addEventListener("mouseleave", () => hideTooltip());
  cell.addEventListener("click", (ev) => {
    ev.stopPropagation();
    // onClickなし(ボスの鍵など表示専用セル)はツールチップ固定だけして何もしない
    onClick?.(ev);
  });
}

// ---- 装備倉庫 ----
let itemFilter = null; // レア度フィルタ(null = 全て)

// ---- 装備アイコン(部位×ティアのドット絵。レア度色で染まる) ----
// 形の定義は src/game/item-sprites.js(部位6種×ティア3段階の16x16)

// アイテムのアイコンcanvas(部位の形 × レア度の色 × 星でティアが変わる)
// 生成装備アイコン(2026-07-12): 種類(ジョブ武器/アクセ種別/防具)×豪華ティア(レア度帯)で
// assets/ui/items/<type>_t<1-4>.png を引く。未生成/未ロード時は従来のドット絵にフォールバック
const ITEM_ICON_TIER = Object.freeze({
  common: 1, rare: 1, ultra: 2, legend: 2, immortal: 3,
  arcana: 3, beyond: 4, century: 4, cosmic: 4, celestial: 4,
});
const ROLE_ICON_TYPE = Object.freeze({
  nuke: { weapon: "sword", sub: "axe" },
  guard: { weapon: "lance", sub: "shield" },
  heal: { weapon: "staff", sub: "orb" },
  buff: { weapon: "bow", sub: "arrow" },
});
const itemIconImgCache = new Map();
function itemIconType(item) {
  const part = item.part ?? inferPart(item);
  if (part === "charm") return CHARM_KINDS[item.charmKind]?.id ?? "ring";
  if (part === "weapon" || part === "sub") {
    const byRole = ROLE_ICON_TYPE[item.role];
    if (byRole) return byRole[part];
    return part === "weapon" ? "sword" : "shield"; // 旧共用品は代表アイコン
  }
  return part; // armor / helm / boots
}
// レア度→アイコンランク(10段階)。2026-07-13 FB「レアリティごとに装備デザイン、
// アイコン変えて(コモンとレアでデザインの被りがある)」→ 全レア度が固有アート
const ITEM_ICON_RANK = Object.freeze({
  common: 1, rare: 2, ultra: 3, legend: 4, immortal: 5,
  arcana: 6, beyond: 7, century: 8, cosmic: 9, celestial: 10,
});
function itemIconImg(item) {
  const type = itemIconType(item);
  // ユニーク装備は専用の一点物アート優先(2026-08-10「特別なアイコンを生成して
  // 豪華な見た目とエフェクトを」)。未生成の個体は従来の部位×レア度アートへ落ちる
  const key = item.uniqueId ? `uniq_${item.uniqueId}` : `${type}_r${ITEM_ICON_RANK[item.rarity] ?? 1}`;
  if (!itemIconImgCache.has(key)) {
    const img = new Image();
    img.src = `assets/ui/items/${key}.png`;
    img.onerror = () => {
      img.onerror = null;
      if (item.uniqueId) {
        img.src = `assets/ui/items/${type}_r${ITEM_ICON_RANK[item.rarity] ?? 1}.png`;
        img.onerror = () => {
          img.onerror = null;
          img.src = `assets/ui/items/${type}_t${ITEM_ICON_TIER[item.rarity] ?? 1}.png`;
        };
        return;
      }
      // レア度別アートが未生成の環境では従来の4ティア版へフォールバック
      img.src = `assets/ui/items/${type}_t${ITEM_ICON_TIER[item.rarity] ?? 1}.png`;
    };
    itemIconImgCache.set(key, img);
  }
  return itemIconImgCache.get(key);
}
function itemIconCanvas(item, size = 36) {
  const rm = RARITY_META[item.rarity];
  const part = item.part ?? inferPart(item);
  const img = itemIconImg(item);
  if (img.complete && img.naturalWidth > 0) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // 大きな縮小は段階的に半分ずつ(エイリアス対策)
    let src = img;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;
    while (sw > size * 2.5) {
      const half = document.createElement("canvas");
      half.width = Math.max(1, Math.floor(sw / 2));
      half.height = Math.max(1, Math.floor(sh / 2));
      const hc = half.getContext("2d");
      hc.imageSmoothingEnabled = true;
      hc.imageSmoothingQuality = "high";
      hc.drawImage(src, 0, 0, half.width, half.height);
      src = half;
      sw = half.width;
      sh = half.height;
    }
    const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight) * 0.94;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(src, (size - dw) / 2, (size - dh) / 2, dw, dh);
    return canvas;
  }
  // 画像が未ロードのときは仮アイコン(部位の汎用スプライト)になる。ロード完了時に
  // 開いている窓を描き直して「合成結果のアイコンと装備が違う」瞬間を残さない
  // (2026-07-13 FB「合成でできたアイコンと装備が不一致」の原因=このフォールバック)
  if (!img.dataset.rerenderHooked) {
    img.dataset.rerenderHooked = "1";
    img.addEventListener(
      "load",
      () => {
        if (openOrder.includes("cube")) renderCube();
        if (openOrder.includes("items")) renderItems();
        if (openOrder.includes("storage")) renderStorage();
        refreshHeroInv();
      },
      { once: true },
    );
  }
  return spriteCanvas(partIconSprite(part, rm?.color ?? "#b8a67a", rm?.stars ?? 1), size);
}

// 空きスロットなど、部位だけ示したいとき用(コモンの素朴な見た目=無色に近い)
function partIconCanvas(part, size = 36, color = "#7a6a50") {
  return spriteCanvas(partIconSprite(part, color, 1), size);
}

function itemIcon(item) {
  // 文字が必要な場面(ログ等)用のフォールバック
  return PARTS[item.part]?.icon ?? "⚔";
}

// 部位ラベル(「ぶき」など)。ツールチップ用。
function partLabel(item) {
  return PARTS[item.part]?.label ?? "装備";
}

// TBH風の装備カード: 名前バンド → 等級+装備スコア(大きく) → 1行1ステータス+品質バー。
// 品質バー = そのレア度で出うる最小〜最大ロールのどこか(✦は上位10%の当たり)。
// TBH式アイテム詳細パネル。名前バンド+アイコン&主ステ+固有ステータス+取引可能。
// opts.equipped=true で「装備中」帯を出す。opts.tag で右上の小見出し(比較用)。
function itemPanelHtml(item, opts = {}) {
  const irm = RARITY_META[item.rarity];
  const base = item.opts.find((o) => o.base);
  const traits = item.opts.filter((o) => !o.base);
  // オプション値の表示: 固定値ステ(atkFlat/hpFlat)は「+N」、%ステは「+N%」。
  const fmtVal = (meta, v) => (meta?.flat ? `+${Math.round(v)}` : `+${Math.round(v * 1000) / 10}%`);
  // 主ステ(部位の基礎)= TBHの「攻撃力/防御力 NNN」に相当。大きく出す
  const baseMeta = base ? STAT_META[base.stat] : null;
  const mainRow = base
    ? `<div class="ip-main"><span>${baseMeta?.label ?? base.stat}</span>` +
      `<b>${fmtVal(baseMeta, base.value)}</b></div>`
    : "";
  // 特性(旧・固有ステータス)。各行は「- ラベル …… +X% or +N」、品質で色付け
  const traitRow = (o) => {
    const meta = STAT_META[o.stat];
    const q = optQuality(item, o);
    const qClass = q >= 0.9 ? "q-max" : q >= 0.6 ? "q-high" : "";
    return (
      `<div class="ip-stat${meta?.unique ? " ip-stat-unique" : ""}">` +
      `<span class="ip-stat-dash">−</span>` +
      `<span class="ip-stat-label">${meta?.label ?? o.stat}</span>` +
      `<b class="ip-stat-val ${qClass}">${fmtVal(meta, o.value)}${q >= 0.9 ? " ✦" : ""}</b>` +
      `</div>`
    );
  };
  // 装備に必要なレベル = 部位の解放Lv と 装備自体のLv の大きいほう。
  // いま見ているタスモンがそのLvに達していなければ装備不可 → 赤字で「Lv◯必要」。
  const reqLv = Math.max(PART_UNLOCK[item.part ?? inferPart(item)] ?? 1, item.lv ?? 1);
  const reqRefMon = state.monsters[currentDetailId] ?? leader(state);
  const canEquip = !reqRefMon || reqRefMon.level >= reqLv;
  return (
    `<div class="ip-panel">` +
    `<div class="ip-name${item.uniqueId ? " ip-name-unique" : ""}" style="color:${irm.color};border-color:${irm.color}">${item.name}` +
    (item.uniqueId ? `<span class="ip-tag ip-tag-unique">ユニーク</span>` : "") +
    (opts.tag ? `<span class="ip-tag">${opts.tag}</span>` : "") +
    `</div>` +
    `<div class="ip-head">` +
    `<span class="ip-icon" style="border-color:${irm.color};background:${rarityCellBg(irm)}">` +
    `<img src="${itemIconCanvas(item, 44).toDataURL()}" width="44" height="44">${materiaColHtml(item)}</span>` +
    `<div class="ip-head-info">` +
    `<div class="ip-grade" style="color:${irm.color}">${irm.label}等級 ${"★".repeat(irm.stars)} ` +
    `<span class="ip-part-tag">${
      item.charmKind && CHARM_KINDS[item.charmKind]
        ? CHARM_KINDS[item.charmKind].label
        : PARTS[item.part ?? inferPart(item)]?.label ?? "?"
    }</span>` +
    `<span class="ip-lv">Lv.${item.lv ?? 1}</span></div>` +
    // 武器・サブ武器のジョブ専用表記(2026-07-12 FB)。装備できないロールなら赤字
    (item.role && ROLE_WEAPONS[item.role]
      ? `<div class="ip-grade" style="color:${
          reqRefMon && jobRoleOf(reqRefMon) !== item.role ? "#ff8a7a" : ROLE_META[item.role]?.color ?? "#cbbc94"
        }">${roleIconHtml(ROLE_META[item.role] ?? {}, 11)} ${ROLE_WEAPONS[item.role].label}専用</div>`
      : "") +
    mainRow +
    `<div class="ip-score">装備スコア <b>${itemScore(item)}</b></div>` +
    `</div></div>` +
    (traits.length
      ? `<div class="ip-sec">特性</div>${traits.map(traitRow).join("")}`
      : `<div class="ip-sec ip-sec-empty">特性なし</div>`) +
    // 細工スロット(2026-07-19 v3): TBH式に埋まり/空きを一覧で見せる。
    // イモータル未満でも旧行(移行済み)があれば表示する
    ((enhanceSlotsOf(item).length > 0 || (item.enhances ?? []).some(Boolean))
      ? `<div class="ip-sec">細工スロット</div>` +
        (enhanceSlotsOf(item).length > 0 ? enhanceSlotsOf(item) : (item.enhances ?? []).map(() => "carve"))
          .map((kindKey, i) => {
            const line = item.enhances?.[i];
            const kind = ENHANCE_KINDS[kindKey];
            if (!line) {
              return `<div class="ip-stat ip-stat-empty"><span class="ip-stat-dash">−</span>` +
                `<span class="ip-stat-label">空きスロット(${kind.label})</span><b class="ip-stat-val"></b></div>`;
            }
            const g = ENHANCE_GRADES[line.grade] ?? ENHANCE_GRADES.basic;
            const label = line.skill
              ? `スキル付与「${SKILLS[line.skill]?.name ?? line.skill}」`
              : STAT_META[line.stat]?.label ?? line.stat;
            const val = line.skill ? "" : fmtVal(STAT_META[line.stat], line.value);
            return `<div class="ip-stat ip-stat-enhance"><span class="ip-stat-dash">${kind.icon}</span>` +
              `<span class="ip-stat-label" style="color:${g.color}">${label}</span>` +
              `<b class="ip-stat-val">${val}</b></div>`;
          })
          .join("")
      : "") +
    (item.uniqueId && item.legendary?.lore
      // 飾りの引用符は**別のテキストノードに分ける**(2026-08-13 Haru報告:
      // 英語版でユニーク装備の一文だけ日本語のまま残っていた)。
      // 「❝ 本文 ❞」を1つのテキストノードにすると、辞書に本文の対訳があっても
      // 飾りごと1文字列として照合されて引けない。飾りはspanで挟んで本文を独立させる
      ? `<div style="margin:5px 2px 2px;font-size:10px;line-height:1.5;color:#c8b7ff;font-style:italic"><span>❝</span> <span>${item.legendary.lore}</span> <span>❞</span></div>`
      : "") +
    // 戦闘力に直結しない特殊オプション(2026-08-11)。「わかりやすいか」対策で
    // 数値には出ない効果もここで必ず明示する(隠れた効果を作らない)
    (item.special
      ? `<div style="margin:4px 2px 0;display:flex;gap:6px;flex-wrap:wrap;font-size:10px;font-weight:700">` +
        (item.special.shiny
          ? `<span style="color:#ffd76a;border:1px solid #7a6a2a;border-radius:8px;padding:0 6px">✨ 装備中は色違いになる</span>`
          : "") +
        (item.special.auraTier
          ? `<span style="color:${item.special.auraColor ?? "#c8b7ff"};border:1px solid #5a4a7a;border-radius:8px;padding:0 6px">🌟 戦闘中オーラを纏う</span>`
          : "") +
        `</div>`
      : "") +
    (item.mintNo || item.season || item.soul
      ? `<div style="margin:4px 2px 0;display:flex;gap:6px;flex-wrap:wrap;font-size:10px;font-weight:700">` +
        (item.mintNo ? `<span style="color:#ffe082;border:1px solid #7a6a2a;border-radius:8px;padding:0 6px">刻印 No.${String(item.mintNo).padStart(4, "0")}</span>` : "") +
        (item.season ? `<span style="color:#8af0c0;border:1px solid #2a6a55;border-radius:8px;padding:0 6px">限定 ${item.season}</span>` : "") +
        (item.soul
          ? `<span style="color:#ffb08a;border:1px solid #7a4a2a;border-radius:8px;padding:0 6px">⚡ ${item.soul.shiny ? "★" : ""}${item.soul.name}(${AWAKENING.label[item.soul.awakening] ?? "覚醒"})の魂</span>`
          : "") +
        `</div>`
      : "") +
    // 出品できない装備に「取引可能」と出すのは嘘になる(2026-07-15 出品ゲート導入)。
    // 低レア(全ドロップの92%)はBotの燃料なので出品不可 = ここで正直に言う。
    // 交易品の実装前は取引の話自体を出さない(2026-08-05 Haru指示・TRADE_ENABLED)。
    // 2026-08-11 FB「装備の説明文一番下の説明がおかしい」: 取引の話を出さないだけの
    // つもりが、左側に何も無い空の行(区切り線だけ)になっていた。装備条件ラベルを
    // 添えて「この行は装備条件を表示している」と分かるようにする
    (!TRADE_ENABLED
      ? `<div class="ip-trade ip-trade-no"><span>装備条件</span>`
      : marketListable(item).ok
        ? `<div class="ip-trade"><span>取引可能</span> <b>${formatNum(marketValueEstimate(item))} G</b>`
        : `<div class="ip-trade ip-trade-no"><span>出品不可</span> <b>${RARITY_META[MARKET_MIN_RARITY].label}以上のみ</b>`) +
    `<span class="ip-req${canEquip ? "" : " req-fail"}">${canEquip ? `装備Lv.${reqLv}` : `Lv.${reqLv} 必要`}</span></div>` +
    (opts.equipped ? `<div class="ip-equipped">EQUIPPED</div>` : "") +
    `</div>`
  );
}

// ロック操作のヒント文(2026-08-11 FB「隠した最強装備の記述が残っている」対策)。
// BEST_EQUIP_UI_ENABLED分岐は、テンプレ内の${}に条件断片を差し込むと
// i18n監査の骨格ドライラン(${}を一律センチネル値に置換して検証)が「(売却・合成1から保護)」
// のような壊れた骨格を作ってしまうため、**文ごと丸ごと出し分ける**(辞書は両方とも登録済み)。
// 2026-08-11 FB「クリックすると装備だから記述が違うよ」: withHint=trueで呼ばれるのは
// itemCell(9620行)の持ち物系グリッドで、そこはクリック=即装備(2026-07-08指示で別窓は無し)。
// storage=trueは倉庫グリッド用(クリック=持ち物へ引き出す)。同じ理由で冒頭句も丸ごと出し分ける
function lockHintHtml(item, storage = false) {
  const lockLabel = item.locked ? "ロック解除" : "ロック";
  if (storage) {
    return BEST_EQUIP_UI_ENABLED
      ? `<div class="tt-hint">クリックで 持ち物へ 引き出す ・ <b>Ctrl+クリックで${lockLabel}</b>(売却・合成・最強装備から保護)</div>`
      : `<div class="tt-hint">クリックで 持ち物へ 引き出す ・ <b>Ctrl+クリックで${lockLabel}</b>(売却・合成から保護)</div>`;
  }
  return BEST_EQUIP_UI_ENABLED
    ? `<div class="tt-hint">クリックで 装備 ・ <b>Ctrl+クリックで${lockLabel}</b>(売却・合成・最強装備から保護)</div>`
    : `<div class="tt-hint">クリックで 装備 ・ <b>Ctrl+クリックで${lockLabel}</b>(売却・合成から保護)</div>`;
}
function itemTooltipHtml(item, withHint = true) {
  // ホバー: 参照キャラが同部位を装備中なら「選択中|装備中」を横並びで比較オーバーレイ。
  // 未装備/自分自身なら主パネル1枚。
  const refMon = state.monsters[currentDetailId] ?? leader(state);
  const part = item.part ?? inferPart(item);
  // アクセは3枠あり種別も違うため、「同じ種別(指輪/イヤリング/ネックレス)」の
  // 装備中とだけ比較する(2026-07-13 FB「アクセの比較がおかしい」:
  // ネックレスとイヤリングが比較されていた)
  const equipped = (refMon?.equipment ?? []).find(
    (it) =>
      (it.part ?? inferPart(it)) === part &&
      (part !== "charm" || (it.charmKind ?? "ring") === (item.charmKind ?? "ring")),
  );
  const isSelf = equipped && equipped.id === item.id;
  if (equipped && !isSelf) {
    // 2枚横並び + 付け替え差分(TBHのオーバーレイ比較)
    return (
      `<div class="ip-compare tt-compare-wide">` +
      itemPanelHtml(item, { tag: "▶ 選択中" }) +
      itemPanelHtml(equipped, { equipped: true, tag: `${SPECIES[refMon.speciesId].name.slice(0, 5)}` }) +
      `</div>` +
      compareDiffHtml(item, equipped, refMon) +
      (withHint ? lockHintHtml(item, withHint === "storage") : "")
    );
  }
  return (
    itemPanelHtml(item) +
    compareWithEquippedHtml(item) +
    (withHint ? lockHintHtml(item) : "")
  );
}

// いま見ているキャラ(詳細表示中/いなければリーダー)の同部位装備との差分。
// +は緑・-は赤。「付け替えたらどうなるか」がホバーだけでわかる。
// 選択中itemと、装備中equippedのステータス差分サマリ(緑=上がる/赤=下がる)。
function compareDiffHtml(item, equipped, refMon) {
  const refName = refMon ? SPECIES[refMon.speciesId].name : "";
  const val = (arr, statKey) => arr.find((o) => o.stat === statKey)?.value ?? 0;
  const statKeys = [...new Set([...item.opts, ...equipped.opts].map((o) => o.stat))];
  // 2026-08-11 FB「変化値は改行しないで並列に表記」: 旧仕様はステ1つにつき
  // .tt-diff-row を1個(=1行)生成して縦に積んでいた。1個の横並び行(tt-diff-row)の
  // 中に全ステのtt-diff-itemを詰める形へ変更(折り返しはOK・改行での縦積みをやめる)
  const diffItems = statKeys
    .map((statKey) => {
      const d = val(item.opts, statKey) - val(equipped.opts, statKey);
      if (Math.abs(d) < 0.0005) return "";
      // 固定値ステ(atkFlat/hpFlat)は実数で表示(%化すると+12900%のような誤表示になる)
      const isFlat = !!STAT_META[statKey]?.flat;
      const shown = isFlat ? `${d > 0 ? "+" : ""}${formatNum(Math.round(d))}` : `${d > 0 ? "+" : ""}${Math.round(d * 1000) / 10}%`;
      return (
        `<span class="tt-diff-item"><span>${STAT_META[statKey]?.label ?? statKey}</span>` +
        `<b class="${d > 0 ? "diff-up" : "diff-down"}">${shown}</b></span>`
      );
    })
    .join("");
  const diffRows = '<div class="tt-diff-row">' + (diffItems || '<span>ステータスの 違いなし</span>') + "</div>";
  // 2026-08-10 FB「付け替えたら総合戦力がどう変わるか大きく表示して」:
  // 個別ステの上下だけでは「結局強くなるのか」が一目で分からなかった。
  // 進化演出のbefore→after(evo-power-hero)と同じ考え方をツールチップにも適用する
  const powerHero = refMon ? equipPowerCompareHtml(item, refMon) : "";
  return (
    `<div class="tt-compare">` +
    powerHero +
    `<div class="tt-compare-head">▶付け替えると(${refName})</div>` +
    diffRows +
    `</div>`
  );
}

// そのジョブでは装備できない武器・サブ武器か(2026-08-11 FB「装備できないジョブの
// 装備とも戦力変化が表示されてしまう」)。判定はロック警告(itemPanelHtmlの
// ジョブ不一致赤字表示・equipItemの装備拒否)と同じ式に揃える
function roleMismatch(item, refMon) {
  const part = item.part ?? inferPart(item);
  return !!(item.role && (part === "weapon" || part === "sub") && refMon && jobRoleOf(refMon) !== item.role);
}

// 装備を付け替えた場合の総合戦闘力(before→after)を大きく見せる一段。
// 装備配列を差し替えた浅いコピーで測る(state.js の powerWith と同じ考え方)
function equipPowerCompareHtml(item, refMon) {
  if (roleMismatch(item, refMon)) return ""; // そもそも装備できないので変化を語らない
  const part = item.part ?? inferPart(item);
  const before = powerScore(refMon);
  const afterEquipment = (refMon.equipment ?? []).filter((it) => (it.part ?? inferPart(it)) !== part).concat(item);
  const after = powerScoreWith(refMon, afterEquipment);
  // 2026-08-12 FB「装備によって総合戦力の変化値が表示されないものがある」: powerScoreは
  // 攻撃力+スキルDPS(nuke限定)+最大HP/10の式で、CDR等クールタイム系のステはヒーラー等
  // 非nukeスキル持ちだと式に一切乗らない(skillDps=0固定)。そのため差分行(下段)には
  // 実在するステ差が出ているのに、この式だけ0になり枠ごと消えて「表示されたりされな
  // かったり」に見えていた。式そのもの(戦力ランキング/最強装備選定と共有)は難易度
  // 番人の対象で迂闊に触れないため、表示側は「差が無いことも含めて必ず出す」方針にする
  const cls = after > before ? "diff-up" : after < before ? "diff-down" : "";
  const delta = after - before;
  const deltaLabel = delta === 0 ? "±0" : `${delta > 0 ? "+" : ""}${formatNum(delta)}`;
  // 2026-08-12 FB「+24を271の隣に配置して」: 従来は後ろ(afterの数値)の下に別行で
  // 差分を出していたが、数値の右隣に並べる指定に変更(改行させない)
  return (
    `<div class="tt-power-hero">` +
    `<div class="tt-power-label">総合戦闘力</div>` +
    `<div class="tt-power-nums"><span class="tt-power-before">${formatNum(before)}</span>` +
    `<span class="tt-power-arrow">▶</span>` +
    `<b class="tt-power-after ${cls}">${formatNum(after)}</b>` +
    `<span class="tt-power-delta ${cls}">${deltaLabel}</span></div>` +
    `</div>`
  );
}

// ホバー用: 参照キャラの同部位装備との差分要約(未装備/装備中も明示)。
function compareWithEquippedHtml(item) {
  const refMon = state.monsters[currentDetailId] ?? leader(state);
  if (!refMon) return "";
  const part = item.part ?? inferPart(item);
  const equipped = (refMon.equipment ?? []).find((it) => (it.part ?? inferPart(it)) === part);
  const refName = SPECIES[refMon.speciesId].name;
  if (!equipped) {
    return (
      `<div class="tt-compare">` +
      equipPowerCompareHtml(item, refMon) +
      `<div class="tt-compare-head">${refName}の${partLabel(item)}: 未装備(まるごと強化)</div></div>`
    );
  }
  if (equipped.id === item.id) return "";
  return compareDiffHtml(item, equipped, refMon);
}

// クリック時の固定ツールチップ。loc: "inv"(インベントリ) | "storage"(倉庫)
function itemActionButtons(item, loc = "inv") {
  const done = () => {
    hideTooltip(true);
    closeItemWindow(); // 操作したら装備詳細ウィンドウは閉じる(アイテムが移動するため)
    renderItems();
    if (openOrder.includes("storage")) renderStorage();
    if (openOrder.includes("detail")) renderDetail(currentDetailId);
    if (openOrder.includes("cube")) renderCube();
    save();
  };

  const actions = document.createElement("div");
  actions.className = "tt-actions";

  if (loc === "storage") {
    // 倉庫のアイテムは「引き出す」だけ(操作はインベントリで)
    const outBtn = document.createElement("button");
    outBtn.textContent = "引き出す";
    outBtn.addEventListener("click", () => {
      const result = moveToInventory(state, item.id);
      if (result.error) {
        toast(result.error);
        return;
      }
      done();
    });
    actions.appendChild(outBtn);
    return actions;
  }

  for (const mon of partyMonsters(state)) {
    const sp = SPECIES[mon.speciesId];
    const btn = document.createElement("button");
    btn.textContent = `${sp.name.slice(0, 5)}に装備`;
    btn.disabled = mon.level < (PART_UNLOCK[item.part ?? "weapon"] ?? 1);
    btn.addEventListener("click", () => {
      const result = equipItem(state, mon.id, item.id);
      if (result.error) {
        toast(result.error);
        return;
      }
      playerHp = Math.min(playerHp, partyMaxHp());
      toast(`${sp.name} に「${item.name}」を 装備した`);
      done();
    });
    actions.appendChild(btn);
  }

  const rerollBtn = document.createElement("button");
  rerollBtn.textContent = `打直 ${formatGold(rerollCost(item))}G`;
  rerollBtn.addEventListener("click", () => {
    const before = item.opts.map((o) => ({ ...o })); // ビフォーを控える
    const result = rerollItem(state, item.id);
    if (result.error) {
      toast(result.error);
      return;
    }
    toast("⚒ 打ち直した! 結果はビフォー→アフターで表示中", "#ffe9a8");
    // 窓は閉じずに、同じアイテムの新旧比較を出して開き直す
    lastRerollBefore = { itemId: item.id, opts: before };
    hideTooltip(true);
    renderItems();
    if (openOrder.includes("storage")) renderStorage();
    if (openOrder.includes("detail")) renderDetail(currentDetailId);
    openItemWindow(item, loc);
    save();
  });
  actions.appendChild(rerollBtn);

  const storeBtn = document.createElement("button");
  storeBtn.textContent = "預ける";
  storeBtn.addEventListener("click", () => {
    const result = moveToStorage(state, item.id);
    if (result.error) {
      toast(result.error);
      return;
    }
    done();
  });
  actions.appendChild(storeBtn);

  const sellBtn = document.createElement("button");
  sellBtn.textContent = `売る ${formatGold(itemSellPrice(item))}G`;
  sellBtn.addEventListener("click", () => {
    sellItem(state, item.id);
    toast(`「${item.name}」を ${formatGold(itemSellPrice(item))} GP で 売った`);
    done();
  });
  actions.appendChild(sellBtn);

  // ロックの入口をボタンとして常設(2026-07-28 FB「装備の固定と装備ロックが
  // どうすればいいかユーザー側がわからない」)。Ctrl+クリックは説明を読まないと
  // 存在に気づけない=入口として弱すぎた。ショートカットとしては残す
  const lockBtn = document.createElement("button");
  lockBtn.textContent = item.locked ? "🔓 ロック解除" : "🔒 ロック";
  lockBtn.title = BEST_EQUIP_UI_ENABLED
    ? "ロック中は 売却・合成・最強装備の入れ替えから守られる"
    : "ロック中は 売却・合成から守られる";
  lockBtn.addEventListener("click", () => {
    item.locked = !item.locked;
    toast(
      item.locked
        ? (BEST_EQUIP_UI_ENABLED
            ? `🔒「${item.name}」をロックした(売却・合成・最強装備から保護)`
            : `🔒「${item.name}」をロックした(売却・合成から保護)`)
        : `🔓「${item.name}」のロックを外した`,
    );
    done();
  });
  actions.appendChild(lockBtn);

  return actions;
}

// ---- ドラッグ&ドロップ(モンスター/装備の移動) ----
// mon:<id> = モンスター、item:<id>:<loc> = 装備。ドロップ先が種類ごとに処理する
function makeDragSource(el, data) {
  el.draggable = true;
  // セル内のcanvas/imgは、そのまま掴むとブラウザ既定の「画像ドラッグ」に
  // 化けてセルのdragstartが発火しないことがある。子メディアのドラッグを禁じ、
  // 掴む位置に関わらず必ずセルのD&Dが動くようにする(入れ替えD&Dの不発対策)
  for (const media of el.querySelectorAll("canvas,img")) media.draggable = false;
  el.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/plain", data);
    ev.dataTransfer.effectAllowed = "move";
    hideTooltip(true);
  });
}

function makeDropTarget(el, onDrop) {
  el.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    el.classList.add("drop-ready");
  });
  el.addEventListener("dragleave", () => el.classList.remove("drop-ready"));
  el.addEventListener("drop", (ev) => {
    ev.preventDefault();
    el.classList.remove("drop-ready");
    onDrop(ev.dataTransfer.getData("text/plain") ?? "");
  });
}

// 装備をモンスターへドロップ(倉庫からでも直接装備できる)
function dropEquipTo(monId, data) {
  if (!data.startsWith("item:")) return false;
  const [, itemId, loc] = data.split(":");
  if (loc === "storage") {
    const moved = moveToInventory(state, itemId);
    if (moved.error) {
      toast(moved.error);
      return true;
    }
  }
  const item = state.items.find((it) => it.id === itemId);
  if (!item) return true;
  const result = equipItem(state, monId, itemId);
  if (result.error) {
    toast(result.error);
  } else {
    playerHp = Math.min(playerHp, partyMaxHp());
    toast(`${SPECIES[state.monsters[monId].speciesId].name} に「${item.name}」を装備した`);
  }
  renderItems();
  if (openOrder.includes("storage")) renderStorage();
  refreshHeroInv();
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  save();
  return true;
}

// モンスターをパーティへドロップ(空きなら追加・スロット指定なら入れ替え)
function dropMonToParty(data, slotIndex = null) {
  if (!data.startsWith("mon:")) return false;
  const monId = data.slice(4);
  const mon = state.monsters[monId];
  if (!mon) return true;
  if (onExpedition(state, monId)) {
    toast("🧭 探索中の子は パーティに入れられない");
    return true;
  }
  const curIdx = state.party.indexOf(monId);
  if (curIdx !== -1) {
    // 既にパーティにいる → 枠へのドロップは「並べ替え(位置スワップ)」
    if (slotIndex != null && slotIndex !== curIdx && state.party[slotIndex]) {
      const tmp = state.party[slotIndex];
      state.party[slotIndex] = monId;
      state.party[curIdx] = tmp;
    } else {
      toast("もう パーティにいる");
      return true;
    }
  } else if (slotIndex != null && state.party[slotIndex]) {
    state.party[slotIndex] = monId; // その枠と入れ替え
  } else if (state.party.length < MAX_PARTY) {
    state.party.push(monId);
  } else {
    toast(`パーティは 最大 ${MAX_PARTY}体(枠にドロップで入れ替え)`);
    return true;
  }
  playerHp = partyMaxHp();
  syncSceneParty();
  if (openOrder.includes("box")) renderBox();
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  if (curIdx === -1) toast(`${baseNameOf(mon)} をパーティに入れた!`, "#ffe9a8");
  save();
  return true;
}

// パーティから1体だけ外す(2026-08-13 Haru指示「キャラをパーティから外せないので
// 右クリックでパーティから外れるようにしてほしい、かつドラッグアンドドロップでも」)。
// 入口は3つ(パーティ枠の右クリック / タスモン窓へドロップ / お気に入り候補へドロップ)
// あるが、**外す処理はこの1関数に集約**する。
// 「同じ概念にUIの入口が2つ以上あるものは実装を1か所にまとめる」— 入口ごとに
// 書くと、片方だけ最低人数チェックや再描画を忘れて挙動が食い違う
function removeFromParty(monId) {
  const mon = state.monsters[monId];
  if (!mon) return false;
  if (state.party.indexOf(monId) === -1) return false; // パーティにいない
  if (!togglePartyMember(state, monId)) {
    // togglePartyMember は最後の1体を外そうとしたときだけ false
    toast("パーティは 最低1体 必要", "#ff9a9a");
    return false;
  }
  playerHp = Math.min(playerHp, partyMaxHp());
  syncSceneParty();
  hideTooltip(true);
  if (openOrder.includes("box")) renderBox();
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  toast(`${baseNameOf(mon)} をパーティから外した`, "#8ad8ff");
  save();
  return true;
}

// パーティの子を「外す」ドロップ(タスモン窓・お気に入り候補が受け皿)。
// パーティ外の子をドロップしても何も起きない(= false を返して他の処理へ譲る)
function dropMonOutOfParty(data) {
  if (!data.startsWith("mon:")) return false;
  const monId = data.slice(4);
  if (state.party.indexOf(monId) === -1) return false;
  removeFromParty(monId);
  return true;
}

// レア度で塗ったセル背景(TBH風: 背景色でひと目でレア度がわかる)
function rarityCellBg(rm) {
  return `linear-gradient(160deg, ${rm.color}d9 0%, ${rm.color}59 55%, rgba(6, 7, 14, 0.88) 140%)`;
}

// アイテム1個ぶんのグリッドセルを作る(倉庫・装備ピッカー共用)。
// クリック=装備詳細ウィンドウ(比較つき) / ダブルクリック=すぐアクション(装備など)
// FF7マテリア風(2026-07-21 FB v2→v5): 細工スロットを持つ装備(レジェンド以上)は
// アイコンに玉を並べる。空きスロットは「埋める穴」(くぼみ)として見せる。
// v5(同日FB「同じ種類なら横並びに表示」): 種別ごとに1行=同種の玉は横並び、
// 行は 装飾→碑文→彫刻 の順で縦に積む(スロット一覧のグループ順と同じ)。
// 玉の色=スロット種(彫刻=紅/碑文=蒼/装飾=翠)、等級で豪華さが変わる
// (上級=明るく/属性=紫リング/特級=金リング+鼓動/スキル=虹回転)
const MATERIA_COLORS = { carve: "#ff6a5a", inscribe: "#5aa8ff", adorn: "#5ae08a" };
function materiaOrbSpec(slotKind, line) {
  const color = MATERIA_COLORS[line?.kind ?? slotKind] ?? "#cdd8ef";
  let cls = "materia-orb";
  if (!line) cls += " empty";
  else {
    cls += ` grade-${line.grade ?? "basic"}`;
    if (line.skill) cls += " skill";
  }
  return { cls, color };
}
// 種別ごとの行(表示順=装飾→碑文→彫刻)。値は元スロットの添字の配列
function materiaRowsOf(slots) {
  const byKind = new Map();
  for (const i of enhanceSlotDisplayOrder(slots)) {
    if (!byKind.has(slots[i])) byKind.set(slots[i], []);
    byKind.get(slots[i]).push(i);
  }
  return [...byKind.values()];
}
function materiaColEl(item) {
  const slots = enhanceSlotsOf(item);
  if (slots.length === 0) return null;
  const lines = item.enhances ?? [];
  const col = document.createElement("span");
  col.className = "materia-col";
  for (const idxs of materiaRowsOf(slots)) {
    const row = document.createElement("span");
    row.className = "materia-row";
    for (const i of idxs) {
      const { cls, color } = materiaOrbSpec(slots[i], lines[i] ?? null);
      const orb = document.createElement("i");
      orb.className = cls;
      orb.style.setProperty("--mo-color", color);
      row.appendChild(orb);
    }
    col.appendChild(row);
  }
  return col;
}
function materiaColHtml(item) {
  const slots = enhanceSlotsOf(item);
  if (slots.length === 0) return "";
  const lines = item.enhances ?? [];
  const rows = materiaRowsOf(slots).map((idxs) => {
    const orbs = idxs.map((i) => {
      const { cls, color } = materiaOrbSpec(slots[i], lines[i] ?? null);
      return `<i class="${cls}" style="--mo-color:${color}"></i>`;
    }).join("");
    return `<span class="materia-row">${orbs}</span>`;
  }).join("");
  return `<span class="materia-col">${rows}</span>`;
}
function itemHasMateria(item) {
  return (item.enhances ?? []).some(Boolean);
}
function itemCell(item, onClick, loc = "inv", iconSize = 36) {
  const irm = RARITY_META[item.rarity];
  const cell = document.createElement("div");
  cell.className = "inv-cell";
  cell.style.borderColor = irm.color;
  cell.style.background = rarityCellBg(irm);
  if (irm.stars >= 4) cell.style.boxShadow = `0 0 ${irm.stars}px ${irm.color}66`;
  cell.appendChild(itemIconCanvas(item, iconSize));
  const materia = materiaColEl(item);
  if (materia) {
    cell.classList.add("has-sockets");
    if (itemHasMateria(item)) {
      cell.classList.add("has-materia");
      // 高レアの外光はインラインshadowなのでクラスの内枠と両立させる
      if (cell.style.boxShadow) {
        cell.style.boxShadow += ", inset 0 0 0 1px rgba(255,214,122,.4), inset 0 0 7px rgba(255,214,122,.18)";
      }
    }
    cell.appendChild(materia);
  }
  if (item.uniqueId) cell.classList.add("cell-unique"); // ユニークは光って分かる(2026-07-13 FB)
  // ロック(2026-07-13 FB「アイテムロック機能(削除や使用の保護)」): Ctrl+クリックで切替。
  // ロック中は 捨てる/まとめ売り/錬金術/合成素材 に使えない
  if (item.locked) {
    cell.classList.add("item-locked");
    const lk = document.createElement("span");
    lk.className = "cell-lock-badge";
    lk.textContent = "🔒";
    cell.appendChild(lk);
  }
  cell.addEventListener(
    "click",
    (ev) => {
      if (!ev.ctrlKey) return;
      ev.stopPropagation();
      ev.preventDefault();
      item.locked = !item.locked;
      toast(
      item.locked
        ? (BEST_EQUIP_UI_ENABLED
            ? `🔒「${item.name}」をロックした(売却・合成・最強装備から保護)`
            : `🔒「${item.name}」をロックした(売却・合成から保護)`)
        : `🔓「${item.name}」のロックを外した`,
    );
      refreshInvViews();
      if (openOrder.includes("detail")) refreshHeroInv();
      save();
    },
    true,
  );
  makeDragSource(cell, `item:${item.id}:${loc}`);
  // 部位バッジは廃止のまま(生成アイコンで種類は分かる)。
  // レベルバッジは復活(2026-07-13 FB「装備Lvがなくなっちゃった。わかりづらいから戻して」)
  const lvb = document.createElement("span");
  lvb.className = "cell-lv";
  lvb.textContent = `L${item.lv ?? 1}`;
  cell.appendChild(lvb);
  // 合成スロットにセット中の装備は✓で分かるように(2026-07-12 FB)。
  // 合成窓が閉じているときは出さない(2026-07-16 FB「閉じてるのに✓が残ってる」)
  if (openOrder.includes("cube") && cubeSel.includes(item.id)) {
    cell.classList.add("in-cube");
    const ck = document.createElement("span");
    ck.className = "cell-cube-check";
    ck.textContent = "✓";
    ck.title = "アイテム合成のスロットにセット中";
    cell.appendChild(ck);
  }
  // 新着マーク(宝箱を開けたばかりの装備)。従来は装備詳細窓を開いたときだけ消えたが、
  // その窓を開かない導線だとNEWが永久に残る不具合があった。カーソルを合わせた=見た時点で
  // 消す(2026-07-09修正)。このセルだけ即時更新し、保存もする。
  if (item.isNew) {
    cell.classList.add("is-new");
    const nb = document.createElement("span");
    nb.className = "cell-new";
    nb.textContent = "NEW";
    cell.appendChild(nb);
    cell.addEventListener(
      "mouseenter",
      () => {
        if (!item.isNew) return;
        item.isNew = false;
        cell.classList.remove("is-new");
        nb.remove();
        save();
      },
      { once: true },
    );
  }
  // TBH式ジャンクマーク: 右クリックで✗印をトグル。まとめて売却の対象になる
  if (loc !== "select") {
    if (item.junk) cell.classList.add("junk");
    const mark = document.createElement("span");
    mark.className = "cell-junk";
    mark.textContent = "✗";
    cell.appendChild(mark);
    // keepScroll: 右クリックの再描画で一覧が先頭へ飛ばないようにする(2026-07-15 FB)
    cell.addEventListener("contextmenu", (ev) => keepScroll(() => {
      ev.preventDefault();
      hideTooltip(true);
      // 最優先: 合成スロットにセット中なら右クリックで選択解除(2026-07-13 FB)
      if (cubeSel.includes(item.id)) {
        cubeSel = cubeSel.filter((id) => id !== item.id);
        toast("合成スロットから 外した", "#9aa4c8");
        if (openOrder.includes("cube")) renderCube();
        else {
          if (openOrder.includes("items")) renderItems();
          if (openOrder.includes("storage")) renderStorage();
          refreshHeroInv();
        }
        return;
      }
      // 合成窓が開いていれば右クリックでキューブへ送る。
      if (openOrder.includes("cube")) {
        cubeAddItem(item.id);
        return;
      }
      // 交易船が開いていれば右クリックで積み込む(2026-07-13)
      if (openOrder.includes("trade")) {
        tradeLoadItem(item.id);
        return;
      }
      // 倉庫窓が開いていれば、持ち物↔倉庫を右クリックで移動(LL)。
      if (openOrder.includes("storage")) {
        if (loc === "storage") {
          const r = moveToInventory(state, item.id);
          if (r.error) {
            toast(r.error);
            return;
          }
          toast(`「${item.name}」を 持ち物へ`);
        } else {
          const r = moveToStorage(state, item.id);
          if (r.error) {
            toast(r.error);
            return;
          }
          toast(`「${item.name}」を 倉庫へ`);
        }
        refreshInvViews();
        save();
        return;
      }
      // どちらも閉じているときは従来どおり✗印(まとめ売り)をトグル。
      if (item.locked) return void toast("🔒 ロック中の装備は 売却対象にできない");
      item.junk = !item.junk;
      cell.classList.toggle("junk", !!item.junk);
      if (openOrder.includes("detail")) refreshHeroInv();
      save();
    }));
  }
  // クリック=装備(そのアクション)。詳細は別窓を出さず、ホバーのツールチップで十分
  // (2026-07-08ユーザー指示: 装備はクリックで装備・別窓は不要・カーソル合わせで十分)。
  // loc="storage"だけクリックの実際の挙動が違う(持ち物へ引き出す)ので、ヒント文もそこだけ分ける
  bindCellTooltip(cell, () => itemTooltipHtml(item, loc === "storage" ? "storage" : true), onClick);
  return cell;
}

// ジャンク(✗印)をまとめて売却する。対象はインベントリ+倉庫の item.junk 全部。
function sellAllJunk() {
  const junk = [...state.items, ...state.storage].filter((it) => it.junk);
  if (junk.length === 0) {
    toast("✗印のアイテムがない(右クリックで印をつける)");
    return;
  }
  let total = 0;
  for (const it of junk) {
    total += itemSellPrice(it);
    sellItem(state, it.id);
  }
  toast(`✗印の ${junk.length}個を ${formatGold(total)} GP で売った`, "#ffcf4a");
  if (openOrder.includes("detail")) refreshHeroInv();
  if (openOrder.includes("storage")) renderStorage();
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("cube")) renderCube();
  renderHud();
  save();
}

// ---- 装備詳細ウィンドウ(クリックで開く別窓。比較+全操作) ----
let itemWinCurrent = null; // { item, loc }
let lastRerollBefore = null; // { itemId, opts } 打ち直し直後のビフォー表示用

// 打ち直しのビフォー→アフター表(ステごとに 旧値 → 新値。上がり=緑/下がり=赤)
function rerollDiffHtml(item) {
  if (!lastRerollBefore || lastRerollBefore.itemId !== item.id) return "";
  const before = lastRerollBefore.opts;
  const val = (arr, stat) => arr.find((o) => o.stat === stat)?.value ?? 0;
  const stats = [...new Set([...before, ...item.opts].map((o) => o.stat))];
  const rows = stats
    .map((stat) => {
      const b = val(before, stat);
      const a = val(item.opts, stat);
      const fmt = (v) => (v > 0 ? `+${Math.round(v * 1000) / 10}%` : "─");
      const cls = a > b ? "diff-up" : a < b ? "diff-down" : "";
      return (
        `<div class="tt-diff-row"><span>${STAT_META[stat]?.label ?? stat}</span>` +
        `<b>${fmt(b)} → <span class="${cls}">${fmt(a)}</span></b></div>`
      );
    })
    .join("");
  return `<div class="tt-compare reroll-diff"><div class="tt-compare-head">⚒ 打ち直し結果(旧 → 新)</div>${rows}</div>`;
}
function openItemWindow(item, loc = "inv", quickAction = null) {
  if (item.isNew) {
    item.isNew = false; // 見たら新着マークを消す
    if (openOrder.includes("detail")) refreshHeroInv();
    if (openOrder.includes("items")) renderItems();
    if (openOrder.includes("storage")) renderStorage();
  }
  itemWinCurrent = { item, loc, quickAction };
  openWindow("item"); // 他のタブウィンドウと同じサブ枠に出す
}

function closeItemWindow() {
  if (openOrder.includes("item")) closeWindow("item");
  itemWinCurrent = null;
}

function renderItemWindow() {
  const body = $("item-body");
  body.innerHTML = "";
  if (!itemWinCurrent) {
    closeItemWindow(); // 中身がないのに枠だけ出るのを防ぐ
    return;
  }
  const { item, loc } = itemWinCurrent;
  // 打ち直し直後は新旧比較を最上部に出す
  const diff = rerollDiffHtml(item);
  if (diff) {
    const d = document.createElement("div");
    d.innerHTML = diff;
    body.appendChild(d);
  }
  // TBH式: 選んだ装備 |(装備中があれば)いま装備中 を2枚横並びで比較
  const refMon = state.monsters[currentDetailId] ?? leader(state);
  const part = item.part ?? inferPart(item);
  // アクセは3枠あり種別も違うため、「同じ種別(指輪/イヤリング/ネックレス)」の
  // 装備中とだけ比較する(2026-07-13 FB「アクセの比較がおかしい」:
  // ネックレスとイヤリングが比較されていた)
  const equipped = (refMon?.equipment ?? []).find(
    (it) =>
      (it.part ?? inferPart(it)) === part &&
      (part !== "charm" || (it.charmKind ?? "ring") === (item.charmKind ?? "ring")),
  );
  const compare = document.createElement("div");
  compare.className = "ip-compare";
  const isEquippedItem = equipped && equipped.id === item.id;
  compare.innerHTML =
    itemPanelHtml(item, { equipped: isEquippedItem, tag: isEquippedItem ? "" : "▶ 選択中" }) +
    (equipped && !isEquippedItem
      ? itemPanelHtml(equipped, { equipped: true, tag: `${SPECIES[refMon.speciesId].name.slice(0, 5)}` })
      : "");
  body.appendChild(compare);
  // 選択中↔装備中の差分サマリ(緑=上がる/赤=下がる)
  if (equipped && !isEquippedItem) {
    const d = document.createElement("div");
    d.innerHTML = compareDiffHtml(item, equipped, refMon);
    body.appendChild(d);
  }
  // 操作ボタン(装備/打直/預ける/売る)
  body.appendChild(itemActionButtons(item, loc));
}


// ---- 並び替え(装備・倉庫共通) ----
let itemSort = "rarity"; // "rarity" | "new" | "type"
const ITEM_SORTS = { rarity: "レア度", new: "新着", type: "部位" };

function sortItems(arr) {
  const a = [...arr];
  if (itemSort === "new") {
    a.sort((x, y) => y.obtainedAt - x.obtainedAt);
  } else if (itemSort === "type") {
    // 部位順(武器→鎧→兜→靴→盾→御守り)→ 同部位はレア度降順
    const pi = (it) => PART_ORDER.indexOf(it.part ?? inferPart(it));
    a.sort(
      (x, y) =>
        pi(x) - pi(y) ||
        RARITY_ORDER.indexOf(y.rarity) - RARITY_ORDER.indexOf(x.rarity) ||
        y.obtainedAt - x.obtainedAt,
    );
  } else {
    a.sort(
      (x, y) =>
        RARITY_ORDER.indexOf(y.rarity) - RARITY_ORDER.indexOf(x.rarity) ||
        y.obtainedAt - x.obtainedAt,
    );
  }
  return a;
}

// 並び替えチップの行を作る。rerender は選択後に呼ぶ再描画関数。
// showInvExpand=false で「＋枠」チップを出さない(2026-08-07: 倉庫窓では持ち物の
// 枠拡大ボタンをここでは重複させない。持ち物窓側の拡張ボタンに一本化)
function sortChipsRow(rerender, { showInvExpand = true } = {}) {
  const chips = document.createElement("div");
  chips.className = "filter-chips";
  const label = document.createElement("span");
  label.className = "sort-label";
  label.textContent = "並び:";
  chips.appendChild(label);
  for (const [key, name] of Object.entries(ITEM_SORTS)) {
    const chip = document.createElement("button");
    chip.textContent = name;
    chip.className = itemSort === key ? "chip on" : "chip";
    chip.addEventListener("click", () => {
      itemSort = key;
      rerender();
    });
    chips.appendChild(chip);
  }
  // インベントリ拡張ボタン(2026-07-10): その場で+枠を買える
  if (showInvExpand && invCapOf(state) < INV_CAP_MAX) {
    const expand = document.createElement("button");
    expand.className = "chip inv-expand";
    expand.style.marginLeft = "auto";
    const cost = invSlotCost(state);
    // 高額になるとチップが長くなり枠を突き抜けるため短縮表記(2026-07-21 FB「はみ出てる」)
    expand.textContent = `＋枠 ${state.items.length}/${invCapOf(state)} ・ ${cost >= 1_000_000 ? formatNum(cost) : formatGold(cost)}G`;
    expand.title = `持ち物の枠をゴールドで拡張(+${INV_CAP_STEP}枠 / ${formatGold(cost)}G)`;
    expand.classList.toggle("cant", state.gold < cost);
    expand.addEventListener("click", () => {
      const r = buyInvSlot(state);
      if (r.error) return void toast(r.error);
      toast(`持ち物の枠が ${invCapOf(state)} に拡張された!(-${formatGold(r.cost ?? 0)}G)`, "#ffe9a8");
      bumpMissionCounter(state, "expand"); // チュートリアル: 拡張を買った
      bumpMissionCounter(state, "expandInv"); // 種類別(持ち物)
      save();
      rerender();
    });
    chips.appendChild(expand);
  }
  return chips;
}

// 宝箱を1つ開けて、開封演出(獲得バナー)を出す。
function doOpenChest(chestId) {
  const result = openChest(state, chestId);
  if (result.error) {
    toast(result.error);
    return null;
  }
  sfx("chest");
  if (result.item) result.item.isNew = true; // 装備欄で新着マーク(見たら消える)
  passNotify(passProgress(state, "chests")); // タスモンパス任務(2026-07-20)
  // おまけの鍵(幕ボスの間の入場券)。出たらしっかり祝う。
  // 一括開封でも「鍵が出た」ことを取りこぼさないよう、HUDカウンター更新+履歴に残す。
  if (result.key) {
    gainFloat("🗝 ボスの鍵", "#ffcf4a");
    toast(`🗝 宝箱から ${keyLabelOf(state.difficulty ?? 0)}が出た!(${bossKeyCount(state, state.difficulty ?? 0)}本)幕ボスの間に挑める`, "#ffcf4a");
    celebrateLoot({
      kicker: "鍵を入手!",
      icon: keyIconEl(state.difficulty ?? 0, 52),
      title: keyLabelOf(state.difficulty ?? 0),
      sub: `所持 ${bossKeyCount(state, state.difficulty ?? 0)}本<br>この難易度の幕ボスの間に入れる`,
      rarity: "legend",
    });
    addLog(state, { kind: "鍵", rarity: "legend", text: `🗝 ${keyLabelOf(state.difficulty ?? 0)}を入手(所持${bossKeyCount(state, state.difficulty ?? 0)}本)` });
    renderHud(); // 🗝カウンターを即更新(単発開封パスでも取りこぼさない)
    flashKeyCounter();
  }
  return result.item;
}

// 英雄(拠点)ウィンドウのインベントリタブを最新化する。
// 宝箱開封・ガチャなど「英雄ウィンドウの外」で持ち物が増えたときに呼ぶ
// 装備の増減後に英雄窓を更新(装備スロットの中身が変わるため)
function refreshHeroInv() {
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  if (openOrder.includes("inv")) renderInvWindow(); // 2026-08-06: インベントリ別窓化
}

// 🗝カウンターをひと押しさせて「鍵が増えた」ことに気づかせる(QQ: 取りこぼし対策)。
function flashKeyCounter() {
  const el = $("key-count");
  if (!el) return;
  el.classList.remove("key-pop");
  void el.offsetWidth; // リフローでアニメを再起動
  el.classList.add("key-pop");
  setTimeout(() => el.classList.remove("key-pop"), 800);
}

// 持ち物・倉庫・合成・英雄インベントリを一括で最新化する。
// 一斉移動やD&Dの直後に「タブを切り替えないと反映されない」ズレを防ぐ(NN)。
function refreshInvViews() {
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("storage")) renderStorage();
  if (openOrder.includes("cube")) renderCube();
  refreshHeroInv();
  renderHud();
}

// 鍵/水晶(1点もの)のセルを作る。持ち物側と倉庫側で同じ見た目を使い、
// 右クリックで倉庫⇔持ち物を移動する(2026-07-15 FB「カギとか水晶も倉庫に入れられるように」)。
// stored: false=持ち物にあるぶん / true=倉庫に預けたぶん
function preciousCells({ stored, iconSize = 32 }) {
  const cells = [];
  const wantStored = !!stored;
  const move = (id) => {
    const r = wantStored ? movePreciousToInventory(state, id) : movePreciousToStorage(state, id);
    if (r.error) return void toast(r.error);
    toast(wantStored ? "貴重品を 持ち物へ" : "貴重品を 倉庫へ", "#8ad8ff");
    refreshInvViews();
    save();
  };
  for (const k of state.keyItems ?? []) {
    if (!!k.stored !== wantStored) continue;
    const cell = document.createElement("div");
    cell.className = "inv-cell precious-cell";
    // 背景も装備と同じレア度グラデで統一(2026-07-29 FB「背景の色をレアリティが
    // 分かるように装備と統一して」)
    const krm = RARITY_META[keyRarityOf(k.difficulty)] ?? RARITY_META.common;
    cell.style.borderColor = krm.color;
    cell.style.background = rarityCellBg(krm);
    cell.appendChild(keyIconEl(k.difficulty, iconSize));
    // 装備と同じくドラッグで倉庫⇔持ち物(2026-07-16 FB「鍵が倉庫に入らない」:
    // 右クリック導線しかなく、装備と同じ操作=ドラッグでは入らなかった)
    makeDragSource(cell, `precious:${k.id}:${wantStored ? "storage" : "inv"}`);
    cell.addEventListener("contextmenu", (ev) => keepScroll(() => {
      ev.preventDefault();
      hideTooltip(true);
      if (openOrder.includes("storage")) move(k.id);
      else if (openOrder.includes("trade") && !wantStored) tradeLoadPrecious(k.id);
    }));
    bindCellTooltip(cell, () =>
      `<div class="tt-name" style="color:${RARITY_META[keyRarityOf(k.difficulty)]?.color ?? "#ffcf4a"}">${keyLabelOf(k.difficulty)} <span class="ip-tag">${RARITY_META[keyRarityOf(k.difficulty)]?.label ?? ""}等級</span></div>` +
      `<div class="tt-opts">${DIFFICULTIES[k.difficulty]?.name ?? ""}の幕ボスの間(x-10)に入るとき1本消費${TRADE_ENABLED ? ` ・ 取引可能 想定相場 ${formatGold(preciousMarketEstimate(k))} G` : ""}` +
      (wantStored ? "<br>倉庫にあるあいだは使えない" : "") + `</div>` +
      `<div class="tt-hint">${openOrder.includes("storage") ? (wantStored ? "右クリックで 持ち物へ" : "右クリックで 倉庫へ") : "ポータルの👑面から使う"} ・ ID: ${k.id.slice(-6)}</div>`);
    cells.push(cell);
  }
  for (const c of state.crystalItems ?? []) {
    if (!!c.stored !== wantStored) continue;
    const cell = document.createElement("div");
    cell.className = "inv-cell precious-cell";
    const crm = RARITY_META[CRYSTAL_RARITY] ?? RARITY_META.common;
    cell.style.borderColor = crm.color;
    cell.style.background = rarityCellBg(crm);
    cell.appendChild(crystalIconEl(iconSize));
    makeDragSource(cell, `precious:${c.id}:${wantStored ? "storage" : "inv"}`);
    cell.addEventListener("contextmenu", (ev) => keepScroll(() => {
      ev.preventDefault();
      hideTooltip(true);
      if (openOrder.includes("storage")) move(c.id);
      else if (openOrder.includes("trade") && !wantStored) tradeLoadPrecious(c.id);
    }));
    bindCellTooltip(cell, () =>
      `<div class="tt-name" style="color:${RARITY_META[CRYSTAL_RARITY]?.color ?? "#c88aff"}">叡智の水晶 <span class="ip-tag">${RARITY_META[CRYSTAL_RARITY]?.label ?? ""}等級</span></div>` +
      `<div class="tt-opts">兆し(スフィア盤)を無料で初期化できる${TRADE_ENABLED ? ` ・ 取引可能 想定相場 ${formatGold(preciousMarketEstimate(c))} G` : ""}` +
      (wantStored ? "<br>倉庫にあるあいだは使えない" : "") + `</div>` +
      `<div class="tt-hint">${openOrder.includes("storage") ? (wantStored ? "右クリックで 持ち物へ" : "右クリックで 倉庫へ") : "スフィア盤の最下部から使う"} ・ ID: ${c.id.slice(-6)}</div>`);
    cells.push(cell);
  }
  // 進化石(2026-08-07 Haru指示「進化石はカギと同じくまとめず1個ずつ並べる」):
  // 以前は種類ごとに1マス+個数バッジだったが、鍵・水晶と同じく所持数ぶんだけ
  // セルを並べる(evoStonesはID無しの個数管理なので、セル自体は同じ見た目をN個複製)。
  // あわせて、アイテム合成(進化石の合成)の枠へドラッグ/右クリックで直接投入できるように
  // する(2026-08-05に作った合成窓内蔵の一覧chipは廃止し、持ち物側からの操作に一本化)
  {
    for (const kind of [...EVO_STONE_ROLES, "random"]) {
      const total = wantStored ? evoStoneStoredCount(state, kind) : evoStoneCount(state, kind);
      if (total <= 0) continue;
      const stone = EVO_STONES[kind];
      // レア度は種類ごとに固定(2026-07-29 Haru指示: ロール=イモータル/ランダム=アルカナ)。
      // セル背景は装備と同じレア度グラデで統一(同日FB)
      const srm = RARITY_META[evoStoneRarityOf(kind)] ?? RARITY_META.immortal;
      // ランダム石は合成の素材にできない(激レアドロップの価値を保つ)ので、
      // 持ち物にあるぶんだけ合成の投入対象にする
      const craftable = kind !== "random" && !wantStored;
      for (let i = 0; i < total; i++) {
        const cell = document.createElement("div");
        cell.className = "inv-cell precious-cell evo-stone-cell";
        cell.style.borderColor = srm.color;
        cell.style.background = rarityCellBg(srm);
        cell.appendChild(stoneIconEl(kind, iconSize));
        if (craftable) makeDragSource(cell, `stone:${kind}`);
        bindCellTooltip(cell, () =>
          `<div class="tt-name" style="color:${stone.color}">${stone.label} ×${total} <span class="ip-tag">${srm.label}等級</span></div>` +
          `<div class="tt-opts">${kind === "random" ? "進化の「ランダム枠」に1個必要 ・ 激レアドロップ(幕ボスでまれに)" : "同系統進化に1個必要 ・ 戦闘/幕ボスでドロップ"}` +
          (wantStored ? "<br>倉庫にあるあいだは使えない" : "") + `</div>` +
          (TRADE_ENABLED
            ? `<div class="tt-opts">取引可能 想定相場 ${formatGold(preciousMarketEstimate({ stone: kind, rarity: evoStoneRarityOf(kind) }))} G</div>`
            : "") +
          `<div class="tt-hint">${
            openOrder.includes("storage")
              ? (wantStored ? "右クリックで 持ち物へ" : "右クリックで 倉庫へ")
              : craftable && openOrder.includes("cube") && cubeMode === "evoStone"
                ? "ドラッグ、または右クリックで合成の枠へ"
                : "パーティ窓の「⤴進化」から使う"
          }${TRADE_ENABLED && !wantStored ? " ・ <b>交易船が開いていれば右クリックで積む</b>" : ""}</div>`);
        // 右クリック優先順: 倉庫の移動 > 進化石の合成枠への投入 > 交易船への積み込み
        // (2026-08-05 Haru指示「交易品回りは機能もオフに」— 表示を消しても右クリックが
        // 生きていて「積み荷は…」のエラーが出ていた事故の再発防止で、優先順を明示する)
        cell.addEventListener("contextmenu", (ev) => keepScroll(() => {
          ev.preventDefault();
          hideTooltip(true);
          if (openOrder.includes("storage")) {
            const res = wantStored
              ? moveEvoStoneToInventory(state, kind)
              : moveEvoStoneToStorage(state, kind);
            if (res.error) return void toast(res.error, "#ff9a9a");
            toast(wantStored ? "進化石を 持ち物へ" : "進化石を 倉庫へ", "#8ad8ff");
            refreshInvViews();
            save();
            return;
          }
          if (craftable && openOrder.includes("cube") && cubeMode === "evoStone") {
            evoStoneAddToSel(kind);
            return;
          }
          if (!TRADE_ENABLED || !openOrder.includes("trade")) return;
          const res = loadTradeShipStone(state, kind);
          if (res.error) return void toast(res.error, "#ff9a9a");
          sfx("chest");
          toast(`⚓ ${stone.label}(${srm.label})を交易船に積み込んだ`, "#8ad8ff");
          renderTrade();
          refreshInvViews();
          save();
        }));
        cells.push(cell);
      }
    }
  }
  return cells;
}

// 宝箱保管の拡張/自動開封の短縮の購入チップ(2026-07-21 FB「ゴールドで解放できるように」)。
// 買い場は倉庫窓(既存の拡張ショップの並び)と装備窓の両方に出す。refresh=購入後の再描画
function chestUpgRowEl(refresh) {
  const upgRow = document.createElement("div");
  upgRow.className = "chest-upg-row";
  const capLv = state.chestCapLv ?? 0;
  const capBtn = document.createElement("button");
  capBtn.className = "chip chest-upg";
  capBtn.textContent = capLv >= CHEST_UPG_MAX
    ? `📦 宝箱保管 MAX`
    : `📦 宝箱保管+ Lv${capLv} ▶ ${capLv + 1}(${formatNum(CHEST_CAP_UPG_PRICES[capLv])}G)`;
  capBtn.title = `宝箱のストック上限を増やす(1レベルごとに 木+4/レア+2/ボス+1)。今: 木${chestCapOf(state, "wood")}/レア${chestCapOf(state, "rare")}/ボス${chestCapOf(state, "boss")}`;
  capBtn.disabled = capLv >= CHEST_UPG_MAX;
  capBtn.addEventListener("click", () => {
    const r = buyChestCapUpg(state);
    if (r.error) return void toast(r.error, "#ff9a9a");
    sfx("coin");
    toast(`📦 宝箱保管を拡張した!(Lv${r.lv}: 木${chestCapOf(state, "wood")}/レア${chestCapOf(state, "rare")}/ボス${chestCapOf(state, "boss")})`, "#ffe9a8");
    bumpMissionCounter(state, "expand"); // チュートリアル: 拡張を買った
    // Haru指示(2026-08-05): このクエストは初回だけ支払い額を返す=チュートリアルの受講料は無料
    { const back = refundTutorialCost(state, "m3_chestcap", CHEST_CAP_UPG_PRICES[capLv]);
      if (back) toast(`🎁 ミッション達成! 使った ${formatNum(back)}G を お返しします`, "#8af0c0"); }
    keepScroll(refresh);
    renderHud();
    // タスクバーの宝箱チップ(n/上限)も即座に反映する(2026-08-11 FB)
    renderChestChips();
    save();
  });
  upgRow.appendChild(capBtn);
  const aoLv = state.autoOpenLv ?? 0;
  const aoBtn = document.createElement("button");
  aoBtn.className = "chip chest-upg";
  aoBtn.textContent = aoLv >= CHEST_UPG_MAX
    ? `⚡ 自動開封 最速`
    : `⚡ 自動開封短縮 Lv${aoLv} ▶ ${aoLv + 1}(${formatNum(AUTO_OPEN_UPG_PRICES[aoLv])}G)`;
  aoBtn.title = `AUTO Openの間隔を1レベルごとに-12%(最大-60%: 木5分→2分/レア・ボス8分→3.2分)。今: -${Math.round((1 - autoOpenCdMult(state)) * 100)}%`;
  aoBtn.disabled = aoLv >= CHEST_UPG_MAX;
  aoBtn.addEventListener("click", () => {
    const r = buyAutoOpenUpg(state);
    if (r.error) return void toast(r.error, "#ff9a9a");
    sfx("coin");
    toast(`⚡ 自動開封を短縮した!(Lv${r.lv}: 間隔-${Math.round((1 - autoOpenCdMult(state)) * 100)}%)`, "#ffe9a8");
    bumpMissionCounter(state, "expand"); // チュートリアル: 拡張を買った
    // Haru指示(2026-08-05): このクエストは初回だけ支払い額を返す
    { const back = refundTutorialCost(state, "m8_autolv", AUTO_OPEN_UPG_PRICES[aoLv]);
      if (back) toast(`🎁 ミッション達成! 使った ${formatNum(back)}G を お返しします`, "#8af0c0"); }
    keepScroll(refresh);
    renderHud();
    save();
  });
  upgRow.appendChild(aoBtn);
  return upgRow;
}

// 宝箱/持ち物/倉庫の数字バッジだけを即時に文字差し替えする(2026-08-07)。
// renderItems/renderStorageの全再構築(throttleRender対象)を待たず、
// 開いている窓があればその場で正しい数へ更新する
function refreshChestCountBadges() {
  const chestCapTotal = ["wood", "rare", "boss"].reduce((s, k) => s + chestCapOf(state, k), 0);
  const itemsCount = document.querySelector("#items-list .items-count");
  if (itemsCount) {
    itemsCount.textContent =
      `宝箱 ${state.chests.length}/${chestCapTotal} ・ 持ち物 ${state.items.length}/${invCapOf(state)} ・ 倉庫 ${storageUsed(state)}/${storageCapOf(state)}`;
  }
  const storageCount = document.querySelector("#storage-list .items-count");
  if (storageCount) {
    storageCount.textContent = `倉庫 ${storageUsed(state)}/${storageCapOf(state)} ・ 持ち物 ${state.items.length}/${invCapOf(state)}`;
  }
}

function renderItems() {
  if (throttleRender(renderItems)) return;
  const list = $("items-list");
  list.innerHTML = "";
  const count = document.createElement("div");
  count.className = "items-count";
  const chestCapTotal = ["wood", "rare", "boss"].reduce((s, k) => s + chestCapOf(state, k), 0);
  count.textContent =
    `宝箱 ${state.chests.length}/${chestCapTotal} ・ 持ち物 ${state.items.length}/${invCapOf(state)} ・ 倉庫 ${storageUsed(state)}/${storageCapOf(state)}`;
  list.appendChild(count);

  // ---- 宝箱保管の拡張/自動開封の短縮(2026-07-21 FB「ゴールドで解放できるように」) ----
  list.appendChild(chestUpgRowEl(renderItems));

  // (貴重品の別セクションは廃止 2026-07-13 FB「インベントリ欄にほかの装備と
  //  同じように1個ずつ並べて」→ 下の装備グリッドに合流)

  // ---- 記念コイン(持ち物に入る希少アイテム。クリックで1枚使って装備を引く) ----
  const ownedCoins = GACHA_COINS.filter((c) => (state.coins?.[c.id] ?? 0) > 0);
  if (ownedCoins.length > 0) {
    const coinLabel = document.createElement("div");
    coinLabel.className = "box-hint";
    coinLabel.textContent = "記念コイン(クリックで1枚使う ・ 右クリック/ドラッグで倉庫へ ・ ホバーで確率)";
    list.appendChild(coinLabel);
    const coinGrid = document.createElement("div");
    coinGrid.className = "inv-grid";
    for (const coin of ownedCoins) {
      const owned = state.coins[coin.id];
      const cell = document.createElement("div");
      cell.className = "inv-cell coin-cell";
      cell.style.borderColor = coin.color;
      cell.appendChild(coinIconEl(coin, 36));
      makeDragSource(cell, `coin:${coin.id}`);
      cell.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        if (openOrder.includes("storage")) {
          hideTooltip(true);
          depositCoin(coin.id);
        }
      });
      const nb = document.createElement("b");
      nb.className = "coin-count";
      nb.textContent = `×${owned}`;
      cell.appendChild(nb);
      const oddsHtml = RARITY_ORDER.filter((r) => coin.weights[r])
        .map((r) => `<span style="color:${RARITY_META[r].color}">${RARITY_META[r].label} ${coin.weights[r]}%</span>`)
        .join(" ・ ");
      bindCellTooltip(
        cell,
        () =>
          `<div class="tt-name" style="color:${coin.color}">${coin.name} ×${owned}</div>` +
          `<div class="tt-opts">${oddsHtml}</div>` +
          `<div class="tt-hint">クリックで 調合窓のガチャを開く(そこで1枚使う)</div>`,
        () => {
          hideTooltip(true);
          compoundMode = "gacha";
          openWindow("compound");
          renderCompound();
        },
      );
      coinGrid.appendChild(cell);
    }
    list.appendChild(coinGrid);
  }

  // ---- 宝箱ストリップ(開封で中身が判明する) ----
  if (state.chests.length > 0) {
    const actions = document.createElement("div");
    actions.className = "storage-actions";
    const openAllBtn = document.createElement("button");
    openAllBtn.textContent = `全部開ける(${state.chests.length})`;
    openAllBtn.addEventListener("click", () => {
      let best = null;
      let opened = 0;
      while (state.chests.length > 0 && state.items.length < invCapOf(state)) {
        const item = doOpenChest(state.chests[0].id);
        if (!item) break;
        opened++;
        addLog(state, {
          kind: "宝箱",
          rarity: item.rarity,
          text: `${item.name} — ${item.opts.map(describeOpt).join(" / ")}`,
        });
        if (!best || RARITY_META[item.rarity].stars > RARITY_META[best.rarity].stars) {
          best = item;
        }
      }
      if (opened === 0) return;
      // 一番の当たりだけバナーで祝う(残りは履歴に)
      const brm = RARITY_META[best.rarity];
      if (brm.stars >= CELEBRATE_MIN_STARS) {
        celebrateLoot({
          kicker: "宝箱 開封",
          icon: itemIconCanvas(best, 52),
          title: best.name,
          sub: `${brm.label}<br>${best.opts.map(describeOpt).join("<br>")}<br>全部で${opened}個 開けた`,
          rarity: best.rarity,
        });
      } else {
        toast(`宝箱を${opened}個 開けた(最高: ${brm.label})`, brm.color);
      }
      if (openOrder.includes("log")) renderLog();
      renderItems();
      if (openOrder.includes("cube")) renderCube();
      refreshHeroInv();
      save();
    });
    actions.appendChild(openAllBtn);
    list.appendChild(actions);

    const chestGrid = document.createElement("div");
    chestGrid.className = "inv-grid";
    for (const chest of state.chests) {
      const km = CHEST_KINDS[chest.kind] ?? CHEST_KINDS.wood;
      const cell = document.createElement("div");
      cell.className = "inv-cell chest-cell";
      cell.style.borderColor = km.color;
      cell.style.color = km.color;
      if (chest.kind === "boss") cell.style.boxShadow = `0 0 8px ${km.color}`;
      cell.appendChild(chestIconEl(chest.kind, 34));
      bindCellTooltip(
        cell,
        () =>
          `<div class="tt-name" style="color:${km.color}">${km.label}</div>` +
          `<div class="tt-opts">${km.desc}<br>中身は 開けるまで 分からない</div>` +
          `<div class="tt-hint">クリックで 開封</div>`,
        () => {
          hideTooltip(true);
          const item = doOpenChest(chest.id);
          if (!item) return;
          celebrateItem(item, chest.kind === "boss" ? "👑 ボスの宝箱" : "宝箱 開封");
          renderItems();
          if (openOrder.includes("cube")) renderCube();
          refreshHeroInv();
          save();
        },
      );
      chestGrid.appendChild(cell);
    }
    list.appendChild(chestGrid);
  }

  // まとめ操作(低レア一括売却は2段階確認)
  const actionsRow = document.createElement("div");
  actionsRow.className = "storage-actions";
  const junkBtn = document.createElement("button");
  const junkCount = state.items.filter((it) => it.rarity === "common" || it.rarity === "rare").length;
  junkBtn.textContent = `コモン+レアを全部売る(${junkCount})`;
  junkBtn.disabled = junkCount === 0;
  junkBtn.addEventListener("click", () => {
    if (!junkBtn.dataset.confirm) {
      junkBtn.dataset.confirm = "1";
      junkBtn.textContent = "本当に 全部売る?";
      setTimeout(() => {
        junkBtn.dataset.confirm = "";
        renderItems();
      }, 3000);
      return;
    }
    const result = sellJunk(state);
    toast(`装備${result.count}個を まとめて ${formatGold(result.gold)} GP で 売った`);
    renderItems();
    if (openOrder.includes("cube")) renderCube();
    save();
  });
  actionsRow.appendChild(junkBtn);
  list.appendChild(actionsRow);

  // レア度フィルタ(持っているレア度だけチップを出す)
  const owned = new Set(state.items.map((it) => it.rarity));
  if (owned.size > 1) {
    const chips = document.createElement("div");
    chips.className = "filter-chips";
    const allChip = document.createElement("button");
    allChip.textContent = "全て";
    allChip.className = itemFilter === null ? "chip on" : "chip";
    allChip.addEventListener("click", () => {
      itemFilter = null;
      renderItems();
    });
    chips.appendChild(allChip);
    for (const rarity of [...RARITY_ORDER].reverse()) {
      if (!owned.has(rarity)) continue;
      const rm = RARITY_META[rarity];
      const chip = document.createElement("button");
      chip.textContent = rm.label;
      chip.className = itemFilter === rarity ? "chip on" : "chip";
      chip.style.color = rm.color;
      chip.addEventListener("click", () => {
        itemFilter = itemFilter === rarity ? null : rarity;
        renderItems();
      });
      chips.appendChild(chip);
    }
    list.appendChild(chips);
  }

  if (state.items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "box-hint";
    empty.textContent = "持ち物が ない(敵を 倒すと ドロップするよ)";
    list.appendChild(empty);
    return;
  }

  // 並び替えチップ+フィルタを適用
  // 表示サイズ(小/中/大)。bodyのdata属性でCSSがセル寸法を切り替える
  const sizeRow = document.createElement("div");
  sizeRow.className = "filter-chips";
  const sizeLabel = document.createElement("span");
  sizeLabel.className = "sort-label";
  sizeLabel.textContent = "サイズ:";
  sizeRow.appendChild(sizeLabel);
  for (const [key, name] of [["s", "小"], ["m", "中"], ["l", "大"]]) {
    const chip = document.createElement("button");
    chip.textContent = name;
    chip.className = (state.settings.invSize ?? "m") === key ? "chip on" : "chip";
    chip.addEventListener("click", () => {
      state.settings.invSize = key;
      document.body.dataset.invsize = key;
      renderItems();
      save();
    });
    sizeRow.appendChild(chip);
  }
  list.appendChild(sizeRow);
  list.appendChild(sortChipsRow(renderItems));
  const items = sortItems(
    state.items.filter((it) => itemFilter === null || it.rarity === itemFilter),
  );
  // TBH風: アイコンのみのグリッド。ホバーで詳細、クリックで操作。
  const grid = document.createElement("div");
  grid.className = "inv-grid";
  // 鍵/水晶(1点もの)は装備と同じグリッドに1個ずつ並べる(2026-07-13 FB)。
  // 倉庫に預けたぶん(stored)はここには出さない(2026-07-15 FB「カギとか水晶も倉庫に」)
  for (const cell of preciousCells({ stored: false })) grid.appendChild(cell);
  for (const item of items) {
    grid.appendChild(
      itemCell(item, () => {
        // 倉庫が開いているときは装備より倉庫への移動を優先(2026-07-16 FB
        // 「倉庫開いてるときはダブルクリックで倉庫に移動させる仕組み」)
        if (openOrder.includes("storage")) {
          const r = moveToStorage(state, item.id);
          if (r.error) return void toast(r.error);
          toast(`「${item.name}」を倉庫に預けた`);
          keepScroll(() => refreshInvViews());
          save();
          return;
        }
        // ダブルクリック: いま見ているキャラへ即装備
        const mon = state.monsters[currentDetailId] ?? leader(state);
        if (!mon) return;
        const result = equipItem(state, mon.id, item.id);
        if (result.error) {
          toast(result.error);
          return;
        }
        playerHp = Math.min(playerHp, partyMaxHp());
        toast(`${baseNameOf(mon)} に「${item.name}」を装備した`);
        renderItems();
        refreshHeroInv();
        if (openOrder.includes("detail")) renderDetail(currentDetailId);
        save();
      }, "inv"),
    );
  }
  list.appendChild(grid);
}

// ---- 倉庫(大容量ストレージ) ----
const STORAGE_PAGE_SIZE = 42; // TBH倉庫: 7列×6行
let storagePage = 0;

// 倉庫パネルへのドロップ処理(持ち物→倉庫のD&D・コインの預け入れ)。
function storageDropHandler(data) {
  if (data.startsWith("item:")) {
    const [, itemId, loc] = data.split(":");
    if (loc === "storage") return; // 既に倉庫にある
    // 装備中のものを直接倉庫へ落とせる(2026-07-22 FB「全部D&Dを有効に」)。
    // 外してから預ける往復を省く。持ち主から抜いて持ち物へ戻してから預け直す
    if (loc === "equipped") {
      const un = unequipItemById(state, itemId);
      if (!un) return;
      state.items.push(un.item);
      playerHp = Math.min(playerHp, partyMaxHp());
      if (openOrder.includes("detail")) renderDetail(currentDetailId);
      refreshMonViews();
    }
    const r = moveToStorage(state, itemId);
    if (r.error) {
      toast(r.error);
      return;
    }
    toast(`「${r.item.name}」を倉庫に預けた`);
    refreshInvViews();
    save();
  } else if (data.startsWith("coin:")) {
    depositCoin(data.slice(5));
  } else if (data.startsWith("precious:")) {
    // 鍵/水晶のドラッグ預け入れ(2026-07-16 FB「鍵が倉庫に入らない」)
    const [, preciousId, loc] = data.split(":");
    if (loc === "storage") return; // 既に倉庫にある
    const r = movePreciousToStorage(state, preciousId);
    if (r.error) return void toast(r.error);
    toast("貴重品を 倉庫へ", "#8ad8ff");
    refreshInvViews();
    save();
  }
}

function renderStorage() {
  if (throttleRender(renderStorage)) return;
  const list = $("storage-list");
  list.innerHTML = "";
  // 倉庫ウィンドウ全体を持ち物/コインのドロップ先にする(1回だけ配線)。
  const panel = $("storage-panel");
  if (panel && !panel.dataset.dropWired) {
    panel.dataset.dropWired = "1";
    makeDropTarget(panel, storageDropHandler);
  }
  const count = document.createElement("div");
  count.className = "items-count";
  count.textContent = `倉庫 ${storageUsed(state)}/${storageCapOf(state)} ・ 持ち物 ${state.items.length}/${invCapOf(state)}`;
  list.appendChild(count);

  // TBH式の転送ボタン: 倉庫→持ち物 / 持ち物→倉庫(2026-08-07 Haru指示で窓の一番上へ移動)
  const transfer = document.createElement("div");
  transfer.className = "storage-transfer";
  const withdrawAllBtn = document.createElement("button");
  const room = invCapOf(state) - state.items.length;
  withdrawAllBtn.textContent = `倉庫 ▶ 持ち物(${Math.min(room, state.storage.length)})`;
  withdrawAllBtn.disabled = state.storage.length === 0 || room <= 0;
  withdrawAllBtn.addEventListener("click", () => {
    let moved = 0;
    for (const it of sortItems(state.storage)) {
      if (state.items.length >= invCapOf(state)) break;
      if (!moveToInventory(state, it.id).error) moved++;
    }
    toast(`倉庫から ${moved}個 引き出した`);
    refreshInvViews();
    save();
  });
  const depositAllBtn2 = document.createElement("button");
  depositAllBtn2.textContent = `持ち物 ▶ 倉庫(${state.items.length})`;
  depositAllBtn2.disabled = state.items.length === 0;
  depositAllBtn2.addEventListener("click", () => {
    const result = depositAll(state);
    toast(`装備${result.moved}個を倉庫に預けた`);
    refreshInvViews();
    save();
  });
  transfer.append(withdrawAllBtn, depositAllBtn2);
  list.appendChild(transfer);

  // ---- 倉庫に預けた記念コイン(引き出すまで使えない。クリックで引き出す) ----
  const storedCoins = GACHA_COINS.filter((c) => (state.storageCoins?.[c.id] ?? 0) > 0);
  if (storedCoins.length > 0) {
    const clabel = document.createElement("div");
    clabel.className = "box-hint";
    clabel.textContent = "預けたコイン(クリックで引き出す)";
    list.appendChild(clabel);
    const cgrid = document.createElement("div");
    cgrid.className = "inv-grid";
    for (const coin of storedCoins) {
      const owned = state.storageCoins[coin.id];
      const cell = document.createElement("div");
      cell.className = "inv-cell coin-cell";
      cell.style.borderColor = coin.color;
      cell.appendChild(coinIconEl(coin, 36));
      const nb = document.createElement("b");
      nb.className = "coin-count";
      nb.textContent = `×${owned}`;
      cell.appendChild(nb);
      bindCellTooltip(
        cell,
        () =>
          `<div class="tt-name" style="color:${coin.color}">${coin.name}(倉庫 ×${owned})</div>` +
          `<div class="tt-hint">クリックで 持ち物へ 引き出す</div>`,
        () => {
          hideTooltip(true);
          withdrawCoin(coin.id);
        },
      );
      cgrid.appendChild(cell);
    }
    list.appendChild(cgrid);
  }

  const actions = document.createElement("div");
  actions.className = "storage-actions";
  // (「全部預ける」は下部の転送ボタンと重複するため撤去。文字はみ出し対策 2026-07-09)
  // 倉庫拡張(GP課金): +80枠ずつ、最大400。買うほど激増(Lv60ごろ全拡張の目安)
  const capBtn = document.createElement("button");
  if (storageCapOf(state) >= STORAGE_MAX_CAP) {
    capBtn.textContent = `倉庫は最大(${STORAGE_MAX_CAP})`;
    capBtn.disabled = true;
  } else {
    capBtn.textContent = `倉庫+80(${formatGold(storageSlotCost(state))}G)`;
    capBtn.disabled = state.gold < storageSlotCost(state);
    capBtn.addEventListener("click", () => {
      const result = buyStorageSlot(state);
      if (result.error) {
        toast(result.error);
        return;
      }
      toast(`倉庫を${result.cap}枠に広げた!`, "#ffcf4a");
      bumpMissionCounter(state, "expand"); // チュートリアル: 拡張を買った
      bumpMissionCounter(state, "expandStorage"); // 種類別(倉庫)
      renderStorage();
      renderHud();
      save();
    });
  }
  actions.appendChild(capBtn);
  // 持ち物の枠拡大ボタンはここでは非表示(2026-08-07 Haru指示「倉庫窓にある持ち物の
  // 枠拡大ボタン非表示に」)。持ち物の拡張は持ち物窓(buildHeroInventory)側に一本化する
  list.appendChild(actions);
  // 宝箱保管の拡張/自動開封の短縮(2026-07-21 FB)。拡張ショップの並びに置く
  list.appendChild(chestUpgRowEl(renderStorage));

  if (state.storage.length === 0) {
    // 空でもマス目は見せる(2026-07-10)。ヒントだけ添えてグリッド描画へ進む
    const empty = document.createElement("div");
    empty.className = "box-hint";
    empty.textContent = "倉庫は 空っぽ(アイテムをクリック→預ける で保管)";
    list.appendChild(empty);
  }

  // 持ち物の枠拡大チップは倉庫窓では出さない(2026-08-07 Haru指示)
  const sortRow = sortChipsRow(renderStorage, { showInvExpand: false });
  const junkCount = [...state.items, ...state.storage].filter((it) => it.junk).length;
  if (junkCount > 0) {
    const jb = document.createElement("button");
    jb.className = "chip junk-sell";
    jb.textContent = `✗${junkCount}個 売却`;
    jb.addEventListener("click", sellAllJunk);
    sortRow.appendChild(jb);
  }
  list.appendChild(sortRow);

  // TBH式ページタブ: 倉庫を42枠/ページに分割して番号タブで切り替え
  const items = sortItems(state.storage);
  const pages = Math.ceil(storageCapOf(state) / STORAGE_PAGE_SIZE);
  if (storagePage >= pages) storagePage = 0;
  const tabRow = document.createElement("div");
  tabRow.className = "page-tabs";
  for (let p = 0; p < pages; p++) {
    const t = document.createElement("button");
    t.className = "page-tab" + (p === storagePage ? " on" : "");
    t.textContent = String(p + 1);
    const used = items.slice(p * STORAGE_PAGE_SIZE, (p + 1) * STORAGE_PAGE_SIZE).length;
    t.title = `ページ${p + 1}(${used}/${STORAGE_PAGE_SIZE})`;
    if (used > 0 && p !== storagePage) t.classList.add("has");
    t.addEventListener("click", () => {
      storagePage = p;
      renderStorage();
    });
    tabRow.appendChild(t);
  }
  list.appendChild(tabRow);

  const pageItems = items.slice(storagePage * STORAGE_PAGE_SIZE, (storagePage + 1) * STORAGE_PAGE_SIZE);
  const grid = document.createElement("div");
  grid.className = "inv-grid storage-grid"; // TBH倉庫: 7列
  // 預けた鍵/水晶は1ページ目の先頭にまとめて出す(2026-07-15 FB)。装備と同じ棚を分け合う
  if (storagePage === 0) for (const cell of preciousCells({ stored: true })) grid.appendChild(cell);
  for (const item of pageItems) {
    grid.appendChild(
      itemCell(item, () => {
        // ダブルクリック: インベントリへ即引き出す
        const result = moveToInventory(state, item.id);
        if (result.error) {
          toast(result.error);
          return;
        }
        toast(`「${item.name}」を 引き出した`);
        refreshInvViews();
        save();
      }, "storage"),
    );
  }
  // TBH倉庫風: 空き枠もマス目として見せる。ただし最終ページは容量を超える
  // 幻の枠を出さない(cap=80で84枠見える不具合の対策 2026-07-09)。
  const cellsThisPage = Math.min(
    STORAGE_PAGE_SIZE,
    Math.max(0, storageCapOf(state) - storagePage * STORAGE_PAGE_SIZE),
  );
  for (let i = pageItems.length; i < cellsThisPage; i++) {
    const blank = document.createElement("div");
    blank.className = "inv-cell slot-blank";
    grid.appendChild(blank);
  }
  list.appendChild(grid);
}

// ---- キューブ(装備合成) ----
// TBH式: 3x3のスロットに同じレア度の装備を9個セットして合成。倉庫のアイテムも使える。
let cubeSel = []; // セット中のアイテムID(最大 CRAFT_COST)
let cubeBand = 0; // レベル帯フィルタ(数値=itemBand)。「全て」は廃止(2026-07-13 FB)
// "craft"(装備の合成) | "craftCharm"(アクセの合成) | "alchemy"(錬金術=まとめ売り)。
// アクセとそれ以外は合成のレーンを分ける(2026-07-15 FB「アクセはアクセだけで合成、
// アクセ以外はアクセ以外だけで合成。アクセ合成からはアクセしかできないように、
// それ以外からはアクセができないように」)。素材も結果も、選んだレーンから出ない。
let cubeMode = "craft";
let cubeResultId = null; // 直前の合成でできた装備ID(3x3の中央に残して見せる)
// 進化石合成(2026-08-06 UI刷新): 装備合成と同じ「枠に入れて確定」方式にする。
// 進化石はidを持たない個数管理(state.evoStones[kind])なので、選択も
// 「スロットに入っている種別の配列」で持つ(evoSel[i] = "nuke"等)
let evoSel = [];
let evoDestMode = "role"; // "role"(任意のジョブ石) | "random"(ランダム石)
let evoDestRole = "nuke"; // mode==="role"のときの変換先
// 錬金の自動入力フィルタ(2026-07-18 FB「レベル: 全て/○○以下、対象: 装備/アクセ」)
let alchLvMax = 0; // 0 = 全て(お任せ)、それ以外 = このレベル以下だけ
let alchTarget = "all"; // all | equip | charm

const isCharmItem = (it) => (it?.part ?? inferPart(it ?? {})) === "charm";
const isCraftMode = () => cubeMode === "craft" || cubeMode === "craftCharm";
// 今のレーンで扱える装備か(アクセ合成ならアクセだけ、装備合成ならアクセ以外だけ)
const cubeLaneAccepts = (it) =>
  cubeMode === "enhance" ? true : cubeMode === "craftCharm" ? isCharmItem(it) : !isCharmItem(it);

// キューブに装備を1つ追加(D&D・右クリック・在庫チップから共通で呼ぶ)。
// 既にセット済みと同じレア度・同じレベル帯でないと弾く。
function cubeAddItem(itemId) {
  cubeResultId = null; // 新しい素材を置いたら結果表示は役目を終える
  if (cubeSel.includes(itemId)) return;
  // 細工モードはスロット1つ。新しい装備を置いたら前のは入れ替える
  if (cubeMode === "enhance") {
    cubeSel = [itemId];
    if (openOrder.includes("cube")) keepScroll(renderCube);
    return;
  }
  if (cubeSel.length >= CRAFT_COST) {
    toast(`スロットは ${CRAFT_COST}個まで`);
    return;
  }
  // 装備中のものも素材にできる(2026-07-22 FB「装備したまま、パーティに入れたままでも
  // 枠に入れて利用ができるように」)。合成の実行時に自動で外れる
  const pool = new Map(craftablePool(state).map((it) => [it.id, it]));
  const it = pool.get(itemId);
  if (!it) return;
  // 合成は「同じレア度」+「選択中の帯の下限以上」(2026-07-12 FB: 下限以上ならレベル差OK)。
  // 錬金(売却)はどれでもOK
  if (isCraftMode()) {
    if (!cubeLaneAccepts(it)) {
      toast(
        cubeMode === "craftCharm"
          ? "アクセ合成に入れられるのは アクセサリーだけ"
          : "アクセサリーは「アクセ合成」で 合成してね",
        "#ff9a9a",
      );
      return;
    }
    if (cubeSel.length > 0) {
      const first = pool.get(cubeSel[0]);
      if (first && first.rarity !== it.rarity) {
        toast("同じレア度で 揃えて");
        return;
      }
    }
    if (it.locked) return void toast("🔒 ロック中の装備は 合成素材にできない");
    if (cubeBand != null) {
      const bandMin = bandMinOf(cubeBand);
      if ((it.lv ?? 1) < bandMin) {
        toast(`選択中の帯の下限(Lv.${bandMin})より低い装備は 入れられない`, "#ff9a9a");
        return;
      }
    }
  }
  cubeSel.push(itemId);
  // D&D投入は右クリックと違いkeepScrollの外から来るので、ここでも包む(2026-07-16 FB)
  if (openOrder.includes("cube")) keepScroll(renderCube);
}

function renderCube(opts = {}) {
  // ユーザーがセレクタ/入力を操作中は受動的な再描画を保留(2026-07-30 FB
  // 「レベル帯変更クリックしても勝手に閉じて変更できない」)。周回中はドロップや
  // ゴールド変化のたびに renderCube が走り、開いた瞬間のドロップダウンを
  // 毎回作り直して閉じていた。操作が終わった(blur)時に1回だけ流し直す。
  // セレクタ自身の change からの再描画は force:true で即時に通す
  if (!opts.force && throttleRender(renderCube)) return; // 受動再描画は200msに1回へ間引く
  const ae = document.activeElement;
  if (!opts.force && ae && windows.cube?.contains(ae) && (ae.tagName === "SELECT" || ae.tagName === "INPUT")) {
    if (!renderCube._deferred) {
      renderCube._deferred = true;
      ae.addEventListener(
        "blur",
        () => {
          renderCube._deferred = false;
          if (openOrder.includes("cube")) renderCube();
        },
        { once: true },
      );
    }
    return;
  }
  renderCube._deferred = false;
  const body = $("cube-body");
  body.innerHTML = "";
  // 「倉庫アイテムを含む」チェック(TBH準拠 2026-07-12)で倉庫を含めるか切り替え
  const useStorage = state.settings.cubeUseStorage !== false;
  // 装備中も常にプールに含める(2026-07-22 FB「タスモンの装備枠からD&Dで入れられる
  // ように」)。cubeAddItem側は既に受け付けていたが、こちらのフィルタが投入直後に
  // 装備中の品を「消えた扱い」で弾き戻していた(=ドロップが効かないように見えた)
  const pool = [
    ...state.items,
    ...(useStorage ? state.storage : []),
    ...Object.values(state.monsters).flatMap((m) => m.equipment ?? []),
  ];
  const byId = new Map(pool.map((it) => [it.id, it]));
  cubeSel = cubeSel.filter((id) => byId.has(id)); // 売却などで消えたぶんを除外

  // ---- キューブのレベル+経験値バー ----
  const cubeLv = cubeLevelOf(state);
  const cubeExp = state.cube?.exp ?? 0;
  const need = cubeExpToNext(cubeLv);
  const lvBar = document.createElement("div");
  lvBar.className = "cube-level";
  lvBar.innerHTML =
    `<div class="cube-level-top"><b>⚒ 合成レベル ${cubeLv}${cubeLv >= CUBE_LEVEL_MAX ? "(最大)" : ""}</b>` +
    `<span>${cubeLv >= CUBE_LEVEL_MAX ? "" : `${formatNum(cubeExp)} / ${formatNum(need)} EXP`}</span></div>` +
    `<div class="cube-exp-bar"><i></i></div>`;
  lvBar.querySelector(".cube-exp-bar i").style.width =
    `${cubeLv >= CUBE_LEVEL_MAX ? 100 : Math.round((cubeExp / need) * 100)}%`;
  // TBH準拠(2026-07-12): レベルバーはモード/帯セレクタの下に置く(appendはpillsの後)

  // ---- モード切替(合成 / 錬金術) ----
  const pills = document.createElement("div");
  pills.className = "cube-pills";
  const modeSel = document.createElement("select");
  modeSel.className = "cube-band";
  const enhOk = enhanceUnlocked(state);
  for (const [val, label] of [
    ["craft", "⚗ 装備の合成"],
    ["craftCharm", "💍 アクセの合成"],
    ["alchemy", "🔥 錬金術(売却)"],
    // 細工(2026-08-05 前倒し): ノーマル全クリアで解禁。未解放でも項目は見せて目標にする
    [enhOk ? "enhance" : "enhanceLocked", enhOk ? "🗿 細工" : "🔒 細工(ノーマル全クリアで解放)"],
    // 進化石の合成(2026-08-05 Haru指示「進化石の合成も作って」)
    ["evoStone", "🔮 進化石の合成"],
  ]) {
    const o = document.createElement("option");
    o.value = val;
    o.textContent = label;
    if (val === "enhanceLocked") o.disabled = true;
    modeSel.appendChild(o);
  }
  modeSel.value = cubeMode;
  modeSel.addEventListener("change", () => {
    cubeMode = modeSel.value;
    cubeSel = [];
    // 直前の合成結果もしまう(2026-07-15): レーンを分けたので、装備合成に切り替えたのに
    // アクセの結果が中央に残っていると「このレーンで作れる物」を誤解させる
    cubeResultId = null;
    renderCube({ force: true }); // 自分の変更確定は保留ガードを通さず即時反映
  });
  pills.appendChild(modeSel);

  if (isCraftMode()) {
    // レベル帯ドロップダウン: 全帯を常に並べる(2026-07-13 FB「全てのレベル帯は
    // いらない。クリックすると全帯が並んで、未解放はxxLvで解放の表記に」)
    const bandSel = document.createElement("select");
    bandSel.className = "cube-band";
    const allBands = CRAFT_BANDS.map((_, i) => i);
    for (const b of allBands) {
      const o = document.createElement("option");
      o.value = String(b);
      // 解放レベルは表示しない(2026-07-13 FB)。帯の下限Lvのタスモンが育てば自動解放
      o.textContent = cubeCanCraftBand(state, b) ? bandLabel(b) : `${bandLabel(b)} 🔒`;
      bandSel.appendChild(o);
    }
    if (!allBands.includes(cubeBand)) cubeBand = allBands[0] ?? 0;
    bandSel.value = String(cubeBand);
    bandSel.addEventListener("change", () => {
      cubeBand = Number(bandSel.value);
      bumpMissionCounter(state, "craftband"); // チュートリアル: 合成レベル帯を変えた
      renderCube({ force: true }); // 自分の変更確定は保留ガードを通さず即時反映
    });
    pills.appendChild(bandSel);
  }
  body.appendChild(pills);
  body.appendChild(lvBar); // TBH準拠: セレクタ→レベルバー→3x3の順

  if (cubeMode === "alchemy") {
    bumpMissionCounter(state, "alchemy"); // チュートリアル: 錬金術を開いた
    renderCubeAlchemy(body);
    return;
  }
  if (cubeMode === "enhance") {
    renderCubeEnhance(body);
    return;
  }
  if (cubeMode === "evoStone") {
    renderCubeEvoStone(body);
    return;
  }

  // ===== 合成モード =====
  const selItems = cubeSel.map((id) => byId.get(id));
  const selRarity = selItems[0]?.rarity ?? null;

  // 3x3スロット(D&Dで装備を落とせる。クリックで外す)
  const grid = document.createElement("div");
  grid.id = "cube-grid";
  // 直前の合成結果: スロットが空のあいだ中央に残して「何ができたか」を見せる
  const resultItem = cubeSel.length === 0 && cubeResultId ? byId.get(cubeResultId) : null;
  for (let i = 0; i < CRAFT_COST; i++) {
    const slot = document.createElement("div");
    slot.className = "cube-slot";
    const item = selItems[i];
    if (resultItem && i === Math.floor(CRAFT_COST / 2)) {
      const irm = RARITY_META[resultItem.rarity];
      slot.classList.add("filled", "result");
      slot.style.borderColor = irm.color;
      // 結果スロットにもレア度背景を(2026-07-18 FB「出来上がった防具は無色のまま」:
      // 入力スロットだけ色づけして結果側を忘れていた)
      slot.style.background = rarityCellBg(irm);
      if (irm.stars >= 4) slot.style.boxShadow = `0 0 ${irm.stars}px ${irm.color}66`;
      slot.appendChild(itemIconCanvas(resultItem, 36));
      const lvb = document.createElement("span");
      lvb.className = "cell-lv";
      lvb.textContent = `L${resultItem.lv ?? 1}`;
      slot.appendChild(lvb);
      const tag = document.createElement("span");
      tag.className = "cube-result-tag";
      tag.textContent = "できた!";
      slot.appendChild(tag);
      bindCellTooltip(
        slot,
        () => itemTooltipHtml(resultItem, false) + '<div class="tt-hint">直前の合成でできた装備(クリックで表示を消す)</div>',
        () => {
          cubeResultId = null;
          hideTooltip(true);
          renderCube();
        },
      );
      grid.appendChild(slot);
      continue;
    }
    if (item) {
      const irm = RARITY_META[item.rarity];
      slot.classList.add("filled");
      slot.style.borderColor = irm.color;
      // レア度の背景をインベントリのセルと同じに(2026-07-16 FB「合成欄に入ると色がわかりづらい」)
      slot.style.background = rarityCellBg(irm);
      if (irm.stars >= 4) slot.style.boxShadow = `0 0 ${irm.stars}px ${irm.color}66`;
      slot.appendChild(itemIconCanvas(item, 36)); // アイコンサイズを倉庫/卵と統一(36)
      const materiaS = materiaColEl(item);
      if (materiaS) {
        slot.classList.add("has-sockets");
        if (itemHasMateria(item)) slot.classList.add("has-materia");
        slot.appendChild(materiaS);
      }
      // 装備レベルのバッジ(2026-07-10: 帯そろえの判断がスロット上でできるように)
      const lvb = document.createElement("span");
      lvb.className = "cell-lv";
      lvb.textContent = `L${item.lv ?? 1}`;
      slot.appendChild(lvb);
      bindCellTooltip(
        slot,
        () => itemTooltipHtml(item, false) + '<div class="tt-hint">クリックで 外す</div>',
        () => {
          cubeSel = cubeSel.filter((id) => id !== item.id);
          hideTooltip(true);
          renderCube();
        },
      );
    } else {
      // 素材が入りかけのときは空きスロットに「?」を出して不足を見える化(2026-07-10)
      if (cubeSel.length > 0) {
        slot.classList.add("need");
        slot.textContent = "?";
      }
      makeDropTarget(slot, (data) => {
        if (data.startsWith("item:")) cubeAddItem(data.split(":")[1]);
      });
    }
    grid.appendChild(slot);
  }
  body.appendChild(grid);
  // 操作列: 自動入力 / クリア / 合成する
  const controls = document.createElement("div");
  controls.className = "cube-controls";
  const autoBtn = document.createElement("button");
  autoBtn.textContent = "自動入力";
  autoBtn.addEventListener("click", () => {
    // レベル帯フィルタを尊重しつつ(レア度×帯)グループを集める。
    // 9個揃っていなくても最多グループを部分セットする(2026-07-10 FB「足りない分の見える化」)
    const groups = new Map();
    // 自動入力は帯の範囲内[下限..上限]だけを拾う(2026-07-13 FB「範囲外のレベルの
    // 装備を勝手に自動入力するな」)。上限超えは手動なら入れられる(警告つき)が、
    // 自動では絶対に選ばない。ロック中も除外
    const bandLo = cubeBand == null ? null : bandMinOf(cubeBand);
    const bandHi = cubeBand == null ? null : bandCeilOf(cubeBand);
    // 装備中の品は自動では絶対に拾わない(2026-07-29 FB「装備しているアイテムは
    // 合成の自動入力に入らないようにして」)。プール自体には入っている(D&Dで
    // 意図的に入れる道は残す 2026-07-22 FB)ので、ここで弾く
    const equippedIds = new Set(
      Object.values(state.monsters).flatMap((m) => (m.equipment ?? []).map((e) => e.id)),
    );
    for (const it of pool) {
      if (it.locked) continue;
      if (equippedIds.has(it.id)) continue;
      if (!cubeLaneAccepts(it)) continue; // レーン外(アクセ⇔それ以外)は拾わない
      const lv = it.lv ?? 1;
      if (bandLo != null && (lv < bandLo || lv > bandHi)) continue;
      const key = bandLo != null ? it.rarity : `${it.rarity}|${itemBand(it.lv)}`;
      (groups.get(key) ?? groups.set(key, []).get(key)).push(it);
    }
    const chosen =
      [...groups.values()].find((g) => g.length >= CRAFT_COST) ??
      [...groups.values()].sort((a, b) => b.length - a.length)[0];
    if (!chosen) {
      toast(cubeMode === "craftCharm" ? "合成に使えるアクセサリーがない" : "合成に使える装備がない");
      return;
    }
    cubeSel = chosen
      .sort((a, b) => (a.lv ?? 1) - (b.lv ?? 1) || a.obtainedAt - b.obtainedAt) // 低Lv優先で高級品を温存
      .slice(0, CRAFT_COST)
      .map((it) => it.id);
    if (chosen.length < CRAFT_COST) {
      toast(`同じレア度・同じ帯は ${chosen.length}個。あと${CRAFT_COST - chosen.length}個で合成できる`, "#ffd67a");
    }
    renderCube();
  });
  controls.appendChild(autoBtn);
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "クリア";
  // 合成後は結果表示(できた!)が中央に残る。クリアでそれも消せる(2026-07-13 FB)
  clearBtn.disabled = cubeSel.length === 0 && !cubeResultId;
  clearBtn.addEventListener("click", () => {
    cubeSel = [];
    cubeResultId = null;
    renderCube();
  });
  controls.appendChild(clearBtn);
  const craftBtn = document.createElement("button");
  // 合成ボタンは常に独立行(全幅)にする(2026-07-15 FB「自動入力したときにUIのデザインが
  // 変わらないように」)。ラベルが「合成する (0/9)」→「合成する → レア(成功率100%)」と
  // 伸びるため、1行に並べていると自動入力の瞬間に折り返して操作列の高さが変わっていた
  // (実測 31.7px → 59.4px)。最初から独立行なら、ラベルが伸びてもレイアウトは動かない。
  craftBtn.className = "cube-craft-btn";
  const nextRm = selRarity
    ? RARITY_META[RARITY_ORDER[RARITY_ORDER.indexOf(selRarity) + 1]]
    : null;
  craftBtn.textContent =
    cubeSel.length === CRAFT_COST && nextRm
      ? `合成する → ${nextRm.label}(成功率${Math.round((CRAFT_SUCCESS[RARITY_ORDER[RARITY_ORDER.indexOf(selRarity) + 1]] ?? 1) * 100)}%)`
      : `合成する (${cubeSel.length}/${CRAFT_COST})`;
  craftBtn.disabled = cubeSel.length !== CRAFT_COST;
  craftBtn.addEventListener("click", () => {
    const result = craftItemsExact(state, cubeSel, Math.random, cubeBand);
    if (result.error) {
      toast(result.error);
      return;
    }
    if (result.success === false) {
      toast(`⚠ 合成失敗… 素材は溶けて ${RARITY_META[result.item.rarity].label}の装備1個が残った`, "#ff9a9a");
      gainFloat(result.item.name, RARITY_META[result.item.rarity].color);
    } else {
      celebrateItem(result.item, "アイテム合成 成功");
    }
    // 装備中のものを溶かしたときは「誰の何が外れたか」を必ず伝える
    // (黙って外すと「装備が消えた」というバグ報告になる)
    if (result.unequipped?.length) {
      const names = [...new Set(result.unequipped.map((u) => monName(u.mon)))].join(" / ");
      toast(`⚠ 装備中だった分は 外して素材にした(${names})`, "#ffcf4a");
      refreshMonViews();
    }
    if (result.cube?.levelUps > 0) {
      toast(`🧊 合成レベルが ${result.cube.level} に上がった!(+${result.cube.gained} EXP)`, "#8ad8ff");
    }
    passNotify(passProgress(state, "craft")); // タスモンパス任務(2026-07-20)
    cubeSel = [];
    cubeResultId = result.item.id; // できたものを中央スロットに残す
    renderCube();
    if (openOrder.includes("storage")) renderStorage();
    refreshHeroInv();
    save();
  });
  controls.appendChild(craftBtn);
  body.appendChild(controls);

  // ✅倉庫アイテムを含む(TBH準拠 2026-07-12)
  const storRow = document.createElement("label");
  storRow.className = "cube-storage-row";
  const chk = document.createElement("input");
  chk.type = "checkbox";
  chk.checked = useStorage;
  chk.addEventListener("change", () => {
    state.settings.cubeUseStorage = chk.checked;
    cubeSel = [];
    renderCube({ force: true }); // 自分の変更確定は保留ガードを通さず即時反映
    save();
  });
  storRow.appendChild(chk);
  storRow.insertAdjacentHTML("beforeend", `<span>倉庫アイテムを含む</span>`);
  body.appendChild(storRow);

  // 説明+必要アイテムレベル(TBH準拠のフッター)
  const minLv = cubeBand == null ? 1 : bandMinOf(cubeBand);
  const info = document.createElement("div");
  info.className = "cube-info-box";
  const laneWord = cubeMode === "craftCharm" ? "アクセサリー" : "装備(アクセ以外)";
  info.innerHTML =
    `<div>同じ等級の${laneWord}9個を合成して<br>より高い等級の${laneWord}を獲得できます</div>` +
    `<div class="cube-info-req">必要アイテムレベル:Lv.${minLv}以上</div>`;
  // 上位Lvの装備が混ざっている注意喚起(2026-07-13 FB: TBH方式=入れられるが強くはならない)
  {
    const bandMax = bandCeilOf(cubeBand ?? 0);
    const pools = [...state.items, ...(useStorage ? state.storage : [])];
    const overCount = cubeSel.filter((id) => {
      const it = pools.find((x) => x.id === id);
      return it && (it.lv ?? 1) > bandMax;
    }).length;
    if (overCount > 0) {
      info.insertAdjacentHTML(
        "beforeend",
        `<div class="cube-info-req cube-warn-over">⚠ この帯より上位Lvの装備が${overCount}個入っています` +
          `(合成できますが、結果はこの帯のLvのまま=もったいない)</div>`,
      );
    }
  }
  // 成功率は確率開示ポリシーのためフッターに常時表示(cube-noteはTBH準拠で廃止)
  info.insertAdjacentHTML(
    "beforeend",
    `<div class="cube-info-req">成功率: 〜レジェンド100% / イモータル50% / アルカナ25% / ビヨンド以降10% / セレスティアル5%</div>`,
  );
  body.appendChild(info);

  // セット中✓を持ち物/倉庫のセルへ同期(2026-07-12 FB)
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("storage")) renderStorage();
  refreshHeroInv();
}

// 現在の合成レベルで解放されている最大の帯(表示範囲の目安)。
function cubeLevelBandCap() {
  let b = 0;
  while (b < CRAFT_BANDS.length - 1 && cubeCanCraftBand(state, b + 1)) b++;
  return b;
}

// 錬金術モード: 合成と同じ3x3スロットで、装備を最大9個まとめて売却(ゴールド+合成EXP)。
// ---- 進化石の合成(2026-08-05 Haru指示「アイテム合成の中に進化石の合成も作って。
// 任意のジョブの進化石にするのは3つ必要、ランダム石にするのは5つ必要」) ----
// 素材は手持ちのロール進化石(nuke/guard/heal/buff)のみ。多く持っている種類から
// 自動で選ぶ(装備合成の「自動入力」と同じ思想=手で内訳を組ませない)。
// 変換先と同じ種類は他で足りるうちは避ける(3個払って同じ石が1個に減るだけの
// 無駄な取引を自動選択させない。他が無ければ最終手段として使う)
function autoPickEvoStoneSrc(need, preferExcludeRole, alreadyInSlots = []) {
  const usedOf = (k) => alreadyInSlots.filter((x) => x === k).length;
  const roles = [...EVO_STONE_ROLES].sort(
    (a, b) => (evoStoneCount(state, b) - usedOf(b)) - (evoStoneCount(state, a) - usedOf(a)),
  );
  const ordered = preferExcludeRole
    ? [...roles.filter((k) => k !== preferExcludeRole), preferExcludeRole]
    : roles;
  const picks = {};
  let left = need;
  for (const k of ordered) {
    if (left <= 0) break;
    const take = Math.min(evoStoneCount(state, k) - usedOf(k), left);
    if (take > 0) {
      picks[k] = take;
      left -= take;
    }
  }
  return left <= 0 ? picks : null;
}

// 進化石をスロットへ1個追加する(evoSel配列に1エントリ追加)。装備合成の
// cubeAddItemと同じ役目: ドラッグ/右クリックの両方から呼ばれる共通口
function evoStoneAddToSel(kind) {
  const need = evoDestMode === "random" ? EVO_STONE_CRAFT_COST.random : EVO_STONE_CRAFT_COST.role;
  if (evoSel.length >= need) return void toast(`スロットは ${need}個まで`);
  const already = evoSel.filter((k) => k === kind).length;
  if (already >= evoStoneCount(state, kind)) return void toast(`${EVO_STONES[kind].label}が 足りない`);
  evoSel.push(kind);
  if (openOrder.includes("cube")) keepScroll(renderCube);
}

function renderCubeEvoStone(body) {
  const wrap = document.createElement("div");
  wrap.className = "cube-evostone";

  // ---- 変換先を選ぶ(ロール4種+ランダム。選ぶとスロット数が変わるので選択はクリア) ----
  // 2026-08-07 Haru指示: ボタン列からプルダウンに変更(上のcube-band=合成モード
  // セレクタと見た目を揃え、縦の占有を減らす)
  const destOptions = [...EVO_STONE_ROLES.map((r) => ({ mode: "role", role: r })), { mode: "random", role: null }];
  const destSel = document.createElement("select");
  destSel.className = "cube-band evostone-dest-sel";
  for (const opt of destOptions) {
    const meta = opt.mode === "random" ? EVO_STONES.random : EVO_STONES[opt.role];
    const cost = opt.mode === "random" ? EVO_STONE_CRAFT_COST.random : EVO_STONE_CRAFT_COST.role;
    const o = document.createElement("option");
    o.value = opt.mode === "random" ? "random" : opt.role;
    o.textContent = `${meta.icon} ${meta.label}(${cost}個必要)`;
    destSel.appendChild(o);
  }
  destSel.value = evoDestMode === "random" ? "random" : evoDestRole;
  destSel.title = "変換先の進化石を選ぶ";
  destSel.addEventListener("change", () => {
    const v = destSel.value;
    evoDestMode = v === "random" ? "random" : "role";
    if (evoDestMode === "role") evoDestRole = v;
    evoSel = []; // スロット数が変わるので選択はやり直し
    renderCube({ force: true });
  });
  wrap.appendChild(destSel);

  const need = evoDestMode === "random" ? EVO_STONE_CRAFT_COST.random : EVO_STONE_CRAFT_COST.role;
  evoSel = evoSel.slice(0, need); // 上限超えを保険で切る

  // ---- 素材スロット(装備合成と同じ見た目。ドラッグ or 右クリックで投入) ----
  const grid = document.createElement("div");
  grid.className = "evostone-slots";
  for (let i = 0; i < need; i++) {
    const slot = document.createElement("div");
    slot.className = "cube-slot";
    const kind = evoSel[i];
    if (kind) {
      const meta = EVO_STONES[kind];
      slot.classList.add("filled");
      slot.style.borderColor = meta.color;
      slot.appendChild(stoneIconEl(kind, 32));
      slot.title = `${meta.label}(クリックで外す)`;
      slot.addEventListener("click", () => {
        evoSel.splice(i, 1);
        keepScroll(renderCube);
      });
    } else {
      // 2026-08-07 Haru指示: 窓内蔵の所持一覧chipは廃止。持ち物/倉庫窓に並ぶ
      // 進化石セルからドラッグ、または(この合成窓が開いていれば)右クリックで直接投入する
      slot.title = "持ち物の進化石をドラッグ、または右クリックで投入";
      makeDropTarget(slot, (data) => {
        if (data.startsWith("stone:")) evoStoneAddToSel(data.split(":")[1]);
      });
    }
    grid.appendChild(slot);
  }
  wrap.appendChild(grid);
  const invHint = document.createElement("div");
  invHint.className = "box-hint";
  invHint.textContent = "進化石は持ち物ウィンドウにあります。ドラッグ、または右クリックで枠へ投入";
  wrap.appendChild(invHint);

  // ---- 操作ボタン: 自動入力 / クリア / 合成する ----
  const controls = document.createElement("div");
  controls.className = "cube-controls";
  const autoBtn = document.createElement("button");
  autoBtn.className = "chip";
  autoBtn.textContent = "🔀 自動入力";
  autoBtn.title = "持っている進化石から自動でスロットを埋める";
  autoBtn.addEventListener("click", () => {
    const remain = need - evoSel.length;
    if (remain <= 0) return;
    const picks = autoPickEvoStoneSrc(remain, evoDestMode === "role" ? evoDestRole : undefined, evoSel);
    if (!picks) return void toast("残りを埋めるだけの進化石がない");
    for (const [k, n] of Object.entries(picks)) for (let i = 0; i < n; i++) evoSel.push(k);
    keepScroll(renderCube);
  });
  controls.appendChild(autoBtn);

  const clearBtn = document.createElement("button");
  clearBtn.className = "chip";
  clearBtn.textContent = "🗑 クリア";
  clearBtn.addEventListener("click", () => {
    if (evoSel.length === 0) return;
    evoSel = [];
    keepScroll(renderCube);
  });
  controls.appendChild(clearBtn);

  const doBtn = document.createElement("button");
  doBtn.className = "compound-do";
  const destMeta = evoDestMode === "random" ? EVO_STONES.random : EVO_STONES[evoDestRole];
  doBtn.innerHTML = `🔮 ${destMeta.label}に合成する<small>(${evoSel.length}/${need})</small>`;
  doBtn.disabled = evoSel.length !== need;
  doBtn.addEventListener("click", () => {
    const srcCounts = {};
    for (const k of evoSel) srcCounts[k] = (srcCounts[k] ?? 0) + 1;
    const r = craftEvoStone(state, evoDestMode, srcCounts, evoDestMode === "role" ? evoDestRole : undefined);
    if (r.error) return void toast(r.error);
    sfx("coin");
    toast(`🔮 ${destMeta.label}を合成した!`, destMeta.color);
    evoSel = [];
    renderCube({ force: true });
    renderHud();
    save();
  });
  controls.appendChild(doBtn);
  wrap.appendChild(controls);

  body.appendChild(wrap);
}

function renderCubeAlchemy(body) {
  const pool = [...state.items, ...state.storage];
  const byId = new Map(pool.map((it) => [it.id, it]));
  const selItems = cubeSel.map((id) => byId.get(id)).filter(Boolean);

  // 3x3スロット(合成と共通の見た目。D&Dドロップ/クリックで外す)
  const grid = document.createElement("div");
  grid.id = "cube-grid";
  for (let i = 0; i < CRAFT_COST; i++) {
    const slot = document.createElement("div");
    slot.className = "cube-slot";
    const item = selItems[i];
    if (item) {
      const irm = RARITY_META[item.rarity];
      slot.classList.add("filled");
      slot.style.borderColor = irm.color;
      // レア度の背景をインベントリのセルと同じに(2026-07-16 FB「合成欄に入ると色がわかりづらい」)
      slot.style.background = rarityCellBg(irm);
      if (irm.stars >= 4) slot.style.boxShadow = `0 0 ${irm.stars}px ${irm.color}66`;
      slot.appendChild(itemIconCanvas(item, 36)); // アイコンサイズを倉庫/卵と統一(36)
      const materiaS = materiaColEl(item);
      if (materiaS) {
        slot.classList.add("has-sockets");
        if (itemHasMateria(item)) slot.classList.add("has-materia");
        slot.appendChild(materiaS);
      }
      // 装備レベルのバッジ(2026-07-10: 帯そろえの判断がスロット上でできるように)
      const lvb = document.createElement("span");
      lvb.className = "cell-lv";
      lvb.textContent = `L${item.lv ?? 1}`;
      slot.appendChild(lvb);
      bindCellTooltip(
        slot,
        () => itemTooltipHtml(item, false) + '<div class="tt-hint">クリックで 外す</div>',
        () => {
          cubeSel = cubeSel.filter((id) => id !== item.id);
          hideTooltip(true);
          renderCube();
        },
      );
    } else {
      makeDropTarget(slot, (data) => {
        if (data.startsWith("item:")) cubeAddItem(data.split(":")[1]);
      });
    }
    grid.appendChild(slot);
  }
  body.appendChild(grid);

  // 錬金額プレビュー
  let gold = 0;
  let exp = 0;
  for (const it of selItems) {
    gold += itemSellPrice(it);
    exp += CUBE_EXP_BY_RARITY[it.rarity] ?? 4;
  }

  // 自動入力フィルタ(2026-07-18 FB「下に枠があって レベル: 全て/○○以下、
  // 対象: 全て/装備/アクセ みたいなのあると便利」)
  const filterRow = document.createElement("div");
  filterRow.className = "cube-alch-filter";
  const lvSel = document.createElement("select");
  const lvOpts = [[0, "全て(お任せ)"]];
  for (let lv = 10; lv <= 100; lv += 10) lvOpts.push([lv, `Lv${lv}以下`]);
  for (const [v, label] of lvOpts) {
    const o = document.createElement("option");
    o.value = String(v);
    o.textContent = label;
    if (alchLvMax === v) o.selected = true;
    lvSel.appendChild(o);
  }
  lvSel.addEventListener("change", () => {
    alchLvMax = Number(lvSel.value);
  });
  const tgSel = document.createElement("select");
  for (const [v, label] of [["all", "全て(お任せ)"], ["equip", "装備"], ["charm", "アクセ"]]) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = label;
    if (alchTarget === v) o.selected = true;
    tgSel.appendChild(o);
  }
  tgSel.addEventListener("change", () => {
    alchTarget = tgSel.value;
  });
  const lvLab = document.createElement("label");
  lvLab.append("レベル ", lvSel);
  const tgLab = document.createElement("label");
  tgLab.append("対象 ", tgSel);
  filterRow.append(lvLab, tgLab);
  body.appendChild(filterRow);

  const controls = document.createElement("div");
  controls.className = "cube-controls";
  const autoBtn = document.createElement("button");
  autoBtn.textContent = "自動入力";
  autoBtn.title = "上のフィルタ(レベル/対象)の範囲で、✗印→低レアの順に最大9個セット。ロック中は選ばない";
  autoBtn.addEventListener("click", () => {
    const partOf = (it) => it.part ?? inferPart(it);
    const ranked = pool
      .filter((it) => {
        if (it.locked) return false; // ロック中は錬金候補にしない
        if (alchLvMax > 0 && (it.lv ?? 1) > alchLvMax) return false;
        if (alchTarget === "equip" && partOf(it) === "charm") return false;
        if (alchTarget === "charm" && partOf(it) !== "charm") return false;
        return true;
      })
      .sort((a, b) => {
        const ja = a.junk ? 0 : 1;
        const jb = b.junk ? 0 : 1;
        if (ja !== jb) return ja - jb; // ✗印を優先
        return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity); // 低レア優先
      });
    if (ranked.length === 0) {
      toast("フィルタに合う装備がない(レベル/対象を見直そう)");
      return;
    }
    cubeSel = ranked.slice(0, CRAFT_COST).map((it) => it.id);
    renderCube();
  });
  controls.appendChild(autoBtn);
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "クリア";
  // 合成後は結果表示(できた!)が中央に残る。クリアでそれも消せる(2026-07-13 FB)
  clearBtn.disabled = cubeSel.length === 0 && !cubeResultId;
  clearBtn.addEventListener("click", () => {
    cubeSel = [];
    cubeResultId = null;
    renderCube();
  });
  controls.appendChild(clearBtn);
  const goBtn = document.createElement("button");
  goBtn.className = "cube-alchemy-go";
  goBtn.textContent = cubeSel.length ? `錬金する(${cubeSel.length}個 → +${formatGold(gold)}G /+${exp}EXP)` : "錬金する (0個)";
  goBtn.disabled = cubeSel.length === 0;
  goBtn.addEventListener("click", () => {
    const r = alchemizeItems(state, [...cubeSel]);
    if (r.count === 0) {
      toast("錬金できる装備がない");
      return;
    }
    toast(`装備${r.count}個を錬金 → +${formatGold(r.gold)} GP ・ +${r.exp} 合成EXP`, "#ffcf4a");
    if (r.cube?.levelUps > 0) toast(`🧊 合成レベルが ${r.cube.level} に上がった!`, "#8ad8ff");
    cubeSel = [];
    renderCube();
    renderHud();
    if (openOrder.includes("storage")) renderStorage();
    refreshHeroInv();
    save();
  });
  controls.appendChild(goBtn);
  body.appendChild(controls);

  // 卵・タスモンのまとめ錬金(スロットに乗らないので下にコンパクトなクイックボタン)
  const quick = document.createElement("div");
  quick.className = "cube-alchemy-quick";
  const lowEggs = state.eggs.filter((e) => e.rarity === "common" || e.rarity === "rare");
  const eggBtn = document.createElement("button");
  eggBtn.textContent = `🥚 コモン/レアの卵 ${lowEggs.length}個を錬金`;
  eggBtn.disabled = lowEggs.length === 0;
  eggBtn.addEventListener("click", () => {
    const r = alchemizeEggs(state, ["common", "rare"]);
    toast(`卵${r.count}個を錬金 → +${formatGold(r.gold)} GP ・ +${r.exp} EXP`, "#ffcf4a");
    if (r.cube?.levelUps > 0) toast(`🧊 合成レベルが ${r.cube.level} に上がった!`, "#8ad8ff");
    renderCube();
    renderHud();
    renderEggs();
    save();
  });
  quick.appendChild(eggBtn);
  const lowMons = Object.values(state.monsters).filter(
    (m) => !state.party.includes(m.id) && ["common", "rare"].includes(SPECIES[m.speciesId].rarity),
  );
  const monBtn = document.createElement("button");
  monBtn.textContent = `👥 パーティ外の弱タスモン ${lowMons.length}体を錬金`;
  monBtn.disabled = lowMons.length === 0;
  monBtn.addEventListener("click", () => {
    if (!monBtn.dataset.confirm) {
      monBtn.dataset.confirm = "1";
      monBtn.textContent = "本当に錬金?(もう一度)";
      setTimeout(() => {
        if (openOrder.includes("cube")) renderCube();
      }, 2500);
      return;
    }
    const r = alchemizeMonsters(state, lowMons.map((m) => m.id));
    toast(`タスモン${r.count}体を錬金 → +${formatGold(r.gold)} GP ・ +${r.exp} EXP`, "#ffcf4a");
    if (r.cube?.levelUps > 0) toast(`🧊 合成レベルが ${r.cube.level} に上がった!`, "#8ad8ff");
    renderCube();
    renderHud();
    if (openOrder.includes("box")) renderBox();
    save();
  });
  quick.appendChild(monBtn);
  body.appendChild(quick);

  const note = document.createElement("div");
  note.className = "cube-note";
  note.innerHTML =
    `<b>装備を最大${CRAFT_COST}個</b>スロットに入れて錬金(ドラッグ/右クリック/自動入力)。<br>` +
    `<small>売るとゴールド+<b>合成経験値</b>(高レアほど多い)。卵/タスモンは下のボタンでまとめて。パーティは保護。</small>`;
  body.appendChild(note);
}

// ---- 細工(2026-07-19 バッチ2: 装飾品システム+ゴールドシンク・ヘル到達で解禁) ----
// 装備1個をスロットに置き、ゴールドを払ってティアを選んでロール。
// 前の細工は消える(上書き)。直前のロールは before → after で必ず見せる(変化の見える化)
let enhLastRoll = null; // { itemId, slotIdx, before, after } 表示用(モード切替/別装備で消す)
let enhSelSlot = 0; // 選択中のスロット添字
// 上の「初期選択の自動あて」を**その装備を置いた直後の1回だけ**にするための記録
// (2026-08-05 Haru報告「碑文/装飾/彫刻の好きなものを選べない」の実犯: 旧実装は
// 毎回の再描画で「選択中が空きスロットなら最初の空きへ戻す」を無条件に実行していた。
// これはユーザーが2番目以降の空きスロット(例: 彫刻)をクリックした直後の再描画でも
// 発火し、選んだ直後に1番目の空きスロット(装飾)へ勝手に戻されるバグだった)
let enhSelItemId = null;
function renderCubeEnhance(body) {
  const pool = [...state.items, ...state.storage,
    ...Object.values(state.monsters).flatMap((m) => m.equipment ?? [])];
  const byId = new Map(pool.map((it) => [it.id, it]));
  cubeSel = cubeSel.filter((id) => byId.has(id)).slice(0, 1);
  const item = byId.get(cubeSel[0]) ?? null;
  if (enhLastRoll && enhLastRoll.itemId !== item?.id) enhLastRoll = null;

  // 装備スロット(1つ)。合成スロットと同じ見た目で置く
  const grid = document.createElement("div");
  grid.id = "cube-grid";
  grid.className = "enh-grid";
  const slot = document.createElement("div");
  slot.className = "cube-slot";
  if (item) {
    const irm = RARITY_META[item.rarity];
    slot.classList.add("filled");
    slot.style.borderColor = irm.color;
    slot.style.background = rarityCellBg(irm);
    if (irm.stars >= 4) slot.style.boxShadow = `0 0 ${irm.stars}px ${irm.color}66`;
    slot.appendChild(itemIconCanvas(item, 36));
    // マテリア玉(2026-07-21 FB「合成の窓に装備が入るとマテリア消える」)
    const materia = materiaColEl(item);
    if (materia) {
      slot.classList.add("has-sockets");
      if (itemHasMateria(item)) slot.classList.add("has-materia");
      slot.appendChild(materia);
    }
    const lvb = document.createElement("span");
    lvb.className = "cell-lv";
    lvb.textContent = `L${item.lv ?? 1}`;
    slot.appendChild(lvb);
    bindCellTooltip(
      slot,
      () => itemTooltipHtml(item, false) + '<div class="tt-hint">クリックで 外す</div>',
      () => {
        cubeSel = [];
        enhLastRoll = null;
        hideTooltip(true);
        renderCube();
      },
    );
  } else {
    makeDropTarget(slot, (data) => {
      if (data.startsWith("item:")) cubeAddItem(data.split(":")[1]);
    });
  }
  grid.appendChild(slot);
  body.appendChild(grid);

  // 細工スロットの一覧(レア度で数が増える)。クリックで抽選先を選ぶ
  const info = document.createElement("div");
  info.className = "enh-info";
  const slots = item ? enhanceSlotsOf(item) : [];
  if (!item) {
    info.innerHTML = `<div class="enh-current"><span>細工したい装備を スロットに置く(ドラッグ or 右クリック)</span></div>`;
  } else if (slots.length === 0) {
    info.innerHTML = `<div class="enh-current"><span>細工できるのは ${RARITY_META[ENHANCE_MIN_RARITY].label}等級以上の装備だけ</span></div>`;
  } else {
    if (enhSelSlot >= slots.length) enhSelSlot = 0;
    // 最初の空きスロットを選ぶのは、この装備をスロットに置いた直後の1回だけ
    // (上書き事故の予防)。ユーザーが自分でスロットをクリックした後は、
    // 再描画のたびに選び直さない(選んだ直後に戻されるバグの根治)
    if (item.id !== enhSelItemId) {
      enhSelItemId = item.id;
      if (!item.enhances?.[enhSelSlot] && item.enhances?.some?.(Boolean)) {
        const firstEmpty = slots.findIndex((_, i) => !item.enhances?.[i]);
        if (firstEmpty >= 0) enhSelSlot = firstEmpty;
      }
    }
    const list = document.createElement("div");
    list.className = "enh-slots";
    // 表示は種別ごとにまとめる(2026-07-21 FB「細工の並びがおかしい。装飾2個なら
    // 上下に並べて。最後彫刻」): 装飾グループ→碑文→彫刻の順で、同種は縦に連続。
    // スロットの実体(enhances の添字)はラダー順のまま
    for (const i of enhanceSlotDisplayOrder(slots)) {
      const kindKey = slots[i];
      const kind = ENHANCE_KINDS[kindKey];
      const line = item.enhances?.[i] ?? null;
      const chip = document.createElement("button");
      chip.className = "enh-slot-chip" + (i === enhSelSlot ? " sel" : "") + (line ? " filled" : "");
      if (line) {
        const g = ENHANCE_GRADES[line.grade] ?? ENHANCE_GRADES.basic;
        chip.innerHTML = `<span>${kind.icon}</span><b style="color:${g.color}">${enhLineText(line)}</b>`;
      } else {
        chip.innerHTML = `<span>${kind.icon}</span><small>空き(${kind.label})</small>`;
      }
      chip.addEventListener("click", () => {
        if (enhSelSlot !== i) enhLastRoll = null; // 別スロットを選んだら前の結果表示は消す(2026-07-21 FB)
        enhSelSlot = i;
        keepScroll(renderCube);
      });
      list.appendChild(chip);
    }
    info.appendChild(list);
  }
  body.appendChild(info);

  // 種別ごとの料金表(2026-07-21 FB「金額が分かりづらい」): 彫刻30M/碑文20M/装飾12M。
  // 選択中のスロット種をハイライト
  if (item && slots.length > 0) {
    const costs = document.createElement("div");
    costs.className = "enh-costs";
    costs.innerHTML = Object.entries(ENHANCE_KINDS).map(([k, kind]) =>
      `<span class="enh-cost${slots[enhSelSlot] === k ? " sel" : ""}">${kind.icon} ${kind.label} <b>${formatGold(ENHANCE_ROLL_COSTS[k])} G</b></span>`,
    ).join("");
    body.appendChild(costs);
  }

  // 直前のロール結果: 等級色のパネルでポップ演出(2026-07-21 FB「あっさりしすぎ」)。
  // どのスロットの結果かを明示し、空きへの抽選は「なし→」を出さずNEW表示(同FB「おかしくないか」)
  if (enhLastRoll && item) {
    const res = document.createElement("div");
    const g0 = ENHANCE_GRADES[enhLastRoll.after?.grade] ?? ENHANCE_GRADES.basic;
    const rk = ENHANCE_KINDS[enhLastRoll.kind] ?? null;
    res.className = `enh-result pop grade-${enhLastRoll.after?.grade ?? "basic"}`;
    res.style.setProperty("--eg-color", g0.color);
    const a = enhLastRoll.after ? enhLineText(enhLastRoll.after) : "なし";
    res.innerHTML =
      `<div class="enh-result-head">${rk ? `<span class="enh-kind-tag">${rk.icon} ${rk.label}</span>` : ""}` +
      `<span class="enh-grade-chip" style="color:${g0.color};border-color:${g0.color}">等級 ${g0.label}</span></div>` +
      (enhLastRoll.before
        ? `<div class="enh-result-line"><span class="enh-before">${enhLineText(enhLastRoll.before)}</span><i>▼</i><b style="color:${g0.color}">${a}</b></div>`
        : `<div class="enh-result-line"><b style="color:${g0.color}">${a}</b><small class="enh-new">NEW</small></div>`);
    body.appendChild(res);
  }

  // 抽選ボタン(完全ランダム・上書き)。埋まったスロットは「再抽選(上書き)」を明示し、
  // 2度押しで確認。料金はスロット種で変わる(彫刻30M/碑文20M/装飾12M)
  const controls = document.createElement("div");
  controls.className = "cube-controls enh-tiers";
  const roll = document.createElement("button");
  const selKindKey = slots[enhSelSlot] ?? null;
  const selKind = selKindKey ? ENHANCE_KINDS[selKindKey] : null;
  // 検証用の無料トグル(settings.debugFreeEnhance)が入っていれば0G(テスト専用)
  const selCost = state.settings?.debugFreeEnhance ? 0 : selKindKey ? ENHANCE_ROLL_COSTS[selKindKey] : ENHANCE_ROLL_COST;
  const isReroll = !!item?.enhances?.[enhSelSlot];
  // 文言は引き算(2026-07-22 FB「文字が多すぎ・はみ出してる」): 種別は料金表と
  // スロット選択が既に示しているので、ボタンは動詞+金額だけにする
  roll.innerHTML = selKind
    ? `🎲 ${isReroll ? "再抽選(上書き)" : `${selKind.label}に抽選`}<small>${formatGold(selCost)} G</small>`
    : `🎲 抽選する<small>${formatGold(selCost)} G</small>`;
  roll.disabled = !item || slots.length === 0 || state.gold < selCost;
  roll.addEventListener("click", () => {
    if (item.enhances?.[enhSelSlot] && !roll.dataset.confirm) {
      // 上書き確認(2度押し): 今の行は消える
      roll.dataset.confirm = "1";
      roll.innerHTML = `⚠ もう一度クリックで上書き<small>${formatGold(selCost)} G</small>`;
      setTimeout(() => {
        if (openOrder.includes("cube")) keepScroll(renderCube);
      }, 2500);
      return;
    }
    const r = enhanceRollSlot(state, item.id, enhSelSlot);
    if (r.error) return void toast(r.error, "#ff9a9a");
    enhLastRoll = { itemId: item.id, slotIdx: r.slotIdx, kind: slots[r.slotIdx], before: r.before, after: r.after };
    const g = ENHANCE_GRADES[r.after.grade] ?? ENHANCE_GRADES.basic;
    sfx(r.after.grade === "basic" ? "craft" : "banner");
    bumpMissionCounter(state, "tinker"); // チュートリアル: 細工した
    toast(`🎲 細工の抽選! ${enhLineText(r.after)}(-${formatGold(r.cost)} GP)`, g.color);
    // 属性以上の出目は事件なのでバナーでも祝う(2026-07-21 FB「演出わかりやすく」)
    if (r.after.grade === "element" || r.after.grade === "mythic" || r.after.grade === "skill") {
      celebrateLoot({
        kicker: "レアの出目!!",
        icon: "🎲",
        title: enhLineText(r.after),
        sub: `等級「${g.label}」の細工を引き当てた!`,
        rarity: r.after.grade === "skill" ? "century" : r.after.grade === "mythic" ? "beyond" : "arcana",
      });
    }
    keepScroll(renderCube);
    renderHud();
    refreshMonViews(); // 装備中の装備に刻んだときのステ表示更新
    save();
  });
  controls.appendChild(roll);
  body.appendChild(controls);

  // 確率開示(コードの実値から動的生成。ガチャ規制対応の方針と同じ姿勢)。
  // v5: 出るオプションは部位で決まるので、置いた装備の部位カテゴリの実値を出す
  const selCat = item ? enhancePartCat(item.part ?? "weapon") : "offense";
  const rates = enhanceGradeRates(slots[enhSelSlot] ?? "carve", selCat);
  const rateTxt = Object.entries(rates)
    .map(([gk, pct]) => `${ENHANCE_GRADES[gk].label} ${Math.round(pct * 100) / 100}%`)
    .join(" ・ ");
  // 見えるのは出現率1行だけにし、長い仕様説明はオーバーレイへ退避
  // (2026-07-22 FB「細工窓が見づらい。文字が多すぎ」。調合窓と同じ引き算方式)
  const note = document.createElement("div");
  note.className = "cube-note enh-note";
  note.innerHTML =
    `<small>出現率${item ? `(${ENHANCE_PART_CAT_LABEL[selCat]})` : ""}: ${rateTxt}</small>` +
    `<button class="enh-help-btn" type="button">❓ 説明</button>`;
  note.querySelector(".enh-help-btn").addEventListener("click", () => {
    showHelpOverlay(
      "cube-panel",
      `<b>🗿 細工</b><br>` +
      `ゴールドで抽選して 装備のスロットに細工を刻む(完全ランダム・前の行は消える)。<br><br>` +
      `・スロットは ${RARITY_META[ENHANCE_MIN_RARITY].label}等級で${enhanceSlotsOf({ rarity: ENHANCE_MIN_RARITY }).length}個 → レア度で 装飾→碑文→彫刻 の順に増える(最大${enhanceSlotsOf({ rarity: "celestial" }).length}個)<br>` +
      `・出るオプションは部位で決まる: 武器・サブ武器=攻撃系 / 防具=防御系 / アクセ=周回系<br>` +
      `・種別は値の倍率: 装飾×${ENHANCE_KIND_MULT.adorn} → 碑文×${ENHANCE_KIND_MULT.inscribe} → 彫刻×${ENHANCE_KIND_MULT.carve}。スキル付与は彫刻でだけ出る<br>` +
      `・HPアップは合計+100%まで。回復・バリアの量は細工HPを除いたHPが基準。` +
      `特級「魂の器」を引くと細工HPの一部(最大40%)も基準に乗る<br>` +
      `・品質: ${Object.values(ENHANCE_TIERS).filter((t) => t.label)
        .map((t) => `<span style="color:${t.color}">${t.label} ${t.weight}%(値×${t.mult})</span>`)
        .join(" / ")}`,
    );
  });
  body.appendChild(note);
}

// 細工行の表示テキスト(スキル行は「スキル付与」、ステ行は describeOpt と同じ形式)。
// ロール品質ティア(上質/傑作/極 2026-07-21)は【】の接頭辞で見せる
function enhLineText(line) {
  if (!line) return "なし";
  if (line.skill) return `スキル付与「${SKILLS[line.skill]?.name ?? line.skill}」`;
  const t = ENHANCE_TIERS[line.tier];
  return `${t?.label ? `【${t.label}】` : ""}◆ ${describeOpt(line)}`;
}

// ---- タスモンパス(2026-07-20: バトルパス。無料トラック+プレミアム予告) ----
// 任務の達成でEXPが自動加算され、届いた段の報酬をクリックで受け取る。
// 報酬は全段確定表示(ランダム性なし)。コインはプレミアム限定。卵は無料側も最終30段にウルトラ1個(2026-07-21)
function passNotify(completed) {
  for (const q of completed) {
    toast(`🎖 任務達成「${q.label}」 +${q.exp}パスEXP`, "#ffd67a");
    sfx("levelup");
  }
  if (completed.length && openOrder.includes("pass")) keepScroll(renderPass);
}

// パス報酬のホバーオーバーレイ(2026-07-22 FB「カーソル合わせるとオーバーレイで
// 何がもらえるかわかるように」)。30マス×2段の絵文字だけでは中身が読めないので、
// 段・トラック・中身・受け取り状況を1枚のカードで見せる。
// 卵は等級の色で「価値の予告」を出す(パス窓の売り文句そのもの)
function passRewardTooltipHtml(tier, reward, { premium, claimed, reached, owned = false }) {
  const rows = [];
  if (reward.gold) rows.push(["💰", "ゴールド", `+${formatGold(reward.gold)}`, "#ffcf4a"]);
  if (reward.egg) {
    const rm = RARITY_META[reward.egg];
    rows.push(["🥚", `${rm?.label ?? reward.egg}確定の卵`, "+1", rm?.color ?? "#cdd8ef"]);
  }
  if (reward.coin) rows.push(["🪙", "記念コイン", `+${reward.coin}`, "#e8c050"]);
  if (reward.key) rows.push(["🗝", "ボスの鍵", `+${reward.key}`, "#e8b060"]);
  if (reward.crystal) rows.push(["🔮", "叡智の水晶", `+${reward.crystal}`, "#8ad8ff"]);
  if (reward.theme) rows.push(["🖼", "限定UIテーマ", UI_SKIN_LABEL[reward.theme] ?? reward.theme, "#c88aff"]);
  if (reward.expedSlot) rows.push(["🧭", "探索パーティの枠", `+${reward.expedSlot}`, "#8af0c0"]);
  const state2 = claimed ? "受け取り済み" : reached ? "受け取れる" : "未到達";
  return (
    `<div class="pass-tip">` +
    `<div class="pass-tip-head"><b>${tier}段</b>` +
    `<span class="pass-tip-track${premium ? " premium" : ""}">${premium ? "プレミアム" : "無料"}</span></div>` +
    rows
      .map(
        ([ic, name, val, color]) =>
          `<div class="pass-tip-row"><span class="pass-tip-ic">${ic}</span>` +
          `<span class="pass-tip-name" style="color:${color}">${name}</span>` +
          `<b class="pass-tip-val">${val}</b></div>`,
      )
      .join("") +
    `<div class="pass-tip-foot">${premium && !owned ? "プレミアムを持っていると受け取れる" : state2}</div>` +
    `</div>`
  );
}

function renderPass() {
  const body = $("pass-body");
  body.innerHTML = "";
  const p = passState(state);
  const tier = passTier(state);
  const premium = passPremiumOwned(state);

  // ヘッダ: シーズン・残り日数・段とEXPバー
  const head = document.createElement("div");
  head.className = "pass-head";
  const need = PASS_TIER_EXP;
  const cur = tier >= PASS_MAX_TIER ? need : p.exp - tier * need;
  head.innerHTML =
    `<div class="pass-season"><b>🎖 タスモンパス ${PASS_SEASON.name}</b><span>残り ${passRemainDays(state)}日</span></div>` +
    `<div class="pass-tier"><b>ランク ${tier}</b><span>/ ${PASS_MAX_TIER}</span>` +
    `<div class="cube-exp-bar pass-exp"><i style="width:${Math.round((cur / need) * 100)}%"></i></div>` +
    `<small>${tier >= PASS_MAX_TIER ? "MAX" : `${formatNum(cur)} / ${formatNum(need)} EXP`}</small></div>`;
  body.appendChild(head);

  // まとめて受け取り(届いた無料報酬を1クリックで)
  const claimable = [];
  for (let t = 1; t <= tier; t++) if (!p.claimedFree.includes(t)) claimable.push(t);
  if (claimable.length > 0) {
    const allBtn = document.createElement("button");
    allBtn.className = "compound-do pass-claim-all";
    allBtn.textContent = `🎁 報酬をまとめて受け取る(${claimable.length}件)`;
    allBtn.addEventListener("click", () => {
      let gold = 0;
      let keys = 0;
      let crystals = 0;
      let eggs = 0;
      let got = 0;
      let firstError = null; // 受け取れなかった段の理由(鍵上限/卵枠満杯)は握りつぶさず見せる
      for (const t of claimable) {
        const r = passClaimFree(state, t);
      if (!r?.error) bumpMissionCounter(state, "passclaim"); // チュートリアル: パス報酬を受け取った
        if (!r?.error) bumpMissionCounter(state, "passclaim"); // チュートリアル: パス報酬を受け取った
        if (r.error) {
          firstError ??= r.error;
          continue;
        }
        got++;
        gold += r.reward.gold ?? 0;
        keys += r.reward.key ?? 0;
        crystals += r.reward.crystal ?? 0;
        if (r.egg) {
          eggs++;
          celebrateEgg(r.egg, "パス報酬");
        }
      }
      if (got === 0) return void toast(firstError, "#ff9a9a"); // 全滅=状態変化ゼロ。個別セルと同じ赤トースト
      sfx("coin");
      toast(
        `🎖 パス報酬 ${got}件: +${formatGold(gold)} GP` +
          (keys ? ` ・ ボスの鍵+${keys}` : "") + (crystals ? ` ・ 叡智の水晶+${crystals}` : "") +
          (eggs ? ` ・ 卵+${eggs}` : ""),
        "#ffd67a",
      );
      if (firstError) toast(firstError, "#ff9a9a"); // 一部だけ残った理由も添える
      if (eggs && openOrder.includes("eggs")) renderEggs();
      keepScroll(renderPass);
      renderHud();
      save();
    });
    body.appendChild(allBtn);
  }

  // 任務(デイリー/ウィークリー)。達成済みは✓
  const quests = document.createElement("div");
  quests.className = "pass-quests";
  for (const [label, slotName, defs] of [["今日の任務", "daily", PASS_QUESTS.daily], ["今週の任務", "weekly", PASS_QUESTS.weekly]]) {
    const sec = document.createElement("div");
    sec.className = "pass-quest-col";
    sec.innerHTML = `<div class="pass-quest-head">${label}</div>`;
    for (const q of defs) {
      const got = p[slotName].done.includes(q.id);
      const prog = Math.min(q.goal, p[slotName].progress[q.id] ?? 0);
      const row = document.createElement("div");
      row.className = "pass-quest" + (got ? " done" : "");
      row.innerHTML =
        `<span>${got ? "✅" : "▫"} ${q.label}</span>` +
        `<b>${got ? `+${q.exp}` : `${formatNum(prog)}/${formatNum(q.goal)}`}</b>`;
      sec.appendChild(row);
    }
    quests.appendChild(sec);
  }
  body.appendChild(quests);

  // 報酬トラック(横スクロール)。上段=無料 / 下段=プレミアム(🔒予告)
  const track = document.createElement("div");
  track.className = "pass-track";
  // Steam審査対応(2026-08-04): プレミアムが買えない審査ビルド(DLC未承認)では、
  // 未所有者に🔒の帯を見せない(購入手段のない予告=「未完成」とみなされFailureになった)。
  // 所有者には受け取り行をそのまま残す。2026-08-12: プレミアムパスは承認済みなので復帰
  const showPremiumRow = premium || DLC_STORE_APPROVED.has("premiumPass");
  const labelCol = document.createElement("div");
  labelCol.className = "pass-col pass-col-labels";
  labelCol.innerHTML =
    `<div class="pass-col-tier">&nbsp;</div>` +
    `<div class="pass-row-label">無料</div>` +
    (showPremiumRow ? `<div class="pass-row-label premium">プレミアム</div>` : "");
  track.appendChild(labelCol);
  for (let t = 1; t <= PASS_MAX_TIER; t++) {
    const col = document.createElement("div");
    col.className = "pass-col" + (t <= tier ? " reached" : "");
    col.innerHTML = `<div class="pass-col-tier">${t}</div>`;
    // 無料
    const fr = passFreeReward(t);
    const fCell = document.createElement("button");
    const fClaimed = p.claimedFree.includes(t);
    fCell.className = "pass-cell free" + (fClaimed ? " claimed" : t <= tier ? " ready" : "");
    fCell.innerHTML = fr.egg ? `🥚` : fr.crystal ? `🔮` : fr.key ? `🗝` : `💰`;
    // 中身はホバーのオーバーレイで見せる(2026-07-22 FB)。title属性は
    // ネイティブの吹き出しと二重になるので付けない
    bindCellTooltip(fCell, () =>
      passRewardTooltipHtml(t, fr, { premium: false, claimed: fClaimed, reached: t <= tier }));
    fCell.disabled = fClaimed || t > tier;
    fCell.addEventListener("click", () => {
      const r = passClaimFree(state, t);
      if (r.error) return void toast(r.error, "#ff9a9a");
      sfx("coin");
      if (r.egg) {
        // 卵はドロップと同格の獲得演出+卵窓の即時更新(claim-all経路と対称に)
        celebrateEgg(r.egg, "パス報酬");
        if (openOrder.includes("eggs")) renderEggs();
      }
      toast(`🎖 パス報酬(${t}段): ${fr.label ?? `ゴールド +${formatGold(fr.gold ?? 0)}`}`, "#ffd67a");
      keepScroll(renderPass);
      renderHud();
      save();
    });
    col.appendChild(fCell);
    // プレミアム。所有していれば無料側と同じく「届いた段をクリックで受け取る」。
    // 未所有のあいだだけ locked(予告表示)にする(2026-07-26 プレミアム販売の実装)。
    // 審査ビルドでは行ごと出さない(showPremiumRow=上の審査対応コメント参照)
    if (!showPremiumRow) {
      track.appendChild(col);
      continue;
    }
    const pr = passPremiumReward(t);
    const pCell = document.createElement("button");
    const pClaimed = p.claimedPremium.includes(t);
    pCell.className =
      "pass-cell premium" +
      (!premium ? " locked" : pClaimed ? " claimed" : t <= tier ? " ready" : "");
    // 探索枠は最終報酬なので専用の羅針盤アイコン(卵より先に判定して主役にする)
    pCell.textContent = pr.expedSlot ? "🧭" : pr.egg ? "🥚" : pr.theme ? "🖼" : pr.key ? "🗝" : pr.crystal ? "🔮" : pr.coin ? "🪙" : "💰";
    // 2026-08-12 FB「プレミアムパスの報酬を受け取り済みなのに暗転しないからわかりづらい」:
    // 実犯は2つ重なっていた。①そもそも.pass-cell.premium.claimedの暗転CSSが未定義
    // (freeトラックにはあるのにpremiumトラックだけ抜けていた) ②卵報酬セルは「レア度の
    // 色をlockedのグレースケールに殺されないための予告」インライン上書きを無条件に
    // 適用しており、受け取り済み後もそのまま色付きで残っていた(予告は未受け取りの
    // ときだけ意味があるので、受け取り済みなら適用しない)
    if (pr.egg && RARITY_META[pr.egg] && !pClaimed) {
      // 等級保証の卵はそのレア度の色で「価値の予告」を見せる。lockedの
      // grayscale+半透明が色を殺すので、卵セルだけインラインで打ち消す(指摘#6)
      pCell.style.borderColor = RARITY_META[pr.egg].color;
      pCell.style.boxShadow = `0 0 6px ${RARITY_META[pr.egg].color}55`;
      pCell.style.filter = "none";
      pCell.style.opacity = "0.85";
    }
    bindCellTooltip(pCell, () =>
      passRewardTooltipHtml(t, pr, { premium: true, claimed: pClaimed, reached: t <= tier, owned: premium }));
    pCell.disabled = premium && (pClaimed || t > tier);
    pCell.addEventListener("click", () => {
      if (!premium) {
        return void toast("🎖 プレミアムを持っていると受け取れる報酬。中身はこの表のとおり確定だよ", "#c8b8ff");
      }
      const r = passClaimPremium(state, t);
      if (r.error) return void toast(r.error, "#ff9a9a");
      sfx("coin");
      if (r.egg) {
        // 卵はドロップと同格の獲得演出+卵窓の即時更新(無料側と対称に)
        celebrateEgg(r.egg, "パス報酬");
        if (openOrder.includes("eggs")) renderEggs();
      }
      toast(`🎖 プレミアム報酬(${t}段): ${pr.label ?? ""}`, "#ffd67a");
      keepScroll(renderPass);
      renderHud();
      save();
    });
    col.appendChild(pCell);
    track.appendChild(col);
  }
  body.appendChild(track);

  // 説明の常設をやめてオーバーレイへ(2026-08-01 友人テストFB「パスの詳細は
  // 書かないで、オーバーレイで詳細を見せるように」)。導線は「? 説明」ボタン
  const helpBtn = document.createElement("button");
  helpBtn.className = "chip pass-help-btn";
  helpBtn.textContent = "? パスの説明";
  helpBtn.addEventListener("click", () => {
    const panel = $("pass-panel");
    panel.querySelector(".pass-help-overlay")?.remove();
    const ov = document.createElement("div");
    ov.className = "cmp-help-overlay pass-help-overlay";
    ov.innerHTML =
      `<b>任務をこなすと自動でEXPが入り、届いた段の報酬をクリックで受け取れる。</b><br>` +
      (showPremiumRow
        ? `<small>上段=無料(ゴールド/ボスの鍵/叡智の水晶、最終30段はウルトラ確定の卵)。下段=プレミアム(卵・記念コイン・限定テーマ+所有中は戦闘時間1.1倍)は購入すると受け取れる。報酬は全段この表のとおり(ランダムなし)。</small>`
        : `<small>報酬はゴールド/ボスの鍵/叡智の水晶、最終30段はウルトラ確定の卵。全段この表のとおり(ランダムなし)。</small>`);
    const cl = document.createElement("button");
    cl.className = "compound-do";
    cl.style.cssText = "width:100%;margin-top:8px";
    cl.textContent = "閉じる";
    cl.addEventListener("click", () => ov.remove());
    ov.appendChild(cl);
    panel.appendChild(ov);
  });
  body.appendChild(helpBtn);

  renderDlcSection(body); // 有料コンテンツが先(2026-08-03 FB「称号と有料コンテンツの並び逆」)
  renderTitleSection(body);
}

// ---- 称号(2026-07-21 DLC): 名乗る称号を選ぶ。戦闘力には一切影響しない ----
// 所有していない/条件を満たしていない称号は「取り方」つきで薄く見せる
// (取れるものが見えると目標になる。隠すと存在に気づけない)
function renderTitleSection(body) {
  const sec = document.createElement("div");
  sec.className = "pass-titles";
  const owned = availableTitles(state);
  const cur = activeTitle(state);
  sec.innerHTML = `<div class="pass-sec-head">🏅 称号<small>いま: <b style="color:${cur.color}">${cur.label}</b></small></div>`;
  const row = document.createElement("div");
  row.className = "title-row";
  for (const id of Object.keys(TITLES)) {
    const t = TITLES[id];
    const has = owned.includes(id);
    const chip = document.createElement("button");
    chip.className = "title-chip" + (has ? "" : " locked") + (cur.id === id ? " sel" : "");
    chip.style.setProperty("--tc", t.color);
    chip.innerHTML = `<b>${t.label}</b><small>${has ? (cur.id === id ? "名乗り中" : "選ぶ") : t.how}</small>`;
    chip.title = has ? t.how : `未取得: ${t.how}`;
    if (has) {
      chip.addEventListener("click", () => {
        const r = setTitle(state, id);
        if (r.error) return void toast(r.error, "#ff9a9a");
        toast(`🏅 称号を「${r.title.label}」にした`, r.title.color);
        save();
        keepScroll(renderPass);
      });
    }
    row.appendChild(chip);
  }
  sec.appendChild(row);
  body.appendChild(sec);
}

// ---- DLC一覧(2026-07-21): 何が売り物かを1画面で見せる ----
// Steam接続前は「準備中」。所有していれば内容と受け取り状況を出す
// Steam審査対応(2026-08-04): 未採番・申請中のDLCとプレミアム帯は審査ビルドでは見せない
// (「Coming soon」表示が“未完成のゲーム”と判定されFailureになった)。
// 2026-08-12 Haru報告「DLCはこの2つしか承認されてない(プレミアムパス/蒼のガラス)。
// まずはこの2つで行く」: 5件中2件だけが個別に承認され、残り3件は審査継続中のため、
// 単一のON/OFFフラグから「承認済みDLC idの集合」へ変更。id は DLC_IDS(dlc.js)の
// キー名と一致させる。追加承認が来たらここへ id を足すだけで復活する
const DLC_STORE_APPROVED = new Set(["premiumPass", "starter_blue-glass"]);
// verify-langs の審査ゲートがこの一覧を見る(準備中/Coming soonの露出検査・
// 未承認DLCのプレミアム帯露出検査)
window.__dlcStoreApproved = [...DLC_STORE_APPROVED];

// ---- DLC購入者への「受け取り方」案内(2026-08-12 Haru指示) ----
// Haruの依頼は「メールで通知」だったが、Steamは購入者のメールアドレスを開発者へ
// 渡さない(Steamworksの仕様。開発側に届くのは所有可否の判定結果だけ)ため、実際の
// メール送信は不可能。代わりに**ゲーム内の✉メール**へ、新規に所有を検知したDLCごとに
// 1回だけ自動で1通届ける(state.settings.dlcMailSent[id]で既送を記録・以後は再送しない)。
// 文はDLCごとの完全な文で用意する(i18n-dict.jsは完全一致の辞書引きが基本のため、
// 変数をそのまま文中へ埋め込む合成文は未訳が残りやすい — 2026-08-05細工修正と同じ教訓)
const DLC_RECEIVE_MAIL = Object.freeze({
  premiumPass: {
    icon: "🎫",
    title: "タスモンパス プレミアムの受け取り方",
    body:
      "ご購入ありがとうございます!\nパス窓を開くと、上部の🔒帯が解錠されてプレミアム報酬をすぐに受け取れます。\n報酬はシーズンごとに更新されるので、定期的にパス窓をのぞいてみてください。",
  },
  "starter_blue-glass": {
    icon: "🖼",
    title: "スターターパック 蒼のガラスの受け取り方",
    body:
      "ご購入ありがとうございます!\nパス窓の有料コンテンツ一覧にある「スターターパック 蒼のガラス」のカードから「🎁 封入物を受け取る」ボタンを押すと、称号・限定テーマ・記念コイン・卵が届きます。\n見た目のテーマは⚙メニュー→🖼UIテーマから切り替えられます。",
  },
});
// DLC_STORE_APPROVED に足したのにここへ書き忘れる事故を防ぐ(verify-langsが検査)
window.__dlcReceiveMailIds = Object.keys(DLC_RECEIVE_MAIL);
// 交易品(マーケット)は初期リリースでは実装しない(2026-08-03 Haru指示「隠しておいて」)。
// 2026-08-05 追加指示「出品・交易品関連の表示は交易品実装まで**全部**非表示。
// 交易品実装と同時に実装して」: タブだけでなく **出品/取引可能/相場/交易船へ の
// 文言も全部**この1スイッチで消す。実装時は true に戻すだけで全部が同時に復活する
// (機能コードは温存。ゲート verify-trade-hidden.js が露出を毎回検査する)
const TRADE_ENABLED = false;
// 最強装備 / 維持ロックのボタン非表示(2026-08-05 Haru指示「最強装備ボタンを非表示にして
// (いつでも戻せるように)」「最強装備から守る維持ロックボタンは非表示でいい」)。
// 機能(autoEquipBest・mon.equipLock)はそのまま残し、パーティ窓の2ボタンだけ隠す
// 1スイッチ方式(TRADE_ENABLED等と同じ思想)。trueに戻すだけでボタンが復活する
const BEST_EQUIP_UI_ENABLED = false;
window.__tradeEnabled = TRADE_ENABLED;
function renderDlcSection(body) {
  const sec = document.createElement("div");
  sec.className = "pass-dlc";
  sec.innerHTML = `<div class="pass-sec-head">💎 有料コンテンツ</div>`;
  let shown = 0;
  for (const id of DLC_IDS) {
    const d = DLC[id];
    const has = dlcOwned(state, id);
    // 未承認DLCの未所有カードは出さない(Failureの実犯だった「準備中」の予告と同じ)。
    // 承認済み(2026-08-12: プレミアムパス/蒼のガラス)は通常どおり表示。所有者には出す
    if (!DLC_STORE_APPROVED.has(id) && !has) continue;
    shown++;
    const card = document.createElement("div");
    card.className = "dlc-card" + (has ? " owned" : "");
    // カードはパッケージ名だけ(2026-08-01 FB「有料コンテンツはパッケージ名だけにして、
    // 詳細はオーバーレイで。文字が小さくて見えない」)。同梱内容は「? 詳細」で大きく出す
    card.innerHTML =
      `<div class="dlc-head"><b>${d.label}</b>` +
      `<span class="dlc-tag">${has ? "所有" : d.steamKey ? d.price : "準備中"}</span></div>`;
    // 詳細は装備の詳細表示と同じツールチップ形式(2026-08-03 Haru指示)。
    // #tooltip は pointer-events:none なので mouseleave の自壊ループも構造的に起きない
    const tip = (ev) =>
      showTooltip(
        `<div class="tt-name" style="color:#ffd67a">${d.label}</div>` +
          `<div style="margin-top:3px">${d.desc}</div>`,
        ev.clientX,
        ev.clientY,
      );
    card.addEventListener("mouseenter", tip);
    card.addEventListener("mousemove", tip);
    card.addEventListener("mouseleave", () => hideTooltip(true));
    // 購入導線(2026-07-28 AppID採番)。未所有 かつ 採番済みのときだけ出す。
    // Steamのストアページを既定ブラウザで開く方式にしてある。ゲーム内決済は持たない
    // (持つと未成年課金・返金・為替を自前で抱えることになり、素人2人には重すぎる)。
    // 採番前は steamKey が null なので、このボタンは出ずに「準備中」のままになる
    if (!has && d.steamKey) {
      const buy = document.createElement("button");
      buy.className = "compound-do dlc-buy";
      buy.textContent = T("🛒 Steamで購入");
      buy.addEventListener("click", (ev) => {
        ev.stopPropagation(); // カードのオーバーレイを開かない
        const url = `https://store.steampowered.com/app/${d.steamKey}/`;
        if (window.appControl?.openExternal) window.appControl.openExternal(url);
        else window.open(url, "_blank");
      });
      card.appendChild(buy);
    }
    // スターターパックの封入物は1回だけ受け取り(二重付与を防ぐ)
    if (has && STARTER_PACKS.some((p) => p.id === id) && state.settings?.dlcClaimed?.[id] !== true) {
      const btn = document.createElement("button");
      btn.className = "compound-do dlc-claim";
      btn.textContent = "🎁 封入物を受け取る";
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation(); // カードのオーバーレイを開かない
        if ((state.eggs?.length ?? 0) + STARTER_PERKS.eggs.count > eggCapOf(state)) {
          return void toast("卵の置き場が 足りない", "#ff9a9a");
        }
        const r = claimStarterPerks(state, id);
        if (r.error) return void toast(r.error, "#ff9a9a");
        // 卵の実体はUI層で作る(dlc.jsをゲーム進行から独立に保つ設計)
        for (let i = 0; i < r.eggs.count; i++) state.eggs.push(makeEgg(r.eggs.rarity));
        toast("🎁 スターターパックの封入物を 受け取った!", "#ffd67a");
        sfx("banner");
        save();
        renderHud();
        keepScroll(renderPass);
      });
      card.appendChild(btn);
    }
    sec.appendChild(card);
  }
  if (shown === 0) return; // 出せるカードが無ければ欄ごと非表示
  body.appendChild(sec);
}

// ---- ガチャコイン(記念コイン) ----
// TBHのコイン表と同じ見せ方: 行=コイン、列=レア度%(色付き)。確率がそのまま売り文句。
function renderGacha() {
  renderGachaInto($("gacha-body"), renderGacha);
}

// コイン投入口の一時状態(保存しない)。coin.id → {loaded: 投入済み, item: 出来上がった物}。
// 再描画をまたいで残したいのでモジュール側に置く(再描画で結果が消えると
// 「何が出たのか分からない」というレビュー指摘の元になる)
const coinSlotState = {};

// コインの中身を任意のコンテナへ描く(専用窓とアイテム合成窓のガチャタブで共用)。
// refresh: 1枚使ったあとにそのコンテナを再描画するコールバック。
function renderGachaInto(body, refresh) {
  body.innerHTML = "";

  const note = document.createElement("div");
  note.className = "box-hint";
  note.textContent =
    "コインはとっても貴重なドロップ品(金以上・幕ボスがおもな入手源)。枠にコインを入れて使うと表の確率で装備が出る";
  body.appendChild(note);

  // 並びは定義順(金→白金→星海→神代=格の順)で固定する。
  // 以前は所持数の多い順に並べ替えていたが、投入口を付けた(2026-07-22)ことで
  // 1枚使うたびに行が入れ替わり、出来上がった物が入っている枠が画面上を飛ぶ、
  // という不具合になった。位置が動かないことのほうが価値が高い。
  // 未所持は .dim で沈めるので「手持ちが主役」は保たれる
  for (const coin of GACHA_COINS) {
    const owned = state.coins?.[coin.id] ?? 0;
    const row = document.createElement("div");
    row.className = "gacha-row";
    if (owned === 0) row.classList.add("dim");

    const head = document.createElement("div");
    head.className = "gacha-head";
    head.innerHTML =
      iconImgHtml("coin", coin.id, 22, "gacha-coin-ico") +
      `<span class="gacha-name">${coin.name}</span>` +
      `<b class="gacha-cost" style="color:${owned > 0 ? "#ffcf4a" : "#8a7a5c"}">所持 ${owned}枚</b>`;
    row.appendChild(head);

    const odds = document.createElement("div");
    odds.className = "gacha-odds";
    for (const r of RARITY_ORDER) {
      const w = coin.weights[r];
      if (!w) continue;
      const rm = RARITY_META[r];
      const cell = document.createElement("span");
      cell.className = "gacha-odd";
      cell.style.color = rm.color;
      cell.innerHTML = `${rm.label}<b>${w}%</b>`;
      // 一番太い当たり枠をTBH風にハイライト
      const maxW = Math.max(...Object.values(coin.weights));
      if (w === maxW) {
        cell.style.background = `${rm.color}22`;
        cell.style.borderColor = `${rm.color}88`;
      }
      odds.appendChild(cell);
    }
    row.appendChild(odds);

    // ---- 投入口(2026-07-22 FB「一枚使うの文字の上に四角の枠をつくってコインを
    // 入れて使う方式に。使った後にはその枠の中にできたものを表示」) ----
    // ボタン一発で引くのをやめ、「入れる → 使う → 出てきた物が枠に残る」の3拍にする。
    // 出た装備が枠に居座るので、次を引く前に必ず結果を見ることになる(取りこぼし防止)
    const slotState = coinSlotState[coin.id] ?? (coinSlotState[coin.id] = { loaded: false, item: null });
    if (slotState.loaded && owned <= 0) slotState.loaded = false; // 所持が消えたら投入も外す

    const slot = document.createElement("div");
    slot.className = "coin-slot";
    slot.style.setProperty("--cs", coin.color);
    const paintSlot = () => {
      slot.classList.toggle("loaded", slotState.loaded && !slotState.item);
      slot.classList.toggle("has-item", !!slotState.item);
      if (slotState.item) {
        const rm = RARITY_META[slotState.item.rarity];
        slot.innerHTML = "";
        slot.appendChild(itemIconCanvas(slotState.item, 40));
        slot.style.setProperty("--cs", rm?.color ?? coin.color);
        slot.title = slotState.item.name; // 詳細はホバーのツールチップ(装備セルと同じ作法)
      } else if (slotState.loaded) {
        slot.innerHTML = iconImgHtml("coin", coin.id, 40, "coin-slot-ico");
        slot.style.setProperty("--cs", coin.color);
        slot.title = "クリックで取り出す";
      } else {
        slot.innerHTML = `<span class="coin-slot-empty">${owned > 0 ? "入れる" : "コインなし"}</span>`;
        slot.style.setProperty("--cs", coin.color);
        slot.title = owned > 0 ? "クリックでコインを1枚 入れる" : "";
      }
      pull.disabled = !slotState.loaded || !!slotState.item;
      pull.textContent = slotState.item ? "受け取り済み" : "1枚使う";
    };
    // 出来上がった装備の中身はホバーのツールチップで見せる(装備セルと同じ作法)
    bindCellTooltip(slot, () => (slotState.item ? itemTooltipHtml(slotState.item, false) : ""));
    // コインのチップからドラッグして入れられる(2026-07-22 FB「全部D&Dを有効に」)
    makeDropTarget(slot, (data) => {
      const [kind, id] = String(data).split(":");
      if (kind !== "coin") return;
      if (id !== coin.id) return void toast("その枠に入るのは この種類のコインだけ", "#ff9a9a");
      if ((state.coins?.[coin.id] ?? 0) <= 0) return void toast(`${coin.name}を 持っていない`, "#ff9a9a");
      if (slotState.item) slotState.item = null; // 結果が残っていたら押しのける
      slotState.loaded = true;
      sfx("click");
      paintSlot();
    });
    slot.addEventListener("click", () => {
      if (slotState.item) {
        slotState.item = null; // 結果を確認したので枠を空ける
        // 2026-08-07 FB「コインを入れても1枚使うが押せない」: 前回の結果が
        // 残った枠をクリックすると、ここまでは「空にするだけ」で終わっていた。
        // ユーザーはこれを「投入した」と思って直後に1枚使うを押すが、実際は
        // まだ何も入っていないので押せない(2クリック必要なのに1クリックで
        // 終わったと誤認する)。ドロップ側(上のmakeDropTarget)は結果を
        // 押しのけて即ロードする実装が既にあるので、クリック側も同じ挙動に揃える
        if ((state.coins?.[coin.id] ?? 0) > 0) {
          slotState.loaded = true;
          sfx("click");
        }
      } else if (slotState.loaded) {
        slotState.loaded = false;
      } else if ((state.coins?.[coin.id] ?? 0) > 0) {
        slotState.loaded = true;
        sfx("click");
      } else {
        return void toast(`${coin.name}を 持っていない`, "#ff9a9a");
      }
      paintSlot();
    });
    row.appendChild(slot);

    const pull = document.createElement("button");
    pull.className = "gacha-pull";
    pull.addEventListener("click", () => {
      if (!slotState.loaded || slotState.item) return;
      const result = pullGacha(state, coin.id);
      if (result.error) {
        toast(result.error);
        return;
      }
      slotState.loaded = false;
      slotState.item = result.item; // 枠に出来上がった物を残す
      // 貴重なコインなので豪華に演出(獲得バナー。コイン名をキッカーに冠する)
      sfx("coin");
      celebrateItem(result.item, `✦ ${coin.name} ✦`);
      (refresh ?? renderGacha)();
      renderHud();
      if (openOrder.includes("items")) renderItems();
      refreshHeroInv();
      save();
    });
    row.appendChild(pull);
    paintSlot();
    body.appendChild(row);
  }
}

// ---- 確率開示 ----
// ガチャ規制対応: 排出にかかわる全確率を1画面で開示する(コード内の実値から動的生成)。
function pct(v, digits = 2) {
  return `${(v * 100).toFixed(digits).replace(/\.?0+$/, "")}%`;
}

function renderOdds() {
  const body = $("odds-body");
  body.innerHTML = "";
  const section = (title) => {
    const el2 = document.createElement("div");
    el2.className = "odds-section";
    el2.textContent = title;
    body.appendChild(el2);
    return el2;
  };
  const row = (label, value, color) => {
    const r = document.createElement("div");
    r.className = "odds-row";
    r.innerHTML =
      `<span${color ? ` style="color:${color}"` : ""}>${label}</span><b>${value}</b>`;
    body.appendChild(r);
  };

  section("卵ドロップ(撃破1回あたり)");
  // 表示は必ず抽選の実装そのものから引く(CLAUDE.md の恒久ルール)。
  // eggDropBreakdown は eggDropChance と同じ式を分解して返すので、
  // 「画面の数字」と「実際に振られる確率」が構造的にズレない。
  // 2026-08-13 Haru指示「卵ドロップは基本ドロップ率だけの表記にして」:
  // 乗算式ではボーナスを積んでも実効率は基本率のすぐ近くに留まる(理論最大でも
  // 1.65倍)ため、内訳を並べると情報量のわりに読み取りづらかった。
  // ここは**基本ドロップ率(進行段階だけで決まる素の確率)**を1行で出す
  const eggOdds = eggDropBreakdown(state);
  row("ドロップ率", pct(eggOdds.base, 3) + (isRookie(state) ? "(駆け出しの加護中)" : ""));

  // 実際の抽選と同じ関数を呼ぶ(2026-07-27)。以前は rarityWeights(=装備側の
  // 素のテーブル)を表示していたため、アルカナ以上を 0.08 倍する
  // WILD_EGG_HIGH_SCALE が反映されず、上位5レア度を一律12.2倍で過大表示していた。
  // ストアで「排出確率はすべてゲーム内で開示」と明言している以上、
  // ここは必ず抽選の実装そのものから引くこと。
  section(`卵のレア度(STAGE ${stageLabel(state.stage)} 時点)`);
  const weights = wildEggWeights(effectiveStage(state));
  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  for (const rarity of [...RARITY_ORDER].reverse()) {
    const rm = RARITY_META[rarity];
    row(`${"★".repeat(rm.stars)} ${rm.label}`, pct(weights[rarity] / total, 3), rm.color);
  }

  section("孵化(卵→モンスター)");
  row("種族", "卵のレア度のテーブルから均等抽選");
  for (const rarity of [...RARITY_ORDER].reverse()) {
    const rm = RARITY_META[rarity];
    const n = HATCH_TABLE[rarity].length;
    row(`　${rm.label}の卵`, `${n}種 × 各${pct(1 / n, 1)}`, rm.color);
  }
  row("色違い(野生の卵・確定で覚醒個体)", pct(SHINY_CHANCE_WILD));
  row("色違い遺伝(調合で色違いの力を託す)", pct(SHINY_FEED_INHERIT));
  row("覚醒個体(野生の卵)", pct(AWAKENING.chanceWild));
  // 配合は封印中(ENABLE_BREEDING=false)。到達できない機能の確率を「開示」すると
  // 確率窓そのものの信頼が落ちるので、封印中は出さない(解除すれば自動で戻る)
  if (ENABLE_BREEDING) {
    row("色違い(配合の卵・確定で覚醒個体)", pct(SHINY_CHANCE_BRED));
    row("覚醒個体(配合・親の覚醒 0/1/2体)", AWAKENING.chanceBred.map((c) => pct(c)).join(" / "));
    row("二重覚醒(両親覚醒で覚醒した子)", pct(AWAKENING.doubleChance));
  }

  section("宝箱(通常ドロップ・撃破1回あたり)");
  // 2026-08-09: ノーマル(難易度0)は宝箱の出現率・レア宝箱率に専用ブーストが
  // 掛かる(NORMAL_CHEST_BONUS_MULT/NORMAL_AREA_RARE_BOX_MULT)。確率窓は
  // 「抽選の実装そのものから引く」がルールなので、現在の難易度に応じた
  // 実際の値を出す(他の難易度はブースト無しの基準値のまま)。
  // 2026-08-10: 駆け出しの加護中はさらにROOKIE_CHEST_MULTが掛かる(applyKillと同じ式)
  const inNormalArea = (state.difficulty ?? 0) === 0;
  const rookieChestMult = isRookie(state) ? ROOKIE_CHEST_MULT : 1;
  row(
    "ドロップ率",
    pct(EQUIP_DROP_CHANCE * (inNormalArea ? NORMAL_CHEST_BONUS_MULT : 1) * rookieChestMult) +
      (rookieChestMult > 1 ? `(駆け出しの加護で${rookieChestMult}倍中)` : ""),
  );
  {
    // 2026-07-27: 以前は rarityWeights のコモン/レアだけを取り出して
    // 2択に正規化していたため、実際には15%出るウルトラ以上が表に載らず、
    // かつ通常箱の圧縮(NORMAL_CHEST_*_SCALE)も無視した数字になっていた。
    // 中身のレア度は全段を出す — 「木/レア」は箱の見た目であって中身ではない。
    const w = normalChestWeights(effectiveStage(state), inNormalArea ? NORMAL_AREA_RARE_BOX_MULT : 1);
    const nTotal = Object.values(w).reduce((sum, v) => sum + v, 0);
    for (const rarity of [...RARITY_ORDER].reverse()) {
      if (!w[rarity]) continue;
      const rm = RARITY_META[rarity];
      row(`${"★".repeat(rm.stars)} ${rm.label}`, pct(w[rarity] / nTotal, 3), rm.color);
    }
    row("箱の見た目", "コモンは木の宝箱・レア以上はレアの宝箱", CHEST_KINDS.rare.color);
  }

  section("記念コイン(ドロップ品・使うと装備ガチャ)");
  row("コインドロップ率", `通常撃破 ${pct(COIN_DROP_CHANCE)} / ボス撃破 ${pct(BOSS_COIN_CHANCE)}(上位寄り)`);
  for (const coin of GACHA_COINS) {
    row(
      coin.name,
      RARITY_ORDER.filter((r) => coin.weights[r])
        .map((r) => `${RARITY_META[r].label}${coin.weights[r]}%`)
        .join(" / "),
      coin.color,
    );
  }
  row(
    "装備入手のまとめ",
    "通常箱=ほぼコモン/レア(上位は奇跡) ・ ボス箱=幕ボス(STAGE x10)限定でウルトラ〜 ・ 安定供給=合成/コイン",
  );

  // 2026-08-10 説明文監査で発見: 配合(ENABLE_BREEDING=false)の成功率行が
  // ガード無しで常に出ていた。孵化・色違い・覚醒の各行は同じ理由で既にif (ENABLE_BREEDING)
  // で隠しているのに、ここだけ漏れていた=「封印中は出さない」ルールの穴
  section(ENABLE_BREEDING ? "レア度アップの成功率(アイテム合成・配合 共通の思想)" : "レア度アップの成功率(アイテム合成)");
  row("アイテム合成", "〜レジェンド100% / イモータル50% / アルカナ25% / ビヨンド〜コズミック10% / セレスティアル5%");
  row("　失敗時", "素材は消費・同じレア度の装備1個が残る");
  if (ENABLE_BREEDING) {
    row("配合", "子がイモータル50% / アルカナ25% / ビヨンド〜コズミック10% / セレスティアル5%");
    row("　失敗時", "子が1段下のレア度で生まれる(卵は必ずできる)");
  }

  section("ボスの鍵(宝箱の開封1回あたり)");
  row("入手率", pct(KEY_FROM_CHEST_CHANCE));
  row("使い道", "幕ボスの間(x-10)への入場に1本(ウェーブなしのボス一騎打ち・ボス箱確定)");

  section(`ボスの宝箱(幕ボス限定・初クリア×2/鍵ボス×1・STAGE ${stageLabel(state.stage)} 時点)`);
  {
    const bw = bossChestWeights(effectiveStage(state));
    const bTotal = Object.values(bw).reduce((s, v) => s + v, 0);
    for (const rarity of [...RARITY_ORDER].reverse()) {
      if (!(rarity in bw)) continue;
      const rm = RARITY_META[rarity];
      row(`${"★".repeat(rm.stars)} ${rm.label}`, pct(bw[rarity] / bTotal, 3), rm.color);
    }
  }

  const note = document.createElement("div");
  note.className = "odds-note";
  note.textContent = "※全てゲーム内部の実際の抽選値です。ステージが進むと高レアの確率が少しずつ上がります。";
  body.appendChild(note);
}

// ---- 獲得履歴 ----
function renderLog() {
  if (throttleRender(renderLog)) return;
  const list = $("log-list");
  list.innerHTML = "";
  if (state.log.length === 0) {
    const empty = document.createElement("div");
    empty.className = "box-hint";
    empty.textContent = "まだ 記録がない(ドロップ・孵化・合成・配合が ここに残る)";
    list.appendChild(empty);
    return;
  }
  for (const entry of state.log) {
    const rm = RARITY_META[entry.rarity];
    const row = document.createElement("div");
    row.className = "log-row";
    if (rm) row.style.borderLeftColor = rm.color;
    const d = new Date(entry.t);
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    row.innerHTML =
      `<span class="log-time">${time}</span>` +
      `<span class="log-kind">${entry.kind}</span>` +
      `<span class="log-text"${rm ? ` style="color:${rm.color}"` : ""}>${entry.text}</span>`;
    list.appendChild(row);
  }
}

// ---- システムボタン ----
$("btn-quit").addEventListener("click", () => window.appControl?.quit());
$("btn-min").addEventListener("click", () => window.appControl?.minimize());
// 確率開示を⚙から1クリックで(2026-07-30 FB「かくりつ表ってどこ?」)。
// 従来の入口(パーティ窓インベントリ最下部の「🎯 排出確率を見る」)も残す
// お知らせ/メール(2026-07-31 友人テストFB: パーティ窓ヘッダーから⚙へ移動)。
// パーティ窓を該当タブで開く(中身の実装は従来のタブと同じ)
for (const [btnId, tab] of [["btn-news", "news"], ["btn-mail", "mail"]]) {
  $(btnId)?.addEventListener("click", () => {
    document.getElementById("sys-menu")?.classList.add("hidden");
    noticeTab = tab;
    openWindow("notice", { force: true });
    setTimeout(updateMailBadge, 400); // 開いて既読になったぶんを反映
  });
}
updateMailBadge();

$("btn-odds")?.addEventListener("click", () => {
  $("sys-menu")?.classList.add("hidden");
  openWindow("odds");
});
// 背景テーマ(2026-07-13 FB「パレットでカラーバリエーション5-6種類」)。
// 🎨ボタンで順番に切替。body[data-bgtheme]でCSS上書き。"emerald"は歴史的経緯で
// ダークティール(TBH風)のキー名(セーブ互換のため変えない)
const BG_THEMES = [
  { id: "default", label: "標準(藍)", color: "#8ab8ff" },
  { id: "emerald", label: "ダークティール", color: "#6aa8c8" },
  { id: "forest", label: "エメラルドグリーン", color: "#5ac88a" },
  { id: "wine", label: "ワインレッド", color: "#d86a7a" },
  { id: "violet", label: "ロイヤルパープル", color: "#a88ae8" },
  { id: "charcoal", label: "チャコール", color: "#a8a8b0" },
];
function applyBgTheme() {
  // 未所有(返金含む)は標準固定。保存値は消さない=買い直せば選んだ色に戻る
  const unlocked = STARTER_PACKS.some((p) => dlcOwned(state, p.id));
  document.body.dataset.bgtheme = unlocked ? (state.settings.bgTheme ?? "default") : "default";
}
// 背景カラーの切替はスターターパック(UIテーマDLC)の特典(2026-07-26 FB
// 「背景の色変えられるのを有料UI DLCにいれて無料からは削除」)。
// 未所有: 標準(藍)固定でトーストで案内 / いずれか1つでも所有: 全6色を切替できる。
// 判定は実行時(dlcOwned)なので、返金すると自動で標準に戻る
function bgThemeUnlocked() {
  return STARTER_PACKS.some((p) => dlcOwned(state, p.id));
}
$("btn-theme")?.addEventListener("click", () => {
  if (!bgThemeUnlocked()) {
    return void toast("🎨 背景カラーの切替はスターターパック(いずれか1つ)の特典", "#c8b8ff");
  }
  const cur = BG_THEMES.findIndex((t) => t.id === (state.settings.bgTheme ?? "default"));
  const next = BG_THEMES[(cur + 1) % BG_THEMES.length];
  state.settings.bgTheme = next.id;
  applyBgTheme();
  toast(`🎨 背景: ${next.label}(${((cur + 1) % BG_THEMES.length) + 1}/${BG_THEMES.length})`, next.color);
  save();
});
applyBgTheme();

// 表示サイズ(2026-07-17 FB「画面や文字サイズを変更できる機能」): 🔍ボタンで循環。
// zoomはChromium/Electronでレイアウトごと拡縮する=画面も文字も一緒に変わる。
// 2026-07-31 友人テストFB「大きい画面にできないかな」→ 150/175/200%を追加
// (ウィンドウ拡大モード)。入り切らない倍率は fits() が自動でスキップするので、
// 小さい画面では従来どおり130%が実質上限のまま=見切れは起きない
const UI_SCALES = [1, 1.15, 1.3, 1.5, 1.75, 2, 0.85];
// zoom中の座標系ずれ対策(2026-07-17 FB「最大倍率にしたとき画面が見切れてる」):
// Chromiumのzoomでは getBoundingClientRect / clientX / innerWidth は物理px、
// style.left 等のレイアウト値は zoom 倍されて描画される。境界計算を物理pxのまま
// レイアウト値に代入すると zoom 倍ぶん右下へずれて画面外に出る。
// → 実効ビューポート(物理px ÷ zoom)を必ずこの3つで取ること。
function uiZoom() {
  return state.settings.uiScale ?? 1;
}
function effViewportW() {
  return window.innerWidth / uiZoom();
}
function effViewportH() {
  return window.innerHeight / uiZoom();
}
function applyUiScale(relayout = true) {
  const sc = state.settings.uiScale ?? 1;
  document.documentElement.style.zoom = sc === 1 ? "" : String(sc);
  // CSSのvhはzoomの影響を受けない(=zoom倍されて描画される)ので、
  // 「実効ビューポート高」を変数で渡して max-height の基準にする
  document.documentElement.style.setProperty("--effvh", `${Math.floor(effViewportH())}px`);
  // ズームでCSS上の画面幅が変わるので窓配置を組み直す。
  // ※起動時はfalse: この時点では下方のconst(windows等)が未初期化で、
  //   layoutWindowsを呼ぶとTDZでモジュールごと落ちる(初期配置は起動処理側が行う)
  if (relayout) {
    layoutWindows();
    positionSysMenu(); // ⚙メニューを開いたままの倍率変更に追従
    // ズーム変更でドラッグ済みの窓や立ち絵/ステータスのペア窓(top指定で浮いている窓)が
    // 画面外・窓ゾーン外に取り残されないよう、実効ビューポートへ再クランプ(2026-08-03
    // FB「表示サイズ最大にするとまたかぶってる」の一因: 旧倍率の座標のまま残っていた)
    // 手動配置の窓はレイアウト座標(style.left/top)のまま=倍率を上げれば
    // 他の窓と同じように拡大側へ動く。物理位置で固定すると手動配置の窓だけ
    // 拡大に追従せず、かえって不自然になる(実測で確認済み)
    for (const el of document.querySelectorAll(".window:not(.hidden)")) {
      if (!el.style.top || el.style.top === "auto") continue; // タイル管理(bottom基準)はそのまま
      const maxL = Math.max(0, effViewportW() - el.offsetWidth);
      const maxT = Math.max(0, effViewportH() - 98 - el.offsetHeight);
      el.style.left = `${Math.min(Math.max(parseFloat(el.style.left) || 0, 0), maxL)}px`;
      el.style.top = `${Math.min(Math.max(parseFloat(el.style.top) || 0, 0), maxT)}px`;
    }
  }
}
$("btn-uiscale")?.addEventListener("click", () => {
  bumpMissionCounter(state, "uiscale"); // チュートリアル: 表示サイズを変えた
  const cur = UI_SCALES.indexOf(state.settings.uiScale ?? 1);
  // 窓クラスタが物理的に入り切らない倍率はスキップ(見切れ防止)。
  // 100%はどの画面でも必ず選べる(無限ループ防止の脱出口)
  let next = UI_SCALES[(cur + 1) % UI_SCALES.length];
  // 余白は+4px(2026-08-01: +16だとFHD(1920px)で150%が1920/1.5=1280 < 1288で
  // ぎりぎり落ちる。クラスタは中央寄せなので4pxで足りる)
  const fits = (sc) =>
    window.innerWidth / sc >= clusterW() + 4 && window.innerHeight / sc >= 470 + skinWinExtra() * 2 + 98 + 8;
  let skipped = false;
  for (let guard = 0; guard < UI_SCALES.length && next !== 1 && !fits(next); guard++) {
    next = UI_SCALES[(UI_SCALES.indexOf(next) + 1) % UI_SCALES.length];
    skipped = true;
  }
  state.settings.uiScale = next;
  applyUiScale();
  toast(
    `🔍 表示サイズ: ${Math.round(next * 100)}%` +
      (skipped ? "(画面に入り切らない倍率はスキップ)" : ""),
    "#ffe9a8",
  );
  save();
});
applyUiScale(false);

// ---- UIテーマ(スキン)切替(2026-07-20 DLC試作: gen-ui-skinの既存スキンを設定に接続) ----
const UI_SKIN_LABEL = {
  metaphor: "標準",
  "royal-crimson": "ダーク深紅",
  "blue-glass": "蒼のガラス",
  woodcut: "羊皮紙と木版",
  "neon-tech": "ネオンテック",
  baroque: "黄金のバロック", // タスモンパス プレミアム25段の限定テーマ
};
// 選べるスキン一覧。無料は標準(metaphor)のみで、4テーマはスターターパック、
// 黄金のバロックはプレミアムパスの限定テーマ(2026-07-22 FB)。
// **所有判定は毎回ここで走る**ので、返金すると次のフレームで選択肢から消え、
// 起動時フォールバック(下)で標準に戻る = 払っていない人が使い続けられない
function uiSkinList() {
  const paid = STARTER_PACKS.filter((p) => dlcOwned(state, p.id)).map((p) => p.skin);
  return ["metaphor", ...paid, ...(passPremiumOwned(state) ? ["baroque"] : [])];
}
$("btn-uiskin")?.addEventListener("click", () => {
  const list = uiSkinList();
  const cur = state.settings.uiSkin ?? "metaphor";
  const next = list[(list.indexOf(cur) + 1) % list.length];
  state.settings.uiSkin = next;
  document.body.dataset.skin = next;
  layoutWindows(); // 額縁ぶん窓幅が変わる(2026-07-21 窓サイズ統一)ので並べ直す
  toast(`🖼 UIテーマ: ${UI_SKIN_LABEL[next] ?? next}`, "#ffe9a8");
  save();
});
// 起動時に反映(所有していないスキンが保存されていたら標準へ)
if (!uiSkinList().includes(state.settings.uiSkin ?? "metaphor")) state.settings.uiSkin = "metaphor";
document.body.dataset.skin = state.settings.uiSkin ?? "metaphor";

// ---- 言語切替(2026-07-18 英語対応 → 2026-07-29 優先9言語へ拡張) ----
// 切替はリロード方式(描画済みDOMの貼り替えは危険)。起動時にsetLang+データ英語化
// 2言語のときはボタン1つのトグルでよかったが、9言語では目当ての言語まで最大8回
// 押すことになるので一覧から選ばせる。**各言語名はその言語の綴りで出す**
// (今が読めない言語になっていても、母語の綴りなら見つけられる=戻ってこられる)
$("btn-lang")?.addEventListener("click", () => {
  document.querySelector(".lang-overlay")?.remove();
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay lang-overlay";
  const box = document.createElement("div");
  box.className = "feed-box evolve-box lang-box";
  // タイトルは英語のまま。index.html のメニュー欄も日本語版から "Language" 表記なので
  // それに揃える(どの言語から開いても、🌐 と併せて何の画面かが分かる)
  box.innerHTML = `<div class="evolve-title">🌐 Language</div>`;
  const cur = state.settings.lang ?? "ja";
  for (const l of LANGS) {
    const b = document.createElement("button");
    b.className = `evolve-card lang-card${l.code === cur ? " lang-cur" : ""}`;
    // translate="no": 自動翻訳レイヤーに言語名を訳させない(「日本語」が消える)
    b.setAttribute("translate", "no");
    b.innerHTML = `<b translate="no">${l.label}</b><small translate="no">${l.code.toUpperCase()}</small>`;
    b.addEventListener("click", () => {
      overlay.remove();
      if (l.code === cur) return;
      state.settings.lang = l.code;
      save();
      toast(`🌐 ${l.label}`, "#ffe9a8");
      setTimeout(() => window.location.reload(), 600);
    });
    box.appendChild(b);
  }
  const cancel = document.createElement("button");
  cancel.className = "compound-do evolve-cancel";
  cancel.textContent = "キャンセル";
  cancel.addEventListener("click", () => overlay.remove());
  box.appendChild(cancel);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
});
// ---- 常に最前面(2026-08-12 Haru指示) ----
// メイン側のsetAlwaysOnTopを呼ぶだけ。判定・適用はmainプロセスの1か所
// (win:alwaystop, main.js)に集約し、ここは設定の保存とボタンの見た目だけ担う
function applyAlwaysOnTop() {
  window.appControl?.setAlwaysOnTop?.(!!state.settings.alwaysOnTop);
  $("btn-alwaystop")?.classList.toggle("on", !!state.settings.alwaysOnTop);
}
$("btn-alwaystop")?.addEventListener("click", () => {
  state.settings.alwaysOnTop = !state.settings.alwaysOnTop;
  applyAlwaysOnTop();
  toast(`🔝 常に最前面: ${state.settings.alwaysOnTop ? "ON" : "OFF"}`, "#ffe9a8");
  save();
});
applyAlwaysOnTop(); // 起動時: 前回ONにしていたら復元

translateStaticDom(); // index.htmlの静的ラベル(窓タイトル/タスクバー)を辞書で置換
enableAutoTranslate(); // en時: 以後の描画をMutationObserverで自動英訳(2026-07-19)
window.__scanUntranslated = scanUntranslated; // 未翻訳の検査(開発用)

// サウンドUIは撤去(2026-07-26)。audio.jsはno-op化済みで、音源差し替え時に復活させる

// ---- ウィンドウ管理(TBH風: 複数ウィンドウを横並びで同時に開ける) ----
const WINDOW_WIDTH = 294;
const WINDOW_GAP = 6;
// 配合システムの有効/無効。2026-07-08「配合はややこしいので一旦削除、いつでも復活可に」。
// false の間は配合タブ/窓が出ず、配合には到達できない(ロジックは温存、true で即復活)。
const ENABLE_BREEDING = false;
const MAX_OPEN_WINDOWS = 2; // バトルウィンドウ(左350px)と共存できる枚数

// バトルウィンドウ(左固定・デフォルト表示)。閉じても戦闘は裏で続く。
const battlePanel = $("battle-panel");
let battleOpen = true;

// 窓の固定(2026-08-01 Haru指示「デフォルトが固定にしておいて」→
// 2026-08-09 Haru指示「すべての窓に固定ボタンをつけて。最初から固定なのは
// バトルとパーティだけにして」で既定を変更)。既定ONはバトル/パーティのみ、
// 他の窓は既定OFF。明示的に保存された値があればそちらを常に優先する
const PIN_DEFAULT_ON = new Set(["battle", "detail"]);
function winPinned(key) {
  const saved = state.settings?.pinnedWins?.[key];
  return saved ?? PIN_DEFAULT_ON.has(key);
}
function setBattleOpen(open, opts = {}) {
  // 固定中は閉じ操作を受けない(2026-08-01 友人テストFB)。解除は📌をもう一度押す
  if (!open && !opts.force && winPinned("battle")) {
    toast("📌 バトル窓は固定中(📌を押すと解除できる)", "#cdd8ef");
    return;
  }
  battleOpen = open;
  battlePanel.classList.toggle("hidden", !open);
  $("btn-battle").classList.toggle("win-open", open);
  // バトル窓を閉じている間だけ、タスクバーに小さな戦闘表示を出す(#9)
  miniCanvas?.classList.toggle("hidden", open);
  if (anyPanelOpen()) window.appControl?.openPanel();
  else window.appControl?.closePanel();
}

// ---- タスクバーのミニ戦闘表示 ----
// バトル窓を閉じても放置戦闘は続く。何も動きがないのはもったいないので、
// リーダーvs敵のドット絵が小さくぶつかり合う様子とHPバーをバーに描く。
const miniCanvas = $("mini-battle");
const miniCtx = miniCanvas?.getContext("2d");
let miniPartySig = "";
let miniPartyIcons = [];
let miniEnemySig = "";
let miniEnemyIcons = [];
miniCanvas?.addEventListener("click", () => setBattleOpen(true));

function renderMiniBattle(now) {
  if (!miniCtx || battleOpen) return;
  const W = miniCanvas.width;
  const H = miniCanvas.height;
  miniCtx.clearRect(0, 0, W, H);
  const party = partyMonsters(state);
  if (party.length === 0) return;
  // バーを厚くしたぶんアイコンも大きく(高さに追従。52px時≒30 / 76px時≒44)。
  const S = Math.min(48, Math.max(30, Math.floor(H * 0.58)));

  // パーティのアイコン(署名が変割ったら作り直してキャッシュ)
  const psig = party.map((m) => `${m.speciesId}:${m.shiny ? 1 : 0}`).join(",");
  if (psig !== miniPartySig) {
    miniPartySig = psig;
    miniPartyIcons = party.map((m) => monIconCanvas(m, S));
  }
  // 敵のアイコン(生存中の敵ぶん、最大3)
  const tier = enemyTier(combatStage());
  const aliveIdx = enemyGroup.map((hp, i) => (hp > 0 ? i : -1)).filter((i) => i >= 0).slice(0, 3);
  const esig = aliveIdx.map((i) => `${waveVariants[i]}:${tier}${bossWave ? "b" : ""}`).join(",");
  if (esig !== miniEnemySig) {
    miniEnemySig = esig;
    // 幕ボスの間は専用ボスアート(bossSprite は spawnWave のローカルで ここでは参照不可だった
    // ため未定義参照でクラッシュしていた 2026-07-09 修正)。ここで実効属性から解決する。
    const bossSpr = bossWave && isBossStage(state.stage) ? getBossSprite(stageElement(state.stage)) : null;
    miniEnemyIcons = aliveIdx.map((i) =>
      spriteCanvas(bossSpr || getEnemySprite(waveVariants[i] ?? 0, tier), S),
    );
  }

  const t = now / 1000;
  const beat = Math.sin(t * 4);
  const pLunge = Math.max(0, beat) * 5;
  const eLunge = Math.max(0, -beat) * 5;
  const clash = Math.abs(beat) > 0.86;
  const yTop = (H - S) / 2 + 3; // 上部にSTAGE/WAVEバーのぶん空ける

  // ふんわりした地面ライン(かわいいモンスターが立っている感じ)
  const groundY = H - 9;
  const grd = miniCtx.createLinearGradient(0, groundY - 3, 0, groundY + 2);
  grd.addColorStop(0, "rgba(120,160,220,0.28)");
  grd.addColorStop(1, "rgba(120,160,220,0)");
  miniCtx.fillStyle = grd;
  miniCtx.fillRect(2, groundY - 3, W - 4, 5);

  // 味方: 左から並べる(先頭ほど前=右寄り)。上下に軽くバウンス
  miniPartyIcons.forEach((ic, i) => {
    const bob = Math.sin(t * 6 + i) * 1.2;
    miniCtx.drawImage(ic, 4 + i * (S - 8) + pLunge, yTop + bob);
  });
  // 敵: 右から左向きに並べる
  miniEnemyIcons.forEach((ic, i) => {
    const bob = Math.sin(t * 6 + i + 1.5) * 1.2;
    miniCtx.save();
    miniCtx.translate(W - 4 - i * (S - 8) - eLunge, yTop + bob);
    miniCtx.scale(-1, 1);
    miniCtx.drawImage(ic, 0, 0);
    miniCtx.restore();
  });

  // 中央の衝突フラッシュ
  const cx = W / 2;
  const cy = H / 2 - 3;
  if (clash) {
    miniCtx.globalAlpha = 0.9;
    miniCtx.fillStyle = "#ffe9a8";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t;
      const r = 4 + (i % 2) * 3;
      miniCtx.fillRect(cx + Math.cos(a) * r - 1.5, cy + Math.sin(a) * r - 1.5, 3, 3);
    }
    miniCtx.globalAlpha = 1;
  }

  // 上部: STAGE表示(左)+ WAVE進行バー(右)。WAVEは文字でなくバーで見せる
  miniCtx.font = "bold 9px 'Yu Gothic UI', sans-serif";
  miniCtx.textAlign = "left";
  miniCtx.textBaseline = "alphabetic";
  const stageTxt = isBossStage(state.stage) ? "👑 BOSS" : `STAGE ${stageLabel(state.stage)}`;
  miniCtx.fillStyle = "#ffe9a8";
  miniCtx.fillText(stageTxt, 5, 9);
  const stgW = miniCtx.measureText(stageTxt).width;
  const wbX = 8 + stgW + 6;
  const wbY = 2;
  const wbW = Math.max(20, W - wbX - 6);
  const wbH = 6;
  const prog = Math.max(0, Math.min(1, state.killsInStage / Math.max(1, stageKillTarget(state.stage, state.difficulty ?? 0))));
  miniCtx.fillStyle = "rgba(0,0,0,0.55)";
  miniCtx.fillRect(wbX, wbY, wbW, wbH);
  const nearBoss = prog > 0.8 || isBossStage(state.stage);
  miniCtx.fillStyle = nearBoss ? "#ffd23f" : "#8ad8ff";
  miniCtx.fillRect(wbX, wbY, wbW * (isBossStage(state.stage) ? 1 : prog), wbH);
  miniCtx.strokeStyle = "rgba(255,220,150,0.45)";
  miniCtx.lineWidth = 1;
  miniCtx.strokeRect(wbX + 0.5, wbY + 0.5, wbW - 1, wbH - 1);
  miniCtx.font = "7px 'Yu Gothic UI', sans-serif";
  miniCtx.fillStyle = "rgba(255,240,210,0.9)";
  miniCtx.fillText("WAVE", wbX + 2, wbY + wbH - 0.5);

  // HPバー(味方=左半分・緑 / 敵=右半分・赤)
  const pHp = Math.max(0, Math.min(1, playerHp / Math.max(1, partyMaxHp())));
  const ti = targetIdx();
  const eMax = bossWave ? currentEnemyMaxHp() : enemyMaxHp(combatStage());
  const eHp = ti === -1 ? 0 : Math.max(0, Math.min(1, (enemyGroup[ti] ?? 0) / Math.max(1, eMax)));
  const barW = W / 2 - 8;
  const drawBar = (bx, frac, color) => {
    miniCtx.fillStyle = "rgba(0,0,0,0.6)";
    miniCtx.fillRect(bx, H - 5, barW, 4);
    miniCtx.fillStyle = color;
    miniCtx.fillRect(bx, H - 5, barW * frac, 4);
  };
  drawBar(5, pHp, pHp > 0.3 ? "#5adb78" : "#e8604a");
  drawBar(W / 2 + 3, eHp, "#e8604a");
}
// ---- モンスター図鑑 ----
// No.はレア度順(コモン→コズミック)で固定。入手済みだけ絵と名前が開き、
// 未発見はシルエット+???(集める楽しみ)
let dexOrderCache = null;
function dexSpeciesOrder() {
  if (!dexOrderCache) {
    const defIdx = Object.keys(SPECIES);
    dexOrderCache = Object.values(SPECIES)
      .slice()
      .sort((a, b) => {
        const r = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
        return r !== 0 ? r : defIdx.indexOf(a.id) - defIdx.indexOf(b.id);
      });
  }
  return dexOrderCache;
}

// 入手前のシルエット(スプライトを黒く塗りつぶす)
function silhouetteCanvas(speciesId, size) {
  const c = spriteCanvas(getMonsterSprite(speciesId), size);
  const ctx = c.getContext("2d");
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = "rgba(8, 10, 18, 0.94)";
  ctx.fillRect(0, 0, size, size);
  return c;
}

// ---- 装備図鑑(2026-07-13 FB: TBHの装備図鑑に相当) ----
// 「種類×豪華ティア」の発見コレクション。所持したことがある組み合わせが開く。
// 発見の記録は描画時に現在の所持品(持ち物/倉庫/装備中/宝箱)をスキャンして
// state.itemDex に永続化(一度見つけたらずっと開いたまま)。
const ITEM_DEX_TYPES = [
  ["sword", "ソード", "アタッカー武器"], ["axe", "アックス", "アタッカーサブ"],
  ["lance", "ランス", "タンク武器"], ["shield", "シールド", "タンクサブ"],
  ["staff", "スタッフ", "ヒーラー武器"], ["orb", "オーブ", "ヒーラーサブ"],
  ["bow", "ボウ", "バッファー武器"], ["arrow", "アロー", "バッファーサブ"],
  ["ring", "指輪", "アクセ"], ["earring", "イヤリング", "アクセ"], ["necklace", "ネックレス", "アクセ"],
  ["armor", "鎧", "防具"], ["helm", "兜", "防具"], ["boots", "靴", "防具"],
];
// 装備図鑑はレア度別の10段(2026-07-19 FB「コモンとレアが一緒になってるよ?」:
// 旧実装は4ティア(コモン〜レア等の帯)でまとめていた。アイコンはレア度別(_r1〜r10)が
// 全140枚そろっているので、図鑑もレア度1段ずつに分ける)
function scanItemDex() {
  state.itemDex = state.itemDex ?? {};
  // 旧ティア記録(_t)→レア度記録(_r)への移行: どのレア度だったか特定できないので、
  // その帯の下側レア度を発見済みにする(現所持は下の再スキャンで正確に上書きされる)
  const T2R = { 1: 1, 2: 3, 3: 5, 4: 7 };
  for (const key of Object.keys(state.itemDex)) {
    const m = key.match(/^(.+)_t([1-4])$/);
    if (m) {
      state.itemDex[`${m[1]}_r${T2R[Number(m[2])]}`] = true;
      delete state.itemDex[key];
    }
  }
  const all = [
    ...state.items,
    ...state.storage,
    ...state.chests.map((c) => c.item).filter(Boolean),
    ...Object.values(state.monsters).flatMap((m) => m.equipment ?? []),
  ];
  for (const it of all) {
    const key = `${itemIconType(it)}_r${ITEM_ICON_RANK[it.rarity] ?? 1}`;
    state.itemDex[key] = true;
  }
}
function buildItemDex() {
  scanItemDex();
  const wrap = document.createElement("div");
  const total = ITEM_DEX_TYPES.length * RARITY_ORDER.length;
  const found = Object.keys(state.itemDex ?? {}).filter((k) => /_r\d+$/.test(k)).length;
  const head = document.createElement("div");
  head.className = "dex-head";
  head.innerHTML = `装備コレクション <b>${Math.min(found, total)}</b> / ${total} 種`;
  wrap.appendChild(head);
  for (const rarity of RARITY_ORDER) {
    const rank = ITEM_ICON_RANK[rarity] ?? 1;
    const rm = RARITY_META[rarity];
    const sec = document.createElement("div");
    sec.className = "dex-section";
    const got = ITEM_DEX_TYPES.filter(([ty]) => state.itemDex?.[`${ty}_r${rank}`]).length;
    sec.innerHTML = `<span style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}</span>` +
      `<small>${got}/${ITEM_DEX_TYPES.length}</small>`;
    wrap.appendChild(sec);
    const grid = document.createElement("div");
    grid.className = "dex-grid";
    for (const [type, label] of ITEM_DEX_TYPES) {
      const key = `${type}_r${rank}`;
      const gotIt = !!state.itemDex?.[key];
      const cell = document.createElement("div");
      cell.className = "dex-cell" + (gotIt ? "" : " unknown item-dex-locked");
      if (gotIt) cell.style.borderColor = rm.color;
      const img = document.createElement("img");
      img.src = `assets/ui/items/${key}.png`;
      img.width = 44;
      img.height = 44;
      img.style.objectFit = "contain";
      if (!gotIt) img.style.filter = "brightness(0.12) saturate(0)";
      cell.appendChild(img);
      const nameEl = document.createElement("span");
      nameEl.className = "dex-name";
      nameEl.textContent = gotIt ? label : "？？？";
      if (gotIt) nameEl.style.color = rm.color;
      cell.appendChild(nameEl);
      cell.title = gotIt ? `${label}(${rm.label})` : "未発見(この種類・レア度の装備を手に入れると開く)";
      grid.appendChild(cell);
    }
    wrap.appendChild(grid);
  }
  return wrap;
}

let dexTab = "mon"; // "mon" | "items"
// 図鑑セルの絵はキャッシュ(2026-08-01 友人テストFB「図鑑が重い」)。
// renderDexは開くたび156種ぶんのcanvasへピクセル絵を描き直していた。
// 絵は種族×発見状態でしか変わらないので、一度描いたcanvasを使い回す
// (図鑑内で同じ種族は1回しか出ないので、同じ要素の再appendで衝突しない)
const dexArtCache = new Map();
function dexCellArt(spId, got) {
  const key = spId + (got ? ":g" : ":s");
  let cv = dexArtCache.get(key);
  if (!cv) {
    cv = got ? spriteCanvas(getMonsterSprite(spId), 64) : silhouetteCanvas(spId, 64);
    dexArtCache.set(key, cv);
  }
  return cv;
}
// 図鑑に載せる「記録された姿」の解決点(2026-08-13)。
// 個体(mon)のアイコンは monIconCanvas に一本化する恒久ルールがあるが、図鑑が描くのは
// **個体ではなく記録**(種族id+進化段+当時のevoSkin/職)で、mon オブジェクトが存在しない。
// 種類が違うので monIconCanvas には寄せず、代わりに図鑑側の解決点をこの1関数に集約する
// (ばら引数の monPortraitCanvas を画面のあちこちから直接呼ばせない、という趣旨は同じ)
function dexPortraitCanvas(speciesId, stage, rec, size) {
  return monPortraitCanvas(speciesId, size, 0, stage, rec?.skin ?? null, rec?.job ?? null);
}

// 図鑑の進化系譜オーバーレイ(2026-08-13 Haru指示「図鑑には進化をしたら進化前と
// 進化後(第2進化したら第2進化も)の姿が見れるようにして」)。
// 進化後の見た目は evoSkin×職で決まるため種族IDだけからは復元できない。
// state.dexEvo に「実際にその子がなった姿」を保存しておき、ここで並べて見せる
function showDexEvolutionLine(sp) {
  const rm = RARITY_META[sp.rarity];
  const rec = dexEvolutionOf(state, sp.id);
  const line = evolutionLineOf(sp.id);
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay dex-evo-overlay";
  const box = document.createElement("div");
  box.className = "feed-box evolve-box dex-evo-box";
  box.innerHTML =
    `<div class="evolve-title" style="color:${rm.color}">${sp.name} の進化系譜</div>`;
  const row = document.createElement("div");
  row.className = "dex-evo-row";
  for (const step of line) {
    const got = step.stage === 0 || !!rec[String(step.stage)];
    const cell = document.createElement("div");
    cell.className = "dex-evo-step" + (got ? "" : " unknown");
    if (step.stage > 0) {
      const arrow = document.createElement("span");
      arrow.className = "dex-evo-arrow";
      arrow.textContent = "▶";
      row.appendChild(arrow);
    }
    // 未到達の段はシルエット(「まだ見ていない姿」を隠すのは図鑑の作法)
    const saved = rec[String(step.stage)] ?? {};
    cell.appendChild(got ? dexPortraitCanvas(sp.id, step.stage, saved, 76) : silhouetteCanvas(sp.id, 76));
    const label = document.createElement("span");
    label.className = "dex-evo-stage";
    label.textContent = step.stage === 0 ? "未進化" : `第${step.stage}進化`;
    cell.appendChild(label);
    const nm = document.createElement("span");
    nm.className = "dex-evo-name";
    nm.textContent = got ? step.name : "？？？";
    if (got) nm.style.color = rm.color;
    cell.appendChild(nm);
    row.appendChild(cell);
  }
  box.appendChild(row);
  const hint = document.createElement("div");
  hint.className = "dex-evo-hint";
  hint.textContent = Object.keys(rec).length
    ? "進化させた姿が記録される(職によって姿は変わる)"
    : "この子を進化させると、ここに進化後の姿が記録される";
  box.appendChild(hint);
  const close = document.createElement("button");
  close.className = "compound-do evolve-cancel";
  close.textContent = "閉じる";
  close.addEventListener("click", () => overlay.remove());
  box.appendChild(close);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

function renderDex() {
  if (throttleRender(renderDex)) return; // 撃破ごとの受動再描画で戦闘スレッドを奪わない
  const body = $("dex-body");
  body.innerHTML = "";
  // タブ: タスモン図鑑 / 装備図鑑(2026-07-13 FB)
  const tabs = document.createElement("div");
  tabs.className = "cube-pills";
  for (const [key, label] of [["mon", "👥 タスモン"], ["items", "⚔ 装備"]]) {
    const b = document.createElement("button");
    b.className = "cube-band";
    b.textContent = label + (dexTab === key ? " ✓" : "");
    b.addEventListener("click", () => {
      dexTab = key;
      renderDex();
    });
    tabs.appendChild(b);
  }
  body.appendChild(tabs);
  if (dexTab === "items") {
    body.appendChild(buildItemDex());
    save();
    return;
  }
  const species = dexSpeciesOrder();
  const owned = species.filter((sp) => state.dex?.[sp.id]).length;
  const head = document.createElement("div");
  head.className = "dex-head";
  head.innerHTML = `発見 <b>${owned}</b> / ${species.length} 種`;
  // 未解放バフのまとめて解放(2026-07-18 FB「バフ解放ボタン」)
  const pendCount = dexUnclaimedCount(state);
  if (pendCount > 0) {
    const claimAll = document.createElement("button");
    claimAll.className = "dex-claim-all";
    claimAll.textContent = `🔓 バフをまとめて解放(${pendCount})`;
    claimAll.addEventListener("click", () => {
      const n = claimDexBuff(state);
      if (n > 0) bumpMissionCounter(state, "dexbuff");
      syncDexBonus();
      toast(`📖 図鑑バフを ${n}種分解放! パーティが強くなった`, "#8af0a8");
      updateDexBadge();
      renderDex();
      renderHud();
      save();
    });
    head.appendChild(claimAll);
  }
  body.appendChild(head);
  // (図鑑バフの合計説明ブロックは撤去 2026-07-17 FB「図鑑の上にバフの説明イラン」。
  //  個別バフは各エントリのツールチップ、獲得は初登録時のトーストで見せる)
  for (const rarity of RARITY_ORDER) {
    const group = species.filter((sp) => sp.rarity === rarity);
    if (group.length === 0) continue;
    const rm = RARITY_META[rarity];
    const sec = document.createElement("div");
    sec.className = "dex-section";
    sec.innerHTML = `<span style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}</span>` +
      `<small>${group.filter((sp) => state.dex?.[sp.id]).length}/${group.length}</small>`;
    body.appendChild(sec);
    const grid = document.createElement("div");
    grid.className = "dex-grid";
    for (const sp of group) {
      const no = species.indexOf(sp) + 1;
      const got = !!state.dex?.[sp.id];
      const pending = got && !!state.dexUnclaimed?.[sp.id]; // バフ未解放(2026-07-18)
      const cell = document.createElement("div");
      cell.className = "dex-cell" + (got ? "" : " unknown") + (pending ? " pending" : "");
      // レア度色は CSS 変数で渡す(2026-07-24 FB「立ち絵はこんな感じで」:
      // 枠線1本の四角ではなく、星空の上に絵が浮かぶカードにするため)
      // 枠線は引かず、後光(--rc)で格を見せる(2026-07-24 FB「立ち絵はこんな感じで」)
      if (got) cell.style.setProperty("--rc", rm.color);
      if (pending) {
        const dot = document.createElement("span");
        dot.className = "dex-reddot";
        dot.textContent = "!";
        cell.appendChild(dot);
        const claim = document.createElement("button");
        claim.className = "dex-claim-btn";
        claim.textContent = "バフ解放";
        claim.addEventListener("click", (ev) => {
          ev.stopPropagation();
          if (!claimDexBuff(state, sp.id)) return;
          bumpMissionCounter(state, "dexbuff");
          syncDexBonus();
          const buff = dexBuffOf(sp.id);
          toast(`📖 ${sp.name} の図鑑バフを解放! ${buff?.label ?? ""}(恒久)`, "#8af0a8");
          updateDexBadge();
          renderDex();
          renderHud();
          save();
        });
        cell.appendChild(claim);
      }
      // 絵を主役に(2026-07-24 FB): セルの余白が大きく絵が小さかったので64pxへ。
      // 未発見のシルエットも同寸=並びの高さが揃う
      cell.appendChild(dexCellArt(sp.id, got));
      const noEl = document.createElement("span");
      noEl.className = "dex-no";
      noEl.textContent = `No.${String(no).padStart(2, "0")}`;
      cell.appendChild(noEl);
      const nameEl = document.createElement("span");
      nameEl.className = "dex-name";
      nameEl.textContent = got ? sp.name : "？？？";
      if (got) nameEl.style.color = rm.color;
      cell.appendChild(nameEl);
      if (got) {
        // 進化系譜バッジ(2026-08-13): 進化後の姿を記録済みなら段数を出す。
        // 「クリックすると何か見られる」ことをセル上で気づけるようにする
        const evoRec = dexEvolutionOf(state, sp.id);
        const evoCount = Object.keys(evoRec).length;
        if (evoCount > 0) {
          const badge = document.createElement("span");
          badge.className = "dex-evo-badge";
          badge.textContent = `⤴${evoCount}`;
          cell.appendChild(badge);
        }
        cell.classList.add("dex-clickable");
        cell.addEventListener("click", () => showDexEvolutionLine(sp));
        bindCellTooltip(
          cell,
          () => {
            const sk = SKILLS[sp.skillId];
            const buff = dexBuffOf(sp.id);
            const evo = dexEvolutionOf(state, sp.id);
            const evoLine = [1, 2]
              .filter((s) => evo[String(s)])
              .map((s) => `第${s}進化: ${evolvedNameOf(sp.id, s)}`)
              .join("<br>");
            return (
              `<div class="tt-name" style="color:${rm.color}">No.${String(no).padStart(2, "0")} ${sp.name}</div>` +
              `<div class="tt-opts">${rm.label} ${elementChip(sp.element)}<br>` +
              `基礎 攻撃${sp.baseAtk} ・ HP${sp.baseHp}<br>スキル: ${sk.name}` +
              (evoLine ? `<br>${evoLine}` : "") +
              `</div>` +
              (buff
                ? pending
                  ? `<div class="tt-hint" style="color:#ffd67a">📖 図鑑バフ: ${buff.label} — 未解放! 「バフ解放」で受け取る</div>`
                  : `<div class="tt-hint" style="color:#8af0a8">📖 図鑑バフ: ${buff.label}(解放済み・恒久)</div>`
                : "") +
              `<div class="tt-hint">クリックで進化系譜を見る</div>`
            );
          },
          () => {},
        );
      } else {
        cell.title = "未発見(孵化・配合で入手すると開く)";
      }
      grid.appendChild(cell);
    }
    body.appendChild(grid);
  }
}

// ---- ステータスウィンドウ(レベル・能力・個体値をスキル窓のように別窓で) ----
// 選択タスモンの詳細ステータス表示を作る。単独の「ステータス窓」でも、
// 英雄ウィンドウの「ステータス」タブでも同じ中身を使い回す(窓の重複を解消)
// 進化ピッカー(2026-07-11 v2): 選択肢は毎回2つ=「同系統の上位職」+「ランダム枠」。
// ランダム枠にはまれにレア職(1ティア上)・超低確率で隠し職(tier4)が光る。
function openEvolvePicker(monId) {
  const mon = state.monsters[monId];
  if (!mon || !canEvolve(mon)) return;
  const stage = evolveStage(mon);
  const opts = evolveOptions(mon); // [同系統, ランダム枠]
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay evolve-overlay";
  const box = document.createElement("div");
  box.className = "feed-box evolve-box";
  box.innerHTML =
    `<div class="evolve-title">⤴ 第${stage + 1}進化 — ${baseNameOf(mon)}</div>` +
    // 1つのテンプレートに収める(2026-08-13 Haru報告: 英語版でこの説明文が
    // 日本語のまま残っていた)。`A` + `B` と分けて書くと、実行時のテキストノードは
    // 連結した1文なのに、監査はA・Bを別々にしか見ないため辞書に無くても素通りする。
    // **画面に1つの文として出るものは、ソースでも1つの文字列で書く**
    `<div class="evolve-note">同系統で堅実に伸ばすか、運命のランダム枠に懸けるか(2択は個体ごとに固定・引き直し不可)。進化にはゴールドと進化石が要る。</div>`;
  opts.forEach((jobId, idx) => {
    const j = JOBS[jobId];
    const jRole = ROLE_META[j.role] ?? ROLE_META.nuke;
    const isHidden = j.tier >= 4;
    const card = document.createElement("button");
    // ランダム枠は第1・第2進化とも中身を伏せる(2026-07-11 FB: 選ぶまで何になるか分からないガチャ方式)
    const secret = idx === 1;
    card.className = "evolve-card" + (secret ? " secret" : "") + (!secret && isHidden ? " hidden-job" : "");
    // 費用行(2026-07-28): ゴールド+進化石。足りない側は赤で見せて「何が要るか」を迷わせない
    const rCost = evolveCost(mon, secret);
    const rStone = secret ? EVO_STONES.random : EVO_STONES[j.role] ?? EVO_STONES.nuke;
    const rHave = evoStoneCount(state, secret ? "random" : j.role);
    const costLine =
      `<span class="evolve-cost">` +
      `<b style="color:${state.gold >= rCost ? "#ffd67a" : "#ff9a9a"}">${formatGold(rCost)}G</b>` +
      ` + <b style="color:${rHave > 0 ? rStone.color : "#ff9a9a"}">${stoneIconHtml(secret ? "random" : (j.role ?? "nuke"), 14)}${rStone.label}×1</b>` +
      `<small>(所持${rHave})</small></span>`;
    if (secret) {
      card.innerHTML =
        `<span class="evolve-kind">ランダム枠 — 運命に賭ける</span>` +
        `<b class="secret-q">？？？</b>` +
        (stage === 0
          ? `<small>別系統の上位職…まれに固有レア職(${RARE_JOB_CHANCE * 100}%)、飛び級(${SKIP_JOB_CHANCE * 100}%)や隠し職(${HIDDEN_JOB_CHANCE * 100}%)も。<b style="color:#ff9a9a">${EVOLVE_FAIL_CHANCE * 100}%で外れ(この子は二度と進化できなくなる)</b></small>`
          : `<small>別系統の最上位職…超低確率で隠し職(${HIDDEN_JOB_CHANCE * 2 * 100}%)。<b style="color:#ff9a9a">${EVOLVE_FAIL_CHANCE * 100}%で外れ(二度と進化不可)</b></small>`) +
        costLine;
    } else {
      const kind =
        idx === 0
          ? "同系統の上位職"
          : isHidden
            ? "✨✨ 隠し職!!"
            : `ランダム枠(${jRole.label}へ)`;
      card.innerHTML =
        `<span class="evolve-kind">${kind}</span>` +
        `<b style="color:${jRole.color}">${roleIconHtml(jRole, 15)} <span class="${isHidden ? "rainbow-name" : ""}">${j.label}</span></b>` +
        `<small>${j.desc}</small>` +
        costLine;
    }
    card.addEventListener("click", () => {
      // 装備を外した素の状態で記録する(2026-07-15 FB)。進化でロールが変わると装備が
      // 全部外れるので、装備込みで比べると「進化したのにステータスが下がった」と見えてしまう
      const before = monStatsSnapshotFull(mon, true);
      const prevHue = monHue(mon);
      const prevSkin = mon.evoSkin; // 儀式演出の「変身前の姿」用
      const prevRarity = monRarityOf(mon); // レアリティ上昇の表示用
      const r = evolveMonster(state, monId, jobId);
      if (r.error) return void toast(r.error);
      overlay.remove();
      if (r.failed) {
        sfx("fail");
        // 外れ: 進化せず費用だけ消える(この段の進化は永久に不可=カードに開示済み)
        toast(`……外れ!! ${baseNameOf(mon)}は もう進化できない(${formatGold(r.cost)}Gも消えた)`, "#ff9a9a");
        renderHud();
        if (openOrder.includes("detail")) renderDetail(currentDetailId);
        save();
        return;
      }
      // ランダム枠(？？？)の開封演出: 大当たり(飛び級/レア職/隠し職)は獲得バナー級の演出
      if (secret) {
        const jackpot =
          r.job.tier >= 4
            ? { kicker: "✨✨ 隠し職降臨!!! ✨✨", rarity: "celestial", toastMsg: "✨✨ 隠し職を引き当てた!!!" }
            : r.job.rare
              ? { kicker: "✨ 固有レア職!! ✨", rarity: "cosmic", toastMsg: "✨ 固有レア職を引き当てた!!" }
              : r.job.tier === 3 && stage === 0
                ? { kicker: "🚀 飛び級!! 🚀", rarity: "beyond", toastMsg: "🚀 飛び級! いきなり最上位職に!!" }
                : null;
        if (jackpot) {
          celebrateLoot({
            kicker: jackpot.kicker,
            icon: "👑",
            title: r.job.label,
            sub: r.job.desc,
            rarity: jackpot.rarity,
          });
          scene.whiteFlash = Math.max(scene.whiteFlash, 0.6);
          scene.camPunch = Math.max(scene.camPunch, 0.9);
          toast(jackpot.toastMsg, "#ffd67a");
        } else {
          toast(`🎲 ランダム枠の中身は【${r.job.label}】!`, "#8ad8ff");
        }
      }
      if (r.jobSkill) toast(`✦ 専用スキル「${r.jobSkill.name}」を習得!!`, "#ffd67a");
      if (r.unequipped > 0)
        toast(`🎒 前のロール専用の武器${r.unequipped}個を外した(防具・アクセはそのまま)`, "#8ad8ff");
      if (r.islandRefund > 0)
        toast(`🗺 前のジョブ島に振った ${r.islandRefund}pt が戻ってきた(スフィア盤で振り直せる)`, "#8ad8ff");
      if (JOBS[jobId].rare || JOBS[jobId].hidden)
        toast("🗺 スフィア盤に専用の島が現れた!(スタート直結)", "#8ad8ff");
      playerHp = Math.min(playerHp, partyMaxHp());
      save();
      sfx("evolve");
      // 窓の更新(見た目の変化)は演出を見終えてから=先に結果が分からない(2026-07-13 FB)
      evolveCeremony(mon, r.job, prevHue, before, prevSkin, prevRarity, () => {
        syncSceneParty();
        refreshMonViews();
        if (openOrder.includes("status")) renderStatus();
        if (openOrder.includes("detail")) renderDetail(currentDetailId);
        if (openOrder.includes("box")) renderBox(); // 2026-07-19 FB「進化してもアイコンが変わらない」
        renderHud();
      });
    });
    box.appendChild(card);
  });
  const cancel = document.createElement("button");
  cancel.className = "compound-do evolve-cancel";
  cancel.textContent = "キャンセル";
  cancel.addEventListener("click", () => overlay.remove());
  box.appendChild(cancel);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// ---- 変化の見える化(2026-07-11 原則: 「変化があるシステムは変化後の効果を必ず見せる」) ----
// モンスターの主要ステータスのスナップショット。before/after比較に使う
function monStatsSnapshot(mon) {
  const atkSpeedBonus = equipStat(mon, "atkSpeed") + perkStat(mon, "atkSpeed");
  const aps = 1 + Math.min(0.6, atkSpeedBonus);
  return {
    攻撃力: Math.round(monsterAtk(mon)),
    最大HP: monsterMaxHp(mon),
    通常攻撃DPS: Math.round(monsterAtk(mon) * aps),
    総合戦力: powerScore(mon),
  };
}

// 進化リザルト用のフルスナップショット(2026-07-11 FB「結果画面でステータス詳細全て」)。
// 基本4値に加えて、%系の詳細ステータス(周回ボーナスはジョブのfarm込み)も文字列で持つ。
//
// bare=true で「装備を外した素の状態」を計算する(2026-07-15 FB)。進化でロールが
// 変わると装備が全部外れるため、装備込みで比較すると進化してステータスが下がったように
// 見えてしまう(実際に下がったのは装備を外したぶんで、素の力は上がっている)。
// before/after の両方を素の状態で比べれば、進化そのものの効果だけが見える。
function monStatsSnapshotFull(mon, bare = false) {
  const m = bare ? { ...mon, equipment: [] } : mon;
  const pctStr = (v) => `+${Math.round(v * 1000) / 10}%`;
  const st = (key) => equipStat(m, key) + perkStat(m, key);
  return {
    ...monStatsSnapshot(m),
    攻撃速度: pctStr(st("atkSpeed")),
    スキル威力: pctStr(st("skillPower")),
    会心率: pctStr(st("critRate")),
    会心ダメージ: pctStr(st("critDmg")),
    CD短縮: pctStr(st("cdr")),
    被ダメージ軽減: pctStr(equipStat(m, "defPct") + perkStat(m, "defCut")),
    卵ドロップ: pctStr(st("dropBonus") + (JOBS[m.job]?.farm?.drop ?? 0)),
    ゴールド: pctStr(st("goldBonus") + (JOBS[m.job]?.farm?.gold ?? 0)),
  };
}

// before/afterの差分行HTML(全ステータス+追加行)。上がった行は緑の+%、変化なしは灰色。
// 値が文字列(%表記など)の行はそのまま表示する
function statDiffRowsHtml(before, after, extraLines = [], skipTotal = false) {
  const pct = (b, a) => (b > 0 && a !== b ? `${a > b ? "+" : ""}${Math.round(((a - b) / b) * 100)}%` : "");
  let html = "";
  for (const key of Object.keys(before)) {
    // 総合戦力は上の大きな before→after で見せるので明細からは省く(重複を作らない)
    if (key === "総合戦力" && skipTotal) continue;
    const b = before[key];
    const a = after[key];
    const changed = a !== b;
    // 変化のない行は出さない(2026-08-05 Haru指示「上がってないステータスは表示しなくていい」)。
    // 伸びた所だけを並べると「何が強くなったか」が一目で分かる
    if (!changed) continue;
    const isStr = typeof b === "string" || typeof a === "string";
    html +=
      `<div class="evo-diff-row"><span>${key}</span>` +
      (isStr
        ? `<b>${b}${changed ? ` → ${a}` : ""}</b><i></i>`
        : `<b>${formatNum(b)}${changed ? ` → ${formatNum(a)}` : ""}</b><i>${pct(b, a)}</i>`);
    html += `</div>`;
  }
  for (const line of extraLines) {
    html += `<div class="evo-diff-row extra"><span>${line.label}</span><b>${line.value}</b><i></i></div>`;
  }
  return html;
}

// 進化の儀式演出(2026-07-11): 旧色の立ち絵が震え→白爆発→新色の立ち絵に変身、
// ジョブ名バナー+ステータスの前後比較を表示。「絵が変割って進化が分かる」対応。
function evolveCeremony(mon, job, prevHue, before, prevSkin = null, prevRarity = null, onDone = null) {
  const after = monStatsSnapshotFull(mon, true); // beforeと同じ「装備なし」基準で比べる
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay evolve-ceremony";
  const box = document.createElement("div");
  box.className = "feed-box evo-box";
  const spWrap = document.createElement("div");
  spWrap.className = "evo-sprite";
  // 旧フォーム=1段前の絵(進化専用アート > 前のスキン > 基本形)、新フォーム=今の絵
  const st = evolveStage(mon);
  const oldSprite =
    (st > 1 ? getEvolvedMonsterSprite(mon.speciesId, st - 1) : null) ??
    (prevSkin && SPECIES[prevSkin] ? getMonsterSprite(prevSkin) : getMonsterSprite(mon.speciesId));
  const oldC = spriteCanvas(oldSprite, 96, prevHue);
  oldC.classList.add("evo-old");
  const newC = spriteCanvas(monSpriteOf(mon), 96, monHue(mon));
  newC.classList.add("evo-new");
  const flash = document.createElement("div");
  flash.className = "evo-flash";
  spWrap.append(oldC, newC, flash);
  box.appendChild(spWrap);
  const banner = document.createElement("div");
  banner.className = "evo-banner";
  // 進化先は職名でなく「進化後の名前」(職名+種族名の複合)で見せる
  // (2026-07-26 FB「職業名で表示されるのをモンスター名に修正したい」)
  banner.innerHTML =
    `${baseNameOf(mon)} は ` +
    `<span class="${job.tier >= 4 ? "rainbow-name" : ""}" style="color:${(ROLE_META[job.role] ?? ROLE_META.nuke).color}">${evolvedName(mon)}</span>` +
    ` に進化した!!`;
  const diff = document.createElement("div");
  diff.className = "evo-diff";
  const extra = [];
  // レアリティ上昇(2026-07-11 FB「姿と共にレアリティも上がる」)
  const newRarity = monRarityOf(mon);
  if (prevRarity && newRarity !== prevRarity) {
    const pr = RARITY_META[prevRarity];
    const nr = RARITY_META[newRarity];
    extra.push({
      label: "レアリティ",
      value: `<span style="color:${pr.color}">${pr.label}</span> → <b style="color:${nr.color}">${nr.label}</b> ✨`,
    });
  }
  if (job.farm) {
    const f = [];
    if (job.farm.gold) f.push(`ゴールド+${Math.round(job.farm.gold * 100)}%`);
    if (job.farm.drop) f.push(`卵+${Math.round(job.farm.drop * 1000) / 10}%`);
    if (job.farm.exp) f.push(`EXP+${Math.round(job.farm.exp * 100)}%`);
    extra.push({ label: "周回ボーナス", value: f.join(" ") });
  }
  if (job.skillId && SKILLS[job.skillId]) extra.push({ label: "専用スキル", value: SKILLS[job.skillId].name });
  // 進化後の名前(変化の見える化)。
  // 2026-08-13 まではここに evoSkin(姿を借りた別種族)の名前を出していたが、
  // それは「実在する別キャラの名前」であって この子の名前ではない
  // (Haru報告「進化キャラが別のキャラの名前になっている」の露出箇所の1つ)。
  // 借りた種族IDは内部の見た目解決のための実装詳細なので画面には出さず、
  // 進化で得た**自分の名前**を見せる
  if (st >= 1) {
    extra.push({ label: "新しい名前", value: `<b>${evolvedNameOf(mon.speciesId, st)}</b>` });
  }
  // 総合戦闘力の before → after を大きく見せる(2026-08-05 Haru指示
  // 「大きく総合戦闘力のbefore/afterを表示して」)。細かい行の前に主役を置く
  const pb = Math.round(before.総合戦力 ?? 0);
  const pa = Math.round(after.総合戦力 ?? 0);
  const upPct = pb > 0 ? Math.round(((pa - pb) / pb) * 100) : 0;
  diff.innerHTML =
    `<div class="evo-power-hero">` +
    `<div class="evo-power-label">総合戦闘力</div>` +
    `<div class="evo-power-nums"><span class="evo-power-before">${formatNum(pb)}</span>` +
    `<span class="evo-power-arrow">▶</span>` +
    `<b class="evo-power-after">${formatNum(pa)}</b></div>` +
    (upPct > 0 ? `<div class="evo-power-up">+${upPct}%</div>` : "") +
    `</div>` +
    statDiffRowsHtml(before, after, extra, true);
  const ok = document.createElement("button");
  ok.className = "compound-do evo-ok";
  ok.textContent = "OK";
  ok.addEventListener("click", () => {
    overlay.remove();
    onDone?.(); // 窓の更新は演出を見終えてから(ネタバレ防止 2026-07-13 FB)
  });
  box.append(banner, diff, ok);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  // シーケンス: 震え(1秒)→白爆発→変身+バナー/差分/OK表示
  setTimeout(() => flash.classList.add("go"), 950);
  setTimeout(() => {
    spWrap.classList.add("done");
    box.classList.add("done");
    scene.whiteFlash = Math.max(scene.whiteFlash, 0.35);
    scene.camPunch = Math.max(scene.camPunch, 0.5);
  }, 1250);
}

// 極みの選択(2026-07-11): 確実な強化か、運命のギャンブルか。確率は開示する
function openPinnaclePicker(monId) {
  const mon = state.monsters[monId];
  if (!mon || !canPinnacle(mon)) return;
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay evolve-overlay";
  const box = document.createElement("div");
  box.className = "feed-box evolve-box";
  const g = PINNACLE_GAMBLE;
  const nonePct = Math.round((1 - g.hidden - g.awaken - g.shiny) * 100);
  box.innerHTML =
    `<div class="evolve-title">🌟 極みの進化 — ${baseNameOf(mon)}</div>` +
    `<div class="evolve-note">最上位職だけが迎える最後の選択(1回だけ・${formatGold(pinnacleCost(mon))}G)。</div>`;
  const doPinnacle = (choice) => {
    const before = monStatsSnapshot(mon);
    const r = pinnacleEvolve(state, monId, choice);
    if (r.error) return void toast(r.error);
    overlay.remove();
    if (r.kind === "solid") {
      toast("🌟 極みの力が宿った! 攻撃+15% HP+15%", "#ffd67a");
      awakenCeremonyLike(mon, before, "🌟 極みの力!(確実強化)");
    } else if (r.kind === "hidden") {
      toast(`✨✨ 運命が微笑んだ! 隠し職【${r.job.label}】に転職!!!`, "#ffd67a");
      awakenCeremonyLike(mon, before, `✨ 隠し職【${r.job.label}】!!`);
    } else if (r.kind === "awaken") {
      toast(`⚡ 運命が微笑んだ! 【${AWAKENING.label[r.level]}】!!`, AWAKENING.color);
      awakenCeremonyLike(mon, before, `⚡ ${AWAKENING.label[r.level]}!!`);
    } else if (r.kind === "shiny") {
      toast("✨ 運命が微笑んだ! 色違い(＋覚醒)になった!!", "#ffd6f2");
      awakenCeremonyLike(mon, before, "✨ 色違いに変化!!");
    } else {
      toast("……運命は動かなかった(そのまま)。それでも挑んだ証は残る", "#9aa4c8");
    }
    playerHp = Math.min(playerHp, partyMaxHp());
    syncSceneParty();
    refreshMonViews();
    if (openOrder.includes("detail")) renderDetail(currentDetailId);
    renderHud();
    save();
  };
  const solid = document.createElement("button");
  solid.className = "evolve-card";
  solid.innerHTML =
    `<span class="evolve-kind">確実</span><b>🌟 極みの力</b>` +
    `<small>攻撃+15%・最大HP+15%(必ず効く)</small>`;
  solid.addEventListener("click", () => doPinnacle("solid"));
  const gamble = document.createElement("button");
  gamble.className = "evolve-card secret";
  gamble.innerHTML =
    `<span class="evolve-kind">運命のギャンブル</span><b class="secret-q">？？？</b>` +
    `<small>隠し職${Math.round(g.hidden * 100)}% / 覚醒+1が${Math.round(g.awaken * 100)}% / ` +
    `色違い${Math.round(g.shiny * 100)}% / そのまま${nonePct}%(費用は消える)</small>`;
  gamble.addEventListener("click", () => doPinnacle("gamble"));
  const cancel = document.createElement("button");
  cancel.className = "compound-do evolve-cancel";
  cancel.textContent = "キャンセル";
  cancel.addEventListener("click", () => overlay.remove());
  box.append(solid, gamble, cancel);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// 汎用の「変化を見せる」オーバーレイ(極み用。覚醒儀式と同じ見た目)
function awakenCeremonyLike(mon, before, bannerText) {
  const after = monStatsSnapshot(mon);
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay evolve-ceremony";
  const box = document.createElement("div");
  box.className = "feed-box evo-box done";
  const spWrap = document.createElement("div");
  spWrap.className = "evo-sprite done";
  const c = spriteCanvas(monSpriteOf(mon), 96, monHue(mon));
  c.classList.add("evo-new");
  if ((mon.awakening ?? 0) > 0) c.classList.add("awakened-sprite");
  spWrap.appendChild(c);
  const banner = document.createElement("div");
  banner.className = "evo-banner";
  banner.textContent = bannerText;
  const diff = document.createElement("div");
  diff.className = "evo-diff";
  diff.innerHTML = statDiffRowsHtml(before, after);
  const ok = document.createElement("button");
  ok.className = "compound-do evo-ok";
  ok.textContent = "OK";
  ok.addEventListener("click", () => overlay.remove());
  box.append(spWrap, banner, diff, ok);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  scene.whiteFlash = Math.max(scene.whiteFlash, 0.35);
}

// 覚醒成功の儀式演出(2026-07-11 FB「達成感がない」): 立ち絵+全ステータスの前後比較。
function awakenCeremony(mon, before, newLevel) {
  const after = monStatsSnapshot(mon);
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay evolve-ceremony";
  const box = document.createElement("div");
  box.className = "feed-box evo-box done"; // 変身演出はなし=最初から結果を見せる
  const spWrap = document.createElement("div");
  spWrap.className = "evo-sprite done";
  const c = spriteCanvas(monSpriteOf(mon), 96, monHue(mon));
  c.classList.add("evo-new", "awakened-sprite");
  spWrap.appendChild(c);
  box.appendChild(spWrap);
  const banner = document.createElement("div");
  banner.className = "evo-banner";
  banner.innerHTML =
    `⚡ ${baseNameOf(mon)} が <span style="color:${AWAKENING.color}">【${AWAKENING.label[newLevel]}】</span> した!!`;
  const sk = AWAKENING.skill[newLevel];
  const diff = document.createElement("div");
  diff.className = "evo-diff";
  diff.innerHTML = statDiffRowsHtml(before, after, [
    { label: "スキル", value: `威力×${sk.power} ・ CD×${sk.cooldown}` },
    {
      label: "周回ボーナス",
      value: `卵+${Math.round(AWAKENING.dropBonus[newLevel] * 1000) / 10}% ゴールド+${Math.round(AWAKENING.goldBonus[newLevel] * 100)}%`,
    },
  ]);
  const ok = document.createElement("button");
  ok.className = "compound-do evo-ok";
  ok.textContent = "OK";
  ok.addEventListener("click", () => overlay.remove());
  box.append(banner, diff, ok);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  scene.whiteFlash = Math.max(scene.whiteFlash, 0.4);
  scene.camPunch = Math.max(scene.camPunch, 0.6);
}

function renderStatus() {
  if (throttleRender(renderStatus)) return;
  const host = $("status-body");
  const mon = state.monsters[currentDetailId] ?? leader(state);
  if (!mon) {
    host.innerHTML = '<div class="box-hint">キャラが いない</div>';
    host.dataset.monId = "";
    return;
  }
  // 0.4秒のライブ更新で丸ごと作り直すと、①スクロールが毎回先頭へ戻り下部の
  // ボタンに留まれない ②押している最中にボタンのDOMノードが消えてクリックが
  // 発火しない ③「逃がす」の2度押し確認が毎回リセットされる(2026-08-04 FB
  // 「ステータスの下のボタン機能してねえぞ」の実犯)。同じキャラで文面も同じ間は
  // **生きているボタン列をそのまま移植**し、スクロール位置も持ち越す
  const fresh = buildStatusContent(mon);
  const oldActions = host.querySelector(".status-actions");
  const freshActions = fresh.querySelector(".status-actions");
  const scrollBefore = host.scrollTop;
  if (
    host.dataset.monId === mon.id &&
    oldActions && freshActions &&
    oldActions.dataset.sig === freshActions.dataset.sig
  ) {
    freshActions.replaceWith(oldActions);
  }
  host.innerHTML = "";
  host.appendChild(fresh);
  host.dataset.monId = mon.id;
  host.scrollTop = scrollBefore;
}

// 立ち絵窓(2026-08-01 Haru指示): 大立ち絵+名前+総合戦闘力だけの窓。
// ステータス窓とペアで開き、細かい数値は隣のステータス窓に任せる。
// 0.4秒ごとのライブ更新が来るので、戦闘力/レベルが動いた時だけ描き直す(memo)
let portraitMemo = "";
function renderPortrait(monId) {
  const host = $("portrait-body");
  if (!host) return;
  const mon = state.monsters[monId] ?? leader(state);
  if (!mon) {
    host.innerHTML = '<div class="box-hint">キャラが いない</div>';
    return;
  }
  const key = `${mon.id}:${mon.level}:${powerScore(mon)}:${mon.job ?? ""}:${mon.awakening ?? 0}`;
  if (key === portraitMemo && host.childElementCount) return;
  portraitMemo = key;
  host.innerHTML = "";
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const box = document.createElement("div");
  box.className = "portrait-hero";
  box.style.background = `radial-gradient(ellipse 62% 70% at 50% 58%, ${rm.color}30, transparent 72%)`;
  box.appendChild(monHeroCanvas(mon, 262, 300));
  host.appendChild(box);
  const name = document.createElement("div");
  name.className = "portrait-name";
  // 立ち絵窓も進化名で統一(2026-08-13)
  name.innerHTML = (mon.awakening ?? 0) > 0
    ? `<b class="rainbow-name">${baseNameOf(mon)}</b>`
    : `<b style="color:${rm.color}">${baseNameOf(mon)}</b>`;
  name.insertAdjacentHTML("beforeend", `<small style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}</small>`);
  host.appendChild(name);
  const power = document.createElement("div");
  power.className = "status-power-big";
  power.innerHTML = `<small>総合戦闘力</small><b>${formatNum(powerScore(mon))}</b>`;
  host.appendChild(power);
  // 孵化直後の立ち絵窓に閉じるボタンを常設(2026-08-07 Haru指示)。
  // ヘッダーの×は小さくて気づきにくいので、立ち絵の下にも明示的に置く。
  // 挙動はヘッダーの×と同じ(closeWindow側のhatchPairFromEggsが卵一覧へ戻す)
  const closeBtn = document.createElement("button");
  closeBtn.className = "compound-do portrait-close-btn";
  closeBtn.textContent = "閉じる";
  closeBtn.addEventListener("click", () => closeWindow("portrait"));
  host.appendChild(closeBtn);
}

function buildStatusContent(mon) {
  const body = document.createElement("div");
  body.className = "status-content";
  const sp = SPECIES[mon.speciesId];
  const rm = RARITY_META[monRarityOf(mon)];
  const grade = gradeFromIv(mon.iv);
  const skill = effectiveSkill(mon);
  const skillA = skill.active;
  const skillDps =
    skillA.type === "nuke" ? Math.round((monsterAtk(mon) * skillNukePower(skillA)) / skill.cooldown) : 0;
  // スキルの働きを1行で言い切る(2026-07-15 FB「キャラによってはスキルDPSが
  // 表示されてないのはなんで?」)。回復/かばう/バフ役は攻撃スキルを持たないので
  // DPSが0=「—」になり、壊れているのか仕様なのか判別できなかった。
  // 種別ごとに意味のある指標へ差し替える(ラベルごと変える)。
  const skillPowerMult =
    1 + equipStat(mon, "skillPower") + perkStat(mon, "skillPower") + jobStat(mon, "skillPower");
  const skillMetric = (() => {
    if (skillA.type === "nuke") {
      return { label: "スキルDPS", value: skillDps > 0 ? formatNum(skillDps) : "—" };
    }
    if (skillA.type === "heal") {
      // 毎秒の回復量(最大HP割合)。回復には毎秒上限があるので、超えるぶんは頭打ちと明示
      const raw = (skillA.power * skillPowerMult) / skill.cooldown;
      const capped = Math.min(raw, HEAL_CAP_PER_SEC);
      const pct = (v) => `${Math.round(v * 1000) / 10}%`;
      return {
        label: "回復/秒",
        value: raw > HEAL_CAP_PER_SEC ? `${pct(capped)}(上限)` : pct(raw),
      };
    }
    if (skillA.type === "guard") {
      return skillA.kind === "shield"
        ? { label: "バリア", value: `最大HP${Math.round(Math.min(0.85, skillA.power * skillPowerMult) * 100)}%` }
        : { label: "被ダメ軽減", value: `${Math.round(Math.min(0.85, skillA.power) * 100)}%` };
    }
    // buff: haste/critup/攻撃バフ
    const b =
      skillA.kind === "haste"
        ? { label: "攻撃速度バフ", value: `+${Math.round(skillA.power * 100)}%` }
        : skillA.kind === "critup"
          ? { label: "会心率バフ", value: `+${Math.round(skillA.power * 100)}%` }
          : { label: "攻撃バフ", value: `+${Math.round(skillA.power * 100)}%` };
    return b;
  })();

  // 立ち絵+総合戦闘力(2026-08-01 Haru指示改訂「キャラの詳細画面は元の通りに。
  // 孵化した時の表示だけ2枚ペア」: 通常はこの窓1枚に全部入り。孵化後の
  // ペア表示中だけ、隣の立ち絵窓と重複するのでこの2つを省く)
  if (!openOrder.includes("portrait")) {
    const heroBox = document.createElement("div");
    heroBox.className = "status-hero";
    heroBox.style.background = `radial-gradient(ellipse 62% 70% at 50% 62%, ${rm.color}30, transparent 72%)`;
    heroBox.appendChild(monHeroCanvas(mon, 260, 170));
    body.appendChild(heroBox);
    const powerBig = document.createElement("div");
    powerBig.className = "status-power-big";
    powerBig.innerHTML = `<small>総合戦闘力</small><b>${formatNum(powerScore(mon))}</b>`;
    body.appendChild(powerBig);
  }

  const head = document.createElement("div");
  head.className = "skills-head";
  const role = roleOf(mon);
  // 覚醒個体は名前が七色に流れる(豪華さの主張 2026-07-10)
  // 進化後は進化名で統一(2026-08-13 Haru指示「進化前の名前が残ってるので
  // 進化したら進化後の名前に統一して」)。種族名(sp.name)の直参照は禁止
  const shownName = baseNameOf(mon);
  const nameHtml = (mon.awakening ?? 0) > 0
    ? `<b class="rainbow-name">${shownName}</b>`
    : `<b style="color:${rm.color}">${shownName}</b>`;
  head.insertAdjacentHTML(
    "beforeend",
    `<div>${nameHtml} ${elementChip(sp.element)} ` +
      `<span class="role-chip" style="color:${role.color};border-color:${role.color}">${roleIconHtml(role)}${role.label}</span><br>` +
      `<small>${rm.label} ・ 個体ランク <b style="color:${grade.color}">${grade.rank}</b></small></div>`,
  );
  body.appendChild(head);

  // 進化ジョブの大型表示(2026-07-13 FB「レアジョブや飛び級の表示が全く分からない」)
  if (mon.job && JOBS[mon.job]) {
    const j = JOBS[mon.job];
    const kind = j.hidden
      ? "✨ 隠し職"
      : j.rare
        ? "★ 固有レア職"
        : `第${evolveStage(mon)}進化・上位職`;
    const jb = document.createElement("div");
    jb.className = "job-banner" + (j.hidden ? " hidden-job" : j.rare ? " rare-job" : "");
    jb.innerHTML =
      `<span class="jb-kind">${kind}</span><b class="jb-name">${j.label}</b>` +
      (j.desc ? `<small class="jb-desc">${j.desc}</small>` : "");
    body.appendChild(jb);
  }

  // シリアル刻印(唯一無二の個体である証)＋限定シーズン印。若い番号ほどマーケット価値が高い。
  if (mon.mintNo || sp.season) {
    body.insertAdjacentHTML(
      "beforeend",
      `<div style="margin:2px 0 4px;display:flex;gap:6px;flex-wrap:wrap;font-size:11px;font-weight:700">` +
        (mon.mintNo ? `<span style="color:#ffe082;border:1px solid #7a6a2a;border-radius:8px;padding:1px 7px">刻印 No.${String(mon.mintNo).padStart(4, "0")}</span>` : "") +
        (sp.season ? `<span style="color:#8af0c0;border:1px solid #2a6a55;border-radius:8px;padding:1px 7px">限定 ${sp.season}</span>` : "") +
        `</div>`,
    );
  }

  // 覚醒の6段ラダー(原神の命ノ星座風 2026-07-17 FB「覚醒があるのかどうか・上限が6なのも
  // わからん」)。未覚醒でも常に6ノードを見せて「重ねる余地」と上限を示す。
  // 点灯=到達済み・ホバーで各段の効果。覚醒個体はバナーの中に組み込む
  {
    const lv = mon.awakening ?? 0;
    const nodes = [];
    for (let n = 1; n <= AWAKEN_MAX; n++) {
      const on = n <= lv;
      const m = AWAKENING.mult[n];
      const skN = AWAKENING.skill[n];
      const tip = `${AWAKENING.label[n]}: 攻撃×${m.atk} / HP×${m.hp} / スキル威力×${skN.power} / CD×${skN.cooldown}`;
      nodes.push(`<span class="aw-node${on ? " on" : ""}" title="${tip}">${on ? "⚡" : "◇"}</span>`);
    }
    const ladder =
      `<div class="awaken-ladder">${nodes.join("")}<b class="aw-count">${lv}/${AWAKEN_MAX}</b></div>` +
      (lv === 0
        ? `<small class="aw-note">同じ種族の子を重ねると確定で+1段(覚醒の儀・最大${AWAKEN_MAX})</small>`
        : "");
    if (lv > 0) {
      const atkX = AWAKENING.mult[lv]?.atk ?? 1;
      const hpX = AWAKENING.mult[lv]?.hp ?? 1;
      const banner = document.createElement("div");
      banner.className = "awaken-banner" + (lv >= 4 ? " lv2" : "");
      banner.innerHTML =
        `<div class="awaken-banner-head">⚡ ${AWAKENING.label[lv]}個体 ⚡</div>` +
        ladder +
        `<div class="awaken-skill">覚醒スキル <b style="color:${skill.active.color}">✦ ${skill.name}</b></div>` +
        `<div class="awaken-mults">覚醒補正 <b>攻撃 ×${atkX}</b> ・ <b>HP ×${hpX}</b>` +
        `<small>+ 周回ボーナス(ドロップ/ゴールド)</small></div>`;
      body.appendChild(banner);
    } else {
      const row = document.createElement("div");
      row.className = "awaken-ladder-row";
      row.innerHTML = ladder;
      body.appendChild(row);
    }
  }

  // ステータス行の彫金アイコン(assets/ui/staticons/ = Gemini生成の金エンブレム8種)
  const STAT_ICON = {
    "攻撃力": "atk", "通常攻撃DPS": "atk",
    "防御力(被ダメ軽減)": "def", "防御(被ダメ軽減)": "def",
    "現在のHP": "hp",
    "攻撃速度": "spd", "スキルDPS": "spd",
    "クールタイム短縮": "cdr",
    "クリティカル率": "crit", "クリティカルダメージ": "crit",
    "総合戦力": "power",
    // スキル欄は役割ごとにラベルが変わる(2026-07-15 FB「スキルDPSが表示されてない」)
    "回復/秒": "hp", "バリア": "def", "被ダメ軽減": "def",
    "攻撃バフ": "atk", "攻撃速度バフ": "spd", "会心率バフ": "crit",
  };
  const statIco = (label) =>
    STAT_ICON[label] ? `<img class="stat-ico" src="assets/ui/staticons/${STAT_ICON[label]}.png" alt="">` : "";

  // TBH式パラメータ: 通常攻撃DPS / 攻撃力 / 現在のHP / 攻撃速度 を羊皮紙シートに
  const atkSpeedBonus = equipStat(mon, "atkSpeed") + perkStat(mon, "atkSpeed");
  const attacksPerSec = 1 + Math.min(0.6, atkSpeedBonus); // 基本1回/秒、上限+60%
  const normalDps = Math.round(monsterAtk(mon) * attacksPerSec);
  const maxHp = monsterMaxHp(mon);
  // 名前バンド+LV/EXPヘッダ+「パラメータ」2列グリッド(RPG定番の帳票レイアウト 2026-07-10)
  const sheet = document.createElement("div");
  sheet.className = "hero-sheet";
  const band = `<div class="sheet-band">${mon.shiny ? "★" : ""}${baseNameOf(mon)}${(mon.plus ?? 0) > 0 ? `+${mon.plus}` : ""}</div>`;
  const lvExp =
    `<div class="lv-exp-row">` +
    `<span class="lv-big">LV:<b>${mon.level}</b>${mon.level >= LEVEL_CAP ? "<small>(最大)</small>" : ""}</span>` +
    `<span class="exp-next">次のレベルまで <b>${mon.level >= LEVEL_CAP ? "—" : formatNum(Math.max(0, expToNext(mon.level) - (mon.exp ?? 0)))}</b> EXP</span>` +
    `</div>`;
  // ジョブ/属性の枠付き行(帳票レイアウトの上段)。進化済みはジョブ名を表示(レアジョブは虹色)
  const job = JOBS[mon.job];
  const jobLabel = job
    ? `<b style="color:${role.color}">${roleIconHtml(role, 14)} <span class="${job.tier >= 4 ? "rainbow-name" : ""}">${job.label}</span></b>`
    : `<b style="color:${role.color}">${roleIconHtml(role, 14)} ${role.label}</b>`;
  // ジョブはカード型で見せる(2026-07-26 FB「ステータスのジョブのところの配置これにして」:
  // 進化段+上位職の肩書きを1行目、職名を主役に、倍率を下段に添える)
  // レア職=金の額装、隠し職=虹のオーラで「引き当てた特別」をひと目で(2026-07-28 FB
  // 「パーティ窓におけるレア職、隠し職はわかるようにして。豪華に演出を」)
  const jobCardClass = job?.tier >= 4 ? " job-card-hidden" : job?.rare ? " job-card-rare" : "";
  const jobBadge =
    job?.tier >= 4
      ? `<span class="job-lux-badge hidden-badge">✦ 隠し職 ・ 1/500の奇跡</span>`
      : job?.rare
        ? `<span class="job-lux-badge rare-badge">★ 固有レア職 ・ 1/40の当たり</span>`
        : "";
  const charLine =
    job?.charName && (job.rare || job.tier >= 4)
      ? `<div class="job-card-char">専用キャラ「${job.charName}」</div>`
      : "";
  const jobCard = job
    ? `<div class="job-card${jobCardClass}" style="border-color:${role.color}55">` +
      `<div class="job-card-tier">${["基本職", "第1進化", "第2進化・上位職", "第2進化・上位職"][job.tier] ?? "基本職"}` +
      `${job.tier >= 4 ? "・隠し職" : job.rare ? "・固有レア職" : ""}${jobBadge}</div>` +
      `<div class="job-card-name">${jobLabel}</div>` +
      charLine +
      `<div class="job-card-mult">攻撃+${Math.round(((job.mult?.atk ?? 1) - 1) * 100)}% HP+${Math.round(((job.mult?.hp ?? 1) - 1) * 100)}%` +
      `<small>(${role.label})</small></div>` +
      `</div>`
    : "";
  const jobRows =
    `<div class="job-rows">` +
    (job ? jobCard : `<div class="job-row"><span>ジョブ</span>${jobLabel}</div>`) +
    `<div class="job-row"><span>属性</span><b style="color:${ELEMENT_META[sp.element].color}">${ELEMENT_META[sp.element].label}</b></div>` +
    `<div class="job-row"><span>レア度</span><b style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}</b></div>` +
    `</div>`;
  // パラメータ: 2列×5行(アイコン+ラベル / 右寄せ数値+下罫線)
  const critPct0 = Math.round(partyCritRate(state) * 1000) / 10;
  const critDmgPct0 = Math.round(partyCritDmg(state) * 100);
  const cdrPct0 = Math.round(partyCdr(state) * 1000) / 10;
  const cell = (k, v) =>
    `<div class="param-cell"><span>${statIco(k)}${k}</span><b>${v}</b></div>`;
  // 2026-07-31 友人テストFB: ①通常攻撃DPSは表示から削除(無くてもバランスとして
  // 成立する数字は削る=ぱっと見のわかりやすさ優先) ②総合戦力はセルに埋めず、
  // パラメータ帯の横に大きく出す(初心者が「戦力の高い子を編成する」構図を作る)
  const paramGrid =
    `<div class="param-band">パラメータ</div>` +
    `<div class="param-grid">` +
    cell("現在のHP", `${formatNum(maxHp)}`) +
    cell("攻撃力", formatNum(Math.round(monsterAtk(mon)))) +
    cell("攻撃速度", attacksPerSec.toFixed(2)) +
    cell("防御力(被ダメ軽減)", `${Math.round(partyDefenseCut(state) * 1000) / 10}%`) +
    cell("クリティカル率", `${critPct0}%`) +
    cell("クリティカルダメージ", `${critDmgPct0}%`) +
    cell("クールタイム短縮", `${cdrPct0}%`) +
    cell(skillMetric.label, skillMetric.value) +
    `</div>`;
  sheet.innerHTML = band + lvExp + jobRows + paramGrid;
  body.appendChild(sheet);

  // 進化(2026-07-10): Lv30+で未進化なら進化ボタンを出す
  if (canEvolve(mon)) {
    const btn = document.createElement("button");
    btn.className = "compound-do evolve-btn";
    btn.textContent = `⤴ 進化する(${formatGold(evolveCost(mon))}G)`;
    btn.title = "上位ジョブに進化 or 別ジョブの上位にジョブチェンジ(1回だけ・まれにレアジョブ候補が光る)";
    btn.addEventListener("click", () => openEvolvePicker(mon.id));
    body.appendChild(btn);
  }

  // 詳細ステータス(TBH: 赤帯見出し+シルエット背景に派生ステを並べる)
  const detailHead = document.createElement("div");
  detailHead.className = "detail-stat-head";
  detailHead.innerHTML = `<span>🔍 詳細ステータス</span>`;
  body.appendChild(detailHead);

  const detail = document.createElement("div");
  detail.className = "hero-detail";
  // 背景にキャラのシルエット(TBHの詳細ステ背景)
  detail.style.setProperty(
    "--silhouette",
    `url(${silhouetteCanvas(mon.speciesId, 120).toDataURL()})`,
  );
  // 戦闘ステータスは上の「パラメータ」グリッドへ移動(2026-07-10)。ここは個体値以降だけ
  detail.innerHTML =
    `<div class="iv-head">個体値(全ステータス)${ivRankHtml(mon.iv)}</div>` +
    // 2026-07-08「個体値の表示がでかすぎ」→ 5行を2列のコンパクト表示に詰める
    `<div class="iv-compact">` +
    ivBarHtml("攻撃", mon.iv.atk ?? 1) +
    ivBarHtml("HP", mon.iv.hp ?? 1) +
    ivBarHtml("防御", mon.iv.def ?? 1) +
    ivBarHtml("会心", mon.iv.crit ?? 1) +
    ivBarHtml("速度", mon.iv.spd ?? 1) +
    `</div>` +
    bonusRow("スキル威力", equipStat(mon, "skillPower") + perkStat(mon, "skillPower")) +
    bonusRow("ゴールド", equipStat(mon, "goldBonus") + perkStat(mon, "goldBonus")) +
    bonusRow("経験値", equipStat(mon, "expBonus")) +
    bonusRow("卵ドロップ", equipStat(mon, "dropBonus") + perkStat(mon, "dropBonus")) +
    `<div class="d-skill"><div class="d-skill-name">スキル: ${skill.name}</div><div class="d-skill-desc">${skill.desc}</div></div>`;
  body.appendChild(detail);

  // 操作: パーティ出し入れ / 逃がす(旧・英雄ステータスタブから移設)
  const actions = document.createElement("div");
  actions.className = "status-actions";
  const inParty = state.party.includes(mon.id);
  // ライブ更新の移植判定に使う署名: 文面が変わる要因(所属・逃がし額)が同じなら
  // 古いボタンノードを生かしてよい(renderStatus参照)
  actions.dataset.sig = `${mon.id}:${inParty}:${Math.round((RELEASE_GOLD[sp.rarity] ?? 0) * (1 + (mon.level - 1) * 0.02))}`;
  const partyBtn = document.createElement("button");
  partyBtn.textContent = inParty ? "パーティから 外す" : "パーティに 入れる";
  partyBtn.addEventListener("click", () => {
    if (!togglePartyMember(state, mon.id)) {
      toast(inParty ? "最低1体は パーティに 必要" : `パーティは 最大 ${MAX_PARTY}体`);
      return;
    }
    playerHp = partyMaxHp();
    syncSceneParty();
    refreshMonViews();
    if (openOrder.includes("box")) renderBox();
    save();
  });
  actions.appendChild(partyBtn);
  const releaseBtn = document.createElement("button");
  releaseBtn.className = "release-btn";
  const releasePrice = Math.round(
    (RELEASE_GOLD[sp.rarity] ?? 0) * (1 + (mon.level - 1) * 0.02),
  );
  releaseBtn.textContent = `逃がす +${formatGold(releasePrice)}G`;
  releaseBtn.addEventListener("click", () => {
    if (!releaseBtn.dataset.confirm) {
      releaseBtn.dataset.confirm = "1";
      releaseBtn.textContent = "本当に 逃がす?";
      releaseBtn.classList.add("danger");
      setTimeout(() => {
        releaseBtn.dataset.confirm = "";
        releaseBtn.textContent = `逃がす +${formatGold(releasePrice)}G`;
        releaseBtn.classList.remove("danger");
      }, 3000);
      return;
    }
    const result = releaseMonster(state, mon.id);
    if (result.error) {
      toast(result.error);
      return;
    }
    toast(`${sp.name} を 逃がして ${formatGold(result.price)} GP を もらった`);
    syncSceneParty();
    playerHp = Math.min(playerHp, partyMaxHp());
    if (openOrder.includes("box")) renderBox();
    currentDetailId = state.party[0];
    refreshMonViews();
    save();
  });
  actions.appendChild(releaseBtn);
  // 育成(力を託す)/覚醒の儀/武具に宿すは専用の「調合」ウィンドウへ集約(2026-07-09)。
  const compoundBtn = document.createElement("button");
  compoundBtn.className = "feed-btn";
  compoundBtn.textContent = "🧪 調合(育成・武具)";
  compoundBtn.title = "力を託して育てる/覚醒の儀/武具に宿す 専用ウィンドウを開く";
  compoundBtn.addEventListener("click", () => {
    compoundMode = "feed";
    openWindow("compound");
  });
  actions.appendChild(compoundBtn);
  body.appendChild(actions);
  return body;
}

// ステータス操作後、開いている英雄窓/ステータス窓の両方を更新する
function refreshMonViews() {
  if (openOrder.includes("detail")) renderDetail(currentDetailId);
  if (openOrder.includes("status")) renderStatus();
}

// ---- 調合ウィンドウ(2026-07-09: キャラの使い道を1画面に集約) ----
// 「食べさせる(経験値吸収で育てる)」と「装備に変換(ガチャ)」を専用窓で行う。
let compoundMode = "feed"; // "feed"(力を託す) | "convert"(武具に宿す) | "ritual"(覚醒の儀) | "gacha"
let compoundBaseId = null; // 力を託す先(育てる子)/ 覚醒の儀の対象。初期値は空欄(2026-07-13 FB)
let feedSelId = null; // 育てるビューで選択中の「力を託す子」
let convSelId = null; // 武具に宿すビューで選択中の子(2026-07-13 統一UI)
const ritualFoodIds = new Set(); // 覚醒の儀で想いを重ねる候補
let compoundAutoCap = "rare"; // 自動投入のレア度上限(2026-07-11 FB「どこまで入れるか指定」)

// 自動投入の候補: レア度上限以下で、編成中/探索中/覚醒/色違い/進化済みを除く
// (覚醒と色違いは「基本のぞく」=ユーザー確定。進化済み=ゴールド投資済みなので保護)
function compoundAutoCandidates(excludeId) {
  const capIdx = RARITY_ORDER.indexOf(compoundAutoCap);
  return Object.values(state.monsters).filter(
    (m) =>
      m.id !== excludeId &&
      !state.party.includes(m.id) &&
      !onExpedition(state, m.id) &&
      !m.shiny &&
      !m.fav &&
      (m.awakening ?? 0) === 0 &&
      !m.job &&
      RARITY_ORDER.indexOf(SPECIES[m.speciesId].rarity) <= capIdx,
  );
}

// レア度上限セレクト+自動投入ボタンの行(育てる/覚醒の儀で共用)。
// v3(2026-07-17): 1行コンパクト。除外条件の説明はℹオーバーレイへ移動
function compoundAutoRow(excludeId, buttonLabel, onAuto) {
  const row = document.createElement("div");
  row.className = "cmp-auto";
  const sel = document.createElement("select");
  sel.className = "cube-band";
  for (const r of RARITY_ORDER) {
    const o = document.createElement("option");
    o.value = r;
    o.textContent = `${RARITY_META[r].label}まで`;
    sel.appendChild(o);
  }
  sel.value = compoundAutoCap;
  sel.addEventListener("change", () => {
    compoundAutoCap = sel.value;
    renderCompound();
  });
  row.appendChild(sel);
  const btn = document.createElement("button");
  btn.className = "compound-do";
  const cands = compoundAutoCandidates(excludeId);
  btn.textContent = `${buttonLabel}(${cands.length}体)`;
  btn.disabled = cands.length === 0;
  btn.title = "編成中・探索中・覚醒・色違い・お気に入り・進化済みの子は入れない";
  btn.addEventListener("click", () => onAuto(compoundAutoCandidates(excludeId)));
  row.appendChild(btn);
  return row;
}

// 説明文はオーバーレイに集約(2026-07-17 FB「細かい文章は入れない。入れる場合はオーバーレイで」)
const COMPOUND_HELP = {
  feed:
    `<b>🌟 育てる(力を託す)</b><br>` +
    `仲間を選び、その力を軸の子に託して育てる。<br>` +
    `・累計経験値の<b>80%</b>を受け継ぐ<br>` +
    `・スキルを<b>1つ継承</b>できる<br>` +
    `・託す子の個体ランクが軸より上なら<b>ランクアップ抽選</b><br>` +
    `・色違いの子を託すと<b>色違いが遺伝</b>することがある<br>` +
    `・託した子は旅立つ(装備は外れて返る)<br>` +
    `・探索中の子は選べない(帰還を待って)`,
  ritual:
    `<b>⚡ 覚醒の儀</b><br>` +
    `仲間の想いを重ねて覚醒段階を上げる(最大 覚醒Ⅵ)。<br>` +
    `・<b>同じ種族</b>の子: 1体で<b>確定+1段</b>(失敗しない)<br>` +
    `・<b>別の種族</b>の子: <b>欠片</b>になり、次の段に確率で挑戦<br>` +
    `　(格上・覚醒個体ほど欠片が大きい)<br>` +
    `・成否に関わらず、重ねた子は旅立つ(装備は外れて返る)<br>` +
    `・覚醒するとステータス・スキルが大きく強化される`,
  convert:
    `<b>⚒ 武具に宿す</b><br>` +
    `旅立つ子の想いを武具に変える。<br>` +
    `・レア度×レベルに応じた装備が<b>1個</b>生まれる<br>` +
    `・覚醒した子ほど高いレア度が保証される<br>` +
    `・<b>覚醒Ⅵ</b>の子は<b>世界に1つの刻印つき武具</b>になる<br>` +
    `・その子は旅立つ(つけていた装備は外れて返る)`,
  gacha:
    `<b>🪙 ガチャ</b><br>` +
    `記念コインで装備ガチャを引く。<br>` +
    `コインは宝箱や探索で手に入る。上位のコインだけが最上位レア装備の入口。`,
};
// 窓の説明オーバーレイ(2026-07-17 FB「細かい文章はオーバーレイで」の共通部品)。
// クリックで閉じる。調合と交易船で共用
function showHelpOverlay(panelId, html) {
  const panel = $(panelId);
  panel.querySelector(".cmp-help-overlay")?.remove();
  const ov = document.createElement("div");
  ov.className = "cmp-help-overlay";
  ov.innerHTML = html + `<div class="cmp-help-close">— クリックで閉じる —</div>`;
  ov.addEventListener("click", () => ov.remove());
  panel.appendChild(ov);
}
function compoundHelpOverlay() {
  showHelpOverlay("compound-panel", COMPOUND_HELP[compoundMode] ?? "");
}

function renderCompound() {
  const body = $("compound-body");
  body.innerHTML = "";
  $("compound-panel").querySelector(".cmp-help-overlay")?.remove(); // 説明を持ち越さない
  const mons = Object.values(state.monsters);

  // モード切替: 大きなアイコンタブ(v3 2026-07-17 FB「ぱっと見のわかりやすさ」。
  // セレクト式は今いるモードも選択肢も見えないのでやめた)
  const tabs = document.createElement("div");
  tabs.className = "cmp-tabs";
  for (const [val, ic, lb] of [["feed", "🌟", "育てる"], ["ritual", "⚡", "覚醒"], ["convert", "⚒", "武具"], ["gacha", "🪙", "ガチャ"]]) {
    const b = document.createElement("button");
    b.className = "cmp-tab" + (compoundMode === val ? " on" : "");
    b.innerHTML = `<span class="cmp-tab-ic">${ic}</span><span class="cmp-tab-lb">${lb}</span>`;
    b.addEventListener("click", () => {
      compoundMode = val;
      renderCompound();
      if (openOrder.includes("box")) renderBox(); // モードでバッジの意味が変わる
    });
    tabs.appendChild(b);
  }
  const help = document.createElement("button");
  help.className = "cmp-tab cmp-tab-help";
  help.textContent = "ℹ";
  help.title = "この画面のくわしい説明";
  help.addEventListener("click", compoundHelpOverlay);
  tabs.appendChild(help);
  body.appendChild(tabs);

  // いま何をする画面かの1行(2026-07-17 FB「何をするところなのかそれぞれ説明があっていい」。
  // 詳細はℹのまま、要点だけ常設)
  const DESC = {
    feed: "仲間の力を託して軸の子を育てる — 経験値80%+スキル継承",
    ritual: "想いを重ねて覚醒段階を上げる — 同種は確定+1段/別種は欠片",
    convert: "旅立つ子の想いを武具1個に変える — 覚醒Ⅵは刻印つき1点もの",
    gacha: "記念コインで装備ガチャを引く — 上位コインが最上位レアの入口",
  };
  const desc = document.createElement("div");
  desc.className = "cmp-desc";
  desc.textContent = DESC[compoundMode] ?? "";
  body.appendChild(desc);

  // モードのイメージバナー(2026-07-17 FB「全部の項目で説明文とキャラを入れる枠の間に
  // イメージ画像みたいなの挟んで」)。絵はGemini生成の絵本調(tools/gen-compound-banners.js)
  const banner = document.createElement("div");
  banner.className = "cmp-banner";
  banner.style.backgroundImage = `url("assets/ui/winbg/cmp-${compoundMode}.png")`;
  body.appendChild(banner);

  // コインガチャ(2026-07-11 FB「ガチャは調合窓の中に」): タスモン不要なので先に描く
  if (compoundMode === "gacha") {
    const wrap = document.createElement("div");
    wrap.className = "compound-gacha";
    body.appendChild(wrap);
    renderGachaInto(wrap, renderCompound);
    return;
  }

  if (mons.length === 0) {
    const hint = document.createElement("div");
    hint.className = "box-hint";
    hint.textContent = "タスモンがいない(卵を孵そう)";
    body.appendChild(hint);
    return;
  }

  if (compoundMode === "feed") renderCompoundFeed(body, mons);
  else if (compoundMode === "ritual") renderCompoundRitual(body, mons);
  else renderCompoundConvert(body, mons);
}

// 小さなキャラ顔アイコン(調合の一覧用)
function monMiniIcon(mon, size = 34) {
  const sp = SPECIES[mon.speciesId];
  const c = monIconCanvas(mon, size);
  c.className = "compound-mini";
  c.title = sp.name;
  // 自己監視スキャナ用の注釈(描いた時点の見た目のキー。stateとズレたら陳腐化と判定)
  c.dataset.mon = mon.id;
  c.dataset.uiKey = `${mon.speciesId}|${mon.evoSkin ?? ""}|${mon.awakening ?? 0}`;
  return c;
}

// ---- 3モード共通部品(2026-07-13 FB「食べさせる・覚醒・装備に変換は同じUIデザイン/配置に」) ----
// 言い回しも刷新: 自分のペットが「食べられる/変換される」のは悲しいので、
// 「力を託して旅立つ」「想いを重ねる」「想いを武具に宿す」に統一(ゲーム全体の方針)。

// タスモンのクリックから調合へセットする(2026-07-13 FB: 窓内の候補一覧は廃止し、
// タスモンからのD&D/クリックに統一)。モードごとに軸→選択の順で埋める。
function compoundPickFromBox(mon) {
  const name = baseNameOf(mon);
  // 探索中の子は調合に使えない(2026-07-17 FB)。従来は実行時エラー任せで分かりにくかった
  if (onExpedition(state, mon.id)) return void toast("🧭 探索中の子は選べない(帰還を待って)");
  if (compoundMode === "feed") {
    if (!state.monsters[compoundBaseId]) {
      compoundBaseId = mon.id;
      toast(`軸(力を受け継ぐ子): ${name}`, "#8ad8ff");
    } else if (mon.id === compoundBaseId) {
      toast("軸と同じ子には 託せない(軸を変えるならドロップで)");
    } else {
      feedSelId = feedSelId === mon.id ? null : mon.id;
      if (feedSelId) toast(`託す子: ${name}(調合窓のボタンで実行)`, "#8af0a8");
    }
  } else if (compoundMode === "ritual") {
    if (!state.monsters[compoundBaseId]) {
      compoundBaseId = mon.id;
      ritualFoodIds.delete(mon.id);
      toast(`覚醒させる子: ${name}`, "#8ad8ff");
    } else if (mon.id === compoundBaseId) {
      toast("対象と同じ子は 重ねられない");
    } else if (ritualFoodIds.has(mon.id)) {
      ritualFoodIds.delete(mon.id);
    } else {
      ritualFoodIds.add(mon.id);
      toast(`想いを重ねる: ${name}(${ritualFoodIds.size}体)`, "#ffcf8a");
    }
  } else if (compoundMode === "convert") {
    convSelId = convSelId === mon.id ? null : mon.id;
    if (convSelId) toast(`武具に宿す子: ${name}(調合窓のボタンで確定)`, "#8af0a8");
  }
  renderCompound();
  renderBox();
}

// 対象スロット(v7 2026-07-17 FB「添付のような配置に。全モードこのフォーマットで統一」):
// [情報帯(上)/顔かの＋/情報帯(下)]のパネル + その下に色つき役割ラベル + 小ヒント。
// opts: accent(ラベル色) / sub(下の情報帯HTML) / doom(旅立つ注意) / hint(ラベル下の文言) /
//       onDropId(ドロップで差し替え) / onClear(✕で外す)
function cmpSlot(head, mon, opts = {}) {
  const col = document.createElement("div");
  col.className = "cmp-col";
  const card = document.createElement("div");
  card.className = "cmp-slot" + (mon ? "" : " cmp-empty");
  const top = document.createElement("div");
  top.className = "cmp-slot-band cmp-slot-band-top";
  const mid = document.createElement("div");
  mid.className = "cmp-slot-mid";
  const bottom = document.createElement("div");
  bottom.className = "cmp-slot-band cmp-slot-band-bottom";
  if (mon) {
    const sp = SPECIES[mon.speciesId];
    const rm = RARITY_META[monRarityOf(mon)];
    top.innerHTML = `<b style="color:${rm.color}">${mon.shiny ? "★" : ""}${sp.name}</b>`;
    mid.appendChild(monMiniIcon(mon, 52));
    bottom.innerHTML =
      (opts.sub ?? `Lv.${mon.level}`) +
      (opts.doom ? `<div class="cmp-doom">⚠ この子は旅立つ(いなくなる)</div>` : "");
    if (opts.onClear) {
      const x = document.createElement("button");
      x.className = "cmp-x";
      x.textContent = "✕";
      x.title = "外す";
      x.addEventListener("click", (ev) => {
        ev.stopPropagation();
        opts.onClear();
      });
      card.appendChild(x);
    }
  } else {
    top.innerHTML = `<span class="cmp-slot-hint">— 未選択 —</span>`;
    mid.innerHTML = `<span class="cmp-plus">＋</span>`;
    // 2026-08-07 Haru指示「調合の覚醒窓を入れる場所が分かりづらい」:
    // ドラッグ&ドロップの受け皿(onDropId)は元から実装済みだったが、ヒント文が
    // 「クリック」としか書かれておらずドラッグできることが伝わっていなかった
    bottom.innerHTML = opts.onDropId
      ? `<span class="cmp-slot-hint">タスモンの子をここへドラッグ<br>(クリックでも選べる)</span>`
      : `<span class="cmp-slot-hint">タスモンの子をクリック</span>`;
  }
  card.append(top, mid, bottom);
  col.appendChild(card);
  const label = document.createElement("div");
  label.className = "cmp-slot-label";
  if (opts.accent) label.style.color = opts.accent;
  label.textContent = head;
  col.appendChild(label);
  if (opts.hint) {
    const hint = document.createElement("div");
    hint.className = "cmp-slot-hint";
    hint.textContent = opts.hint;
    col.appendChild(hint);
  }
  if (opts.onDropId) {
    makeDropTarget(card, (data) => {
      if (!data.startsWith("mon:")) return;
      const id = data.slice(4);
      if (!state.monsters[id]) return;
      if (onExpedition(state, id)) return void toast("🧭 探索中の子は選べない(帰還を待って)");
      opts.onDropId(id);
    });
  }
  return col;
}


function renderCompoundFeed(body, mons) {
  // 軸(力を受け継ぐ子)。初期値は空欄(2026-07-13 FB): 一覧かドロップで選ぶまで待つ
  if (compoundBaseId && !state.monsters[compoundBaseId]) compoundBaseId = null;
  const base = compoundBaseId ? state.monsters[compoundBaseId] : null;
  const atCap = !!base && base.level >= LEVEL_CAP;
  if (feedSelId === compoundBaseId || !state.monsters[feedSelId]) feedSelId = null;

  const gainOf = (m) => Math.max(1, Math.floor((totalExpAt(m.level) + (m.exp ?? 0)) * 0.8));
  const doFeed = (foodId, skillId) => {
    const food = state.monsters[foodId];
    if (!base || !food || foodId === base.id) return;
    if (atCap) return void toast("この子はもうLv最大。軸を変えるか、武具に宿すを使おう");
    const r = feedMonster(state, base.id, foodId, Math.random, { skillId });
    if (!r?.error) bumpMissionCounter(state, "feed"); // チュートリアル: 力を託した
    if (r.error) return void toast(r.error);
    toast(
      `${r.foodName}が力を託して旅立った 経験値+${formatNum(r.gained)}` +
        (r.levelsGained > 0 ? ` ・ Lv${r.levelsGained}アップ!(Lv.${r.newLevel})` : ""),
      "#8af0a8",
    );
    if (r.inheritedSkill) toast(`✦ スキル「${r.inheritedSkill.name}」を受け継いだ!`, "#8ad8ff");
    if (r.rankUp) toast(`⭐ 個体ランクが ${r.rankUp.from}→${r.rankUp.to} に上がった!`, "#ffcf4a");
    if (r.shinyInherited) toast(`✨ 色違いが遺伝!! ${SPECIES[base.speciesId].name}が色違い(覚醒)になった!`, "#ffd67a");
    if (feedSelId === foodId) feedSelId = null;
    syncSceneParty();
    playerHp = partyMaxHp();
    refreshMonViews();
    if (openOrder.includes("box")) renderBox();
    save();
    renderCompound();
  };

  // ---- v3(2026-07-17 FB「全面刷新・ぱっと見重視」): [旅立つ子] ➡ [育つ子] の絵だけで語る ----
  // 旅立つ子は軸が未選択でも表示する(2026-07-22 FB「パーティ窓から直接D&Dできない」:
  // 旧実装は軸が決まるまで sel を隠していたため、先に旅立つ子へドロップすると
  // 内部では選択できているのに見た目が空のまま=ドロップが効かないように見えた)
  const sel = state.monsters[feedSelId] ?? null;
  const stage = document.createElement("div");
  stage.className = "cmp-stage";
  stage.appendChild(
    cmpSlot("旅立つ子", sel, {
      accent: "#ff9a7a",
      sub: sel ? `Lv.${sel.level} ・ <b style="color:#8af0a8">+${formatNum(gainOf(sel))}</b> EXP` : null,
      doom: true,
      hint: "託す子を選ぶ",
      onDropId: (id) => {
        if (id === compoundBaseId) return void toast("軸と同じ子は選べない");
        feedSelId = id;
        renderCompound();
        renderBox();
      },
      onClear: sel
        ? () => {
            feedSelId = null;
            renderCompound();
            renderBox();
          }
        : null,
    }),
  );
  const arrow = document.createElement("div");
  arrow.className = "cmp-arrow";
  arrow.textContent = "➡";
  stage.appendChild(arrow);
  let baseSub = null;
  if (base) {
    const expNow = atCap ? 0 : (base.exp ?? 0);
    const expNeed = atCap ? 1 : expToNext(base.level);
    baseSub = atCap
      ? `Lv.${base.level}(最大)`
      : `Lv.${base.level} ・ 次まで ${formatNum(Math.max(0, expNeed - expNow))}`;
  }
  stage.appendChild(
    cmpSlot("育つ子(軸)", base, {
      accent: "#8af0a8",
      sub: baseSub,
      hint: "軸の子を選ぶ",
      onDropId: (id) => {
        compoundBaseId = id;
        if (feedSelId === id) feedSelId = null;
        renderCompound();
        renderBox();
      },
      onClear: base
        ? () => {
            compoundBaseId = null;
            renderCompound();
            renderBox();
          }
        : null,
    }),
  );
  body.appendChild(stage);

  // 結果ストリップ(Lv変化+ランクUP+継承)と実行ボタン。両方そろったときだけ出す
  if (base && sel) {
    const pv = feedPreview(state, base.id, sel.id);
    const res = document.createElement("div");
    res.className = "cmp-result";
    if (pv) {
      res.innerHTML =
        `<span class="cmp-lv">Lv.${base.level} → <b style="color:#8af0a8">${pv.newLevel}</b></span>` +
        (pv.rankUpChance > 0
          ? `<span class="cmp-chip">⭐ランクUP ${Math.round(pv.rankUpChance * 100)}%</span>`
          : `<span class="cmp-chip dim">⭐ランクUPなし</span>`);
    }
    let skillSel = null;
    if (pv && pv.inheritCandidates.length > 0) {
      skillSel = document.createElement("select");
      skillSel.className = "cube-band";
      for (const id of pv.inheritCandidates) {
        const o = document.createElement("option");
        o.value = id;
        o.textContent = `✦ 継承: ${SKILLS[id].name}`;
        skillSel.appendChild(o);
      }
      // 継承スキルの説明をカーソルでオーバーレイ表示(2026-07-17 FB)
      const showSkillTip = (ev) => {
        const sk = SKILLS[skillSel.value];
        if (!sk) return;
        showTooltip(
          `<b style="color:#8ad8ff">✦ ${sk.name}</b><div style="margin-top:3px">${sk.desc}</div>` +
            `<div class="tt-hint">クールダウン ${sk.cooldown}秒</div>`,
          ev.clientX,
          ev.clientY,
        );
      };
      skillSel.addEventListener("mouseenter", showSkillTip);
      skillSel.addEventListener("mousemove", showSkillTip);
      skillSel.addEventListener("mouseleave", () => hideTooltip(true));
      skillSel.addEventListener("change", () => hideTooltip(true));
      res.appendChild(skillSel);
    } else if (pv) {
      res.insertAdjacentHTML("beforeend", `<span class="cmp-chip dim">継承スキルなし</span>`);
    }
    body.appendChild(res);
    const cta = document.createElement("button");
    cta.className = "compound-do cmp-cta";
    cta.textContent = atCap ? "Lv最大(軸を変えよう)" : "🌟 力を託す";
    cta.disabled = atCap;
    cta.addEventListener("click", () => doFeed(sel.id, skillSel?.value));
    body.appendChild(cta);
  }

  // まとめて託す(自動投入)は削除(2026-07-17 FB「育てるのまとめて託すはいったん削除」)

  // (候補一覧は廃止 2026-07-13 FB: タスモンからD&D/クリックで選ぶ)

}

function renderCompoundConvert(body, mons) {
  // 宿す子スロット。初期値は空欄(2026-07-13 FB)。即変換はせず、選択→ボタン2度押しで確定
  if (convSelId && !state.monsters[convSelId]) convSelId = null;
  const sel = convSelId ? state.monsters[convSelId] : null;

  const doConvert = (monId) => {
    // 覚醒Ⅵの子は世界に1つの刻印つき武具になる(2026-07-16)。取り違え防止に一度確認
    const aw = state.monsters[monId]?.awakening ?? 0;
    const r = monsterToEquipment(state, monId);
    if (r.error) return void toast(r.error);
    if (r.soulForged) {
      celebrateItem(r.item, "⚒✨ 魂が宿った1点もの!");
      toast(`⚡ ${r.monName}(${AWAKENING.label[aw]})の魂が「${r.item.name}」に宿った! 世界に1つの刻印つき武具!`, "#ffe082");
    } else {
      celebrateItem(r.item, "⚒ 想いが宿った武具");
      toast(
        `${r.monName}の想いが ${RARITY_META[r.item.rarity].label}装備に宿った!` +
          (aw > 0 ? `(${AWAKENING.label[aw]}の保証つき)` : ""),
        RARITY_META[r.item.rarity].color,
      );
    }
    syncSceneParty();
    playerHp = Math.min(playerHp, partyMaxHp());
    if (openOrder.includes("box")) renderBox();
    if (compoundBaseId === monId) compoundBaseId = null;
    if (convSelId === monId) convSelId = null;
    currentDetailId = state.party[0];
    refreshMonViews();
    save();
    renderCompound();
  };

  // ---- v3(2026-07-17): [旅立つ子] ➡ [生まれる武具(レア度の帯グラフ)] ----
  const aw = sel ? (sel.awakening ?? 0) : 0;
  const stage = document.createElement("div");
  stage.className = "cmp-stage";
  stage.appendChild(
    cmpSlot("旅立つ子", sel, {
      accent: "#ff9a7a",
      sub: sel
        ? `Lv.${sel.level}` +
          (aw > 0 ? ` ・ <span style="color:${AWAKENING.color}">⚡${AWAKENING.label[aw]}</span>` : "")
        : null,
      doom: true,
      hint: "宿す子を選ぶ",
      onDropId: (id) => {
        convSelId = id;
        renderCompound();
        renderBox();
      },
      onClear: sel
        ? () => {
            convSelId = null;
            renderCompound();
            renderBox();
          }
        : null,
    }),
  );
  const arrow = document.createElement("div");
  arrow.className = "cmp-arrow";
  arrow.textContent = "➡";
  stage.appendChild(arrow);
  // 右列も同じフォーマット(v7): パネル+下ラベル
  const outCol = document.createElement("div");
  outCol.className = "cmp-col";
  const out = document.createElement("div");
  out.className = "cmp-slot" + (sel ? "" : " cmp-empty");
  const oTop = document.createElement("div");
  oTop.className = "cmp-slot-band cmp-slot-band-top";
  const oMid = document.createElement("div");
  oMid.className = "cmp-slot-mid";
  oMid.innerHTML = `<span class="cmp-plus">⚒</span>`;
  const oBottom = document.createElement("div");
  oBottom.className = "cmp-slot-band cmp-slot-band-bottom";
  if (sel) {
    if (aw >= AWAKEN_MAX) {
      // 覚醒Ⅵ=確定で刻印つき1点もの(2026-07-16)
      oTop.innerHTML = `<b style="color:#ffe082">✨ 刻印つき1点もの</b>`;
      oBottom.innerHTML = `<span style="color:#ffe082">確定(世界に1つ)</span>`;
    } else {
      const odds = conversionOdds(sel);
      const bar = document.createElement("div");
      bar.className = "cmp-oddsbar";
      bar.style.width = "100%";
      let labels = "";
      for (const o of odds) {
        const orm = RARITY_META[o.rarity];
        const seg = document.createElement("div");
        seg.style.flex = String(Math.max(o.chance, 0.02));
        seg.style.background = orm.color;
        seg.title = `${orm.label} ${Math.round(o.chance * 100)}%`;
        bar.appendChild(seg);
        labels += `<span style="color:${orm.color}">${orm.label} ${Math.round(o.chance * 100)}%</span> `;
      }
      oTop.appendChild(bar);
      oBottom.innerHTML = `<span class="cmp-oddslabels-inline">${labels.trim()}</span>`;
    }
  } else {
    oTop.innerHTML = `<span class="cmp-slot-hint">— 未定 —</span>`;
    oBottom.innerHTML = `<span class="cmp-slot-hint">左の子で決まる</span>`;
  }
  out.append(oTop, oMid, oBottom);
  outCol.appendChild(out);
  outCol.insertAdjacentHTML("beforeend", `<div class="cmp-slot-label" style="color:#ffd67a">生まれる武具</div>`);
  stage.appendChild(outCol);
  body.appendChild(stage);

  // 実行(旅立つ操作なので2度押しで確定)
  if (sel) {
    const cta = document.createElement("button");
    cta.className = "compound-do cmp-cta";
    cta.textContent = "⚒ 武具に宿す";
    cta.addEventListener("click", () => {
      if (!cta.dataset.confirm) {
        cta.dataset.confirm = "1";
        cta.textContent = "本当に宿す?(この子は旅立つ)";
        cta.classList.add("danger");
        setTimeout(() => {
          cta.dataset.confirm = "";
          cta.textContent = "⚒ 武具に宿す";
          cta.classList.remove("danger");
        }, 3000);
        return;
      }
      doConvert(sel.id);
    });
    body.appendChild(cta);
  }
}

// 覚醒の儀: 仲間の想いを重ねて対象の覚醒に挑戦するギャンブル(ダブりの活用先)。
function renderCompoundRitual(body, mons) {
  // 対象(覚醒させたい子)。初期値は空欄(2026-07-13 FB)
  if (compoundBaseId && !state.monsters[compoundBaseId]) compoundBaseId = null;
  const target = compoundBaseId ? state.monsters[compoundBaseId] : null;
  const curAw = target ? (target.awakening ?? 0) : 0;

  // ---- v3(2026-07-17): [対象+6段ラダー] → 重ねる子チップ列 → 確定/挑戦チップ+ゲージ → 実行 ----
  const ladderHtml = (lv) => {
    let nodes = "";
    for (let i = 1; i <= AWAKEN_MAX; i++) nodes += `<i class="aw-node${i <= lv ? " on" : ""}"></i>`;
    return `<span class="awaken-ladder">${nodes}<b class="aw-count">${lv}/${AWAKEN_MAX}</b></span>`;
  };
  const stage = document.createElement("div");
  stage.className = "cmp-stage";
  stage.appendChild(
    cmpSlot("覚醒させる子", target, {
      accent: AWAKENING.color,
      sub: target ? `Lv.${target.level}<br>${ladderHtml(curAw)}` : null,
      hint: "対象を選ぶ",
      onDropId: (id) => {
        compoundBaseId = id;
        ritualFoodIds.delete(id);
        renderCompound();
        renderBox();
      },
      onClear: target
        ? () => {
            compoundBaseId = null;
            renderCompound();
            renderBox();
          }
        : null,
    }),
  );
  body.appendChild(stage);

  if (!target) return;

  if (curAw >= AWAKEN_RITUAL_CAP) {
    body.insertAdjacentHTML(
      "beforeend",
      `<div class="cmp-result"><span class="cmp-chip">⚡ 最大覚醒(${AWAKENING.label[curAw]})</span></div>`,
    );
    return;
  }

  // 選択中の候補を掃除(消えた個体/対象自身を除外)
  for (const id of [...ritualFoodIds]) {
    if (!state.monsters[id] || id === target.id) ritualFoodIds.delete(id);
  }
  const foodIds = [...ritualFoodIds];
  const odds = awakenRitualOdds(state, target.id, foodIds);
  const pct = Math.round((odds.chance ?? 0) * 100);

  // 想いを重ねる子(チップ列)。クリックで外す・ドロップで追加。同種には「同種」バッジ
  const foods = document.createElement("div");
  foods.className = "cmp-foods";
  if (foodIds.length === 0) {
    // 2026-08-07 Haru指示: ここもドラッグで置けることが伝わっていなかった
    foods.innerHTML = `<span class="cmp-slot-hint">＋ タスモンの子をここへドラッグ、またはクリックで重ねる(同種=確定+1段)</span>`;
  } else {
    for (const id of foodIds) {
      const f = state.monsters[id];
      const chip = document.createElement("span");
      chip.className = "cmp-food";
      chip.title = `${SPECIES[f.speciesId].name} Lv.${f.level} — クリックで外す`;
      chip.appendChild(monMiniIcon(f, 30));
      if (f.speciesId === target.speciesId)
        chip.insertAdjacentHTML("beforeend", `<span class="cmp-food-same">同種</span>`);
      chip.addEventListener("click", () => {
        ritualFoodIds.delete(id);
        renderCompound();
        renderBox();
      });
      foods.appendChild(chip);
    }
  }
  makeDropTarget(foods, (data) => {
    if (!data.startsWith("mon:")) return;
    const id = data.slice(4);
    if (!state.monsters[id] || id === target.id) return;
    if (onExpedition(state, id)) return void toast("🧭 探索中の子は選べない(帰還を待って)");
    ritualFoodIds.add(id);
    renderCompound();
    renderBox();
  });
  body.appendChild(foods);
  // いなくなる注意喚起(2026-07-17 FB: 全モードで統一)
  if (foodIds.length > 0)
    body.insertAdjacentHTML(
      "beforeend",
      `<div class="cmp-doom" style="text-align:center;margin-top:2px">⚠ 重ねた子は成否に関わらず旅立つ(装備は返る)</div>`,
    );

  // 確定ぶん / 挑戦ぶん をチップで(2026-07-16 凸方式の中身は不変)
  const res = document.createElement("div");
  res.className = "cmp-result";
  res.innerHTML =
    (odds.guaranteed > 0
      ? `<span class="cmp-chip" style="border-color:#4a8858;background:rgba(20,40,28,0.9);color:#8af0a8">確定 ${AWAKENING.label[curAw]}→${AWAKENING.label[Math.min(AWAKEN_RITUAL_CAP, curAw + odds.guaranteed)]}</span>`
      : `<span class="cmp-chip dim">同種なし=確定なし</span>`) +
    (pct > 0
      ? `<span class="cmp-chip" style="font-size:13px;color:${pct >= 60 ? "#8af0a8" : pct >= 30 ? "#ffcf4a" : "#ff8a6a"}">🎲 ${AWAKENING.label[Math.min(AWAKEN_RITUAL_CAP, odds.afterGuaranteed + 1)]} に ${pct}%</span>`
      : `<span class="cmp-chip dim">欠片なし</span>`);
  body.appendChild(res);
  const gauge = document.createElement("div");
  gauge.className = "cmp-gauge";
  gauge.innerHTML = `<div style="width:${pct}%"></div>`;
  body.appendChild(gauge);

  const doBtn = document.createElement("button");
  doBtn.className = "compound-do cmp-cta";
  doBtn.textContent = foodIds.length === 0 ? "重ねる子を選ぶ" : `⚡ 儀式を行う(${foodIds.length}体)`;
  doBtn.disabled = foodIds.length === 0;
  if (foodIds.length > 0) doBtn.classList.add("danger");
  // 誤爆防止(2026-07-16): 同種は確定素材=最高価値。別の子の欠片として焼こうとして
  // いる子(=手持ちに同種の仲間が別にいる)を検知したら、一度目のクリックは警告で止める
  let ritualConfirmed = false;
  const wastedDupes = () =>
    [...ritualFoodIds].filter((id) => {
      const f = state.monsters[id];
      if (!f || f.speciesId === target.speciesId) return false;
      return Object.values(state.monsters).some(
        (m) => m.id !== id && !ritualFoodIds.has(m.id) && m.speciesId === f.speciesId,
      );
    });
  doBtn.addEventListener("click", () => {
    const waste = wastedDupes();
    if (waste.length > 0 && !ritualConfirmed) {
      ritualConfirmed = true;
      const names = [...new Set(waste.map((id) => SPECIES[state.monsters[id].speciesId].name))].slice(0, 3);
      doBtn.textContent = `⚠ それでも行う(${waste.length}体は確定素材になれる)`;
      toast(
        `⚠ ${names.join("・")} は手持ちに同種の仲間がいる=その子の確定素材になれる。欠片にするならもう一度押して`,
        "#ffcf4a",
      );
      return;
    }
    const ids = [...ritualFoodIds];
    const beforeStats = monStatsSnapshot(target); // 成功時の前後比較用(2026-07-11)
    const r = awakenRitual(state, target.id, ids);
    if (r.error) return void toast(r.error);
    ritualFoodIds.clear();
    if (r.success) {
      const how =
        r.guaranteed > 0 && r.rolled
          ? `同種の確定+${r.guaranteed}段、さらに欠片の挑戦にも成功!`
          : r.guaranteed > 0
            ? `同種の想いが確定で+${r.guaranteed}段!`
            : `欠片の挑戦に成功!`;
      toast(`⚡ ${how} ${SPECIES[target.speciesId].name}が【${AWAKENING.label[r.newLevel]}】に!`, AWAKENING.color);
      awakenCeremony(target, beforeStats, r.newLevel);
    } else {
      toast(`儀式は失敗… ${r.sacrificed}体の想いは実らなかった(成功率 ${Math.round(r.chance * 100)}%)`, "#9aa4c8");
    }
    syncSceneParty();
    playerHp = partyMaxHp();
    refreshMonViews();
    if (openOrder.includes("box")) renderBox();
    save();
    renderCompound();
  });
  body.appendChild(doBtn);

  // 自動で候補に入れる(レア度上限つき 2026-07-11 FB)。儀式の実行は上のボタンで
  body.appendChild(
    compoundAutoRow(target.id, "⚡ 自動で候補に入れる", (cands) => {
      for (const m of cands) ritualFoodIds.add(m.id);
      toast(`${cands.length}体を候補に入れた(実行前なら選び直せる)`);
      renderCompound();
      if (openOrder.includes("box")) renderBox();
    }),
  );
}

const windows = {
  map: $("map-panel"),
  box: el.boxPanel,
  detail: $("detail-panel"),
  eggs: $("eggs-panel"),
  items: $("items-panel"),
  storage: $("storage-panel"),
  inv: $("inv-panel"),
  cube: $("cube-panel"),
  compound: $("compound-panel"),
  odds: $("odds-panel"),
  log: $("log-panel"),
  breed: $("breed-panel"),
  skills: $("skills-panel"),
  gacha: $("gacha-panel"),
  dex: $("dex-panel"),
  portrait: $("portrait-panel"),
  status: $("status-panel"),
  item: $("item-panel"),
  exped: $("exped-panel"),
  trade: $("trade-panel"),
  meyasu: $("meyasu-panel"),
  pass: $("pass-panel"),
  mission: $("mission-panel"),
  notice: $("notice-panel"),
};
const renderers = {
  portrait: () => renderPortrait(currentDetailId),
  map: renderMap,
  box: renderBox,
  detail: () => renderDetail(currentDetailId),
  eggs: renderEggs,
  items: renderItems,
  storage: renderStorage,
  inv: renderInvWindow,
  cube: renderCube,
  compound: renderCompound,
  odds: renderOdds,
  log: renderLog,
  breed: renderBreed,
  skills: renderSkills,
  gacha: renderGacha,
  dex: renderDex,
  status: renderStatus,
  item: renderItemWindow,
  exped: renderExpedition,
  trade: renderTrade,
  meyasu: renderMeyasubako,
  pass: renderPass,
  mission: renderMission,
  notice: renderNotice,
};
// ---- 開いている窓へのリアルタイム反映(2026-07-24 FB「自動更新が入らないのが鬱陶しい。
// レベルやアイテム消費、経験値とか一回どっかのボタン押さないと反映されない」) ----
// 1秒ごとに軽量シグネチャ(ゴールド/レベル/経験値/所持数)を比較し、変化した時だけ
// keepScroll で開いている窓を描き直す。操作を壊さないための除外:
//  ・自由入力を持つ窓(目安箱=投稿文/交易船=価格入力)は対象外
//  ・ドラッグ中・マウス押下中・ツールチップ表示中はその回を見送る(次の秒に反映)
// map: 共通の keepScroll がスクロール位置を強制復元し、renderMap 自身の現在地追従
// (手動スクロール10秒猶予つき)と喧嘩するため、専用の liveMapFollow で面倒を見る
// (2026-07-30 FB「ポータル上のステージをリアルタイムに更新して今いる場所を表示」)
const LIVE_REFRESH_EXCLUDE = new Set(["meyasu", "trade", "status", "map", "mission"]); // status/missionは既存の0.4秒更新
let liveSig = "";
let liveTimer = 0;
// 押下/ドラッグは「時刻を記録+解除イベントでクリア+自動失効」の三重構え。
// booleanの張り付き(pointerupが窓外リリース等で届かないと自動更新が永久停止)を
// 実機で踏んだため(2026-07-24 検証)、失効つきタイムスタンプで自己回復させる
let livePointerAt = 0;
let liveDragAt = 0;
const clearPointer = () => { livePointerAt = 0; };
const clearDrag = () => { liveDragAt = 0; };
document.addEventListener("pointerdown", () => { livePointerAt = performance.now(); }, true);
document.addEventListener("pointerup", clearPointer, true);
document.addEventListener("pointercancel", clearPointer, true);
window.addEventListener("blur", () => { clearPointer(); clearDrag(); });
document.addEventListener("dragstart", () => { liveDragAt = performance.now(); }, true);
document.addEventListener("dragend", clearDrag, true);
document.addEventListener("drop", clearDrag, true);
function liveInteracting() {
  const now = performance.now();
  const pressing = livePointerAt > 0 && now - livePointerAt < 2500; // クリックは2.5秒で失効
  const dragging = liveDragAt > 0 && now - liveDragAt < 10000; // ドラッグは10秒で失効
  return pressing || dragging;
}

function liveSignature() {
  // 2026-08-03 FB「戦闘画面がカク付く」実犯: この署名に**毎秒変わる値**(EXP/ゴールド/
  // 総討伐数)が入っていて、討伐のたびに開いている窓を丸ごとDOM再構築していた。
  // パーティ窓が既定で固定(=常時開)になってから、毎秒200〜500msの停止として表面化
  // (動画実測: 88秒で45回・最長1.15秒)。ティッカー値は署名から外し、
  // EXPメーター/ゴールドは liveTickers() の文字差し替えだけで追従させる
  let party = "";
  for (const id of state.party) {
    const m = state.monsters[id];
    if (m) party += `${m.level}.${(m.learnedSkills ?? []).length};`;
  }
  let lvSum = 0;
  // 2026-08-11 Haru指示「お気に入り登録がリアルタイムにパーティ窓へ反映されるように」:
  // ♥はタスモン窓(box)でCtrl+クリックして付けるが、パーティ窓の候補グリッド
  // (♥だけに絞った入れ替え候補)は別の窓なので自分では再描画されず、この署名にも
  // fav状態が含まれていなかったため、毎秒の受動リフレッシュでも一生反映されなかった。
  // 全タスモンのfavを1本の文字列にして署名へ足す(付け外しのどちらでも変化する)
  let favIds = "";
  for (const k in state.monsters) {
    lvSum += state.monsters[k].level ?? 0;
    if (state.monsters[k].fav) favIds += k + ";";
  }
  return [
    party, lvSum, Object.keys(state.monsters).length, favIds,
    state.items?.length ?? 0, state.storage?.length ?? 0, state.eggs?.length ?? 0,
    JSON.stringify(state.keyItems ?? 0), JSON.stringify(state.crystalItems ?? 0),
    JSON.stringify(state.coins ?? 0), JSON.stringify(state.chests ?? 0),
  ].join("|");
}

// 毎秒の軽量更新(地図のWAVE表示と同じ「文字差し替え」方式 — 全再構築しない):
// 詳細窓のEXPメーターと所持ゴールドだけをその場で書き換える
function liveTickers() {
  if (!openOrder.includes("detail")) return;
  const mon = state.monsters[currentDetailId] ?? state.monsters[state.party[0]];
  if (mon && mon.level < LEVEL_CAP) {
    const bar = document.querySelector("#detail-panel .hero-exp-bar i");
    const label = document.querySelector("#detail-panel .hero-exp small");
    if (bar && label) {
      const need = expToNext(mon.level);
      const cur = Math.max(0, mon.exp ?? 0);
      bar.style.width = `${Math.min(100, Math.floor((cur / need) * 100))}%`;
      const text = `次のLvまで ${formatNum(Math.max(0, need - cur))} EXP`;
      if (label.textContent !== text) label.textContent = text;
    }
  }
  const g = document.getElementById("hero-gold");
  if (g) {
    const text = `💰 ${formatGoldChip(state.gold)}G`;
    if (g.textContent !== text) g.textContent = text;
  }
}

// 戦闘シーンとパーティの一致を中央監視する(2026-07-26 FB「パーティに入れていない
// キャラがバトル画面にいる」)。syncSceneParty の呼び出しは20箇所以上あり、
// パーティを変える経路(逃がす/検証ボタン/進化/調合…)が増えるたびに漏れが出る。
// 経路を個別に追うのをやめて、1秒ごとに「実際のパーティ」と「画面のパーティ」の
// 署名を比べ、ズレていたら同期し直す。HPリセットの中央監視(resetHpOnStageChange)と同じ型
let scenePartySig = "";
function scenePartyGuard() {
  const sig = state.party
    .map((id) => {
      const m = state.monsters[id];
      return m ? `${id}:${m.speciesId}:${m.evoSkin ?? ""}:${m.job ?? ""}` : id;
    })
    .join("|");
  if (sig === scenePartySig) return;
  scenePartySig = sig;
  syncSceneParty();
}

// 地図の現在地をリアルタイム追従させる(2026-07-30 FB「ポータル上のステージを
// リアルタイムに更新して今いる場所を表示するようにして」)。毎秒:
//   ・ステージが動いたら renderMap を呼ぶ(🚩が移動し、手でスクロール中でなければ
//     現在地へ自動で寄る — スクロールの管理は renderMap 自身に一本化)
//   ・同じステージの間は 🚩ノードの進行表示(WAVE/討伐数)だけを文字差し替えで更新
//     (全再構築しない=軽い・ツールチップも壊さない)
function mapLiveText() {
  if (dailyBossActive) return "👹 デイリーボス討伐中";
  if (bossWave && isBossStage(state.stage)) return "👑 BOSS戦";
  const target = stageKillTarget(state.stage, state.difficulty ?? 0);
  const wave = Math.min(WAVES_PER_STAGE, Math.floor(state.killsInStage / ENEMIES_PER_WAVE) + 1);
  return `WAVE ${wave}/${WAVES_PER_STAGE}・討伐 ${state.killsInStage}/${target}`;
}

function liveMapFollow() {
  if (!openOrder.includes("map")) return;
  const key = `${state.difficulty ?? 0}:${state.stage}`;
  if (renderMap._liveKey !== key) {
    // 現在地が動いた。説明を読んでいる間だけ次の秒へ持ち越す(ノードが消えると迷子になる)
    if (!tooltip.classList.contains("hidden")) return;
    renderMap();
    return;
  }
  const live = document.querySelector("#map-panel .portal-live");
  if (live) {
    const text = mapLiveText();
    if (live.textContent !== text) live.textContent = text;
  }
}

function liveRefresh(dt) {
  scenePartyGuard(); // 窓の再描画スロットルより前(毎秒必ず見る)
  liveTimer -= dt;
  if (liveTimer > 0) return;
  liveTimer = 1.0;
  liveMapFollow(); // 地図の追従はシグネチャ判定より前(WAVE進行は署名に映らない)
  if (liveInteracting()) return; // 演出中も更新は止めない(2026-07-24 FB)
  if (!tooltip.classList.contains("hidden")) return; // 読んでいる説明を消さない
  // モーダル(進化2択/孵化/調合ヘルプ等)が開いている間は裏の窓を再描画しない。
  // 裏でちらつく・スクロールが飛ぶのを防ぐ(2026-07-24 進化2択の検証で判明)
  if (document.querySelector(".feed-overlay, .cmp-help-overlay, .sk4-popup")) return;
  liveTickers(); // EXP/ゴールドは毎秒の文字差し替えのみ(再構築しない)
  const sig = liveSignature();
  if (sig === liveSig) return;
  liveSig = sig;
  keepScroll(() => {
    for (const id of openOrder) {
      if (LIVE_REFRESH_EXCLUDE.has(id)) continue;
      try {
        renderers[id]?.();
      } catch (e) {
        console.warn("liveRefresh failed:", id, e);
      }
    }
  });
}

// タブバーは バトル/英雄 だけ。各画面は英雄ウィンドウの下部アイコン列から開く(ハブ方式)
const tabButtons = {};
// openOrder / currentDetailId はファイル先頭に巻き上げ済み(TDZ回避)

function anyPanelOpen() {
  return openOrder.length > 0 || battleOpen;
}

// ---- 固定3枠(バトル|英雄|サブ)のウィンドウ ----
// クラスタ全体を画面中央に置き、バー(中央980px)と揃える。ドラッグは一時的な移動のみ。
const TILE_GAP = 8;
const BATTLE_W = 300; // 「戦闘画面でかい」対応で350→300
const HERO_W = 360; // パーティ窓を縮小(430→360)。他の窓とサイズ感を合わせる
const SUB_W = 294;
// 窓の外寸は全スキン完全同一(2026-07-21 FB v2「額縁が外に付くのはダサい。そろえて」)。
// 額縁は skins.css 側の細枠(12/10px)で窓の中に収まるため、レイアウト補正は不要
function skinWinExtra() {
  return 0;
}
// 2026-07-08(改訂): 同時に開けるウィンドウは3枚まで。パーティ窓(detail)は他を開いても
// 消えない(ピン留め)。4枚目を開くと detail 以外の最古を入れ替える。
const MAX_WINDOWS = 3;
// クラスタ = バトル画面 + 最大3ウィンドウ(パーティ窓 + サブ2枠)。バーもこの幅に合わせる。
const CLUSTER_W = BATTLE_W + TILE_GAP + HERO_W + 2 * (TILE_GAP + SUB_W);
// 有料スキンは各窓が額縁ぶん(+30)広い(バトル窓は対象外=3窓ぶん)
function clusterW() {
  return CLUSTER_W + 3 * skinWinExtra();
}
function clusterLeft() {
  // 実効ビューポート幅で中央寄せ(2026-07-17: 素のinnerWidthだとzoom>1で右へずれて見切れる)
  return Math.max(8, Math.round((effViewportW() - clusterW()) / 2));
}

// 最前面管理(zは20〜55の帯で回し、あふれたら振り直す)
let topZ = 20;
function bringToFront(el) {
  topZ++;
  if (topZ > 55) {
    // 現在の重なり順を保ったまま振り直す
    const all = [...document.querySelectorAll(".window, #battle-panel")]
      .sort((a, b) => (parseInt(a.style.zIndex) || 0) - (parseInt(b.style.zIndex) || 0));
    topZ = 20;
    for (const w of all) w.style.zIndex = String(topZ++);
  }
  el.style.zIndex = String(topZ);
}

// 手で動かした窓は自動整列の対象から外す(2026-08-05 FB「ゲームの位置を画面の
// 中央より上に配置しようとすると画面中央に戻される」)。実犯: ドラッグは
// top を書くが、その後の layoutWindows()(窓の開閉・倍率変更・ライブ更新の
// 各経路で走る)が setWinPos で無条件に top:auto/bottom:98px へ戻していたため、
// 上へ持っていっても一瞬で既定のタイル位置(中央寄せ・バー直上)へ戻っていた。
// ドラッグした窓は「置いた場所を尊重する」= 整列をスキップする。
// 解除は ⟲(並べ直す)ボタン or 窓を閉じたとき
const movedWindows = new Set();
// 窓をドラッグしているあいだ true。クリック素通し(reportUiRects)が
// 「全域を受ける」に切り替わり、ドラッグが途中で死ぬのを防ぐ(2026-08-05)
let dragActive = false;
// ウィンドウを下ぞろえで置くヘルパー
function setWinPos(el, left) {
  el.style.left = `${left}px`;
  el.style.top = "auto";
  el.style.bottom = "98px"; // 90pxバー(+8)の上
  el.style.right = "auto";
}

// TBH式: ヘッダー左上の小アイコンボタン(ヘルプ・位置リセット)
const WIN_HELP = {
  battle: "オート戦闘中。スキルは たまると自動発動",
  map: "ステージを選んで「入る」。進むと 新エリア解放",
  box: "タスモンの一覧。クリックで 詳細",
  detail: "装備・兆し・パーティの へんせいは ここ",
  eggs: "卵をクリックで孵化",
  items: "装備と 宝箱。開いて 装備しよう",
  storage: "大容量の倉庫。番号タブで ページ切替",
  cube: "アイテム合成: 同じレア度9個→1つ上に挑戦。切替で錬金術(まとめ売却)も",
  compound: "調合: 「力を託して」育てる/「武具に宿す」/覚醒の儀/コインガチャ",
  status: "いま見ているタスモンの能力・個体値",
  portrait: "いま見ているタスモンの立ち絵と総合戦闘力",
  item: "装備の詳細と 操作",
  odds: "全ての排出確率を 開示",
  log: "獲得履歴(新しい順)",
  breed: "親2体を選んで 配合。親は いなくなる",
  exped: "使っていない子を探索へ。時間を選んで宝とEXPを持ち帰る",
  dex: "図鑑: 入手した種族が記録される。全種コンプを目指そう",
  skills: "スキル(Lv10ごとに習得)と 兆し(レベル×1.5ポイント)",
  gacha: "記念コイン: GPで引く装備ガチャ。上位コインだけがアルカナ以降の入口",
};

function decorateHeader(id, el) {
  const header = el.querySelector(".win-header");
  if (!header || header.querySelector(".win-icons")) return;
  const box = document.createElement("span");
  box.className = "win-icons";
  if (id === "detail") {
    // 2026-07-31 友人テストFB「導線はシンプルに」: ヘッダーの小アイコン
    // (🚢交易船/📢お知らせ/✉メール)は見つけにくかったので撤去。
    // 交易船はタスクバーのタブへ外出し、お知らせ/メールは⚙メニューへ移動
    return;
  }
  const help = document.createElement("button");
  help.className = "win-mini";
  help.textContent = "?";
  help.title = "この画面の 説明";
  help.addEventListener("click", () => toast(WIN_HELP[id] ?? "", "#ffe9a8"));
  const reset = document.createElement("button");
  reset.className = "win-mini";
  reset.textContent = "⟲";
  reset.title = "ウィンドウを 並べ直す";
  reset.addEventListener("click", () => {
    if (id === "battle") {
      // バトルはCSS既定位置(左下)へ戻す
      el.style.left = "";
      el.style.top = "";
      el.style.right = "";
      el.style.bottom = "";
    }
    movedWindows.clear(); // 手動配置の記憶を全部捨てて整列に戻す(⟲の意味そのもの)
    layoutWindows();
    toast("ウィンドウを 並べ直した");
  });
  box.append(help, reset);
  header.prepend(box);
}

// タイトルバーでドラッグできるようにする(×ボタンは除く)。
function makeDraggable(id, el) {
  decorateHeader(id, el);
  el.addEventListener("mousedown", () => bringToFront(el)); // 窓要素自体は不変なのでここは残る
}

// 窓ドラッグはdocumentへの**委譲**で1本(2026-08-01 Haru指摘「ドラッグして動かせる
// 場所と動かせない場所がある」の実犯修正)。旧実装はヘッダー要素に直接リスナーを
// 付けていたが、詳細窓などは描画のたびに panel.innerHTML="" でヘッダーごと作り
// 直すため、**最初の再描画でドラッグが死んでいた**(静的ヘッダーの窓だけ動く=
// 場所によって挙動が違って見えた)。委譲なら作り直しに耐える
document.addEventListener("mousedown", (ev) => {
  const header = ev.target.closest(".win-header");
  if (!header || ev.target.closest("button")) return;
  const el = header.closest(".window, #battle-panel");
  if (!el) return;
  ev.preventDefault();
  bringToFront(el);
  // rect/clientX=物理px、style.left=レイアウトpx。物理pxで計算し代入時にzoomで割る(2026-07-17)
  const rect = el.getBoundingClientRect();
  const offX = ev.clientX - rect.left;
  const offY = ev.clientY - rect.top;
  el.style.left = `${rect.left / uiZoom()}px`;
  el.style.top = `${rect.top / uiZoom()}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
  // ドラッグ中は**ウィンドウ全域でマウスを受ける**(2026-08-05 実犯)。
  // クリック素通しの判定はメイン側が60msごとのカーソルポーリングで行い、
  // レンダラは250msごとにUI矩形を送っている。上へ速く動かすとカーソルが
  // 「250ms前の矩形」より先に出て素通し(setIgnoreMouseEvents(true))に入り、
  // **mousemove も mouseup も届かなくなる**。すると手動配置の記録(movedWindows)が
  // 走らないまま、次の layoutWindows で整列位置へ戻る = 「中央に戻される」の正体
  dragActive = true;
  reportUiRects(); // 250msの周期を待たず即座に「全域を受ける」を送る
  let moved = 0;
  const markMoved = () => {
    const wid = Object.keys(windows).find((k) => windows[k] === el);
    movedWindows.add(wid ?? (el.id === "battle-panel" ? "battle" : el.id));
  };
  const move = (e) => {
    moved += Math.abs(e.clientX - (rect.left + offX)) + Math.abs(e.clientY - (rect.top + offY));
    const left = Math.max(-rect.width + 60, Math.min(window.innerWidth - 60, e.clientX - offX));
    const top = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - offY));
    el.style.left = `${left / uiZoom()}px`;
    el.style.top = `${top / uiZoom()}px`;
    // **mouseupを待たずにこの時点で記録する**。上のとおり mouseup は届かないことが
    // あるので、「離したときに確定」では手動配置が失われる
    if (moved > 4) markMoved();
  };
  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    window.removeEventListener("blur", up);
    dragActive = false;
    reportUiRects();
    if (moved > 4) markMoved();
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  window.addEventListener("blur", up); // 取りこぼしの保険(フォーカスが外れたら終了)
});

// レイアウト: バトル | パーティ窓 | サブ… を左→右に並べる(最大3ウィンドウ)。
// パーティ窓(detail)はバトルのすぐ右に固定、その他は開いた順に並ぶ。
function layoutWindows() {
  for (const [id, btn] of Object.entries(tabButtons)) {
    btn.classList.toggle("win-open", openOrder.includes(id));
  }
  const left0 = clusterLeft();
  if (!movedWindows.has("battle")) setWinPos(battlePanel, left0);
  // detail を先頭に固定(安定表示)。残りは開いた順(安定ソート)。
  const ordered = [...openOrder].sort((a, b) => (a === "detail" ? -1 : b === "detail" ? 1 : 0));
  let x = left0 + BATTLE_W + TILE_GAP;
  for (const id of ordered) {
    // 手で動かした窓はその場に残す(movedWindowsの宣言コメント参照)。
    // 枠(x)は詰めない=他の窓の並びが動かないので、戻したときも同じ場所に戻る
    if (!movedWindows.has(id)) setWinPos(windows[id], x);
    x += (id === "detail" ? HERO_W : SUB_W) + skinWinExtra() + TILE_GAP;
  }
}
window.addEventListener("resize", () => applyUiScale()); // --effvh更新+再配置(2026-07-17)

// 未解放機能の案内文(段階的開放 2026-07-19)
const FEATURE_HINT = {
  compound: "調合は 仲間が4体になると解放",
  exped: "探索は 仲間が4体になると解放",
};
function openWindow(id, opts = {}) {
  if (!opts.force && !featureUnlocked(state, id)) {
    toast(`🔒 ${FEATURE_HINT[id] ?? "まだ解放されていない"}`, "#9aa4c8");
    return;
  }
  if (!openOrder.includes(id)) {
    if (id === "compound") {
      // 調合はスロット空欄+選択なしで開く(初期値は空欄 2026-07-13 FB)。
      // タスモン連動のため、開いたらタスモンも開いておく(選び先が見える)
      compoundBaseId = null;
      feedSelId = null;
      convSelId = null;
      ritualFoodIds.clear();
      if (!openOrder.includes("box")) {
        openOrder.push("box");
        windows.box.classList.remove("hidden");
        renderBox();
      } else if (openOrder.includes("box")) {
        renderBox();
      }
    }
    if (id === "map") portalArea = null; // 開くたび「いまいる幕」を表示(2026-07-13 FB)
    // 同時に開けるのは3枚まで。あふれる時は「パーティ窓(detail)以外の最古」を閉じて入れ替える
    // (パーティ窓は他を開いても消えない、という2026-07-08改訂指示)。
    // 2026-08-09: 固定中の窓も対象から除く(closeWindowは固定中を拒否するだけなので、
    // 除かずに選ぶと「拒否される窓を選び続けて openOrder が減らない」無限ループになる)
    while (openOrder.length >= MAX_WINDOWS) {
      const evict = openOrder.find((w) => w !== "detail" && w !== id && !winPinned(w));
      if (!evict) break; // detail か固定中の窓しか残っていない等
      closeWindow(evict);
    }
    openOrder.push(id);
  }
  // チュートリアルの「見る」系クエスト(2026-08-01: 目安箱/交易船は開いた事実を数える)
  if (id === "meyasu") bumpMissionCounter(state, "meyasuview");
  if (id === "pass") bumpMissionCounter(state, "passview"); // バトルパスのチュートリアル(2026-08-03)
  if (id === "trade") bumpMissionCounter(state, "tradeview");
  const el = windows[id];
  el.classList.remove("hidden");
  bringToFront(el);
  renderers[id]();
  layoutWindows();
}

function closeWindow(id, opts = {}) {
  // 窓の固定(2026-08-01 友人テストFB→2026-08-09 全窓へ拡張)。固定中は×やタブでは閉じない
  if (!opts.force && winPinned(id)) {
    toast("📌 この窓は固定中(📌を押すと解除できる)", "#cdd8ef");
    return;
  }
  // 二重close/連動closeの再入ガード(2026-08-01: ペア連動を除去前に書くと
  // status⇔portraitが相互再帰でスタックあふれした。**自分をopenOrderから
  // 除いてから**連動先を閉じるのが正しい順序)
  if (!openOrder.includes(id)) return;
  openOrder = openOrder.filter((w) => w !== id);
  movedWindows.delete(id); // 閉じたら手動配置は忘れる(次に開いたら整列位置から)
  // 調合はタスモンから子を選ぶ窓なので、タスモンを閉じたら一緒に閉じる
  // (2026-07-24 FB。開くときにタスモンも開く仕様=openWindowと対になる挙動)
  if (id === "box" && openOrder.includes("compound")) closeWindow("compound");
  // 立ち絵とステータスはペア(2026-08-01)。片方を閉じたら両方閉じる
  if (id === "status" && openOrder.includes("portrait")) closeWindow("portrait");
  if (id === "portrait" && openOrder.includes("status")) closeWindow("status");
  windows[id].classList.add("hidden");
  // 2026-08-12 FB「窓を閉じてバーだけにしても後ろのアプリを触れない」対策の一環。
  // 閉じる窓の中の要素をホバー中だと、祖先がhiddenになる瞬間はmouseleaveが
  // 保証されず、ツールチップが古い座標に残ったまま(=reportUiRectsが拾い続ける
  // 透明な当たり判定になる)ことがある。窓を閉じたら必ず強制で消す
  hideTooltip(true);
  // 孵化直後のペアを閉じたら、開く前に見ていた卵窓へ戻す(2026-08-05 Haru指示)。
  // ペアは相互連動で閉じるので、両方閉じ切ってから1回だけ開き直す
  if ((id === "portrait" || id === "status") && hatchPairFromEggs &&
      !openOrder.includes("portrait") && !openOrder.includes("status")) {
    hatchPairFromEggs = false;
    openWindow("eggs");
  }
  if (id === "compound" && openOrder.includes("box")) renderBox(); // 調合バッジを消す
  // 合成窓を閉じたら✓マークを消すために持ち物系を描き直す(2026-07-16 FB)
  if (id === "cube") keepScroll(() => refreshInvViews());
  // インベントリ窓を閉じたら、パーティ窓の「インベントリ」ボタンの点灯(on)を消す
  // (2026-08-06: インベントリ別窓化)
  if (id === "inv" && openOrder.includes("detail")) renderDetail(currentDetailId);
  layoutWindows();
  if (!anyPanelOpen()) window.appControl?.closePanel(); // ウィンドウを元に戻す
}

// Temporary automation windows use leases so an operation closes only what it opened.
const windowManager = (() => {
  const leases = new Map();
  const acquire = (id, owner = "anonymous") => {
    let entry = leases.get(id);
    if (!entry) {
      const wasOpen = openOrder.includes(id);
      if (!wasOpen) openWindow(id, { force: true });
      entry = { owner, opened: !wasOpen, refs: 0 };
      leases.set(id, entry);
    }
    entry.refs += 1;
    let released = false;
    return {
      id,
      release() {
        if (released) return;
        released = true;
        entry.refs -= 1;
        if (entry.refs === 0) {
          leases.delete(id);
          if (entry.opened) closeWindow(id, { force: true });
        }
      },
    };
  };
  const withWindow = async (id, fn, owner = "anonymous") => {
    const lease = acquire(id, owner);
    try {
      return await fn();
    } finally {
      lease.release();
    }
  };
  const snapshot = () => [...leases.entries()].map(([id, entry]) => ({
    id,
    owner: entry.owner,
    opened: entry.opened,
    refs: entry.refs,
  }));
  return { acquire, withWindow, snapshot };
})();

function toggleWindow(id) {
  if (openOrder.includes(id)) closeWindow(id);
  else openWindow(id);
}

function closePanels() {
  for (const id of [...openOrder]) closeWindow(id);
}

// タスクバーの全画面タブ(英雄ウィンドウ内から移設。アイコン+2文字ラベル)
{
  // 下部バーは主要導線だけに絞る(#14)。図鑑=パーティ窓へ移設、履歴/確率の
  // 独立タブは撤去(確率はコインのホバー/ガチャ窓に残るので開示は維持)。
  // 装備窓は撤廃(#9): 持ち物はパーティ窓のインベントリタブへ集約。
  // [絵文字フォールバック, winId, ラベル, カスタムアイコン(cat/name)]
  // ENABLE_BREEDING: 配合は「ややこしい」ため一旦封印(2026-07-08)。true に戻すだけで
  // 配合タブ・窓・ロジックがそのまま復活する(コードは温存)。
  // 並びは重要順に左から(2026-08-01 友人テストFB改訂「バトル/タスモンも右寄せで
  // 同じ並びでいい。並び方を重要な順に」)。先頭2つ=バトル/タスモンはHTML側の
  // 実体ボタン(参照で保持し、rebuildのinnerHTML消去後に必ず先頭へ再appendする。
  // getElementByIdは切り離し中に失敗するので参照キャプチャが必須)
  // 並びは2026-08-03 Haru指示: バトル,パーティ,ミッション,目安箱,タスモン,倉庫,地図,調合,探索,パス,歯車。
  // 指示に無かった「卵」はタスモンの隣、「合成」は調合の隣に置いた(要調整なら言って)
  const BAR_TABS = [
    ["📋", "mission", "ミッション", null], // 段階制チュートリアル。タブの先頭
    ["📮", "meyasu", "目安箱", null], // 意見を送る(2026-07-15)。他人の投稿は見せない
    ["👥", "box", "タスモン", "nav/party"],
    ["🥚", "eggs", "卵", "egg/legend"],
    ["📦", "storage", "倉庫", "nav/storage"],
    ["🗺", "map", "地図", "misc/map"],
    ["⚒", "cube", "合成", "currency/crystal"],
    ["🧪", "compound", "調合", null],
    ["🧭", "exped", "探索", null],
    ...(ENABLE_BREEDING ? [["🧬", "breed", "配合", "nav/summon"]] : []),
    ["🎖", "pass", "パス", null], // タスモンパス(2026-07-20: 任務+シーズン報酬)
    ...(TRADE_ENABLED ? [["🚢", "trade", "交易船", null]] : []),
    // ガチャは調合窓のタブへ移動(2026-07-11 FB)。専用タブは撤去
  ];
  const wrap = $("bar-fn");
  // 段階的開放(2026-07-19 バッチ1 → 2026-07-20 FB改訂「調合と探索は最初から表示して
  // ロックされてる感じで」): 未解放タブも🔒つきで常に見せる。クリックすると
  // 「何をする機能か+解放条件」を説明し、解放の瞬間はお祝い+説明バナーが出る
  const FEATURE_LABEL = { map: "地図", box: "タスモン", storage: "倉庫", exped: "探索",
    cube: "合成", compound: "調合", meyasu: "目安箱", trade: "交易船" };
  // 解放時の説明(2026-07-19 FB「解放時に説明を付けて」)
  const FEATURE_INTRO = {
    // 2026-08-10 FB「探索解放の表示が消えるのが早い。閉じるまで消えないように。
    // さっそく探索に出してみよう!と表示して」: 新機能の説明は自動で消えず
    // 閉じるボタンを押すまで残る(celebrateLootのpersistent)+行動を後押しする一言を添える
    exped: { icon: "🧭", title: "探索 解放!", sub: "使っていない子を旅に出して、宝とEXPを持ち帰らせよう<br>時間(3/6/12時間)を選んで放置でOK<br><b>さっそく探索に出してみよう!</b>" },
    compound: { icon: "🧪", title: "調合 解放!", sub: "仲間の力を託して育成・覚醒の儀・武具に宿す・コインガチャ<br>増えた仲間の「使い道」は全部ここ" },
  };
  // ロック中タブのクリック説明(何をする機能か+解放条件)
  const FEATURE_LOCKED_HINT = {
    exped: "🧭 探索: 使っていない子を旅に出して宝とEXPを持ち帰る(仲間が4体になると解放)",
    compound: "🧪 調合: 仲間の力を託して育成・覚醒・武具に宿す・ガチャ(仲間が4体になると解放)",
  };
  let barShown = new Set();
  let barBuilt = false;
  const fixedTabs = [$("btn-battle"), $("btn-hero")]; // 最重要2タブ(常に先頭)
  window.__rebuildBarTabs = (announce) => {
    const nowUnlocked = new Set(BAR_TABS.filter(([, id]) => featureUnlocked(state, id)).map(([, id]) => id));
    if (announce) {
      for (const id of nowUnlocked) {
        if (!barShown.has(id) && FEATURE_LABEL[id]) {
          const intro = FEATURE_INTRO[id];
          if (intro) {
            celebrateLoot({ kicker: "新機能解放!!", icon: intro.icon, title: intro.title, sub: intro.sub, rarity: "legend", persistent: true });
          }
          toast(`🔓 新機能解放! 「${FEATURE_LABEL[id]}」が使えるようになった`, "#ffd67a");
          sfx("levelup");
        }
      }
    }
    if (barBuilt && barShown.size === nowUnlocked.size && [...nowUnlocked].every((id) => barShown.has(id))) return;
    barShown = nowUnlocked;
    barBuilt = true;
    wrap.innerHTML = "";
    for (const b of fixedTabs) wrap.appendChild(b); // バトル/タスモンは常に先頭
    for (const [icon, winId, label, iconPath] of BAR_TABS) {
      const unlocked = nowUnlocked.has(winId);
      const b = document.createElement("button");
      b.className = "hero-fn bar-tab" + (unlocked ? "" : " locked");
      b.dataset.win = winId;
      const iconHtml = iconPath
        ? iconImgHtml(iconPath.split("/")[0], iconPath.split("/")[1], 18, "tab-ico")
        : `<span>${icon}</span>`;
      b.innerHTML = unlocked ? `${iconHtml}<small>${label}</small>` : `${iconHtml}<small>🔒${label}</small>`;
      b.title = unlocked ? label : FEATURE_LOCKED_HINT[winId] ?? label;
      b.addEventListener("click", () => {
        if (!featureUnlocked(state, winId)) {
          // ロック中: 開かずに「何をする機能か+解放条件」を説明する(2026-07-20 FB)
          toast(FEATURE_LOCKED_HINT[winId] ?? `🔒 「${FEATURE_LABEL[winId] ?? label}」は まだ解放されていない`, "#cdd8ef");
          return;
        }
        toggleWindow(winId);
      });
      wrap.appendChild(b);
    }
  };
  window.__rebuildBarTabs(false); // 初期構築(起動時は無通知)
  // バトル/タスモンのタブにもカスタムアイコンを付ける(他タブと同じ絵柄構成)
  const bBtn = $("btn-battle");
  if (bBtn) bBtn.innerHTML = iconImgHtml("nav", "battle", 18, "tab-ico") + `<small>バトル</small>`;
  const hBtn = $("btn-hero");
  if (hBtn) hBtn.innerHTML = iconImgHtml("nav", "home", 18, "tab-ico") + `<small>パーティ</small>`;
}

for (const [id, btn] of Object.entries(tabButtons)) {
  btn.addEventListener("click", () => toggleWindow(id));
}
for (const btn of document.querySelectorAll(".win-close")) {
  if (!btn.dataset.win) continue; // バトルウィンドウの×は別ハンドラ
  btn.addEventListener("click", () => closeWindow(btn.dataset.win));
}
// 窓の固定ピン(2026-08-09 全窓に拡張)。バトル/パーティは専用ハンドラ(再描画のたびに
// 付け直す必要があるため上のwin-closeと同じ理由でdata-win無し=ここではスキップ)
for (const btn of document.querySelectorAll(".win-pin")) {
  if (!btn.dataset.win) continue;
  const id = btn.dataset.win;
  btn.classList.toggle("pin-on", winPinned(id));
  btn.addEventListener("click", () => {
    state.settings.pinnedWins = state.settings.pinnedWins ?? {};
    const on = !winPinned(id);
    state.settings.pinnedWins[id] = on;
    btn.classList.toggle("pin-on", on);
    toast(on ? "📌 この窓を固定した(×やタブでは閉じない)" : "📌 この窓の固定を解除した", "#ffd67a");
    save();
  });
}

// 図鑑はパーティ窓の見出しから開く(下部バーから移設 #14)
$("box-dex-btn")?.addEventListener("click", () => toggleWindow("dex"));

// ⚙メニュー(2026-07-19 FB「アイコンが並びすぎてみづらい」): システム/履歴/終了を集約。
// 位置(2026-08-03 Haruスクショ指示で確定): **左端をタスクバーの右端に揃え、バーと
// 重ねない**。下端は画面の最下端。バーの右に幅が無い倍率だけ右端にクランプ
function positionSysMenu() {
  const menu = $("sys-menu");
  const bar = $("bar");
  if (!menu || !bar || menu.classList.contains("hidden")) return;
  const z = uiZoom();
  const barRight = bar.getBoundingClientRect().right / z;
  // 2026-08-03 Haru確定(例外なし): **常に左端=バーの右端・下端=画面の下端**。
  // 空きが狭い倍率では場所を動かさず、メニューの幅を空きに合わせて縮める
  // (以前の「狭い時はバーの上に逃がす」分岐はHaruの意図と違ったため廃止)
  const strip = Math.floor(effViewportW() - barRight - 10);
  if (strip >= 140) {
    // 基本形: 左端=バーの右端・下端=画面の下端(幅は空きに合わせる)
    menu.style.left = `${Math.round(barRight)}px`;
    menu.style.bottom = "8px";
    menu.style.maxWidth = `${strip}px`;
  } else {
    // バーが画面幅いっぱいの倍率(150%等): バーに重ねると⚙ごと塞いで閉じられなくなる
    // (2026-08-03 FB)ので、右端のままバーの上に退避する。バーとの交差はゲートで恒久禁止
    menu.style.left = `${Math.max(4, Math.round(effViewportW() - 176 - 8))}px`;
    menu.style.bottom = "98px";
    menu.style.maxWidth = "176px";
  }
  menu.style.right = "auto";
  menu.style.minWidth = "0";
}
$("btn-settings")?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  $("sys-menu")?.classList.toggle("hidden");
  positionSysMenu();
});
document.addEventListener("click", (ev) => {
  const menu = $("sys-menu");
  if (!menu || menu.classList.contains("hidden")) return;
  if (!menu.contains(ev.target) && ev.target !== $("btn-settings")) menu.classList.add("hidden");
});
// 行のどこを押してもボタンが押せる(ラベルクリック対応)
for (const row of document.querySelectorAll("#sys-menu .menu-row")) {
  row.addEventListener("click", (ev) => {
    const btn = row.querySelector("button");
    if (btn && ev.target !== btn) btn.click();
  });
}

$("btn-battle").addEventListener("click", () => setBattleOpen(!battleOpen));
// 英雄ボタン: ハブ(キャラ詳細)をトグル。対象は前回のキャラ(いなければリーダー)
$("btn-hero").addEventListener("click", () => {
  if (openOrder.includes("detail")) {
    closeWindow("detail");
    return;
  }
  openDetail(state.monsters[currentDetailId] ? currentDetailId : state.party[0]);
});
$("btn-battle-close").addEventListener("click", () => setBattleOpen(false));
$("btn-battle-pin")?.addEventListener("click", () => {
  state.settings.pinnedWins = state.settings.pinnedWins ?? {};
  const on = !winPinned("battle");
  state.settings.pinnedWins.battle = on;
  $("btn-battle-pin").classList.toggle("pin-on", on);
  toast(on ? "📌 バトル窓を固定した(×やタブでは閉じない)" : "📌 バトル窓の固定を解除した", "#ffd67a");
  save();
});
$("btn-battle-pin")?.classList.toggle("pin-on", winPinned("battle"));
$("btn-breed-go").addEventListener("click", doBreed);

$("egg-count").addEventListener("click", () => openWindow("eggs"));

// メッセージ履歴(RECORDS)の開閉
$("msg-log-btn").addEventListener("click", () => {
  const h = $("msg-history");
  h.classList.toggle("hidden");
  if (!h.classList.contains("hidden")) {
    renderMsgHistory();
    $("msg-history-list").scrollTop = $("msg-history-list").scrollHeight;
  }
});
$("msg-history-close").addEventListener("click", () => $("msg-history").classList.add("hidden"));
$("result-log-btn").addEventListener("click", () => renderStageResultHistory());

// 「最初からやり直す」は削除(2026-07-28 FB)。放置RPGの積み上げが1操作で消える
// 危険と釣り合う利点が無い。作り直したい人はSteamのクラウドセーブ削除で足りる。
// 2026-08-12 Haru指示「初期化ボタンの削除」: かくりつ開示窓(renderOdds)に
// 「最初から始める(データリセット)」という**別のボタン**がそのまま残っていた
// (未ゲートで誰でも押せる状態)。doDataReset を呼ぶ経路がこれ1つだけで検証用途の
// 呼び出し元も存在しなかったため、ボタンごと doDataReset()/resetting フラグも削除した

// 宝箱は3種類だけ: 木箱(コモン)/レア箱(通常ドロップ)、ボス箱(幕ボスx10限定・確定)。
const CHEST_KINDS = {
  boss: { label: "ボスの宝箱", color: "#ffcf4a", icon: "👑", desc: "幕ボス(x10)限定・ウルトラ以上 確定!" },
  rare: { label: "レアの宝箱", color: "#4aa8ff", icon: "📦", desc: "レア装備入り" },
  wood: { label: "木の宝箱", color: "#c8a86c", icon: "📦", desc: "コモン装備入り" },
};

// 宝箱ストック(TBH風): タスクバーのミニ戦闘の右にチップで常時表示。クリックで開封。
let chestChipSig2 = "";
// 鍵/水晶アートのimgタグ(2026-07-13 FB「絵関係のやつ反映されてない」)
function keyIconHtml(difficulty, size = 16) {
  return `<img class="key-ico" style="width:${size}px;height:${size}px" src="assets/ui/keys/key_${Math.min(difficulty ?? 0, 3)}.png" alt="鍵">`;
}
function crystalIconHtml(size = 16) {
  return `<img class="key-ico" style="width:${size}px;height:${size}px" src="assets/ui/keys/crystal.png" alt="水晶">`;
}
function keyIconEl(difficulty, size = 44) {
  const img = new Image();
  img.src = `assets/ui/keys/key_${Math.min(difficulty ?? 0, 3)}.png`;
  img.style.width = img.style.height = `${size}px`;
  img.style.objectFit = "contain";
  return img;
}
function stoneIconEl(kind, size = 44) {
  const img = new Image();
  img.src = EVO_STONES[kind]?.img ?? "assets/ui/keys/stone_nuke.png";
  img.style.width = img.style.height = `${size}px`;
  img.style.objectFit = "contain";
  return img;
}
function stoneIconHtml(kind, size = 16) {
  return `<img class="key-ico" style="width:${size}px;height:${size}px" src="${EVO_STONES[kind]?.img}" alt="進化石">`;
}
function crystalIconEl(size = 44) {
  const img = new Image();
  img.src = "assets/ui/keys/crystal.png";
  img.style.width = img.style.height = `${size}px`;
  img.style.objectFit = "contain";
  return img;
}

function renderChestChips() {
  const wrap = $("bar-chests");
  if (!wrap) return;
  const counts = new Map();
  for (const c of state.chests) counts.set(c.kind, (counts.get(c.kind) ?? 0) + 1);
  // 2026-08-11 Haru指示「宝箱保管レベルを上げても保管数がすぐに上がらない」:
  // 署名が所持数(counts)だけを見ていて上限(chestCapLv)を含んでいなかったため、
  // レベルアップの瞬間に所持数が動かないと「変化なし」判定でDOM更新自体が
  // スキップされ、表示のn/上限がその後どこかで所持数が動くまで古いままになっていた
  const sig =
    `${state.chests.length}|${state.chestCapLv ?? 0}|` +
    (Object.keys(CHEST_KINDS)
      .filter((k) => counts.has(k))
      .map((k) => `${k}:${counts.get(k)}`)
      .join(",") || "empty");
  if (sig === chestChipSig2) return; // 変化がないときはDOMを触らない(ホバー維持)
  chestChipSig2 = sig;
  wrap.innerHTML = "";
  if (state.chests.length === 0) return; // 空のときは何も出さない(画面を汚さない)
  // ボス箱が一番上(目立つ位置)
  for (const [kind, km] of Object.entries(CHEST_KINDS)) {
    const n = counts.get(kind);
    if (!n) continue;
    const isBoss = kind === "boss";
    const slot = document.createElement("button");
    slot.className = "bchest" + (isBoss ? " hot bchest-boss" : "");
    slot.style.borderColor = km.color;
    slot.appendChild(chestIconEl(kind, isBoss ? 38 : 32));
    // ボス箱は王冠バッジ+「BOSS」ラベルで別格に(通常箱と一目で区別)
    if (isBoss) slot.insertAdjacentHTML("beforeend", `<span class="bchest-crown">👑</span><span class="bchest-boss-tag">BOSS</span>`);
    // ストック数/上限をアイコン上に(2026-07-13 FB「宝箱ごとに」)
    const kcap = chestCapOf(state, kind);
    slot.insertAdjacentHTML(
      "beforeend",
      `<b class="bchest-n${n >= kcap ? " full" : ""}">${n}/${kcap}</b><span class="bchest-cd" data-kind="${kind}"></span>`,
    );
    slot.title = `${km.label} ${n}/${kcap}(左クリック=1個ずつ開封 / 右クリック=この種を一括開封。満杯だと新しく落ちない)・${km.desc}`;
    // 左クリック=1個ずつ / 右クリック=この種類を一括開封(2026-07-21 FB)
    slot.addEventListener("click", () => openChestOfKind(kind, 1));
    slot.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      openChestOfKind(kind);
    });
    wrap.appendChild(slot);
  }
}

// kind を指定するとその種類を、null なら全部の宝箱を一括開封する。
// limit=1 で「1個ずつ」(2026-07-21 FB: 左クリック=1個/右クリック=一括)。
// 持ち物が満杯になったら止める。最高レアの1個だけバナーで祝い、あとはフロート。
function openChestOfKind(kind, limit = Infinity) {
  const targets = state.chests.filter((c) => kind === null || c.kind === kind).slice(0, limit);
  if (targets.length === 0) return;
  // チュートリアル: 1個ずつ(limit=1)と まとめて開ける(limit省略)を区別して数える
  if (limit === 1) bumpMissionCounter(state, "chestone");
  else if (targets.length >= 1) bumpMissionCounter(state, "chestbulk");
  let opened = 0;
  let best = null;
  let bestScore = -1;
  let bossKind = false;
  for (const chest of targets) {
    if (state.items.length >= invCapOf(state)) {
      toast("持ち物が 満杯(売却/装備してから)", "#ff9a9a");
      break;
    }
    const item = doOpenChest(chest.id);
    if (!item) continue;
    opened++;
    addLog(state, {
      kind: "宝箱",
      rarity: item.rarity,
      text: `${item.name} — ${item.opts.map(describeOpt).join(" / ")}`,
    });
    const irm = RARITY_META[item.rarity];
    gainFloat(item.name, irm.color);
    const score = irm.stars;
    if (score > bestScore) {
      bestScore = score;
      best = item;
      bossKind = chest.kind === "boss";
    }
  }
  if (opened === 0) return;
  // 一番の当たりだけバナーで祝う(一括なので演出は1回に集約)
  if (best && (RARITY_META[best.rarity].stars >= CELEBRATE_MIN_STARS || bossKind)) {
    celebrateItem(best, bossKind ? "👑 ボスの宝箱" : `宝箱 ${opened}個 開封`);
  } else if (best) {
    toast(`宝箱を ${opened}個 開けた(一番: ${best.name})`, RARITY_META[best.rarity].color);
  }
  renderHud();
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("cube")) renderCube();
  if (openOrder.includes("log")) renderLog();
  refreshHeroInv();
  save();
}

// TBH式: チェスト自動開封トグル(On/Off)。バー中央→戦闘画面へ移設
function renderAutoChip() {
  const btn = $("battle-auto");
  if (!btn) return;
  const on = !!state.settings.autoOpenChests;
  btn.querySelector("b").textContent = on ? "On" : "Off";
  btn.classList.toggle("on", on);
}
$("battle-auto").addEventListener("click", () => {
  state.settings.autoOpenChests = !state.settings.autoOpenChests;
  bumpMissionCounter(state, "autoopen"); // チュートリアル: 自動開封を触った
  toast(`チェスト自動開封(${state.settings.autoOpenChests ? "On" : "Off"})`, "#ffe9a8");
  renderAutoChip();
  save();
});
renderAutoChip();

// 相性の簡易相関図(戦闘画面 左上に常時表示 2026-07-09)。内容は不変なので初回のみ描画。
// ---- 相性表(属性×タイプ)。戦闘画面右上の「相性」ボタンで開閉(AB1) ----
function typeChartHtml() {
  const elChip = (k) =>
    `<span class="tc-chip" style="color:${ELEMENT_META[k].color};border-color:${ELEMENT_META[k].color}">${ELEMENT_META[k].label}</span>`;
  const roleChip = (k) =>
    `<span class="tc-chip" style="color:${ROLE_META[k].color};border-color:${ROLE_META[k].color}">${ROLE_META[k].icon}${ROLE_META[k].label}</span>`;
  const arr = '<span class="tc-arrow">▶</span>';
  // 属性の四すくみ環(ELEMENT_ADVANTAGE を先頭からたどる: fire▶wind▶earth▶water▶fire)
  const elemChain = [];
  let e = "fire";
  for (let i = 0; i < 4; i++) { elemChain.push(elChip(e)); e = ELEMENT_ADVANTAGE[e]; }
  elemChain.push(elChip("fire"));
  const lightDark = `${elChip("light")}<span class="tc-arrow">⇄</span>${elChip("dark")}`;
  // ジョブ(タイプ)相性は削除(2026-07-12 FB)。相性は属性のみ
  return (
    `<div class="tc-head">相性表 <span class="tc-x" id="type-chart-close">×</span></div>` +
    `<div class="tc-sec">属性 <small>有利 ×1.5 ・ 不利 ×0.55</small></div>` +
    `<div class="tc-row">${elemChain.join(arr)}</div>` +
    `<div class="tc-row">${lightDark}<small class="tc-mini">光と闇は相互に有利</small></div>` +
    `<div class="tc-note">▶ の先が弱い側(矢の元が得意)。</div>` +
    // ステージ情報(2026-08-01 FB「宝箱からの装備レベルドロップ目安も追記」)。
    // 表示は実装の実値から引く(equipLvTier=ドロップ装備のLv段階そのもの)。
    // 2026-08-12 バグ報告「目安65Lvだが実際は30ほど」の実犯: 実際の通常宝箱
    // (rollNormalChestItem, equipment.js)は combatStage() の生値ではなく
    // expectedLevelForStage(stage)(実効ステージ→想定キャラLvへ較正した値)を
    // equipLvTierへ渡している。ここが生のcombatStage()を渡していたため、
    // 実効ステージが大きい高難易度ほど表示だけが過大(実測: 実効65 → 表示Lv65・
    // 実際の付与Lv30)になっていた。実装と同じ較正を通す
    `<div class="tc-sec">今のステージ <small>${stageLabel(state.stage)}</small></div>` +
    `<div class="tc-row"><small class="tc-mini">📦 宝箱の装備ドロップ目安: <b style="color:#ffe9a8">Lv${equipLvTier(expectedLevelForStage(combatStage()))}</b></small></div>`
  );
}
function toggleTypeChart(force) {
  const box = $("type-chart");
  const show = force ?? box.classList.contains("hidden");
  if (show) {
    box.innerHTML = typeChartHtml();
    box.classList.remove("hidden");
    $("type-chart-close").addEventListener("click", () => toggleTypeChart(false));
  } else {
    box.classList.add("hidden");
  }
}

// 相性の簡易相関図(2026-07-09: 属性+ジョブを1つの窓に統合して右上に常時表示)。
// 矢印は見えづらい▸をやめ「>」を強調(> の先が弱い側)。末尾の「詳細」で倍率つき相性表を開く。
function renderTypeCombo() {
  const box = $("type-mini-role");
  if (!box) return;
  const arr = '<span class="tm-arr">&gt;</span>';
  const elChip = (k) => `<span class="tm-chip" style="color:${ELEMENT_META[k].color}">${ELEMENT_META[k].label}</span>`;
  const roleChip = (k) =>
    `<span class="tm-chip" title="${ROLE_META[k].label}" style="color:${ROLE_META[k].color}">${roleIconHtml(ROLE_META[k], 12)}</span>`;
  let e = "fire";
  const el = [];
  for (let i = 0; i < 4; i++) { el.push(elChip(e)); e = ELEMENT_ADVANTAGE[e]; }
  el.push(elChip("fire"));
  // ジョブ相性は削除(2026-07-12 FB)。属性のみの最小表示
  box.innerHTML =
    `<div class="tm-row">${el.join(arr)}</div>` +
    `<div class="tm-row">${elChip("light")}<span class="tm-arr">⇄</span>${elChip("dark")}</div>`;
  const btn = document.createElement("button");
  btn.className = "tm-detail";
  btn.textContent = "詳細";
  btn.title = "相性の倍率など詳しく";
  btn.addEventListener("click", () => toggleTypeChart());
  box.appendChild(btn);
}
renderTypeCombo();

// 自動開封: 宝箱の種類ごとの独立クールタイム(2026-07-13 FB「それぞれの宝箱ごとに」)。
// 手動開封(宝箱ウィンドウのクリック)はいつでもできる。演出はフロート+履歴のみ。
const AUTO_OPEN_CD_MS = { wood: 5 * 60000, rare: 8 * 60000, boss: 8 * 60000 };
// 短縮レベル(GP購入 2026-07-21)込みの実効CD
const autoOpenCdOf = (kind) => (AUTO_OPEN_CD_MS[kind] ?? 0) * autoOpenCdMult(state);
const lastAutoOpenByKind = { wood: Date.now(), rare: Date.now(), boss: Date.now() };
// チップ上のカウントダウン表示(renderHudから毎秒更新)
let cdTextTimer = 0;
function updateChestCountdowns(now) {
  if (now - cdTextTimer < 1000) return;
  cdTextTimer = now;
  for (const el of document.querySelectorAll(".bchest-cd")) {
    const kind = el.dataset.kind;
    if (!state.settings.autoOpenChests) {
      el.textContent = "";
      continue;
    }
    const remain = (lastAutoOpenByKind[kind] ?? now) + autoOpenCdOf(kind) - now;
    if (remain <= 0) el.textContent = "0:00";
    else el.textContent = `${Math.floor(remain / 60000)}:${String(Math.floor((remain % 60000) / 1000)).padStart(2, "0")}`;
  }
}
setInterval(() => {
  if (!state.settings.autoOpenChests) return;
  if (state.chests.length === 0 || state.items.length >= invCapOf(state)) return;
  // 種類ごとに独立して1個ずつ開ける
  let next = null;
  const now = Date.now();
  for (const kind of Object.keys(AUTO_OPEN_CD_MS)) {
    if (now - (lastAutoOpenByKind[kind] ?? 0) < autoOpenCdOf(kind)) continue;
    next = state.chests.find((c) => c.kind === kind);
    if (next) break;
  }
  if (!next) return;
  const item = doOpenChest(next.id);
  if (!item) return;
  lastAutoOpenByKind[next.kind] = Date.now();
  addLog(state, {
    kind: "宝箱",
    rarity: item.rarity,
    text: `${item.name} — ${item.opts.map(describeOpt).join(" / ")}`,
  });
  const irm = RARITY_META[item.rarity];
  gainFloat(item.name, irm.color);
  // 自動開封は静かに(フロート+履歴)。ただし★5以上の大当たりだけはバナーで祝う
  if (irm.stars >= 5) {
    celebrateLoot({
      kicker: "宝箱 開封",
      icon: itemIconCanvas(item, 52),
      title: item.name,
      sub: `${irm.label}<br>${item.opts.map(describeOpt).join("<br>")}`,
      rarity: item.rarity,
    });
  }
  renderHud();
  if (openOrder.includes("log")) renderLog();
  if (openOrder.includes("items")) renderItems();
  if (openOrder.includes("cube")) renderCube();
  refreshHeroInv();
}, 15000);

// 全ウィンドウをドラッグ可能に(TBH式: タイトルバーでつかんで自由配置)
for (const [id, el] of Object.entries(windows)) {
  makeDraggable(id, el);
}
makeDraggable("battle", battlePanel); // バトルはCSS既定の左下に固定

// バトルウィンドウはデフォルト表示 → 起動時からウィンドウを上に伸ばしておく
setBattleOpen(true);
// 固定していたパーティ窓は起動時に自動で開く(固定=いつも表示、の期待に合わせる)
if (winPinned("detail")) {
  openDetail(state.monsters[currentDetailId] ? currentDetailId : state.party[0]);
}
// 英雄ウィンドウはベース画面としてはじめから開いておく(ここから各画面へ)
openDetail(state.party[0]);

// はじめてのプレイ: 最初の1匹を選ぶ(ポケモン式3択)。選ぶまで画面の上に出しておく
const STARTER_NOTES = {
  flamewolf: "アタッカー(攻め)",
  aquafox: "ヒーラー(回復役)",
  terrashell: "タンク(かばう)",
};

// 最初の1匹は「卵から孵化」で決まる。ランダムで生まれるが、リセマラ(やり直し)機能・案内は
// 用意しない(2026-07-09ユーザー指示: 卵で開始・リセマラは不要)。
function showStarterPicker() {
  const ov = document.createElement("div");
  ov.id = "starter-overlay";
  const box = document.createElement("div");
  box.className = "starter-box ff-panel";
  const render = (phase) => {
    box.innerHTML = "";
    if (phase === "egg") {
      // 4択(2026-07-29 Haru指示「4種類用意して、ジョブごとにどれを選ぶ?と
      // できるように」)。役割で選ばせる — 中身の種族は確定、当たり(色違い/覚醒)の
      // 抽選は孵した瞬間に残す。選んだ卵はその場で孵る(チュートリアルなので
      // 孵化装置の待ち時間は掛けない)
      // 2026-07-30 Haru指示「最初の卵はジョブだけの指定で属性はランダム」:
      // 選ぶのは役割だけ。属性(と種族)は孵った瞬間に分かる = 最初の1個にも
      // 「何が出た?」の楽しみを残す。だから属性チップはここには出さない
      box.innerHTML =
        `<div class="starter-title">最初の卵、どれを選ぶ?</div>` +
        `<div class="starter-sub">役割で選ぼう。属性は 生まれるまで分からない</div>`;
      const eggRow = document.createElement("div");
      eggRow.className = "starter-egg-row";
      for (const pick of STARTER_EGGS) {
        const rmeta = ROLE_META[pick.role] ?? ROLE_META.nuke;
        const card = document.createElement("button");
        card.className = "starter-egg-card";
        card.style.setProperty("--role-color", rmeta.color);
        const eggWrap = document.createElement("div");
        eggWrap.className = "starter-egg-wrap";
        eggWrap.appendChild(eggIconEl("common", 64));
        card.appendChild(eggWrap);
        const label = document.createElement("div");
        label.className = "starter-egg-role";
        label.innerHTML =
          `<b>${pick.roleIcon} ${pick.roleJa}</b>` +
          `<span class="starter-egg-desc">${pick.desc}</span>`;
        card.appendChild(label);
        card.addEventListener("click", () => {
          const result = hatchStarterEgg(state, pick.role);
          if (result.error) return void toast(result.error);
          sfx("hatch");
          playerHp = partyMaxHp();
          syncSceneParty();
          currentDetailId = state.party[0];
          save();
          render("hatched");
        });
        eggRow.appendChild(card);
      }
      box.appendChild(eggRow);
    } else {
      const mon = state.monsters[state.party[0]];
      const sp = SPECIES[mon.speciesId];
      const em = ELEMENT_META[sp.element];
      const rm = RARITY_META[monRarityOf(mon)];
      const sk = SKILLS[sp.skillId];
      box.innerHTML = `<div class="starter-title" style="color:${rm.color}">${"★".repeat(rm.stars)} ${rm.label}が 生まれた!</div>`;
      const card = document.createElement("div");
      card.className = "starter-card starter-result";
      card.style.setProperty("--starter-color", rm.color);
      card.appendChild(spriteCanvas(monSpriteOf(mon), 84, monHue(mon)));
      const info = document.createElement("div");
      info.className = "starter-info";
      info.innerHTML =
        `<b style="color:${rm.color}">${sp.name}</b>` +
        (mon.shiny ? `<span class="starter-badge">✦色違い</span>` : "") +
        (mon.awakening > 0 ? `<span class="starter-badge awk">⚡覚醒${mon.awakening}</span>` : "") +
        `<span class="elem-chip" style="color:${em.color};border-color:${em.color}">${em.label}</span>` +
        `<small>攻撃 ${sp.baseAtk} ・ HP ${sp.baseHp}</small>` +
        `<span class="starter-skill" style="border-color:${em.color}44">` +
        `<b style="color:${sk.active.color}">✦ ${sk.name}</b><br>${sk.desc}</span>`;
      card.appendChild(info);
      box.appendChild(card);
      // ステータス・詳細ステータス・個体値(通常の孵化結果と同じ見せ方 2026-07-09)
      const atkSpeedBonus = equipStat(mon, "atkSpeed") + perkStat(mon, "atkSpeed");
      const attacksPerSec = 1 + Math.min(0.6, atkSpeedBonus);
      const stats = document.createElement("div");
      stats.className = "starter-stats";
      const ivRow = (label, v) => ivBarHtml(label, v ?? 1);
      stats.innerHTML =
        `<div class="hc-statlist">` +
        `<div class="sheet-row"><span>攻撃力</span><b>${formatNum(Math.round(monsterAtk(mon)))}</b></div>` +
        `<div class="sheet-row"><span>最大HP</span><b>${formatNum(monsterMaxHp(mon))}</b></div>` +
        `<div class="sheet-row"><span>総合戦力</span><b style="color:#ffe9a8">${formatNum(powerScore(mon))}</b></div>` +
        `</div>` +
        `<div class="iv-head">個体値(全ステータス)${ivRankHtml(mon.iv)}</div>` +
        `<div class="iv-compact">` +
        ivRow("攻撃", mon.iv.atk) + ivRow("HP", mon.iv.hp) + ivRow("防御", mon.iv.def) +
        ivRow("会心", mon.iv.crit) + ivRow("速度", mon.iv.spd) +
        `</div>`;
      box.appendChild(stats);
      const go = document.createElement("button");
      go.className = "starter-hatch-btn";
      go.textContent = `この子と 冒険する!`;
      go.addEventListener("click", () => {
        ov.remove();
        renderDetail(currentDetailId);
        if (openOrder.includes("box")) renderBox();
        renderHud();
        toast(`${sp.name} と 冒険をはじめる!`, em.color);
        // まずはミッションへ誘導(2026-08-01 Haru指示「ミッションをベースに進める」)。
        // v4(2026-08-04 Haru指示「閉じるボタンを押すまで開いておいて」): 自動で消える
        // バナー(celebrateLoot=約2秒)だと読み終わる前に消えるので、専用オーバーレイに変更。
        // 閉じるとミッション窓が正面に来る(窓は先に開けておく)
        openWindow("mission");
        const intro = document.createElement("div");
        intro.className = "feed-overlay mission-intro-overlay";
        const ibox = document.createElement("div");
        ibox.className = "feed-box evolve-box mission-intro-box";
        ibox.innerHTML =
          `<div class="evolve-title">📋 まずはミッションを進めよう!</div>` +
          `<div class="mission-intro-body">画面下の📋ミッションが冒険のガイド。<br>` +
          `順番にこなすと 遊び方も報酬も 全部手に入る。<br>` +
          `<small>クエストにカーソルを合わせると やり方が出るよ</small></div>`;
        const closeBtn = document.createElement("button");
        closeBtn.className = "compound-do mission-intro-close";
        closeBtn.textContent = "閉じる";
        closeBtn.addEventListener("click", () => {
          intro.remove();
          showWorldFeatureIntro();
        });
        ibox.appendChild(closeBtn);
        intro.appendChild(ibox);
        document.body.appendChild(intro);
        save();
      });
      box.appendChild(go);
    }
  };
  render(state.starterChosen ? "hatched" : "egg");
  ov.appendChild(box);
  document.body.appendChild(ov);
}

// ゲーム開始時のお楽しみ紹介(2026-08-10 Haru指示「ゲーム開始時にこのゲームの面白い
// 要素を紹介してほしい」)。ミッション導入の直後、新規プレイヤーにだけ1回。
// 孵化直後に出る hc-intro(ジョブ/属性/覚醒/個体値/進化2択)とは狙いが別:
// あちらは「今すぐ触る操作の基礎」、こちらは「この先ずっと楽しめる収集・育成の奥行き」を
// 見せて期待値を上げる導線。以後は state.worldIntroShown で二度と出さない
function showWorldFeatureIntro() {
  if (state.worldIntroShown) return;
  state.worldIntroShown = true;
  save();
  const intro = document.createElement("div");
  intro.className = "feed-overlay world-intro-overlay";
  const ibox = document.createElement("div");
  ibox.className = "feed-box evolve-box world-intro-box";
  ibox.innerHTML =
    `<div class="evolve-title">✨ タスモンはここが熱い!</div>` +
    `<div class="hc-intro">` +
    `<div class="hc-intro-row">🌱 2段階進化。進化のたびに正統進化とランダム進化の分かれ道がある</div>` +
    `<div class="hc-intro-row">🎭 ランダム進化はレア職・隠し職への大当たり。限定スキル持ちのオリジナルキャラになる</div>` +
    `<div class="hc-intro-row">⚔ 宝箱にはごくまれにユニーク装備が眠る。専用アート+固有能力つき</div>` +
    `<div class="hc-intro-row">⚡ 同じ個体を重ねる(配合)ほど覚醒が進み、さらに強くなる</div>` +
    `<div class="hc-intro-row">✨ ごくまれに色違いのタスモンも生まれる。見た目が特別な1体</div>` +
    `<div class="hc-intro-row">🌀 覚えるスキルにも、隠されたレアスキルがある</div>` +
    `<div class="hc-intro-row">🎁 毎日のデイリーボスからは、レアなコインがドロップすることも</div>` +
    `</div>`;
  const closeBtn = document.createElement("button");
  closeBtn.className = "compound-do mission-intro-close";
  closeBtn.textContent = "冒険をはじめる!";
  closeBtn.addEventListener("click", () => intro.remove());
  ibox.appendChild(closeBtn);
  intro.appendChild(ibox);
  document.body.appendChild(intro);
}

// はじめてのプレイ: 卵の孵化 → みじかい導入ガイド(新規データのときだけ)
if (!state.starterChosen && state.totalKills < KILLS_PER_STAGE) showStarterPicker();
if (state.totalKills === 0 && state.stage === 1) {
  setTimeout(() => toast("ようこそ! タスモンは自動で戦い、卵と宝箱を拾ってくる", "#ffe9a8"), 1500);
  setTimeout(() => toast("🥚 卵はとても貴重。拾ったらクリックで孵化 → 大切に育てよう", "#ffe9a8"), 8000);
  setTimeout(() => toast("拠点は「英雄」ウィンドウ。下の丸いアイコンから全画面へ", "#ffe9a8"), 15000);
  setTimeout(() => toast("x-10は「幕ボスの間」。宝箱から出る🗝で入場、勝てば高レア確定のボス箱!", "#ffe9a8"), 23000);
}

// 開発用: 戦闘のライブ状態を覗くフック(プレビューのpreview_evalから使う)
// UIスキン切替(検証用。承認後に設定トグルへ)。__skin('metaphor') / __skin('off')
window.__skin = (name = "metaphor") => {
  document.body.dataset.skin = name === "off" ? "" : name;
  return document.body.dataset.skin || "(既定)";
};

// 全窓オープンのレンダラースモーク(2026-07-13 FB「バグ発見をこっちにやらせないで」)。
// 全てのウィンドウ+パーティ窓の全タブ+合成/調合の全モードを順に開き、
// 途中で出た例外を配列で返す。リリース前チェックとプレビュー検証の標準ゲート。
// 調合ビューを選択済み状態で開くデバッグフック(smoke内でしか再現しない
// オーバーフローを外から精査するため 2026-07-16)
// 任意の窓を開く(ストア用スクショ撮影 tools/capture-screenshots.js が使う)。
// 他の窓を閉じてから開くので、撮りたい窓だけが写る
window.__applyUiScale = applyUiScale; // 検証ハーネス用(表示サイズの実機検査)
window.__debugOpenWindow = (id, { solo = true } = {}) => {
  if (solo) for (const w of [...openOrder]) closeWindow(w);
  openWindow(id, { force: true });
};
// 覚醒の儀を「対象+素材が入った状態」で開く(撮影用)。
// ※openWindow("compound") は開くたびに選択をクリアする仕様なので、
//   必ず「開いてから」代入して再描画すること(順序を逆にすると空欄のままになる)
window.__debugOpenRitual = () => {
  const ids = Object.keys(state.monsters).filter((id) => !state.party.includes(id));
  if (ids.length < 3) return false;
  compoundMode = "ritual";
  openWindow("compound"); // ← ここで選択がクリアされる
  compoundBaseId = ids[0];
  ritualFoodIds.clear();
  for (const id of ids.slice(1, 3)) ritualFoodIds.add(id);
  renderCompound();
  renderBox();
  return true;
};
// 細工の実機検査用: ヘル解放+ゴールド付与+装備を1個セットして細工モードで開く
window.__debugOpenEnhance = () => {
  state.bossClearedD = state.bossClearedD ?? [];
  state.bossClearedD[0] = Math.max(state.bossClearedD[0] ?? 0, STAGES_PER_DIFFICULTY);
  state.bossClearedD[1] = Math.max(state.bossClearedD[1] ?? 0, STAGES_PER_DIFFICULTY);
  state.gold = Math.max(state.gold, 1_000_000_000);
  cubeMode = "enhance";
  openWindow("cube", { force: true });
  // 検査用: 細工できるレア度(イモータル以上)の装備を必ず1個用意する
  let anyItem = [
    ...state.items, ...state.storage,
    ...Object.values(state.monsters).flatMap((m) => m.equipment ?? []),
  ].find((it) => enhanceSlotsOf(it).length > 0);
  if (!anyItem) {
    anyItem = rollItemOfRarity("beyond", Math.random, 10);
    state.items.push(anyItem);
  }
  cubeSel = [anyItem.id];
  renderCube();
  renderHud();
  return cubeSel.length === 1;
};
window.__debugOpenCompound = (mode) => {
  const monIds = Object.keys(state.monsters);
  compoundMode = mode;
  openWindow("compound");
  if (mode === "feed" && monIds.length >= 2) {
    compoundBaseId = monIds[0];
    feedSelId = monIds[1];
  }
  renderCompound();
};
// スキン全種×全窓のはみ出し検査(2026-07-20 FB「有料UIでパスの文字がはみ出てる。
// こういうバグはもう二度とないように監視しなかったか」への恒久対応)。
// 従来のoverflow検査は「いま適用中のスキン+開いている窓」しか見ておらず、
// スキンの太枠(左右16px×2)で狭くなった窓の崩れを素通しした。
// 以後、UI/スキン変更の出荷ゲートは __auditSkins()===[] を必須とする(CLAUDE.md)
window.__auditSkins = async () => {
  const offenders = new Set();
  const orig = document.body.dataset.skin;
  const skins = ["metaphor", "royal-crimson", "blue-glass", "woodcut", "neon-tech", "baroque"];
  try {
    for (const skin of skins) {
      document.body.dataset.skin = skin;
      for (const id of Object.keys(windows)) {
        try {
          openWindow(id, { force: true });
          await Promise.resolve();
          for (const o of window.__scanOverflow()) offenders.add(`${skin}: ${o.path} "${o.text}"`);
        } catch (e) {
          offenders.add(`${skin}:${id}: ${String(e).slice(0, 160)}`);
        }
      }
    }
  } finally {
    document.body.dataset.skin = orig;
  }
  return [...offenders];
};

window.__smokeOpenAll = async () => {
  const errs = [];
  const onErr = (e) => errs.push(String(e.error?.stack ?? e.message ?? e.reason).slice(0, 300));
  window.addEventListener("error", onErr);
  window.addEventListener("unhandledrejection", onErr);
  // setTimeoutはバックグラウンドタブで1秒に間引かれるためマイクロタスクで進める
  const pause = () => Promise.resolve();
  try {
    document.querySelector("#starter-overlay")?.remove();
    for (const id of Object.keys(windows)) {
      try {
        openWindow(id, { force: true }); // スモークは解放状態に関わらず全窓を検査
        await pause();
      } catch (e) {
        errs.push(`window:${id}: ${String(e?.stack ?? e).slice(0, 300)}`);
      }
    }
    // パーティ窓の全タブ
    for (const tab of ["inv", "skill", "sphere", "party", "news", "mail", "stat"]) {
      try {
        heroTab = tab;
        renderDetail(currentDetailId ?? state.party[0]);
        await pause();
      } catch (e) {
        errs.push(`heroTab:${tab}: ${String(e?.stack ?? e).slice(0, 300)}`);
      }
    }
    // 調合の全モード(選択済み状態も再現してレイアウト崩れを踏む 2026-07-13 FB)
    const monIds = Object.keys(state.monsters);
    for (const m of ["feed", "convert", "ritual", "gacha"]) {
      try {
        compoundMode = m;
        openWindow("compound");
        if (m === "feed" && monIds.length >= 2) {
          compoundBaseId = monIds[0];
          feedSelId = monIds[1];
        } else if (m === "ritual" && monIds.length >= 2) {
          compoundBaseId = monIds[0];
          ritualFoodIds.add(monIds[1]);
        } else if (m === "convert" && monIds.length >= 1) {
          convSelId = monIds[0];
        }
        renderCompound();
        await pause();
        // 選択済み状態のままレイアウト崩れも検査(2026-07-13 FB)
        for (const o of window.__scanOverflow()) {
          errs.push(`overflow(compound:${m}): ${o.path} "${o.text}"`);
        }
      } catch (e) {
        errs.push(`compound:${m}: ${String(e?.stack ?? e).slice(0, 300)}`);
      }
    }
    // 後始末(選択を残さない)
    compoundBaseId = null;
    feedSelId = null;
    convSelId = null;
    ritualFoodIds.clear();
    // 合成の全モード+全帯
    for (const m of ["craft", "craftCharm", "alchemy", "enhance"]) {
      try {
        cubeMode = m;
        openWindow("cube");
        renderCube();
        await pause();
      } catch (e) {
        errs.push(`cube:${m}: ${String(e?.stack ?? e).slice(0, 300)}`);
      }
    }
    for (let b = 0; b < CRAFT_BANDS.length; b++) {
      try {
        cubeMode = "craft";
        cubeBand = b;
        renderCube();
        await pause();
      } catch (e) {
        errs.push(`cubeBand:${b}: ${String(e?.stack ?? e).slice(0, 300)}`);
      }
    }
  } finally {
    window.removeEventListener("error", onErr);
    window.removeEventListener("unhandledrejection", onErr);
  }
  return errs;
};

// テキストはみ出しの自動検出(2026-07-13 FB「初歩的な指摘を今後一切させないように
// チェックしろ」)。開いているウィンドウ内で「overflowがvisibleなのに中身が横に
// あふれている」要素を列挙する。__smokeOpenAllとセットで出荷前ゲートに使う。
// 崩れの犯人を特定できる名前を作る。class無しの要素が全部「DIV」になると、
// 指摘を読んでも場所が分からない(2026-07-29: meyasu-panel>DIV の特定に手間取った)
const elLabel = (el) =>
  (el.id ? `#${el.id}` : "") + (el.className || (el.id ? "" : el.tagName));

window.__scanOverflow = () => {
  const offenders = [];
  // #battle-panel は .window を持たない(常時表示のため)ので明示的に足す。
  // 2026-07-22 FB「英語版でバトル窓の相性とWaveがかぶってる」の原因はこれ —
  // バトル窓だけ全検査の対象外で、崩れがまるごと素通しになっていた
  for (const panel of document.querySelectorAll(".window:not(.hidden), #bar, #battle-panel")) {
    // パネル自身の横あふれ(タスクバーのタブ列が右へ突き抜ける等 2026-07-20 FB)
    if (panel.scrollWidth > panel.clientWidth + 4) {
      offenders.push({
        path: `${panel.id || panel.className}(パネル横あふれ)`,
        text: "", over: panel.scrollWidth - panel.clientWidth,
      });
    }
    // 窓タイトルの中央ずれ(2026-07-21 FB「タイトル全部中央ぞろえに」。win-iconsの挿入で
    // 中央ぞろえが壊れていた事故の再発防止)。letter-spacingの末尾ぶん(±7px)は許容
    const wt = panel.querySelector(".win-header .win-title");
    if (wt) {
      const hr = wt.parentElement.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(wt);
      const tr = range.getBoundingClientRect();
      const off = tr.left + tr.width / 2 - (hr.left + hr.width / 2);
      if (hr.width > 0 && Math.abs(off) > 8) {
        offenders.push({ path: `${panel.id || panel.className}>win-title(中央ずれ)`, text: wt.textContent.trim().slice(0, 20), over: Math.round(off) });
      }
      // タイトルと機能ボタン(左上アイコン/図鑑/ゴールド/×)の重なり(2026-07-21 EN指摘:
      // autoマージンの折半でボタンが中央へ来た事故。中央ずれ検査だけでは素通しした)
      for (const sib of wt.parentElement.querySelectorAll(".win-icons, .win-close, .win-dex, .hero-gold")) {
        const sr = sib.getBoundingClientRect();
        const ox = Math.min(tr.right, sr.right) - Math.max(tr.left, sr.left);
        if (sr.width > 0 && ox > 2) {
          offenders.push({ path: `${panel.id || panel.className}>win-title(重なり:${sib.className.toString().slice(0, 12)})`, text: wt.textContent.trim().slice(0, 20), over: Math.round(ox) });
          break;
        }
      }
    }
    // 窓の底を突き抜ける縦はみ出し(2026-07-20 FB: パス窓の説明文が窓の外に描かれた。
    // 従来の検査は横方向と縦落ちだけで、これを素通しした)。スクロール容器の中は
    // クリップされるので対象外
    if (panel.id !== "bar") {
      const pr = panel.getBoundingClientRect();
      for (const el of panel.querySelectorAll("*")) {
        if (!el.textContent?.trim() && el.children.length === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.position === "absolute" || cs.position === "fixed" || cs.display === "none") continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.bottom <= pr.bottom + 6) continue;
        // スクロール/クリップする先祖の中身は見た目上はみ出さない
        let clipped = false;
        for (let a = el.parentElement; a && a !== panel; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflowY !== "visible" || acs.overflow === "hidden") { clipped = true; break; }
        }
        if (clipped) continue;
        const path = `${panel.id || panel.className}>${elLabel(el)}(縦はみ出し)`;
        if (!offenders.some((o) => o.path === path)) {
          offenders.push({ path, text: (el.textContent ?? "").trim().slice(0, 40), over: Math.round(r.bottom - pr.bottom) });
        }
        break; // 1窓1件で十分(最初の犯人を直せば連鎖も直る)
      }
      // 窓の右端(額縁の内側)を突き抜ける横はみ出し(2026-07-21 FB: 倉庫の＋枠チップが
      // 額縁を突き抜けた。要素単体のscrollWidth検査は子の多い容器を除外していて素通し)
      const pcs = getComputedStyle(panel);
      const rightEdge = pr.right - (parseFloat(pcs.borderRightWidth) || 0);
      for (const el of panel.querySelectorAll("*")) {
        if (!el.textContent?.trim() && el.children.length === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.position === "absolute" || cs.position === "fixed" || cs.display === "none") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.right <= rightEdge + 6) continue;
        let clippedX = false;
        for (let a = el.parentElement; a && a !== panel; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflowX !== "visible" || acs.overflow === "hidden") { clippedX = true; break; }
        }
        if (clippedX) continue;
        const path = `${panel.id || panel.className}>${elLabel(el)}(横突き抜け)`;
        if (!offenders.some((o) => o.path === path)) {
          offenders.push({ path, text: (el.textContent ?? "").trim().slice(0, 40), over: Math.round(r.right - rightEdge) });
        }
        break;
      }
      // 絶対配置オーバーレイ同士の重なり(2026-07-22 FB「英語版でバトル窓の相性と
      // Waveがかぶってる」)。左上の#battle-stageと右上の#type-mini-roleのように
      // 左右から伸びる別々の絶対配置が、語長の増えるENで衝突する。
      // 従来の検査は「親からのはみ出し」しか見ておらず、兄弟同士の衝突を素通しした
      {
        const abs = [...panel.querySelectorAll("*")].filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.position !== "absolute" || cs.display === "none" || cs.visibility === "hidden") return false;
          if ((cs.opacity ?? "1") === "0") return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && el.textContent?.trim();
        });
        for (let i = 0; i < abs.length; i++) {
          for (let j = i + 1; j < abs.length; j++) {
            // 入れ子(片方がもう片方の子孫)は重なって当然なので除外
            if (abs[i].contains(abs[j]) || abs[j].contains(abs[i])) continue;
            const a = abs[i].getBoundingClientRect();
            const b = abs[j].getBoundingClientRect();
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (ox <= 2 || oy <= 2) continue;
            const nameOf = (el) => el.id || String(el.className).split(" ")[0] || el.tagName;
            const path = `${panel.id || panel.className}>${nameOf(abs[i])}×${nameOf(abs[j])}(オーバーレイ重なり)`;
            if (!offenders.some((o) => o.path === path)) {
              offenders.push({ path, text: (abs[i].textContent ?? "").trim().slice(0, 24), over: Math.round(ox) });
            }
          }
        }
      }
      // flexの縮みで子が押し潰されて中身が重なる(2026-07-21 FB「覚醒にキャラ入れたら
      // めっちゃバグってる」: overflow列の子はflex-shrink:0が無いと縮んで重なり合う)
      for (const cont of panel.querySelectorAll("*")) {
        const ccs = getComputedStyle(cont);
        if (ccs.display !== "flex" || ccs.flexDirection !== "column" || ccs.overflowY === "visible") continue;
        let found = false;
        for (const ch of cont.children) {
          const chcs = getComputedStyle(ch);
          if (chcs.position === "absolute" || chcs.overflowY !== "visible") continue;
          if (ch.clientHeight > 0 && ch.clientHeight + 8 < ch.scrollHeight) {
            const path = `${panel.id || panel.className}>${ch.className || ch.tagName}(押し潰れ)`;
            if (!offenders.some((o) => o.path === path)) {
              offenders.push({ path, text: (ch.textContent ?? "").trim().slice(0, 40), over: ch.scrollHeight - ch.clientHeight });
            }
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
    for (const el of panel.querySelectorAll("*")) {
      if (!el.textContent?.trim() || el.children.length > 3) continue;
      const cs = getComputedStyle(el);
      if (cs.overflowX !== "visible" || cs.position === "absolute") continue;
      // 縦落ち検出(2026-07-13 FB): 文字が1〜2文字ずつ縦に折れる=幅がフォントの
      // 2.2文字ぶん未満なのに複数文字を折返しで詰め込んでいる要素
      const fs = parseFloat(cs.fontSize) || 12;
      const txt = el.textContent.trim();
      if (
        cs.whiteSpace !== "nowrap" &&
        el.children.length === 0 &&
        txt.length >= 3 &&
        el.clientWidth > 0 &&
        el.clientWidth < fs * 2.2 &&
        el.scrollHeight > fs * 2.5
      ) {
        const path = `${panel.id || panel.className}>${elLabel(el)}(縦落ち)`;
        if (!offenders.some((o) => o.path === path))
          offenders.push({ path, text: txt.slice(0, 30), over: -1 });
        continue;
      }
      if (el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0) {
        // はみ出しの原因が「意図的なコーナー重ね(position:absoluteの子)」だけなら正常
        const sticking = [...el.children].filter((c) => {
          const r = c.getBoundingClientRect();
          const pr = el.getBoundingClientRect();
          return r.right > pr.right + 2 || r.left < pr.left - 2;
        });
        if (sticking.length > 0 && sticking.every((c) => getComputedStyle(c).position === "absolute")) continue;
        const path = `${panel.id || panel.className}>${elLabel(el)}`;
        if (!offenders.some((o) => o.path === path))
          offenders.push({ path, text: el.textContent.trim().slice(0, 40), over: el.scrollWidth - el.clientWidth });
      }
    }
  }
  return offenders;
};

window.__battleDebug = () => ({
  scene, // ライブ参照(scene.castSkill(...)などをプレビューから直接呼べる)
  state, // ライブ参照(テスト用: モンスター注入→renderBreed()等で検証できる)
  enhanceRollSlot, // ライブ参照(細工ヘルパーの指定スロット抽選用)
  renderCube, // ライブ参照(細工画面の再描画用)
  renderBreed, // ライブ参照(配合ウィンドウの再描画)
  renderHud, // ライブ参照(HUD・宝箱チップの再描画。テスト検証用)
  closeWindow, // ライブ参照(自動化後にアイテム窓を閉じる)
  windowManager, // ライブ参照(自動化の一時窓をスコープ管理)
  windowState: () => ({
    openOrder: [...openOrder],
    visible: Object.entries(windows).filter(([, el]) => !el.classList.contains("hidden")).map(([id]) => id),
    leases: windowManager.snapshot(),
  }),
  scene, // ライブ参照(戦闘演出の実機検査用: verify-battle-flash)
  openChestOfKind, // ライブ参照(宝箱一括開封のテスト用)
  enemyGroup: [...enemyGroup],
  waveVariants: [...waveVariants],
  bossWave,
  dailyBossActive,
  playerHp,
  hatching,
  atkBuff: { ...atkBuff },
  defBuff: { ...defBuff },
  playerAttackTimer,
  enemyAttackTimer,
  killsInStage: state.killsInStage,
  totalKills: state.totalKills,
  stage: state.stage,
  difficulty: state.difficulty,
  coins: { ...(state.coins ?? {}) },
  bossKeys: bossKeyCount(state, null),
  dailyBossUsed: { ...(state.dailyBossUsed ?? {}) },
  gold: state.gold,
  eggDrop: eggDropBreakdown(state),
});

// ---- 透明部分のクリック素通し ----
// Electronウィンドウは常に全高。UI要素の上ではマウスを受け、
// なにもない透明部分では下のウィンドウ(デスクトップ等)へクリックを通す。
// クリック素通しの判定はメイン側のカーソルポーリングに移管(2026-08-01)。
// レンダラは「操作を受けたいUIの矩形」を送るだけ。gBCRはzoom込みの見た目座標=
// ウィンドウ内DIPと一致するのでそのまま送れる
function reportUiRects() {
  // 2026-08-12 Haru報告「窓を閉じてバーだけにしても、見えない何かが後ろのアプリを
  // 触らせない」: #tooltip と .toast/#toast だけ他のセレクタと違って:not(.hidden)が
  // 抜けていた。ツールチップは「ホバー中の要素が再描画やアニメーションでDOMごと消える」
  // (親をdisplay:noneにする窓クローズ含む)と、その瞬間だけmouseleaveが発火せず
  // hideTooltip()が一生呼ばれない=.hiddenが付かないまま古い座標のrectを報告し続ける
  // (ブラウザの仕様: 祖先へのdisplay:none適用や要素の破棄はmouseleave/mouseoutを
  // 保証しない)。結果、その矩形の上だけクリックがElectron側に食われたままになる。
  // 他の全セレクタと同じく:not(.hidden)を必須にして、消し忘れが起きても
  // 「見た目上hiddenでないものだけ」を数える(closeWindow側の後始末も別途強化する)
  const sels = [
    "#bar",
    "#battle-panel:not(.hidden)",
    ".window:not(.hidden)",
    "#sys-menu:not(.hidden)",
    "#msg-history:not(.hidden)",
    "#type-chart:not(.hidden)",
    "#tooltip:not(.hidden)",
    ".toast:not(.hidden), #toast:not(.hidden)",
    // ステージ結果(戦闘結果/履歴。2026-08-12 バグ報告「閉じるが効かない・スクロールで
    // 固まる」)。#stage-resultの背景はCSSでpointer-events:noneにして下の画面を
    // 素通しにしているので、実際に触れる矩形は中の.sr-card(閉じるボタン・履歴一覧)
    // だけ。ここに無かったため、この矩形はメイン側の当たり判定に一度も乗らず、
    // クリックが常に背後(裏に開いていた別窓や、無ければデスクトップ)へ抜けていた
    "#stage-result:not(.hidden) .sr-card",
  ];
  const rects = [];
  for (const sel of sels) {
    for (const el of document.querySelectorAll(sel)) {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) rects.push({ l: b.left, t: b.top, r: b.right, b: b.bottom });
    }
  }
  // 全画面級のオーバーレイ(孵化・スターター・オフライン・演出)中は全域を受ける。
  // 窓のドラッグ中も同じ扱い(dragActive): 矩形の更新は250ms周期なので、速く動かすと
  // カーソルが古い矩形の外へ出て素通しに入り、ドラッグが途中で死ぬ(2026-08-05 実犯)
  const full =
    dragActive ||
    !!document.querySelector(
      "#hatch-overlay:not(.hidden), #starter-overlay, .feed-overlay, .loot-banner, .cmp-help-overlay",
    );
  window.__uiRectsFull = full; // ゲートが「ドラッグ中は全域を受ける」を確認する
  window.appControl?.sendUiRects({ rects, full });
}
setInterval(reportUiRects, 250); // 窓の開閉・ドラッグ・ズームすべてに250ms以内で追従
reportUiRects();

// ---- 初期描画 ----
initAudioOnGesture(); // 最初のクリックでサウンド起動(ブラウザのautoplay制限対応)
document.body.dataset.invsize = state.settings.invSize ?? "m";
renderEggs();
renderBox();
renderHud();
if (offline) {
  // 起動時ポップアップ(2026-07-28 FB「オフライン時の仕様の説明と、起動時に
  // オフライン報酬のポップアップを出して」)。トーストは3秒で消えて読み逃すので、
  // 成果は1枚のカードで見せて、仕様の説明も同じ場所に常設する
  const mins = Math.round(offline.elapsed / 60000);
  const hrs = Math.floor(mins / 60);
  const durText = hrs > 0 ? `${hrs}時間${mins % 60}分` : `${mins}分`;
  const capped = offline.elapsed >= OFFLINE_CAP_MS;
  const overlay = document.createElement("div");
  overlay.className = "feed-overlay offline-overlay";
  const box = document.createElement("div");
  box.className = "feed-box evolve-box";
  box.innerHTML =
    `<div class="evolve-title">おかえりなさい!</div>` +
    `<div class="offline-report">` +
    `<div class="offline-row"><span>離れていた時間</span><b>${durText}${capped ? "(上限)" : ""}</b></div>` +
    `<div class="offline-row"><span>倒した数</span><b>${formatNum(offline.kills)}体</b></div>` +
    `<div class="offline-row offline-gain"><span>経験値</span><b>+${formatNum(offline.exp)}</b></div>` +
    `</div>` +
    `<div class="evolve-note">オフラインの間は<b>経験値だけ</b>が貯まる(最大12時間分)。<br>` +
    `ゴールド・卵・宝箱・コインは、ゲームを開いている間だけ手に入る。</div>`;
  const ok = document.createElement("button");
  ok.className = "compound-do";
  ok.textContent = "受け取る";
  ok.addEventListener("click", () => overlay.remove());
  box.appendChild(ok);
  overlay.appendChild(box);
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// ---- 今週のアップデート発表(2026-07-11) ----
// content-pack の season 印(自動アップデートの生成物)から、最新週の分を起動時に1枚で発表する。
// 一度見た週は localStorage に記録して再表示しない(セーブデータには触れない)。
const SEASON_SEEN_KEY = "taskbar-idle-rpg-last-season";
function maybeShowUpdateNews() {
  try {
    if (!LATEST_SEASON) return;
    if (!state?.starterChosen) return; // 初回起動はスターター選択を優先(次回起動で出る)
    if (localStorage.getItem(SEASON_SEEN_KEY) === LATEST_SEASON) return;
    const items = UPDATE_FEED.filter((i) => i.season === LATEST_SEASON);
    if (items.length === 0) return;
    localStorage.setItem(SEASON_SEEN_KEY, LATEST_SEASON);
    const overlay = document.createElement("div");
    overlay.className = "feed-overlay update-news";
    const box = document.createElement("div");
    box.className = "feed-box evo-box";
    box.innerHTML =
      `<div class="evolve-title">📢 今週のアップデート <small class="un-season">${LATEST_SEASON}</small></div>` +
      `<div class="un-note">新しいコンテンツが届きました!</div>` +
      `<div class="un-list">` +
      items.map((i) => `<div class="un-row"><span class="un-ico">${i.icon}</span><span>${i.text}</span></div>`).join("") +
      `</div>`;
    const ok = document.createElement("button");
    ok.className = "compound-do evo-ok";
    ok.textContent = "あそぶ!";
    ok.addEventListener("click", () => overlay.remove());
    box.appendChild(ok);
    overlay.appendChild(box);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  } catch {
    // 発表はおまけ。失敗してもゲーム起動は止めない
  }
}
setTimeout(maybeShowUpdateNews, 1200); // 起動描画が落ち着いてから

// 目安箱の送信箱を再送(2026-07-21)。サーバー接続前・ネットワーク断で送れなかった
// 投稿を、起動のたびに静かに flush する(1件/日制限に当たったら翌日へ持ち越し)。
// fire-and-forget: 失敗してもゲームには何も出さない
setTimeout(() => {
  flushMeyasuOutbox().catch(() => {});
}, 3000);

// 運営プレゼント(2026-08-09): 起動のたびに未受け取り分を静かに取得する。
// fire-and-forget: サーバー未接続・ネットワーク断でもゲームは通常どおり遊べる
setTimeout(() => {
  refreshGifts().catch(() => {});
}, 3500);

// 試用システム(2026-07-22): 不採用の試用コンテンツをロード時に回収した場合の
// 補償のお知らせ(1回だけ)。黙って消すと「消えた!」の混乱になるので必ず見せる
if (state.trialReapNotice) {
  const r = state.trialReapNotice;
  delete state.trialReapNotice;
  setTimeout(() => {
    toast(
      `🧪 試用が終了した内容を回収した(装備${r.items}個・タスモン${r.mons}体) → 補償 +${formatGold(r.gold)}G`,
      "#ffe9a8",
    );
    save();
  }, 2000);
}
