(function (DECK) {
  'use strict';

  /* The six element ids a shell must provide. */
  const IDS = {
    deck: 'deck',
    ticks: 'ticks',
    counterNow: 'cNow',
    counterAll: 'cAll',
    previous: 'prevBtn',
    next: 'nextBtn'
  };

  function slideFromHash() {
    const n = parseInt((location.hash || '').replace('#', ''), 10);
    return isNaN(n) ? 0 : n - 1;
  }

  /**
   * Starts a deck. The order below is the order the two decks ran their
   * inline scripts in, and the motif build has to come before the stagger
   * for the result to be identical.
   */
  function start(options) {
    const deck = document.getElementById(IDS.deck);
    if (options.slides) DECK.renderSlides(deck, options.slides);
    (options.decorators || []).forEach(function (decorate) { decorate(deck); });
    DECK.buildMotifs(deck);
    DECK.applyStagger(deck);

    const presentation = DECK.createPresentation({
      slides: deck.querySelectorAll('.slide'),
      ticks: document.getElementById(IDS.ticks),
      counterNow: document.getElementById(IDS.counterNow),
      counterAll: document.getElementById(IDS.counterAll)
    });

    DECK.bindInput(presentation, {
      previous: document.getElementById(IDS.previous),
      next: document.getElementById(IDS.next)
    });

    presentation.show(slideFromHash());
    return presentation;
  }

  DECK.start = start;
  Object.freeze(DECK);
})(window.DECK = window.DECK || {});
