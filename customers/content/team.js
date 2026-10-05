/**
 * My Customers, slide 02: the team and the project.
 *
 * The niches are filled by the engine's niche decorator from
 * CUSTOMERS_CONFIG.PHOTOS. Set one of those to null and it renders a PHOTO
 * PENDING marker.
 */
const CUSTOMERS_TEAM_HTML = (function () {
  'use strict';

  const MEMBERS = [
    { photo: 'ali', alt: 'Ali Marateb', name: 'Ali<br>Marateb', role: 'Product Lead' },
    { photo: 'masih', alt: 'Masih Sadri', name: 'Masih<br>Sadri', role: 'Product Manager', pos: '48% 26%' },
    { photo: 'mehdi', alt: 'Mehdi Mohammad Rezaei', name: 'Mehdi<br>Mohammad Rezaei', role: 'Tech Lead', pos: '58% 38%' },
    { photo: 'ghazaleh', alt: 'Ghazaleh Ebrahimi', name: 'Ghazaleh<br>Ebrahimi', role: 'Product Designer', pos: '47% 50%' },
    { photo: 'sana', alt: 'Sana Mohammadzadeh', name: 'Sana<br>Mohammadzadeh', role: 'PM Consultant' }
  ];

  const PROJECT = '<div class="pj"><div class="k">The project</div><div class="v">Customer Management<small>A new section, <span class="fa">My Customers</span></small></div></div>' +
    '<div class="pj"><div class="k">Where it lives</div><div class="v">Partner panel<small><span class="fa">Front Office</span></small></div></div>' +
    '<div class="pj"><div class="k">Who uses it</div><div class="v">Partners<small>Independent sellers who register orders and earn commission</small></div></div>';

  function member(person) {
    return '<div class="member">' + DECK.nicheHtml(person) +
      '<div class="m-name">' + person.name + '</div>' +
      '<div class="m-role">' + person.role + '</div></div>';
  }

  return '<div class="wrap stack center">' +
    '<div class="eyebrow" data-anim>The team and the project</div>' +
    '<div class="team3" data-anim>' + MEMBERS.map(member).join('') + '</div>' +
    '<div class="proj" data-anim>' + PROJECT + '</div></div>';
})();
