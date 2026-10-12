/**
 * Front Office Reports, slide 02: the project and the product.
 *
 * The niches are filled by the engine's niche decorator from
 * REPORTS_CONFIG.PHOTOS. A key with no file behind it renders a PHOTO
 * PENDING marker.
 */
const REPORTS_TEAM_HTML = (function () {
  'use strict';

  const MEMBERS = [
    { photo: 'amir', alt: 'Amir Souri', name: 'Amir<br>Souri', role: 'Product Designer and PM' },
    { photo: 'amirreza', alt: 'Amir Reza Mahouti', name: 'Amir Reza<br>Mahouti', role: 'Consultant' }
  ];

  const FACTS = '<div class="fact"><dt>Project</dt><dd>Front Office Reports Redesign</dd></div>' +
    '<div class="fact"><dt>Where it lives</dt><dd>Partner Panel / Front Office</dd></div>' +
    '<div class="fact"><dt>Primary user</dt><dd>Insurance sales Partners</dd></div>' +
    '<div class="fact"><dt>Areas covered</dt><dd class="list">Dashboard, Sales &amp; Commission visibility, Payments, Network Sales, Campaigns &amp; Rewards</dd></div>';

  function member(person) {
    return '<div class="member">' + DECK.nicheHtml(person) +
      '<div class="m-name">' + person.name + '</div>' +
      '<div class="m-role">' + person.role + '</div></div>';
  }

  return '<div class="wrap stack center">' +
    '<div class="eyebrow" data-anim>The project and the product</div>' +
    '<div class="ctx" data-anim>' +
    '<div class="duo">' + MEMBERS.map(member).join('') + '</div>' +
    '<dl class="facts">' + FACTS + '</dl></div>' +
    '<p class="support" data-anim>Partners may earn through direct sales, network activity, campaigns, and other commission-based flows.</p></div>';
})();
