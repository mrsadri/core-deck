(function (DECK) {
  'use strict';

  /**
   * The niche: one portrait frame, shared by every deck.
   *
   * A deck's team content puts the element in place with nicheHtml, and the
   * decorator fills it once the deck starts. A key with no value in the
   * deck's photo map, or a file that will not load, renders a PHOTO PENDING
   * marker in the same voice as the screenshot frames.
   */
  function nicheHtml(member) {
    return '<div class="niche" data-photo="' + member.photo +
      '" data-alt="' + (member.alt || member.name) + '"' +
      (member.pos ? ' data-pos="' + member.pos + '"' : '') +
      (member.scale ? ' data-scale="' + member.scale + '"' : '') +
      (member.glyph ? ' data-glyph' : '') +
      '></div>';
  }

  function pending(niche) {
    niche.classList.add('is-pending');
    niche.innerHTML = '<div class="inner"><span class="tag">photo<br>pending</span></div>';
  }

  /* an official mark, unmodified, in its own colour */
  function glyph(niche, src, alt) {
    niche.classList.add('glyph');
    niche.innerHTML = '<div class="inner"><img class="mark" src="' + src +
      '" alt="' + alt + '" width="248" height="248" loading="eager"></div>';
  }

  function photo(niche, src, alt) {
    const img = document.createElement('img');
    img.alt = alt;
    if (niche.dataset.pos) img.style.objectPosition = niche.dataset.pos;
    if (niche.dataset.scale) img.style.transform = 'scale(' + niche.dataset.scale + ')';
    img.addEventListener('error', function () { pending(niche); });
    img.src = src;
    niche.appendChild(img);
  }

  function createNicheDecorator(photos) {
    return function (root) {
      root.querySelectorAll('[data-photo]').forEach(function (niche) {
        const alt = niche.dataset.alt || '';
        const src = photos[niche.dataset.photo];
        if (!src) { pending(niche); return; }
        if (niche.dataset.glyph !== undefined) { glyph(niche, src, alt); return; }
        photo(niche, src, alt);
      });
    };
  }

  DECK.nicheHtml = nicheHtml;
  DECK.createNicheDecorator = createNicheDecorator;
})(window.DECK = window.DECK || {});
