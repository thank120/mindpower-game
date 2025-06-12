let cards = [];
let players = [];
let currentPlayerIndex = 0;
let scores = [0, 0];
let registeredPowerCards = [null, null];
let playerHands = [[], []];
let histories = [[], []];

const instruction = document.getElementById("instruction");
const handArea = document.getElementById("player-hand");
const playZone = document.getElementById("play-zone");
const scoreP1 = document.getElementById("score-p1");
const scoreP2 = document.getElementById("score-p2");
const turnDisplay = document.getElementById("turn-display");
const sentenceOutput = document.getElementById("sentence-output");
const missionOutput = document.getElementById("mission-output");
const history1 = document.getElementById("p1-history");
const history2 = document.getElementById("p2-history");
const p1Label = document.getElementById("p1-label");
const p2Label = document.getElementById("p2-label");
const gameEnd = document.getElementById("game-end");
const winner = document.getElementById("winner");

const missions = [
  "소리 내어 또박또박 말해보세요!",
  "눈을 마주치며 이야기해보세요!",
  "손을 잡고 말해보세요!",
  "서로 포옹하며 말해보세요!",
  "친구의 이름을 넣어서 말해보세요!"
];

function startGame() {
  const p1 = document.getElementById("player1-name").value || "1P";
  const p2 = document.getElementById("player2-name").value || "2P";
  players = [p1, p2];
  p1Label.textContent = p1;
  p2Label.textContent = p2;
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game-area").classList.remove("hidden");

  fetch("mindpower_cards_en.json")
    .then(res => res.json())
    .then(data => {
      cards = [...data.power_cards, ...data.action_cards, ...data.mind_cards].sort(() => Math.random() - 0.5);
      drawInitialCards();
      updateScore();
      renderTurn();
    });
}

function drawInitialCards() {
  for (let i = 0; i < 2; i++) {
    playerHands[i] = cards.splice(0, 6);
    histories[i] = [];
  }
}

function renderTurn() {
  turnDisplay.textContent = `지금은 [${players[currentPlayerIndex]}] 차례입니다.`;
  renderHand();
}

function renderHand() {
  handArea.innerHTML = "";
  playerHands[currentPlayerIndex].forEach((card, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `[${card.type}] ${card.text}`;
    div.onclick = () => playCard(idx);
    handArea.appendChild(div);
  });
}

function playCard(index) {
  const player = currentPlayerIndex;
  const card = playerHands[player][index];

  if (card.type === "파워카드") {
    registeredPowerCards[player] = card;
    instruction.textContent = `${players[player]}이(가) '${card.text}' 파워카드를 등록했어요!`;
  } else if (card.type === "마인드카드") {
    if (!registeredPowerCards[player]) {
      alert("먼저 파워카드를 등록하세요!");
      return;
    }
    const sentence = `${registeredPowerCards[player].text} ${players[player]}야! ${card.text}.`;
    sentenceOutput.textContent = sentence;
    const mission = missions[Math.floor(Math.random() * missions.length)];
    missionOutput.textContent = `💬 표현 미션: ${mission}`;
    scores[player]++;
    updateScore();
    if (scores[player] >= 3) {
      endGame(player);
      return;
    }
  } else {
    instruction.textContent = `${card.text} 액션카드를 사용했습니다.`;
  }

  histories[player].push(card.text);
  updateHistory();
  updatePlayZone(card);
  playerHands[player].splice(index, 1);
  currentPlayerIndex = 1 - currentPlayerIndex;
  renderTurn();
}

function updateScore() {
  scoreP1.textContent = scores[0];
  scoreP2.textContent = scores[1];
}

function updateHistory() {
  history1.textContent = histories[0].join(", ");
  history2.textContent = histories[1].join(", ");
}

function updatePlayZone(card) {
  const div = document.createElement("div");
  div.className = "played-card";
  div.textContent = `[${card.type}] ${card.text}`;
  playZone.appendChild(div);
}

function endGame(winnerIndex) {
  gameEnd.classList.remove("hidden");
  winner.textContent = `${players[winnerIndex]}님이 승리했습니다! 🎉`;
}
