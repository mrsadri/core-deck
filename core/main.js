/**
 * Core. The shell has loaded the engine, the config and every act. This is
 * the only place that fixes the slide order.
 */
DECK.start({
  slides: CORE_SLIDES_OPENING
    .concat(CORE_SLIDES_PROBLEM)
    .concat(CORE_SLIDES_PLATFORM)
    .concat(CORE_SLIDES_VOCABULARY)
    .concat(CORE_SLIDES_CLOSING),
  decorators: [CORE_COPY]
});
