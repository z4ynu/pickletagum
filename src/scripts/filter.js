const search = document.querySelector('#court-search');
const grid = document.querySelector('#court-grid');
const loading = document.querySelector('#court-loading');
const comingSoonGrid = document.querySelector('#coming-soon-grid');
const comingSoonSection = document.querySelector('#coming-soon-section');
const comingSoonCount = document.querySelector('#coming-soon-count');
const count = document.querySelector('#results-count');
const empty = document.querySelector('#empty-state');
const areaFilter = document.querySelector('#area-filter');
const moreAreasFilter = document.querySelector('.more-areas-filter');
const moreAreasList = document.querySelector('.more-areas-filter__list');
const mobileAreaFilter = document.querySelector('.mobile-area-filter');
const mobileAreaSummary = document.querySelector('#mobile-area-summary');
const detailsDialog = document.querySelector('#court-details-dialog');
const detailsImage = document.querySelector('#court-details-image');
const detailsArea = document.querySelector('#court-details-area');
const detailsTitle = document.querySelector('#court-details-title');
const detailsNote = document.querySelector('#court-details-note');
const config = window.PICKLETAGUM_SUPABASE;
const labels = { pickle_hub: 'Book on PickleHub', custom_site: 'Visit booking site', facebook: 'Open Facebook', phone: 'Call venue' };
let courts = [];
let selectedArea = 'all';
const selectedTypes = new Set();
let lastDetailTrigger = null;

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const isExternal = (value) => /^https?:\/\//i.test(value || '');
const safeHref = (value) => {
  const href = String(value ?? '').trim();
  if (/^(https?:\/\/|tel:|mailto:|\/)/i.test(href)) return href;
  if (/^(?:www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:[/?#].*)?$/i.test(href)) return `https://${href}`;
  return '';
};
const formatPrice = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw || raw.includes('\u20b1')) return raw;
  const amount = raw.replace(/\/?\s*(hr|hour)s?\.?$/i, '').trim();
  if (!/^\d+(?:\s*[-\u2013]\s*\d+)?$/.test(amount)) return raw;
  return `\u20b1${amount.replace(/\s*[-\u2013]\s*/, '\u2013')}/hr.`;
};

function cardMarkup(court) {
  const types = Array.isArray(court.types) ? court.types : [];
  const details = [court.court_count > 0 ? `${court.court_count} ${court.court_count === 1 ? 'court' : 'courts'}` : '', formatPrice(court.price_range)].filter(Boolean);
  const bookingHref = safeHref(court.link);
  const facebookHref = safeHref(court.facebook_link);
  const unavailableAction = (label) => `<span class="court-action-button court-action-button--unavailable" aria-disabled="true" title="No link available">${label}</span>`;
  const booking = bookingHref ? `<a class="court-action-button" href="${escapeHtml(bookingHref)}"${isExternal(bookingHref) ? ' target="_blank" rel="noreferrer"' : ''}>${escapeHtml(labels[court.booking_method] || 'Visit booking site')} <span aria-hidden="true">&rarr;</span></a>` : unavailableAction('Booking unavailable');
  const facebook = facebookHref ? `<a class="court-action-button court-action-button--facebook" href="${escapeHtml(facebookHref)}" target="_blank" rel="noreferrer">Visit Facebook page <span aria-hidden="true">&rarr;</span></a>` : unavailableAction('Facebook unavailable');
  const preview = court.image_src
    ? `<img src="${escapeHtml(court.image_src)}" alt="${escapeHtml(court.image_alt || `Preview of ${court.name}`)}" loading="lazy">`
    : `<div class="court-preview__fallback" aria-label="Photo for ${escapeHtml(court.name)} coming soon" role="img"><span>Venue photo</span><strong>Coming soon</strong></div>`;
  const mobilePreview = court.image_src
    ? `<img src="${escapeHtml(court.image_src)}" alt="${escapeHtml(court.image_alt || `Preview of ${court.name}`)}" loading="lazy">`
    : `<span class="mobile-court-card__fallback" aria-hidden="true">Coming soon</span>`;
  const meta = details.length ? `<div class="court-meta">${details.map((detail) => `<span>${escapeHtml(detail)}</span>`).join('')}</div>` : '';
  const comingClass = court.is_coming_soon ? ' court-card--coming' : '';
  const desktopCard = `<article class="court-card court-card--desktop booking--${escapeHtml(court.booking_method)}${comingClass}">
    <div class="court-preview"><button class="court-preview-button" type="button" data-court-detail="${escapeHtml(court.id)}" aria-label="View details for ${escapeHtml(court.name)}">${preview}</button><div class="rally-strip" aria-hidden="true"><span></span><i></i><b></b></div>${court.is_coming_soon ? '' : `<span class="court-preview__badge">${escapeHtml(types.join(' + '))}</span>`}</div>
    <div class="court-card__body"><div class="court-card__topline"><span>${escapeHtml(court.area)}</span></div><h2>${escapeHtml(court.name)}</h2>${meta}<div class="court-card__bottom"><div class="court-actions">${booking}${facebook}</div></div></div>
  </article>`;
  const mobileCard = `<details class="mobile-court-card${court.is_coming_soon ? ' mobile-court-card--coming' : ''}"><summary><span class="mobile-court-card__copy"><span>${escapeHtml(court.area)}</span><strong>${escapeHtml(court.name)}</strong></span><span class="mobile-court-card__preview" data-court-detail="${escapeHtml(court.id)}" role="button" tabindex="0" aria-label="View details for ${escapeHtml(court.name)}">${mobilePreview}</span></summary><div class="mobile-court-card__details">${meta}${booking || facebook ? `<div class="court-actions">${booking}${facebook}</div>` : ''}</div></details>`;
  return `${desktopCard}${mobileCard}`;
}

function update() {
  const term = search.value.trim().toLowerCase();
  const visible = courts.filter((court) => (selectedArea === 'all' || court.area === selectedArea)
    && (selectedTypes.size === 0 || court.types.some((type) => selectedTypes.has(type)))
    && `${court.name} ${court.area}`.toLowerCase().includes(term));
  const available = visible.filter((court) => !court.is_coming_soon);
  const comingSoon = visible.filter((court) => court.is_coming_soon);
  grid.innerHTML = available.map(cardMarkup).join('');
  comingSoonGrid.innerHTML = comingSoon.map(cardMarkup).join('');
  if (count) count.textContent = `${available.length} ${available.length === 1 ? 'place' : 'places'} listed`;
  comingSoonCount.textContent = `${comingSoon.length} ${comingSoon.length === 1 ? 'place' : 'places'} announced`;
  comingSoonSection.hidden = comingSoon.length === 0;
  empty.hidden = available.length !== 0;
  if (!available.length) empty.textContent = courts.length ? 'No available courts match that search yet. Try another area or clear a filter.' : 'No courts have been added yet.';
}

function setLoading(isLoading) {
  grid.classList.toggle('is-loading', isLoading);
  if (!isLoading) loading?.remove();
}

function addAreaButtons() {
  const areas = [...new Set(courts.map((court) => court.area))].sort((a, b) => a.localeCompare(b));
  const visibleAreaLimit = 5;
  areaFilter.querySelectorAll('[data-area]:not([data-area="all"])').forEach((button) => button.remove());
  areas.forEach((area, index) => {
    const button = document.createElement('button');
    button.className = 'filter-chip';
    button.dataset.area = area;
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = area;
    if (index < visibleAreaLimit) areaFilter.insertBefore(button, moreAreasFilter);
    else moreAreasList.append(button);
  });
  if (moreAreasFilter) moreAreasFilter.hidden = areas.length <= visibleAreaLimit;
}

function syncAreaDropdown() {
  const isMobile = window.matchMedia('(max-width: 560px)').matches;
  if (mobileAreaFilter) mobileAreaFilter.open = !isMobile;
  if (moreAreasFilter) moreAreasFilter.open = isMobile;
}

function openCourtDetails(id, trigger) {
  const court = courts.find((item) => item.id === id);
  if (!court || !detailsDialog) return;
  lastDetailTrigger = trigger || null;
  detailsArea.textContent = court.area;
  detailsTitle.textContent = court.name;
  detailsNote.textContent = court.note || 'No venue notes have been added yet.';
  detailsImage.hidden = !court.image_src;
  if (court.image_src) { detailsImage.src = court.image_src; detailsImage.alt = court.image_alt || `Preview of ${court.name}`; }
  detailsDialog.showModal();
  requestAnimationFrame(() => detailsDialog.querySelector('.court-details-dialog__close')?.focus());
}

document.addEventListener('click', (event) => {
  const detailTrigger = event.target.closest('[data-court-detail]');
  if (detailTrigger) { event.preventDefault(); openCourtDetails(detailTrigger.dataset.courtDetail, detailTrigger); return; }
  if (event.target.closest('.court-details-dialog__close')) { detailsDialog.close(); return; }
  const button = event.target.closest('.filter-chip');
  if (!button) return;
  if (button.dataset.area) {
    selectedArea = button.dataset.area;
    document.querySelectorAll('[data-area].filter-chip').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (mobileAreaSummary) mobileAreaSummary.textContent = `Area: ${button.textContent}`;
    if (moreAreasFilter && !window.matchMedia('(max-width: 560px)').matches) moreAreasFilter.open = false;
    if (window.matchMedia('(max-width: 560px)').matches && mobileAreaFilter) mobileAreaFilter.open = false;
  } else if (button.dataset.type) {
    if (selectedTypes.has(button.dataset.type)) selectedTypes.delete(button.dataset.type); else selectedTypes.add(button.dataset.type);
    document.querySelectorAll('[data-type].filter-chip').forEach((item) => {
      const active = selectedTypes.has(item.dataset.type);
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }
  update();
});

search.addEventListener('input', update);
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); } });
document.addEventListener('keydown', (event) => {
  const detailTrigger = event.target.closest?.('[data-court-detail]');
  if (detailTrigger && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openCourtDetails(detailTrigger.dataset.courtDetail, detailTrigger); }
});
detailsDialog?.addEventListener('close', () => {
  lastDetailTrigger?.focus();
  lastDetailTrigger = null;
});
detailsDialog?.addEventListener('click', (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});

async function loadCourts() {
  if (!config?.url || !config?.key) {
    setLoading(false);
    if (count) count.textContent = 'Courts unavailable';
    empty.textContent = 'The court directory is not configured yet.';
    empty.hidden = false;
    return;
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${config.url}/rest/v1/courts?select=*&order=name`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Could not load courts (${response.status})`);
    courts = await response.json();
    addAreaButtons();
    syncAreaDropdown();
    setLoading(false);
    update();
  } catch (error) {
    setLoading(false);
    if (count) count.textContent = 'Courts unavailable';
    empty.textContent = error.name === 'AbortError'
      ? 'Loading the court directory took too long. Please refresh and try again.'
      : 'Could not load the court directory. Please try again shortly.';
    empty.hidden = false;
  } finally {
    window.clearTimeout(timeout);
  }
}

loadCourts();
window.addEventListener('resize', syncAreaDropdown);
