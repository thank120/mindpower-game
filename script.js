let cards = [];
let players = [];
let currentPlayerIndex = 0;
let histories = [[], []];
let registeredPowerCards = [null, null];

const instruction = document.getElementById("instruction");
const handArea = document.getElementById("player-hand");
const playZone = document.getElementById("play-zone");
const history1 = document.getElementById("p1-history");
const history2 = document.getElementById("p2-history");
const p1Label = document.getElementById("p1-label");
const p2Label = document.getElementById("p2-label");
const turnDisplay = document.getElementById("turn-display");

const ding = document.getElementById("sound-ding");
const bbyong = document.getElementById("sound-bbyong");

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
      for (let i = 0; i < 2; i++) histories[i] = [];
      drawInitialCards();
      renderTurn();
    });
}

let playerHands = [[], []];

function drawInitialCards() {
  for (let i = 0; i < 2; i++) {
    playerHands[i] = cards.splice(0, 6);
  }
  renderHand();
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
  const card = playerHands[currentPlayerIndex][index];
  const player = currentPlayerIndex;

  if (card.type === "파워카드") {
    registeredPowerCards[player] = card;
    instruction.textContent = `${players[player]}이(가) '${card.text}' 파워카드를 등록했어요!`;
    ding.play();
  } else if (card.type === "액션카드") {
    if (!registeredPowerCards[player] || registeredPowerCards[player].text !== card.linked_power) {
      alert("먼저 해당 파워카드를 등록해야 해요!");
      return;
    }
    instruction.textContent = `${players[player]}이(가) '${card.text}' 액션카드를 사용했어요!`;
    ding.play();
  } else if (card.type === "마인드카드") {
    instruction.textContent = `"${card.text}" 이 문장을 소리 내어 읽어보세요!`;
    bbyong.play();
  }

  histories[player].push(card.text);
  updateHistory();
  updatePlayZone(card);
  playerHands[player].splice(index, 1);
  currentPlayerIndex = 1 - currentPlayerIndex;
  renderTurn();
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
