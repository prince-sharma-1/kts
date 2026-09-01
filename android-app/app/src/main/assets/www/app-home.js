const hour = new Date().getHours();
const dayPart = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
document.getElementById('dayPart').textContent = dayPart;

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => link.classList.add('pressed'));
});
