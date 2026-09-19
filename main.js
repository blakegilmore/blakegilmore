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

const birthdayBanner = document.querySelector('.birthday-banner');
if (birthdayBanner) {
	const birthdayEnds = Date.parse('2026-09-20T00:00:00-05:00');
	function updateBirthdayVisibility() {
		if (Date.now() >= birthdayEnds) {
			birthdayBanner.remove();
			document.removeEventListener('visibilitychange', updateBirthdayVisibility);
		} else {
			birthdayBanner.hidden = false;
			setTimeout(updateBirthdayVisibility, Math.min(birthdayEnds - Date.now(), 2147483647));
		}
	}
	document.addEventListener('visibilitychange', updateBirthdayVisibility);
	updateBirthdayVisibility();
	const pauseButton = birthdayBanner.querySelector('.birthday-pause');
	pauseButton.hidden = false;
	pauseButton.addEventListener('click', () => {
		const paused = birthdayBanner.classList.toggle('is-paused');
		pauseButton.setAttribute('aria-pressed', String(paused));
		pauseButton.textContent = paused ? 'play banner' : 'pause banner';
	});
}

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

const archiveOrder = document.querySelector('#archive-order');
if (archiveOrder) {
	const archiveList = document.querySelector('#archive-entries');
	// The HTML order is Blake's ranking.
	const heartOrder = Array.from(archiveList.children);
	archiveOrder.value = 'heart';
	document.querySelector('.archive-sort').hidden = false;
	archiveOrder.addEventListener('change', () => {
		const ordered = [...heartOrder];
		if (archiveOrder.value === 'love') {
			ordered.sort((a, b) =>
				(Number(a.dataset.loveOrder) || Number.MAX_SAFE_INTEGER)
				- (Number(b.dataset.loveOrder) || Number.MAX_SAFE_INTEGER));
		}
		archiveList.append(...ordered);
		document.querySelector('.archive-ordering-note').textContent = archiveOrder.value === 'love'
				? 'when i fell in love with it, newest to oldest; entries not yet placed in this timeline appear at the end'
				: 'closest to my heart / most enduring';
	});
}
