/**
 * Core: puts the config's copy into the slides that carry a placeholder.
 */
const CORE_COPY = (function () {
  'use strict';

  return function (root) {
    root.querySelectorAll('.js-dur').forEach(function (el) {
      el.textContent = CORE_CONFIG.TODAY_DURATION_SMALL;
    });
    root.querySelectorAll('.js-dur-cap').forEach(function (el) {
      el.textContent = CORE_CONFIG.TODAY_DURATION;
    });

    const rfs = root.querySelector('#rfsExpand');
    rfs.textContent = CORE_CONFIG.RFS_EXPANSION;
    if (CORE_CONFIG.RFS_CONFIRMED) {
      rfs.classList.remove('tbd');
    } else {
      const tag = document.createElement('em');
      tag.textContent = 'to confirm';
      rfs.appendChild(tag);
    }
  };
})();
