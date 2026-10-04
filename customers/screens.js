/**
 * My Customers: fills every panel screenshot frame, or marks it pending.
 * The pending marker speaks in the same voice as Core's TO CONFIRM.
 */
const CUSTOMERS_SCREENS = (function () {
  'use strict';

  /* ---------- pending markers, in the voice of Core's TO CONFIRM ---------- */
  function pendingShot(box, tag, what, key){
    box.classList.add('is-pending');
    box.innerHTML = '';
    const b = document.createElement('div');
    b.className = 'shot-pending';
    const t = document.createElement('span'); t.className = 'tag'; t.textContent = tag;
    const k = document.createElement('div');  k.className = 'key'; k.textContent = key;
    const w = document.createElement('div');  w.className = 'what'; w.textContent = what;
    b.appendChild(t); b.appendChild(k); b.appendChild(w);
    box.appendChild(b);
    const r = document.createElement('span');
    r.className = 'shot-ratio-note';
    r.textContent = '1280 × 832';
    box.appendChild(r);
  }

  return function (root) {
    root.querySelectorAll('[data-shot]').forEach(function (box) {
      const key  = box.dataset.shot;
      const what = box.dataset.what || '';
      const src  = CUSTOMERS_CONFIG.SCREENSHOTS[key];
      if (!src){
        pendingShot(box, 'screenshot pending', what, key);
        return;
      }
      const img = document.createElement('img');
      img.alt = what;
      img.addEventListener('error', function(){ pendingShot(box, 'screenshot pending', what, key); });
      img.src = src;
      box.appendChild(img);
    });
  };
})();
