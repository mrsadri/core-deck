/**
 * Front Office Reports. The shell has loaded the engine, the config and
 * every act. This is the only place that fixes the slide order.
 */
DECK.start({
  slides: REPORTS_SLIDES_OPENING
    .concat(REPORTS_SLIDES_MONEY)
    .concat(REPORTS_SLIDES_NETWORK)
    .concat(REPORTS_SLIDES_CLOSING),
  decorators: [REPORTS_SCREENS, DECK.createNicheDecorator(REPORTS_CONFIG.PHOTOS)]
});
