const gameState = {
  Name: "WIP",
  cHP: 0,
  mHP: 0,
  Class: "Choose one already",
  Stats: {
    Str: "You haven't rolled",
    Dex: "You haven't rolled",
    Con: "You haven't rolled",
    Int: "You haven't rolled",
    Wis: "You haven't rolled",
    Cha: "You haven't rolled",
  },
  Inventory: {
    armor: [],
    weapons: [],
    utility: [],
    GP: 0,
  },
  currentStage: "start",
  enemiesLeft: 0,
};
let adventureTest = {};
var rollsLeft = 2;
//elements

const GP = document.getElementById("GP");
const hp = document.getElementById("hp");
const str = document.getElementById("str");
const dex = document.getElementById("dex");
const con = document.getElementById("con");
const int = document.getElementById("int");
const wis = document.getElementById("wis");
const cha = document.getElementById("cha");
const options = document.getElementById("options");
const dmgDice = document.getElementById("dmgDice");
const classState = document.getElementById("class");
const battleDiv = document.getElementById("battle");
const question = document.getElementById("question");
const creation = document.getElementById("creation");
const inventory = document.getElementById("inventory");
const armorList = document.getElementById("armorList");
const rollsLeftEl = document.getElementById("rollsLeft");
const adventureDiv = document.getElementById("adventure");
const weaponsList = document.getElementById("weaponsList");
const utilitiesList = document.getElementById("utilitiesList");
const player_hp_value = document.getElementById("player-hp-value");
const enemy_hp_value = document.getElementById("enemy-hp-value");

//functions
function pageload() {
  document.getElementById("rollsLeft").innerText = `Rolls Left: ${rollsLeft}`;
  adventureDiv.style.display = "none";
  battleDiv.style.display = "none";
}
function stateUpdate() {
  classState.innerText = `Class: ${gameState.Class}`;
  str.innerText = `Str: ${gameState.Stats.Str}`;
  dex.innerText = `Dex: ${gameState.Stats.Dex}`;
  con.innerText = `Con: ${gameState.Stats.Con}`;
  int.innerText = `Int: ${gameState.Stats.Int}`;
  wis.innerText = `Wis: ${gameState.Stats.Wis}`;
  cha.innerText = `Cha: ${gameState.Stats.Cha}`;
  hp.innerText = `Hp: ${gameState.cHP}/${gameState.mHP}`;
  updateInven(weaponsList, gameState["Inventory"]["weapons"]);
  updateInven(armorList, gameState["Inventory"]["armor"]);
  updateInven(utilitiesList, gameState["Inventory"]["utility"]);
  GP.innerText = `GP: ${gameState.Inventory.GP}`;
}
function classChoose(classChosen) {
  console.log(classData[classChosen]);
  if (!classData[classChosen]) {
    console.log("yo that class dont be existing rn...dumb dumb");
    return;
  }
  gameState["mHP"] = classData[classChosen]["startStats"]["Hp"];
  gameState["cHP"] = classData[classChosen]["startStats"]["Hp"];
  gameState["Class"] = classData[classChosen]["classname"];
  gameState["Inventory"]["armor"] =
    classData[classChosen]["startItems"]["armor"];
  gameState["Inventory"]["weapons"] =
    classData[classChosen]["startItems"]["weapons"];
  gameState["Inventory"]["utility"] =
    classData[classChosen]["startItems"]["utility"];
  console.log(gameState);
  gameState["Inventory"]["GP"] = classData[classChosen]["startItems"]["GP"];
  stateUpdate();
}
//1 reroll wip
function rollStats() {
  rollsLeft -= 1;
  if (rollsLeft <= -1) {
    alert("You have no more rolls left, please confirm.");
    return;
  }
  document.getElementById("rollsLeft").innerText = `Rolls Left: ${rollsLeft}`;
  if (gameState["Class"] === "Choose one already") {
    alert("Please choose your class first, thank you for your cooperation.");
    return;
  }
  var allSums = [];
  for (let i = 0; i < 6; i += 1) {
    var allRolls = [];
    var sum = 0;
    for (let j = 0; j < 4; j += 1) {
      var number = Math.ceil(Math.random() * 6);
      sum += number;
      allRolls.push(number);
    }
    sum -= Math.min(...allRolls);
    allSums.push(sum);
    console.log(allSums);
  }
  assignStats(allSums.toSorted((a, b) => b - a));
}
function assignStats(sortStats) {
  console.log(sortStats);
  for (let i = 0; i < 6; i += 1) {
    gameState["Stats"][
      classData[gameState["Class"]]["startStats"]["priority"][i]
    ] = sortStats[i];
  }
  console.log(gameState);
  stateUpdate();
}
stateUpdate();
function updateInven(elements, items) {
  if (!elements) return;
  if (!Array.isArray(items) || items.length === 0) {
    elements.innerHTML = "";
    return;
  }
  elements.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    if (item && typeof item === "object") {
      li.textContent = item.name || JSON.stringify(item);
    } else {
      li.textContent = item;
    }
    elements.appendChild(li);
  });
}
function confirm() {
  if (gameState["Stats"]["Str"] === "You haven't rolled") {
    alert(
      "Please choose your class first and roll your stats, thank you for your cooperation.",
    );
    return;
  }
  // hide creation panel
  creation.style.display = "none";
  // move adventure into the creation grid area so it takes the place
  if (adventureDiv) {
    adventureDiv.style.display = "block";
    adventureDiv.style.gridArea = "creation";
  }
  startAdv();
  createButtons();
}

function startAdv() {
  question.innerText = adventureTest.start?.question || "";
}
function next(index) {
  const stage = adventureTest[gameState.currentStage];
  if (!stage) {
    console.error("Invalid currentStage:", gameState.currentStage);
    return;
  }
  const answer = stage.answers?.[index];
  if (!answer) {
    console.error(
      "Invalid answer index:",
      index,
      "for stage:",
      gameState.currentStage,
    );
    return;
  }
  if (stage.answers[index].battle) {
    showBattleUI();
    adventureDiv.style.display = "none";
  }
  const gpGain = parseInt(answer.GP || 0, 10);
  gameState.Inventory.GP = parseInt(gameState.Inventory.GP || 0, 10) + gpGain;
  gameState.currentStage = answer.next || gameState.currentStage;
  createButtons();
  const newStage = adventureTest[gameState.currentStage];
  question.innerText = newStage?.question || "";
  chooseWeapon();
  stateUpdate();
}
function createButtons() {
  // clear existing options
  options.innerHTML = "";

  const answers = adventureTest[gameState.currentStage]?.answers || [];
  answers.forEach((element, index) => {
    const button = document.createElement("button");
    button.innerText = element.option;
    button.onclick = () => next(index);
    options.appendChild(button);
  });
}

function chooseWeapon() {
  // fetch the loot file and pick an item from the specified category
  return fetch("data/loot.json")
    .then((res) => res.json())
    .then((loot) => {
      var cat = ["simpleWeapons", "martialWeapons"];
      var chosenCat = cat[Math.floor(Math.random() * cat.length)];
      const list = loot[chosenCat] || [];
      if (!list.length) return null;
      const randy = Math.floor(Math.random() * list.length);
      const item = list[randy];
      const itemName = item && typeof item === "object" ? item.name : item;
      const ownedNames = gameState.Inventory.weapons.map((w) =>
        w && typeof w === "object" ? w.name : w,
      );
      if (!ownedNames.includes(itemName)) {
        gameState.Inventory.weapons.push(item);
      }
      stateUpdate();
      return item;
    });
}

// load external JSON data used by the game
function loadGameData() {
  return Promise.all([
    fetch("data/classData.json").then((r) => r.json()),
    fetch("data/adventureTest.json").then((r) => r.json()),
  ])
    .then(([cd, at]) => {
      classData = cd;
      adventureTest = at;
      // refresh UI now that data is available
      stateUpdate();
    })
    .catch((err) => console.error("Failed to load game data:", err));
}
// start loading data immediately
loadGameData();

// create a single tooltip element for weapon hover
const _weaponTooltip = document.createElement("div");
_weaponTooltip.className = "weapon-tooltip";
_weaponTooltip.style.display = "none";
document.body.appendChild(_weaponTooltip);

function showWeaponTooltip(text, x, y) {
  _weaponTooltip.innerText = text;
  _weaponTooltip.style.display = "block";
  const offset = 12;
  // basic positioning; adjust if tooltip goes off-screen
  const tooltipRect = _weaponTooltip.getBoundingClientRect();
  let left = x + offset;
  let top = y + offset;
  if (left + tooltipRect.width > window.innerWidth) {
    left = x - tooltipRect.width - offset;
  }
  if (top + tooltipRect.height > window.innerHeight) {
    top = y - tooltipRect.height - offset;
  }
  _weaponTooltip.style.left = `${left}px`;
  _weaponTooltip.style.top = `${top}px`;
}

function hideWeaponTooltip() {
  _weaponTooltip.style.display = "none";
}

// ---------- Battle UI handlers (minimal placeholders) ----------
function attack() {
  const panel = document.getElementById("attackPanel");
  if (!panel) return;
  // toggle panel visibility
  if (panel.style.display === "none" || !panel.style.display) {
    panel.style.display = "flex";
  } else {
    panel.style.display = "none";
    return;
  }
  panel.innerHTML = "";
  const weapons = Array.isArray(gameState.Inventory.weapons)
    ? gameState.Inventory.weapons
    : [];
  if (weapons.length === 0) {
    const div = document.createElement("div");
    div.innerText = "No weapons available";
    panel.appendChild(div);
    return;
  }
  weapons.forEach((w, i) => {
    const name = w && typeof w === "object" ? w.name : w;
    const max =
      w && typeof w === "object"
        ? (w.max ?? w.maxDamage ?? w.dmg ?? "N/A")
        : "N/A";
    const btn = document.createElement("button");
    btn.className = "attack-weapon";
    btn.innerText = name;
    if (max !== "N/A") {
      // custom tooltip handlers
      btn.addEventListener("mouseenter", (e) =>
        showWeaponTooltip(`Max damage: ${max}`, e.pageX, e.pageY),
      );
      btn.addEventListener("mousemove", (e) =>
        showWeaponTooltip(`Max damage: ${max}`, e.pageX, e.pageY),
      );
      btn.addEventListener("mouseleave", hideWeaponTooltip);
    }
    btn.onclick = () => {
      performWeaponAttack(w);
    };
    panel.appendChild(btn);
  });
}
function showBattleUI() {
  if (!battleDiv) return;
  battleDiv.style.display = "flex";
  // ensure enemy state exists when showing the battle UI
  if (!gameState.enemy) {
    const enemyNameEl = document.getElementById("enemy-name");
    const defaultName = (enemyNameEl && enemyNameEl.innerText) || "Enemy";
    gameState.enemy = {
      name: defaultName,
      mHP: 20,
      cHP: 20,
    };
  }
  startBattle();
}

function hideBattleUI() {
  if (!battleDiv) return;
  battleDiv.style.display = "none";
}

function startBattle(index) {
  const stage = adventureTest[gameState.currentStage];
  battleUpdate();
  if (!stage.answers[index].battle) {
    return;
  } else if (stage.answers[index].battle == "Easy") {
    gameState.enemiesLeft = 1;
  } else if (stage.answers[index].battle == "Medium") {
    gameState.enemiesLeft = 2;
  } else if (stage.answers[index].battle == "Hard") {
    gameState.enemiesLeft = 3;
  }
}
function battleUpdate() {
  player_hp_value.innerText = `${gameState.cHP}/${gameState.mHP}`;
  if (enemy_hp_value && gameState.enemy) {
    enemy_hp_value.innerText = `${gameState.enemy.cHP}/${gameState.enemy.mHP}`;
  }
}

function rollWeaponDamage(weapon) {
  if (!weapon || typeof weapon !== "object") return null;
  const min = parseInt(weapon.min ?? weapon.minDamage ?? 1, 10);
  const max = parseInt(weapon.max ?? weapon.maxDamage ?? weapon.dmg ?? min, 10);
  if (Number.isNaN(min) || Number.isNaN(max) || max < min) return null;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function performWeaponAttack(weapon) {
  const dmg = rollWeaponDamage(weapon);
  if (dmg === null) {
    console.log("Weapon has no damage data");
    return;
  }
  if (!gameState.enemy) {
    console.log("No enemy set");
    return;
  }
  gameState.enemy.cHP = Math.max(0, gameState.enemy.cHP - dmg);
  battleUpdate();

  // show floating damage text near enemy
  const dmgEl = document.createElement("div");
  dmgEl.innerText = `-${dmg}`;
  dmgEl.style.position = "absolute";
  dmgEl.style.color = "#a33";
  dmgEl.style.fontWeight = "bold";
  dmgEl.style.left = window.innerWidth / 2 + 120 + "px"; // approximate near enemy panel
  dmgEl.style.top = window.innerHeight / 2 - 40 + "px";
  document.body.appendChild(dmgEl);
  setTimeout(() => dmgEl.remove(), 900);

  if (gameState.enemy.cHP <= 0) {
    enemyDefeated();
  }
}

function enemyDefeated() {
  console.log("Enemy defeated");
  // decrease enemiesLeft and hide battle UI if no enemies remain
  gameState.enemiesLeft = Math.max(0, (gameState.enemiesLeft || 0) - 1);
  const panel = document.getElementById("attackPanel");
  if (panel) panel.style.display = "none";
  // simple feedback: hide battle UI after short delay
  setTimeout(() => {
    hideBattleUI();
    // clear enemy state
    delete gameState.enemy;
  }, 800);
}
