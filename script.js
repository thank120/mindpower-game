
let players = [];
let hands = [];
let fields = [];
let currentTurn = 0;
let deck = [];
let drewCard = [];
let gameStarted = false;

const turnDisplay = document.getElementById('turn-display');
const instruction = document.getElementById('instruction');
const handArea = document.getElementById('player-hand');
const drawDeckDiv = document.getElementById('draw-deck');
const gameEnd = document.getElementById('game-end');
const winner = document.getElementById('winner');
const statusArea = document.getElementById('status-area');
const fieldsDiv = document.getElementById('fields');
const playerNamesDiv = document.getElementById('player-names');

function setupNames() {
  const count = parseInt(document.getElementById('player-count').value);
  playerNamesDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const input = document.createElement('input');
    input.placeholder = `플레이어 ${i + 1} 이름`;
    input.id = `player-name-${i}`;
    playerNamesDiv.appendChild(input);
  }
}

function startGame() {
  const count = parseInt(document.getElementById('player-count').value);
  players = [];
  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`player-name-${i}`).value || `플레이어${i + 1}`;
    players.push(name);
  }

  hands = Array.from({ length: players.length }, () => []);
  fields = Array.from({ length: players.length }, () => []);
  drewCard = Array.from({ length: players.length }, () => false);

  initDeck();
  shuffle(deck);

  for (let i = 0; i < players.length; i++) {
    hands[i] = deck.splice(0, 6);
  }

  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  gameStarted = true;
  updateGameState();
  renderDrawButton();
}

function initDeck() {
  const powers = ['사랑해', '고마워', '잘했어'];
  const minds = ['정말', '진심으로', '아주 많이'];
  const actions = ['포옹해줘', '칭찬해줘', '눈 마주쳐줘'];
  deck = [];

  for (let p of powers) deck.push({ type: '파워카드', text: p });
  for (let m of minds) deck.push({ type: '마인드카드', text: m });
  for (let a of actions) deck.push({ type: '액션카드', text: a, linked_to: '사랑해' });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function updateGameState() {
  const playerName = players[currentTurn];
  turnDisplay.textContent = `${playerName} 차례입니다.`;
  instruction.textContent = '';
  updateStatus();
  updateHand();
  updateFields();
}

function updateStatus() {
  statusArea.innerHTML = players.map((p, i) =>
    `<div class="player-block"><strong>${p}</strong> 카드: ${hands[i].length}</div>`
  ).join('');
}

function updateHand() {
  handArea.innerHTML = '';
  hands[currentTurn].forEach((card, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = `[${card.type}] ${card.text}`;
    div.onclick = () => playCard(index);
    handArea.appendChild(div);
  });
}

function updateFields() {
  fieldsDiv.innerHTML = '';
  fields.forEach((field, i) => {
    const fieldHTML = field.map(c => `<div class="card">[${c.type}] ${c.text}</div>`).join('');
    fieldsDiv.innerHTML += `<div><strong>${players[i]}</strong> 필드:<br>${fieldHTML}</div><br>`;
  });
}

function playCard(index) {
  const hand = hands[currentTurn];
  const card = hand[index];
  const myField = fields[currentTurn];

  if (card.type === '파워카드') {
    myField.push(card);
    instruction.textContent = `'${card.text}' 파워카드 등록`;
  } else if (card.type === '마인드카드') {
    if (myField.length === 0) return alert('파워카드를 먼저 등록하세요.');
    instruction.textContent = `문장: ${card.text} ${players[currentTurn]}! ${myField[0].text}`;
  } else if (card.type === '액션카드') {
    const found = myField.some(p => p.text === card.linked_to);
    if (!found) return alert('연결된 파워카드가 없습니다.');
    instruction.textContent = `실천 미션: ${card.text}`;
  }

  hand.splice(index, 1);
  drewCard[currentTurn] = false;
  checkWin();
  nextTurn();
}

function renderDrawButton() {
  drawDeckDiv.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = '카드 뽑기';
  btn.onclick = () => {
    if (deck.length === 0 || drewCard[currentTurn]) return;
    hands[currentTurn].push(deck.shift());
    drewCard[currentTurn] = true;
    instruction.textContent = `${players[currentTurn]}이(가) 카드를 뽑았습니다.`;
    updateHand();
  };
  drawDeckDiv.appendChild(btn);
}

function nextTurn() {
  currentTurn = (currentTurn + 1) % players.length;
  updateGameState();
}

function checkWin() {
  for (let i = 0; i < players.length; i++) {
    if (hands[i].length === 0) {
      gameEnd.classList.remove('hidden');
      winner.textContent = `${players[i]} 승리!`;
      gameStarted = false;
      return;
    }
  }
}

function resetGame() {
  location.reload();
}
