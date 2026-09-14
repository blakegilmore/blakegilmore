const siteHeader = document.createElement('header');
const siteTitle = document.createElement('a');
const siteFooter = document.createElement('footer');

siteHeader.className = 'site-header';
siteTitle.href = 'index.html';
siteTitle.textContent = 'Blakeworld';
siteHeader.append(siteTitle);

siteFooter.className = 'site-footer';
siteFooter.textContent = 'Unofficial fan/curation site. Not affiliated with the artists, people, or organizations featured.';

document.body.prepend(siteHeader);
document.body.append(siteFooter);
