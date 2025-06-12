let cards = [];
let playerHand = [];
let registeredPowerCard = null;

const instruction = document.getElementById("instruction");
const handArea = document.getElementById("player-hand");
const playZone = document.getElementById("play-zone");
const gameArea = document.getElementById("game-area");

fetch("mindpower_cards_en.json")
  .then(res => res.json())
  .then(data => {
    cards = [...data.power_cards, ...data.action_cards, ...data.mind_cards];
    document.getElementById("start-button").onclick = () => startGame();
  });

function startGame() {
  gameArea.classList.remove("hidden");
  drawInitialCards();
  renderHand();
}

function drawInitialCards() {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  playerHand = shuffled.slice(0, 6);
}

function renderHand() {
  handArea.innerHTML = "";
  playerHand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `[${card.type}] ${card.text}`;
    div.onclick = () => playCard(index);
    handArea.appendChild(div);
  });
}

function playCard(index) {
  const card = playerHand[index];

  if (card.type === "파워카드") {
    registeredPowerCard = card;
    playerHand.splice(index, 1);
    instruction.textContent = `파워카드 '${card.text}'를 등록했습니다. 이제 액션카드를 사용할 수 있어요.`;
    updatePlayZone(card);
    renderHand();
  } else if (card.type === "액션카드") {
    if (!registeredPowerCard || registeredPowerCard.text !== card.linked_power) {
      alert("먼저 해당 파워카드를 등록해야 합니다!");
      return;
    }
    playerHand.splice(index, 1);
    instruction.textContent = `액션카드 '${card.text}'를 사용했습니다!`;
    updatePlayZone(card);
    renderHand();
  } else if (card.type === "마인드카드") {
    if (!registeredPowerCard) {
      alert("먼저 파워카드를 등록해 주세요!");
      return;
    }
    playerHand.splice(index, 1);
    instruction.textContent = `마인드카드 '${card.text}'로 문장을 완성해 보세요!`;
    updatePlayZone(card);
    renderHand();
  }
}

function updatePlayZone(card) {
  const div = document.createElement("div");
  div.className = "played-card";
  div.textContent = `[${card.type}] ${card.text}`;
  playZone.appendChild(div);
}
