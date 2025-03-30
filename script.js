const winColor = "mediumseagreen";
const looseColor = "crimson";
const drawColor = "var(--text-dark)";

// Constants for DOM elements
const playButtons = document.querySelectorAll(".buttons");
const currentRound_rootCard = document.querySelector("#rootPicks");
const currentRound_userPickImg = document.querySelector("#userPickImg");
const currentRound_botPickImg = document.querySelector("#botPickImg");
const currentRound_roundCount = document.querySelector("#roundCount");

const totalScore_rootCard = document.querySelector("#rootScore");
const totalScore_wCount = document.querySelector("#wCount");
const totalScore_dCount = document.querySelector("#dCount");
const totalScore_lCount = document.querySelector("#lCount");
const totalScore_currentScore = document.querySelector("#currentScore");

const prevRounds_list = document.querySelector("#prevRounds");

// Images paths
const images_64 = {
  rock: "../img/clenched_64.png",
  paper: "../img/palm_64.png",
  scissors: "../img/two-fingers_64.png"
};

const images_32 = {
  rock: "../img/clenched_32.png",
  paper: "../img/palm_32.png",
  scissors: "../img/two-fingers_32.png"
};

// Global variables
let userScore = { wins: 0, draws: 0, losses: 0 };
let round = 0;
let interval;

// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setRandomImg(imgUser, imgBot, imgSrc, imgIndexUser, imgIndexBot) {
  interval = setInterval(() => {
    imgIndexUser = (imgIndexUser + 1) % imgSrc.length;
    imgUser.src = imgSrc[imgIndexUser];
    imgIndexBot = (imgIndexBot + 1) % imgSrc.length;
    imgBot.src = imgSrc[imgIndexBot];
  }, 175);
}

function stopRandomImg() {
  clearInterval(interval);
}

function changeColor(elem, result) {
  const classes = ["win", "loose", "draw"];
  classes.forEach((cls) => elem.classList.remove(cls));
  elem.classList.add(result);
}

// Game logic
function getBotChoice() {
  const choices = ["rock", "paper", "scissors"];
  let botChoice = choices[getRandomInt(0, 2)];
  currentRound_botPickImg.src = images_64[botChoice];
  return botChoice;
}

function getUserChoice(pick) {
  stopRandomImg();
  currentRound_userPickImg.src = images_64[pick];
  return pick;
}

function playRound(user, bot) {
  if (user === bot) return 0; // Draw
  const winConditions = {
    rock: "scissors", // rock beats scissors
    paper: "rock",    // paper beats rock
    scissors: "paper" // scissors beats paper
  };
  return winConditions[user] === bot ? 1 : -1; // 1 win, -1 loss
}

function updateScore(currentText, newText) {
  currentText.textContent = newText;
  if (userScore.wins > userScore.losses) {
    updateRoundStatus("Winning", winColor, "win");
  } else if (userScore.wins < userScore.losses) {
    updateRoundStatus("Loosing", looseColor, "loose");
  } else {
    updateRoundStatus("Tied", drawColor, "draw");
  }
}

function updateRoundStatus(status, color, resultClass) {
  totalScore_currentScore.textContent = status;
  totalScore_currentScore.style.cssText = `color: ${color}`;
  changeColor(totalScore_rootCard, resultClass);
}

// Previous score history
function prevScore(userPick, botPick, result, round) {
  const listItem = document.createElement("li");
  listItem.classList.add("container", "subText");
  listItem.id = "lastRound";

  const userDiv = createPlayerDiv("You", userPick, images_32);
  const botDiv = createPlayerDiv("Bot", botPick, images_32);
  const labelDiv = createRoundLabel(round);

  listItem.appendChild(userDiv);
  listItem.appendChild(labelDiv);
  listItem.appendChild(botDiv);
  prevRounds_list.prepend(listItem);

  changeColor(listItem, result === 1 ? "win" : result === -1 ? "loose" : "draw");
}

function createPlayerDiv(playerText, pick, imgSrc) {
  const playerDiv = document.createElement("div");
  playerDiv.classList.add("container", "subText");
  playerDiv.id = "last";

  const playerImg = document.createElement("img");
  playerImg.src = imgSrc[pick];
  const playerSpan = document.createElement("span");
  playerSpan.textContent = playerText;

  if (playerText === "Bot") {
    playerDiv.appendChild(playerImg);
    playerDiv.appendChild(playerSpan);
} else {
    playerDiv.appendChild(playerSpan);
    playerDiv.appendChild(playerImg);
}

  return playerDiv;
}

function createRoundLabel(round) {
  const labelDiv = document.createElement("div");
  labelDiv.classList.add("container");
  labelDiv.id = "lastRoundLabel";

  const roundPara = document.createElement("p");
  roundPara.classList.add("subText");
  roundPara.textContent = "Round";

  const roundText = document.createElement("p");
  roundText.classList.add("subText");
  roundText.textContent = round;

  labelDiv.appendChild(roundPara);
  labelDiv.appendChild(roundText);
  return labelDiv;
}

// Reset function (future use)
// function reset() {
//   return true;
// }

// Initialize random images on page load
setRandomImg(
  currentRound_userPickImg,
  currentRound_botPickImg,
  Object.values(images_64),
  getRandomInt(0, 2),
  getRandomInt(0, 2)
);

// LET THE GAME BEGIN
playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (round !== 0) {
      prevScore(userPick, botPick, result, round);
    }

    currentRound_roundCount.textContent = ++round;

    userPick = getUserChoice(button.id);
    botPick = getBotChoice();
    result = playRound(userPick, botPick);

    // Update score and UI based on the result
    if (result === 1) {
      updateScore(totalScore_wCount, ++userScore.wins);
      changeColor(currentRound_rootCard, "win");
    } else if (result === -1) {
      updateScore(totalScore_lCount, ++userScore.losses);
      changeColor(currentRound_rootCard, "loose");
    } else {
      updateScore(totalScore_dCount, ++userScore.draws);
      changeColor(currentRound_rootCard, "draw");
    }
  });
});