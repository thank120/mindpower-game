
let deck = [];
let playerHand = [];
let aiHand = [];
let playerField = [];
let aiField = [];
let playerName = '';
let currentPlayer = 'player'; // or 'ai'

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

function startGame() {
  playerName = document.getElementById('player-name').value || '플레이어';
  playerLabel.textContent = playerName;

  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');

  initDeck();
  shuffle(deck);

  // 분배
  playerHand = deck.splice(0, 6);
  aiHand = deck.splice(0, 6);

  updateHands();
  updateField();
  updateTurn();
}

function initDeck() {
  deck = [];
  const power = ['사랑해', '고마워', '잘했어'];
  const action = ['포옹해줘', '칭찬해줘', '눈 마주쳐줘'];
  const mind = ['정말', '진심으로', '아주 많이'];

  for (let p of power) deck.push({type: '파워카드', text: p});
  for (let a of action) deck.push({type: '액션카드', text: a, linked_to: '사랑해'});
  for (let m of mind) deck.push({type: '마인드카드', text: m});
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
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
  if (card.type === '파워카드') {
    playerField.push(card);
    instruction.textContent = `${playerName}이(가) 파워카드 '${card.text}'을(를) 등록했습니다.`;
  } else if (card.type === '마인드카드' && playerField.length > 0) {
    instruction.textContent = `문장: '${card.text} ${playerName}! ${playerField[0].text}.'`;
  } else if (card.type === '액션카드') {
    const valid = playerField.some(p => p.text === card.linked_to);
    if (!valid) {
      alert('연결된 파워카드가 없습니다!');
      return;
    }
    instruction.textContent = `실천 미션: ${card.text}`;
  }
  playerHand.splice(index, 1);
  updateHands();
  updateField();
  checkWin();
  currentPlayer = 'ai';
  setTimeout(aiTurn, 1000);
}

function updateField() {
  playerFieldDiv.innerHTML = playerField.map(c => `<div class='card'>[${c.type}] ${c.text}</div>`).join('');
  aiFieldDiv.innerHTML = aiField.map(c => `<div class='card'>[${c.type}] ${c.text}</div>`).join('');
}

function updateTurn() {
  turnDisplay.textContent = currentPlayer === 'player' ? `${playerName} 차례입니다.` : 'AI 차례입니다.';
}

function aiTurn() {
  if (aiHand.length === 0) return;
  const card = aiHand.find(c => c.type === '파워카드') || aiHand[0];
  aiField.push(card);
  instruction.textContent = `AI가 '${card.text}' 카드를 사용했습니다.`;
  aiHand = aiHand.filter(c => c !== card);
  updateHands();
  updateField();
  checkWin();
  currentPlayer = 'player';
  updateTurn();
}

function checkWin() {
  if (playerHand.length === 0) {
    gameEnd.classList.remove('hidden');
    winner.textContent = `${playerName} 승리! 🎉`;
  } else if (aiHand.length === 0) {
    gameEnd.classList.remove('hidden');
    winner.textContent = `AI 승리! 🤖`;
  }
}
