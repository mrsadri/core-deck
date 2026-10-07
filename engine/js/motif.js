(function (DECK) {
  'use strict';

  function indexList(v){
    if (v === undefined) return [];
    return v.split(',').map(function(s){ return parseInt(s, 10); });
  }

  /* ---------- arch builder: rowlock voussoirs radiating on a curve ---------- */
  function buildArch(el){
    const w = el.clientWidth;
    if (!w) return;
    const n      = parseInt(el.dataset.bricks || '13', 10);
    const depthR = parseFloat(el.dataset.depth || '0.22');
    const fill   = el.dataset.fill !== undefined ? parseInt(el.dataset.fill, 10) : n;
    const newTop = el.dataset.new  !== undefined ? parseInt(el.dataset.new, 10)  : 0;
    const key    = el.dataset.key  !== undefined;

    const R = w / 2;
    const D = R * depthR;
    const Rmid = R - D / 2;
    const slot = Math.PI * Rmid / n;
    const bw = Math.max(3, slot * 0.84);          // mortar gap

    el.style.height = R + 'px';
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

      if (i >= fill) b.classList.add('is-ghost');
      else if (newTop && i >= newStart && i < newStart + newTop) b.classList.add('is-new');
      else if (key && Math.abs(i - mid) < 0.5) b.classList.add('is-key');

      const face = document.createElement('i');
      face.style.height = D + 'px';
      b.appendChild(face);
      el.appendChild(b);
    }
  }

  /* ---------- bond builder: the same bricks, sorted into labelled courses ----
     Where the arch spans, the bond files. Bricks sit in level courses, laid
     from the ground up, and every course may carry a label. The bond reads
     the arch's whole vocabulary, so one grammar covers both geometries:
       data-bricks="n"     bricks in the wall
       data-courses="r"    courses to divide them into, the top one laid last
       data-tags="a|b|c"   one label per course, written top down, blank to skip
       data-fill="k"       only the first k bricks are laid
       data-new="k"        the last k laid bricks are the ones just added
       data-key            the footing brick, at the centre of the ground course
       data-lift="i"       one brick pulled clear of its course, a search hit
       data-place="i,j"    bricks laid in an otherwise empty wall
       data-ghostat="i,j"  bricks missing from an otherwise laid wall
     Geometry is the stylesheet's: a course is a grid of equal columns, so the
     wall needs no pixel arithmetic of its own.
     --------------------------------------------------------------------- */
  function buildBond(el){
    const n     = parseInt(el.dataset.bricks  || '12', 10);
    const rows  = parseInt(el.dataset.courses || '3', 10);
    const per   = Math.ceil(n / rows);
    const fill  = el.dataset.fill !== undefined ? parseInt(el.dataset.fill, 10) : n;
    const fresh = el.dataset.new  !== undefined ? parseInt(el.dataset.new, 10)  : 0;
    const lift  = el.dataset.lift !== undefined ? parseInt(el.dataset.lift, 10) : -1;
    const key   = el.dataset.key !== undefined ? Math.floor((per - 1) / 2) : -1;
    const placed = indexList(el.dataset.place);
    const gone   = indexList(el.dataset.ghostat);
    const tags   = (el.dataset.tags || '').split('|');

    // a lifted brick stands clear above its course, so leave the wall room
    el.style.paddingTop = lift >= 0 ? '1.7rem' : '';
    el.textContent = '';

    for (let r = 0; r < rows; r++){
      const tier = rows - 1 - r;            // the top course is the last laid
      const course = document.createElement('div');
      course.className = 'crs';

      const row = document.createElement('div');
      row.className = 'crs-row';
      row.style.setProperty('--per', per);
      let ghosts = 0;
      let news = 0;
      let count = 0;
      for (let c = 0; c < per; c++){
        const i = tier * per + c;
        if (i >= n) break;
        count++;

        const b = document.createElement('span');
        b.className = 'bk';
        b.style.setProperty('--i', i);

        if (gone.indexOf(i) > -1) { b.classList.add('is-ghost'); ghosts++; }
        else if (placed.indexOf(i) > -1) { b.classList.add('is-new'); news++; }
        else if (i === lift) b.classList.add('is-lift');
        else if (i >= fill) { b.classList.add('is-ghost'); ghosts++; }
        else if (fresh && i >= fill - fresh) { b.classList.add('is-new'); news++; }
        else if (i === key) b.classList.add('is-key');
        row.appendChild(b);
      }

      // the label carries the state of its own shelf
      if (ghosts === count) course.classList.add('is-pending');
      else if (news === count) course.classList.add('is-new');

      if (tags[r]) {
        const tag = document.createElement('span');
        tag.className = 'crs-tag';
        tag.textContent = tags[r];
        course.appendChild(tag);
      }
      course.appendChild(row);
      el.appendChild(course);
    }
  }

  /* ---------- loose bricks: the order list, before anyone owns it ----------
     Deterministic jitter, so the pile looks the same on every machine and in
     every reload.
     --------------------------------------------------------------------- */
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
   * The rebuild is deliberately total: it destroys and recreates every brick,
   * which restarts the reveal transition. The second build on load is part of
   * how the deck looks, so it stays.
   */
  function buildMotifs(root) {
    const arches = Array.prototype.slice.call(root.querySelectorAll('.arch'));
    const bonds = Array.prototype.slice.call(root.querySelectorAll('.bond'));
    const piles = Array.prototype.slice.call(root.querySelectorAll('.loose'));
    let resizeTimer = null;

    function buildAll() {
      arches.forEach(buildArch);
      bonds.forEach(buildBond);
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
