(function (DECK) {
  'use strict';

  /**
   * Turns a deck's slides into sections in the mount, in array order.
   *
   * A slide is {id, name, html}: id is its stable handle, name is its line
   * from the deck's narrative arc, html is the markup that sits inside the
   * section. Whitespace at the edges of html becomes a text node, which the
   * slide's grid does not render.
   */
  function renderSlides(mount, slides) {
    mount.textContent = '';
    slides.forEach(function (slide) {
      const section = document.createElement('section');
      section.className = 'slide';
      section.innerHTML = slide.html;
      mount.appendChild(section);
    });
  }

  DECK.renderSlides = renderSlides;
})(window.DECK = window.DECK || {});
