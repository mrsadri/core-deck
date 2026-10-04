/**
 * My Customers. The shell has loaded the engine, the config and every act.
 * This is the only place that fixes the slide order.
 */
DECK.start({
  slides: CUSTOMERS_SLIDES_OPENING
    .concat(CUSTOMERS_SLIDES_PHASE_ONE)
    .concat(CUSTOMERS_SLIDES_BEYOND)
    .concat(CUSTOMERS_SLIDES_CLOSING),
  decorators: [CUSTOMERS_SCREENS, CUSTOMERS_PHOTOS]
});
