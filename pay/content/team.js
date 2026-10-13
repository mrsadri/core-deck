/**
 * Pay Link, slide 02: the project and the product.
 *
 * The niche is filled by the engine's niche decorator from
 * PAY_CONFIG.PHOTOS. A key with no file behind it renders a PHOTO PENDING
 * marker.
 */
const PAY_TEAM_HTML = (function () {
  'use strict';

  const MEMBERS = [
    { photo: 'mohammadreza', alt: 'Mohammadreza Hosseinzadeh', name: 'Mohammadreza<br>Hosseinzadeh', role: 'Backend' }
  ];

  const FACTS = '<div class="fact"><dt>Project</dt><dd>Recipient payment link</dd></div>' +
    '<div class="fact"><dt>Where it lives</dt><dd>Partner Panel / Front Office</dd></div>' +
    '<div class="fact"><dt>Who uses it</dt><dd>Sellers, and the customers they send a link to</dd></div>' +
    '<div class="fact"><dt>What it covers</dt><dd class="list">BimeBazar body and health invoices, paid in cash or with BimeBazar BNPL</dd></div>';

  function member(person) {
    return '<div class="member">' + DECK.nicheHtml(person) +
      '<div class="m-name">' + person.name + '</div>' +
      '<div class="m-role">' + person.role + '</div></div>';
  }

  return '<div class="wrap stack center">' +
    '<div class="eyebrow" data-anim>The project and the product</div>' +
    '<div class="ctx" data-anim>' +
    '<div class="solo">' + MEMBERS.map(member).join('') + '</div>' +
    '<dl class="facts">' + FACTS + '</dl></div>' +
    '<p class="support" data-anim>Until now the seller had to be the one who paid. Now the seller can hand the invoice to the customer.</p></div>';
})();
