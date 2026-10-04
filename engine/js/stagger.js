(function (DECK) {
  'use strict';

  /* The enter order: an element keeps a --d it already declares, and takes
     its position in the slide otherwise. */
  function applyStagger(root) {
    root.querySelectorAll('.slide').forEach(function (slide) {
      slide.querySelectorAll('[data-anim]').forEach(function (el, i) {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i);
      });
    });
  }

  DECK.applyStagger = applyStagger;
})(window.DECK = window.DECK || {});
