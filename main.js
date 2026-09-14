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
