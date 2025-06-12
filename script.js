
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      new Audio('select_sound.mp3').play();
    });
  });
});
