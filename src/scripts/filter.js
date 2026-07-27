const search = document.querySelector('#court-search');
const cards = [...document.querySelectorAll('[data-court]')];
const count = document.querySelector('#results-count');
const empty = document.querySelector('#empty-state');
let selectedArea = 'all';
const selectedTypes = new Set();

function update() {
  const term = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matches = (selectedArea === 'all' || card.dataset.area === selectedArea)
      && (selectedTypes.size === 0 || card.dataset.types.split(',').some((type) => selectedTypes.has(type)))
      && card.dataset.search.includes(term);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  count.textContent = `${visible} ${visible === 1 ? 'place' : 'places'} listed`;
  empty.hidden = visible !== 0;
}

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.area) {
      selectedArea = button.dataset.area;
      document.querySelectorAll('[data-area]').forEach((item) => {
        if (item.classList.contains('filter-chip')) { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', item === button); }
      });
    } else {
      if (selectedTypes.has(button.dataset.type)) { selectedTypes.delete(button.dataset.type); } else { selectedTypes.add(button.dataset.type); }
      document.querySelectorAll('[data-type]').forEach((item) => { const active = selectedTypes.has(item.dataset.type); item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', active); });
    }
    update();
  });
});
search.addEventListener('input', update);
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); } });
