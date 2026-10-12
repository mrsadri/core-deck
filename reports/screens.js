/**
 * Front Office Reports: fills every wireframe frame, or marks it pending.
 * The highlights a slide lays over a frame stay in place when the image
 * loads, and go with everything else when the frame turns pending.
 */
const REPORTS_SCREENS = (function () {
  'use strict';

  /* ---------- pending marker, in the voice of the other decks ---------- */
  function pendingShot(box, what, key){
    box.classList.add('is-pending');
    box.innerHTML = '';
    const b = document.createElement('div');
    b.className = 'shot-pending';
    const t = document.createElement('span'); t.className = 'tag'; t.textContent = 'wireframe pending';
    const k = document.createElement('div');  k.className = 'key'; k.textContent = key;
    const w = document.createElement('div');  w.className = 'what'; w.textContent = what;
    b.appendChild(t); b.appendChild(k); b.appendChild(w);
    box.appendChild(b);
  }

  return function (root) {
    root.querySelectorAll('[data-shot]').forEach(function (box) {
      const key  = box.dataset.shot;
      const what = box.dataset.what || '';
      const src  = REPORTS_CONFIG.SCREENSHOTS[key];
      if (!src){
        pendingShot(box, what, key);
        return;
      }
      const img = document.createElement('img');
      img.alt = what;
      img.addEventListener('error', function(){ pendingShot(box, what, key); });
      img.src = src;
      box.appendChild(img);
    });
  };
})();
