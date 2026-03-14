const gameState = {
  Name: "WIP",
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
};
let adventureTest = {};
var rollTimes = 0;
//elements

const GP = document.getElementById("GP");
const str = document.getElementById("str");
const dex = document.getElementById("dex");
const con = document.getElementById("con");
const int = document.getElementById("int");
const wis = document.getElementById("wis");
const cha = document.getElementById("cha");
const options = document.getElementById("options");
const dmgDice = document.getElementById("dmgDice");
const classState = document.getElementById("class");
const question = document.getElementById("question");
const creation = document.getElementById("creation");
const inventory = document.getElementById("inventory");
const armorList = document.getElementById("armorList");
const adventureDiv = document.getElementById("adventure");
const finalBossDiv = document.getElementById("finalBoss");
const weaponsList = document.getElementById("weaponsList");
const utilitiesList = document.getElementById("utilitiesList");

//functions
function pageload() {
  adventureDiv.style.display = "none";
  finalBossDiv.style.display = "none";
}
function stateUpdate() {
  classState.innerText = `Class: ${gameState.Class}`;
  str.innerText = `Str: ${gameState.Stats.Str}`;
  dex.innerText = `Dex: ${gameState.Stats.Dex}`;
  con.innerText = `Con: ${gameState.Stats.Con}`;
  int.innerText = `Int: ${gameState.Stats.Int}`;
  wis.innerText = `Wis: ${gameState.Stats.Wis}`;
  cha.innerText = `Cha: ${gameState.Stats.Cha}`;
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
  rollTimes += 1;
  if (rollTimes == 3) {
    confirm();
    return;
  }
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
    li.textContent = item;
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

  const gpGain = parseInt(answer.GP || 0, 10);
  gameState.Inventory.GP = parseInt(gameState.Inventory.GP || 0, 10) + gpGain;
  gameState.currentStage = answer.next || gameState.currentStage;
  createButtons();
  const newStage = adventureTest[gameState.currentStage];
  question.innerText = newStage?.question || "";
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
function chooseWeapon(category) {
  // fetch the loot file and pick an item from the specified category
  return fetch("data/loot.json")
    .then((res) => res.json())
    .then((loot) => {
      const list = loot[category] || [];
      if (!list.length) return null;
      const randy = Math.floor(Math.random() * list.length);
      const item = list[randy];
      // add to inventory if it's a weapon
      if (!gameState.Inventory.weapons.includes(item)) {
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
