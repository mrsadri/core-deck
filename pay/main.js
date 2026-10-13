/**
 * Pay Link. The shell has loaded the engine, the config and every act.
 * This is the only place that fixes the slide order.
 */
DECK.start({
  slides: PAY_SLIDES_OPENING
    .concat(PAY_SLIDES_SELLER)
    .concat(PAY_SLIDES_CUSTOMER)
    .concat(PAY_SLIDES_PAY)
    .concat(PAY_SLIDES_AFTER),
  decorators: [PAY_RAIL, DECK.createNicheDecorator(PAY_CONFIG.PHOTOS)]
});
