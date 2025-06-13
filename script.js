
function setupNames() {
  const count = parseInt(document.getElementById('player-count').value);
  const namesDiv = document.getElementById('player-names');
  namesDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `플레이어 ${i + 1} 이름`;
    input.id = `player-name-${i}`;
    input.className = 'name-input';
    namesDiv.appendChild(input);
  }
  document.querySelector('.name-input')?.focus();
}

function startGame() {
  const count = parseInt(document.getElementById('player-count').value);
  const playersList = [];
  for (let i = 0; i < count; i++) {
    const nameInput = document.getElementById(`player-name-${i}`);
    playersList.push(nameInput.value || `플레이어${i + 1}`);
  }

  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');

  const listDiv = document.getElementById('players-list');
  listDiv.innerHTML = '<h3>참가자 목록</h3><ul>' + playersList.map(p => `<li>${p}</li>`).join('') + '</ul>';
}

function resetGame() {
  location.reload();
}
