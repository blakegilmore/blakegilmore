const photographyPage = document.querySelector('.photography-page');

if (photographyPage) {
	const lightbox = document.createElement('div');
	const enlargedImage = document.createElement('img');
	const closeButton = document.createElement('button');

	lightbox.className = 'photo-lightbox';
	lightbox.hidden = true;
	lightbox.setAttribute('aria-label', 'Enlarged photograph');
	closeButton.type = 'button';
	closeButton.setAttribute('aria-label', 'Close enlarged photograph');
	closeButton.textContent = 'x';
	lightbox.append(enlargedImage, closeButton);
	photographyPage.append(lightbox);

	const closeLightbox = () => {
		lightbox.hidden = true;
		document.body.style.overflow = '';
	};

	photographyPage.querySelectorAll(':scope > img').forEach((photo) => {
		photo.addEventListener('click', () => {
			enlargedImage.src = photo.src;
			enlargedImage.alt = photo.alt;
			lightbox.hidden = false;
			document.body.style.overflow = 'hidden';
		});
	});

	closeButton.addEventListener('click', closeLightbox);
	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !lightbox.hidden) {
			closeLightbox();
		}
	});
}
