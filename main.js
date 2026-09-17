const siteHeader = document.createElement('header');
const siteTitle = document.createElement('a');
const siteFooter = document.createElement('footer');
const isHomePage = document.body.classList.contains('home-page');

siteHeader.className = 'site-header';
siteTitle.href = 'index.html';
siteTitle.textContent = isHomePage ? 'blakeworld' : 'Blakeworld';
siteHeader.append(siteTitle);

siteFooter.className = 'site-footer';
siteFooter.textContent = isHomePage
	? 'unofficial fan/curation site. not affiliated with the artists, people, or organizations featured.'
	: 'Unofficial fan/curation site. Not affiliated with the artists, people, or organizations featured.';

document.body.prepend(siteHeader);
document.body.append(siteFooter);

let activePhoto = null;

function syncPhotoLightbox() {
	const photo = document.querySelector('.photo-lightbox:target');
	if (photo) {
		activePhoto = photo;
		photo.querySelector('.photo-lightbox-close').focus();
	} else if (activePhoto) {
		const thumbnail = document.querySelector(`.photo-link[href="#${activePhoto.id}"]`);
		thumbnail?.focus();
		activePhoto = null;
	}
}

window.addEventListener('hashchange', syncPhotoLightbox);
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && document.querySelector('.photo-lightbox:target')) {
		event.preventDefault();
		history.replaceState(null, '', window.location.pathname + window.location.search);
		syncPhotoLightbox();
	}
});
syncPhotoLightbox();

const datesToggle = document.querySelector('.archive-dates-toggle');

const archiveOrder = document.querySelector('#archive-order');
if (archiveOrder) {
	const archiveList = document.querySelector('#archive-entries');
	// The HTML order is Blake's ranking; keep it when dates tie, too.
	const heartOrder = Array.from(archiveList.children);
	archiveOrder.value = 'heart';
	document.querySelector('.archive-sort').hidden = false;
	archiveOrder.addEventListener('change', () => {
		const byDate = archiveOrder.value === 'date';
		const ordered = [...heartOrder];
		if (byDate) {
			ordered.sort((a, b) =>
				(Date.parse(b.dataset.added) || 0) - (Date.parse(a.dataset.added) || 0));
		} else if (archiveOrder.value === 'love') {
			ordered.sort((a, b) =>
				(Number(a.dataset.loveOrder) || Number.MAX_SAFE_INTEGER)
				- (Number(b.dataset.loveOrder) || Number.MAX_SAFE_INTEGER));
		}
		archiveList.append(...ordered);
		document.querySelector('.archive-ordering-note').textContent = byDate
			? 'ordered by date added, newest first'
			: archiveOrder.value === 'love'
				? 'when i fell in love with it, newest to oldest; entries not yet placed in this timeline appear at the end'
				: 'closest to my heart / most enduring';
	});
}

if (datesToggle) {
	const dateFormat = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/Chicago',
		month: 'short', day: 'numeric', year: 'numeric',
		hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
	});
	const dateLabels = [];
	document.querySelectorAll('.archive-content nav a').forEach((link) => {
		const date = new Date(link.dataset.added || '');
		const validDate = !Number.isNaN(date.getTime());
		const label = document.createElement(validDate ? 'time' : 'span');
		label.className = 'archive-entry-date';
		label.hidden = true;
		if (validDate) {
			label.dateTime = link.dataset.added;
			label.textContent = dateFormat.format(date).toLowerCase();
		} else {
			label.textContent = 'date not recorded';
		}
		link.append(label);
		dateLabels.push(label);
	});
	datesToggle.hidden = false;
	datesToggle.addEventListener('click', () => {
		const showDates = datesToggle.getAttribute('aria-pressed') !== 'true';
		datesToggle.setAttribute('aria-pressed', String(showDates));
		datesToggle.textContent = showDates ? 'hide dates' : 'show dates entry was added';
		document.querySelector('.archive-dates-note').hidden = !showDates;
		dateLabels.forEach((label) => { label.hidden = !showDates; });
	});
}
