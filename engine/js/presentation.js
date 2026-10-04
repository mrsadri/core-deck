(function (DECK) {
  'use strict';

  /**
   * Holds which slide is showing. This closure is the deck's only mutable
   * state, and nothing outside it can reach the index.
   */
  function createPresentation(options) {
    const slides = options.slides;
    const total = slides.length;
    const tickRow = options.ticks;
    let index = 0;

    for (let t = 0; t < total; t++) tickRow.appendChild(document.createElement('b'));
    const tickEls = tickRow.children;
    options.counterAll.textContent = '/ ' + String(total).padStart(2, '0');

    function show(n) {
      index = Math.max(0, Math.min(total - 1, n));
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      for (let i = 0; i < total; i++) tickEls[i].classList.toggle('on', i <= index);
      options.counterNow.textContent = String(index + 1).padStart(2, '0');
      if (location.hash !== '#' + (index + 1)) history.replaceState(null, '', '#' + (index + 1));
    }

    return {
      show: show,
      next: function () { show(index + 1); },
      prev: function () { show(index - 1); },
      total: total
    };
  }

  DECK.createPresentation = createPresentation;
})(window.DECK = window.DECK || {});
