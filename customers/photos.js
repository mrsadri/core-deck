/**
 * My Customers: fills the five niches on the team slide.
 */
const CUSTOMERS_PHOTOS = (function () {
  'use strict';

  return function (root) {
    root.querySelectorAll('[data-photo]').forEach(function (niche) {
      const who = niche.dataset.photo;
      const alt = niche.dataset.alt || '';
      const src = CUSTOMERS_CONFIG.PHOTOS[who];
      function pendingPhoto(){
        niche.classList.add('is-pending');
        niche.innerHTML = '<div class="inner"><span class="tag">photo<br>pending</span></div>';
      }
      if (!src){ pendingPhoto(); return; }
      const img = document.createElement('img');
      img.alt = alt;
      if (niche.dataset.pos) img.style.objectPosition = niche.dataset.pos;
      img.addEventListener('error', pendingPhoto);
      img.src = src;
      niche.appendChild(img);
    });
  };
})();
