/**
 * Pay Link: fills every [data-rail] with the seven stops of a payment.
 *
 * The attribute is the stop a slide is about, counted from 1. Every stop
 * before it is already behind the user, so it is solid; the stop itself is
 * the orange one; every stop after it is still ahead, so it is dashed.
 * A value of 0 means the whole route, with no stop singled out.
 */
const PAY_RAIL = (function () {
  'use strict';

  const STOPS = ['Link', 'Send', 'Open', 'Code', 'Invoice', 'Pay', 'Paid'];

  function stop(label, index, current) {
    const el = document.createElement('div');
    el.className = 'rs';
    if (current && index === current) el.classList.add('is-key');
    if (current && index > current) el.classList.add('is-off');
    const mark = document.createElement('i');
    const key = document.createElement('span');
    key.className = 'rk';
    key.textContent = label;
    el.appendChild(mark);
    el.appendChild(key);
    return el;
  }

  return function (root) {
    root.querySelectorAll('[data-rail]').forEach(function (rail) {
      const current = parseInt(rail.dataset.rail, 10) || 0;
      STOPS.forEach(function (label, i) {
        rail.appendChild(stop(label, i + 1, current));
      });
    });
  };
})();
