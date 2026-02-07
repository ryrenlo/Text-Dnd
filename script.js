const gameState = {
  Name: "WIP",
  Class: "Choose one already",
  Stats: {
    Str: "You haven't rolled yet",
    Dex: "You haven't rolled yet",
    Con: "You haven't rolled yet",
    Int: "You haven't rolled yet",
    Wis: "You haven't rolled yet",
    Cha: "You haven't rolled yet",
  },
  Inventory: {
    armor: [],
    weapons: [],
    utility: [],
    GP: 0,
  },
  currentStage: "",
};

//Classes
const classData = {
  Rogue: {
    classname: "Rogue",
    startStats: {
      Hp: 8,
      Str: 0,
      Dex: 0,
      Con: 0,
      Int: 0,
      Wis: 0,
      Cha: 0,
      //priority for rogue 1.dex 2.con 3.cha 4.int 5.wis 6.str
    },
    startItems: {
      armor: ["Leather Armor"],
      weapons: ["Daggers", "Shortsword", "Shortbow"],
      utility: ["Thieves Tools"],
      GP: 8,
    },
  },
  Barbarian: {
    classname: "Barbarian",
    startStats: {
      Hp: 12,
      Str: 0,
      Dex: 0,
      Con: 0,
      Int: 0,
      Wis: 0,
      Cha: 0,
      //priority for barbarian 1.str 2.con 3.dex 4.wis 5.cha 6.int
    },
    startItems: {
      armor: [],
      weapons: ["Greataxe", "Handaxes"],
      utility: [],
      GP: 15,
    },
  },
  Bard: {
    classname: "Bard",
    startStats: {
      Hp: 8,
      Str: 0,
      Dex: 0,
      Con: 0,
      Int: 0,
      Wis: 0,
      Cha: 0,
      //priority for  1.Cha 2.Dex 3.Con 4.wis 5.int 6.str
    },
    startItems: {
      armor: ["Leather Armor"],
      weapons: ["Daggers", "Lute"],
      utility: [],
      GP: 19,
    },
  },
  Cleric: {
    classname: "Cleric",
    startStats: {
      Hp: 8,
      Str: 0,
      Dex: 0,
      Con: 0,
      Int: 0,
      Wis: 0,
      Cha: 0,
      //priority for  1.wis 2.con 3.dex 4.str 5.cha 6.int
    },
    startItems: {
      armor: ["Chain Skirt", "Shield"],
      weapons: ["Mace"],
      utility: [],
      GP: 7,
    },
  },
  Wizard: {
    classname: "Wizard",
    startStats: {
      Hp: 6,
      Str: 0,
      Dex: 0,
      Con: 0,
      Int: 0,
      Wis: 0,
      Cha: 0,
      //priority for  1.int 2.con 3.dex 4.wis 5.cha 6.str
    },
    startItems: {
      armor: [],
      weapons: ["Daggers", "Quarter Staff"],
      utility: ["Robe", "Spellbook"],
      GP: 5,
    },
  },
};
//elements
const classState = document.getElementById("class");
const str = document.getElementById("str");
const dex = document.getElementById("dex");
const con = document.getElementById("con");
const int = document.getElementById("int");
const wis = document.getElementById("wis");
const cha = document.getElementById("cha");
//const armorClass = document.getElementById("armorClass");
const dmgDice = document.getElementById("dmgDice");
const inventory = document.getElementById("inventory");
const armorList = document.getElementById("armorList");
const weaponsList = document.getElementById("weaponsList");
const utilitiesList = document.getElementById("utilitiesList");
//functions
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
  stateUpdate();
}
function rollStats() {}
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
