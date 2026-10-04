(function (DECK) {
  'use strict';

  /* The enter order: an element takes the beat its slide declares in data-d,
     and its position in the slide otherwise. */
  function applyStagger(root) {
    root.querySelectorAll('.slide').forEach(function (slide) {
      slide.querySelectorAll('[data-anim]').forEach(function (el, i) {
        const declared = el.dataset.d;
        el.style.setProperty('--d', declared === undefined ? i : declared);
      });
    });
  }

  DECK.applyStagger = applyStagger;
})(window.DECK = window.DECK || {});
