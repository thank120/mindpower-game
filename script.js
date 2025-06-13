
let deck = [];
let playerHand = [];
let aiHand = [];
let playerField = [];
let aiField = [];
let playerName = '';
let currentPlayer = 'player';
let drewCard = false;

const turnDisplay = document.getElementById('turn-display');
const instruction = document.getElementById('instruction');
const playerHandDiv = document.getElementById('player-hand');
const playerFieldDiv = document.getElementById('field-player');
const aiFieldDiv = document.getElementById('field-ai');
const playerLabel = document.getElementById('player-label');
const playerHandCount = document.getElementById('player-hand-count');
const aiHandCount = document.getElementById('ai-hand-count');
const gameEnd = document.getElementById('game-end');
const winner = document.getElementById('winner');
const drawDeckDiv = document.getElementById('draw-deck');

function startGame() {
  playerName = document.getElementById('player-name').value || '플레이어';
  playerLabel.textContent = playerName;
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');

  initDeck();
  shuffle(deck);
  playerHand = deck.splice(0, 6);
  aiHand = deck.splice(0, 6);

  update();
  renderDrawButton();
}

function initDeck() {
  const powers = ['사랑해', '고마워', '잘했어'];
  const minds = ['정말', '진심으로', '아주 많이'];
  const actions = ['포옹해줘', '칭찬해줘', '눈 마주쳐줘'];

  for (let p of powers) deck.push({type: '파워카드', text: p});
  for (let m of minds) deck.push({type: '마인드카드', text: m});
  for (let a of actions) deck.push({type: '액션카드', text: a, linked_to: '사랑해'});
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function update() {
  updateHands();
  updateField();
  updateTurn();
}

function updateHands() {
  playerHandDiv.innerHTML = '';
  playerHand.forEach((card, i) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = `[${card.type}] ${card.text}`;
    div.onclick = () => playCard(i);
    playerHandDiv.appendChild(div);
  });
  playerHandCount.textContent = playerHand.length;
  aiHandCount.textContent = aiHand.length;
}

function playCard(index) {
  if (currentPlayer !== 'player') return;
  const card = playerHand[index];
  const hasPower = playerField.length > 0;

  if (card.type === '파워카드') {
    playerField.push(card);
    instruction.textContent = `${playerName}이(가) '${card.text}' 파워카드 등록`;
  } else if (card.type === '마인드카드') {
    if (!hasPower) return alert('먼저 파워카드를 등록하세요.');
    instruction.textContent = `문장: "${card.text} ${playerName}! ${playerField[0].text}"`;
  } else if (card.type === '액션카드') {
    const found = playerField.some(p => p.text === card.linked_to);
    if (!found) return alert('연결된 파워카드가 없습니다.');
    instruction.textContent = `실천 미션: ${card.text}`;
  }

  playerHand.splice(index, 1);
  update();
  checkWin();
  currentPlayer = 'ai';
  drewCard = false;
  setTimeout(aiTurn, 1000);
}

function aiTurn() {
  const card = aiHand.find(c => c.type === '파워카드') || aiHand.find(c => c.type !== '파워카드');
  if (!card && deck.length > 0) {
    aiHand.push(deck.shift());
  } else if (card) {
    if (card.type === '파워카드') aiField.push(card);
    aiHand = aiHand.filter(c => c !== card);
  }
  update();
  checkWin();
  currentPlayer = 'player';
}

function renderDrawButton() {
  drawDeckDiv.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = '카드 뽑기';
  btn.onclick = drawCard;
  drawDeckDiv.appendChild(btn);
}

function drawCard() {
  if (currentPlayer !== 'player' || drewCard || deck.length === 0) return;
  const newCard = deck.shift();
  playerHand.push(newCard);
  drewCard = true;
  instruction.textContent = `${playerName}이(가) 카드를 1장 뽑았습니다.`;
  update();
}

function updateField() {
  playerFieldDiv.innerHTML = playerField.map(c => `<div class='card'>${c.text}</div>`).join('');
  aiFieldDiv.innerHTML = aiField.map(c => `<div class='card'>${c.text}</div>`).join('');
}

function updateTurn() {
  turnDisplay.textContent = currentPlayer === 'player' ? `${playerName} 차례입니다.` : 'AI 차례입니다.';
}

function checkWin() {
  if (playerHand.length === 0) {
    gameEnd.classList.remove('hidden');
    winner.textContent = `${playerName} 승리!`;
  } else if (aiHand.length === 0) {
    gameEnd.classList.remove('hidden');
    winner.textContent = `AI 승리!`;
  }
}

function resetGame() {
  deck = [];
  playerHand = [];
  aiHand = [];
  playerField = [];
  aiField = [];
  currentPlayer = 'player';
  drewCard = false;

  document.getElementById('setup').classList.remove('hidden');
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('winner').textContent = '';
  document.getElementById('game-end').classList.add('hidden');
  document.getElementById('instruction').textContent = '';
  document.getElementById('player-name').value = '';
  drawDeckDiv.innerHTML = '';
}
