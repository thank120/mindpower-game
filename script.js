
let cardData = [];
let history = [];

fetch('mindpower_cards.json')
  .then(response => response.json())
  .then(data => {
    cardData = [...data.power_cards, ...data.action_cards, ...data.mind_cards];
  });

function drawCard() {
  if (cardData.length === 0) return;
  const index = Math.floor(Math.random() * cardData.length);
  const card = cardData[index];
  const container = document.getElementById("selected-card");
  container.innerHTML = `
    <p><strong>${card.text}</strong> (${card.character})</p>
    <img src="images/${card.character}.png" alt="${card.character}">
  `;
  showPopup(card);
  saveToHistory(card);
}

function showPopup(card) {
  const popup = document.getElementById("card-popup");
  document.getElementById("popup-image").src = `images/${card.character}.png`;
  document.getElementById("popup-text").innerText = card.text;
  popup.style.display = "block";
}

function closePopup() {
  document.getElementById("card-popup").style.display = "none";
}

function saveToHistory(card) {
  history.push(card);
  localStorage.setItem("mindHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.text} (${item.character})`;
    list.appendChild(li);
  });
}

window.onload = () => {
  const saved = localStorage.getItem("mindHistory");
  if (saved) {
    history = JSON.parse(saved);
    renderHistory();
  }
};
