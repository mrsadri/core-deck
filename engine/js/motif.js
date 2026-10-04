(function (DECK) {
  'use strict';

  /* ---------- arch builder: rowlock voussoirs radiating on a curve ----------
     Carried over from Core, with three additions this deck needs:
       data-lift="i"       one stone pulled clear of the curve, a search hit
       data-place="i,j"    stones set in an otherwise unbuilt span
       data-ghostat="i,j"  stones missing from an otherwise built span
     ------------------------------------------------------------------------ */
  function indexList(v){
    if (v === undefined) return [];
    return v.split(',').map(function(s){ return parseInt(s, 10); });
  }

  function buildArch(el){
    const w = el.clientWidth;
    if (!w) return;
    const n      = parseInt(el.dataset.bricks || '13', 10);
    const depthR = parseFloat(el.dataset.depth || '0.22');
    const fill   = el.dataset.fill  !== undefined ? parseInt(el.dataset.fill, 10)  : n;
    const newTop = el.dataset.new   !== undefined ? parseInt(el.dataset.new, 10)   : 0;
    const key    = el.dataset.key   !== undefined;
    const lift   = el.dataset.lift  !== undefined ? parseInt(el.dataset.lift, 10)  : -1;
    const placed = indexList(el.dataset.place);
    const gone   = indexList(el.dataset.ghostat);

    const R = w / 2;
    const D = R * depthR;
    const Rmid = R - D / 2;
    const slot = Math.PI * Rmid / n;
    const bw = Math.max(3, slot * 0.84);          // mortar gap

    el.style.height = R + 'px';
    // a lifted stone stands clear above the curve, so leave it room
    el.style.marginTop = lift >= 0 ? (D * 1.15) + 'px' : '';
    el.textContent = '';

    const newStart = Math.floor((n - newTop) / 2);
    const mid = (n - 1) / 2;

    for (let i = 0; i < n; i++){
      const ang = -90 + ((i + 0.5) / n) * 180;

      const b = document.createElement('span');
      b.className = 'vsr';
      b.style.height = R + 'px';
      b.style.width = bw + 'px';
      b.style.marginLeft = (-bw / 2) + 'px';
      b.style.transform = 'rotate(' + ang.toFixed(3) + 'deg)';

      // bricks reveal outward from the springing line
      b.style.setProperty('--i', Math.round(Math.abs(i - mid)));

      if (gone.indexOf(i) > -1) b.classList.add('is-ghost');
      else if (placed.indexOf(i) > -1) b.classList.add('is-new');
      else if (i === lift) b.classList.add('is-lift');
      else if (i >= fill) b.classList.add('is-ghost');
      else if (newTop && i >= newStart && i < newStart + newTop) b.classList.add('is-new');
      else if (key && Math.abs(i - mid) < 0.5) b.classList.add('is-key');

      const face = document.createElement('i');
      face.style.height = D + 'px';
      // the lifted stone sits outside the span, clear of its neighbours
      if (i === lift) face.style.top = (-D * 0.95) + 'px';
      b.appendChild(face);
      el.appendChild(b);
    }
  }

  /* ---------- loose bricks: the order list, before anyone owns it ----------
     Deterministic jitter, so the pile looks the same on every machine
     and in every reload.
     ---------------------------------------------------------------------- */
  function jitter(i, salt){
    const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);            // 0 to 1
  }

  function buildLoose(el){
    const w = el.clientWidth;
    if (!w) return;
    const n    = parseInt(el.dataset.loose || '12', 10);
    const rows = parseInt(el.dataset.rows  || '3', 10);
    const per  = Math.ceil(n / rows);

    const bw = w / (per * 1.34);
    const bh = Math.max(5, bw * 0.3);
    const step = bh * 2.3;

    el.style.height = (rows * step) + 'px';
    el.textContent = '';

    for (let i = 0; i < n; i++){
      const row = Math.floor(i / per);
      const col = i % per;
      const slotW = w / per;

      const brick = document.createElement('span');
      brick.className = 'lb' + (jitter(i, 3) > 0.68 ? ' pale' : '');
      brick.style.width = bw + 'px';
      brick.style.height = bh + 'px';
      brick.style.left = Math.max(0, Math.min(w - bw, col * slotW + (slotW - bw) * jitter(i, 1))) + 'px';
      brick.style.top = (row * step + step * 0.18 * jitter(i, 2)) + 'px';
      brick.style.transform = 'rotate(' + ((jitter(i, 4) - 0.5) * 17).toFixed(2) + 'deg)';
      brick.style.setProperty('--i', i);
      el.appendChild(brick);
    }
  }

  /**
   * Builds every motif in the tree, and rebuilds them on resize and on load.
   *
   * The rebuild is deliberately total: it destroys and recreates every
   * brick, which restarts the reveal transition. The second build on load is
   * part of how the deck looks, so it stays.
   */
  function buildMotifs(root) {
    const arches = Array.prototype.slice.call(root.querySelectorAll('.arch'));
    const piles = Array.prototype.slice.call(root.querySelectorAll('.loose'));
    let resizeTimer = null;

    function buildAll() {
      arches.forEach(buildArch);
      piles.forEach(buildLoose);
    }

    buildAll();
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildAll, 120);
    });
    window.addEventListener('load', buildAll);
  }

  DECK.buildMotifs = buildMotifs;
})(window.DECK = window.DECK || {});
