
function setupNames() {
  const count = parseInt(document.getElementById('player-count').value);
  const namesDiv = document.getElementById('player-names');
  namesDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const input = document.createElement('input');
    input.placeholder = `플레이어 ${i + 1} 이름`;
    input.id = `player-name-${i}`;
    namesDiv.appendChild(input);
  }
  alert("입력칸 생성 완료");
}

function startGame() {
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  alert("게임 시작됨!");
}

function resetGame() {
  location.reload();
}
