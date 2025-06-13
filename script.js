
const mindCards = ["진심으로", "따뜻하게", "조심스럽게", "정성스럽게"];
const powerCards = ["고마워", "미안해", "도와줘", "축하해"];
let selectedMind = "";
let selectedPower = "";

function joinRoom() {
  const roomNum = document.getElementById('room-number').value;
  const username = document.getElementById('username').value;
  if (!username) {
    alert("이름을 입력해주세요.");
    return;
  }
  document.getElementById('join-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('welcome-msg').innerText = `${roomNum}조 - ${username}님 환영합니다!`;
  renderCards();
}

function renderCards() {
  const mindDiv = document.getElementById('mind-cards');
  const powerDiv = document.getElementById('power-cards');
  mindCards.forEach(card => {
    const btn = document.createElement('div');
    btn.className = 'card';
    btn.innerText = card;
    btn.onclick = () => {
      selectedMind = card;
      updateResult();
    };
    mindDiv.appendChild(btn);
  });
  powerCards.forEach(card => {
    const btn = document.createElement('div');
    btn.className = 'card';
    btn.innerText = card;
    btn.onclick = () => {
      selectedPower = card;
      updateResult();
    };
    powerDiv.appendChild(btn);
  });
}

function updateResult() {
  if (selectedMind && selectedPower) {
    document.getElementById('result').innerText = `${selectedMind} ${selectedPower}!`;
  }
}
