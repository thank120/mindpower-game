let cards = [];
let players = [];
let currentPlayerIndex = 0;
let scores = [0, 0];
let registeredPowerCards = [null, null];
let playerHands = [[], []];

const instruction = document.getElementById("instruction");
const handArea = document.getElementById("player-hand");
const playZone = document.getElementById("play-zone");
const scoreP1 = document.getElementById("score-p1");
const scoreP2 = document.getElementById("score-p2");
const sentenceOutput = document.getElementById("sentence-output");
const turnDisplay = document.getElementById("turn-display");

function startGame() {
  const p1 = document.getElementById("player1-name").value || "1P";
  const p2 = document.getElementById("player2-name").value || "2P";
  players = [p1, p2];
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
  }
}

function renderTurn() {
  turnDisplay.textContent = `현재 차례: ${players[currentPlayerIndex]}`;
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
  } else if (card.type === "마인드카드") {
    if (!registeredPowerCards[player]) {
      alert("먼저 파워카드를 등록하세요!");
      return;
    }
    const sentence = makeSentence(players[player], registeredPowerCards[player].text, card.text);
    sentenceOutput.textContent = sentence;
    instruction.textContent = `${players[player]}이(가) 문장을 완성했어요! +1점 🎉`;
    scores[player]++;
    updateScore();
    if (scores[player] >= 3) {
      setTimeout(() => {
        alert(`${players[player]} 승리! 🎊`);
        location.reload();
      }, 300);
    }
  } else {
    instruction.textContent = `액션카드 '${card.text}'는 점수와 연결되지 않아요.`;
  }

  updatePlayZone(card);
  playerHands[player].splice(index, 1);
  currentPlayerIndex = 1 - currentPlayerIndex;
  renderTurn();
}

function makeSentence(name, power, mind) {
  return `${power} ${name}야! ${mind}.`;
}

function updateScore() {
  scoreP1.textContent = scores[0];
  scoreP2.textContent = scores[1];
}

function updatePlayZone(card) {
  const div = document.createElement("div");
  div.className = "played-card";
  div.textContent = `[${card.type}] ${card.text}`;
  playZone.appendChild(div);
}
