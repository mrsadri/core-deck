/**
 * The homepage. One engine primitive and nothing else: the arch builder
 * draws the small arch over each card. There are no slides here, so the
 * deck lifecycle never starts and DECK is left unfrozen.
 *
 * The entrance and the resting state are pure CSS, so both cards stay
 * readable and clickable whether or not this file runs.
 */
(function (DECK) {
  'use strict';

  const home = document.getElementById('home');
  if (home && DECK && DECK.buildMotifs) DECK.buildMotifs(home);
})(window.DECK);
