/**
 * S. P. PATEL PUBLIC SCHOOL — GALLERY & LIGHTBOX JAVASCRIPT
 * Responsive Grid, Category Filtering, Fullscreen Lightbox & Touch Gestures
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let activeItems = [];
  let currentIndex = 0;

  // 1. Category Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
      updateActiveItems();
    });
  });

  const updateActiveItems = () => {
    activeItems = Array.from(galleryCards).filter((card) => card.style.display !== 'none');
  };
  updateActiveItems();

  // 2. Open Lightbox
  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      updateActiveItems();
      currentIndex = activeItems.indexOf(card);
      if (currentIndex === -1) currentIndex = 0;
      showLightboxImage(currentIndex);
    });
  });

  const showLightboxImage = (index) => {
    if (!lightbox || activeItems.length === 0) return;
    const item = activeItems[index];
    const img = item.querySelector('.gallery-img');
    const title = item.getAttribute('data-title') || img?.getAttribute('alt') || 'Campus View';
    const category = item.getAttribute('data-category') || 'Gallery';
    const src = img?.getAttribute('src');

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.innerHTML = `<span>${title}</span> <small style="display:block; font-size:0.8rem; color:var(--color-secondary); font-family:var(--font-body); text-transform:uppercase; margin-top:2px;">${category}</small>`;
    if (lightboxCounter) lightboxCounter.textContent = `Image ${index + 1} of ${activeItems.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (activeItems.length <= 1) return;
    currentIndex = (currentIndex + 1) % activeItems.length;
    showLightboxImage(currentIndex);
  };

  const showPrev = () => {
    if (activeItems.length <= 1) return;
    currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
    showLightboxImage(currentIndex);
  };

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', showNext);
  prevBtn?.addEventListener('click', showPrev);

  // Close when clicking outside image
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // 3. Keyboard navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // 4. Touch swipe detection for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext(); // Swiped left -> next
    } else if (touchEndX > touchStartX + swipeThreshold) {
      showPrev(); // Swiped right -> prev
    }
  };
});
