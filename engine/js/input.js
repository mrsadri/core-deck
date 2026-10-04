(function (DECK) {
  'use strict';

  /**
   * Keyboard, click, button and touch input.
   *
   * Three known issues are deliberately preserved here, deferred to a later
   * pass: Enter, Space and Backspace are claimed for the whole document, a
   * click anywhere advances the deck, and requestFullscreen is unguarded.
   */
  function bindInput(presentation, buttons) {
    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
          e.preventDefault(); presentation.next(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
          e.preventDefault(); presentation.prev(); break;
        case 'Home': e.preventDefault(); presentation.show(0); break;
        case 'End': e.preventDefault(); presentation.show(presentation.total - 1); break;
        case 'f': case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
      }
    });

    /* click: right side forward, far left back */
    document.addEventListener('click', function (e) {
      if (e.clientX < window.innerWidth * 0.14) presentation.prev();
      else presentation.next();
    });

    buttons.previous.addEventListener('click', function (e) {
      e.stopPropagation();
      presentation.prev();
    });
    buttons.next.addEventListener('click', function (e) {
      e.stopPropagation();
      presentation.next();
    });

    /* touch */
    let touchX = null;
    document.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) { dx < 0 ? presentation.next() : presentation.prev(); }
      touchX = null;
    }, { passive: true });
  }

  DECK.bindInput = bindInput;
})(window.DECK = window.DECK || {});
