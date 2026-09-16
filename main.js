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
