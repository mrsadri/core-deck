/**
 * Core, slide 02: the team, in two tiers.
 *
 * Both tiers share one tile size, so every member is set at the same weight.
 * The niches are filled by the engine's niche decorator from
 * CORE_CONFIG.PHOTOS.
 */
const CORE_TEAM_HTML = (function () {
  'use strict';

  const LEADS = [
    { photo: 'mehdi', alt: 'Mehdi Mohammad Rezaei', name: 'Mehdi<br>Mohammad Rezaei', role: 'Tech Lead', pos: '58% 38%' },
    { photo: 'mohammadreza', alt: 'MohammadReza HosseinZadeh', name: 'MohammadReza<br>HosseinZadeh', role: 'Backend', pos: '34% 26%' },
    { photo: 'amirhossein', alt: 'AmirHossein KhanZadeh', name: 'AmirHossein<br>KhanZadeh', role: 'Backend', pos: '46% 42%', scale: '1.06' },
    { photo: 'shabnam', alt: 'Shabnam Nouri', name: 'Shabnam<br>Nouri', role: 'Frontend', pos: '50% 22%' },
    { photo: 'masih', alt: 'Masih Sadri', name: 'Masih<br>Sadri', role: 'Designer', pos: '48% 26%' },
    { photo: 'vida', alt: 'Vida GolZadeh', name: 'Vida<br>GolZadeh', role: 'QA' },
    { photo: 'claude', alt: 'Claude', name: 'Claude<br>by Anthropic', role: 'AI assistant', glyph: true }
  ];

  const WIDER = [
    { photo: 'javid', name: 'Javid IzadFar', role: 'Frontend' },
    { photo: 'sana', name: 'Sana MohammadZadeh', role: 'PM' },
    { photo: 'amirreza', name: 'AmirReza Mahouti', role: 'APM' },
    { photo: 'hamid', name: 'Hamid BahramPour', role: 'Backend' },
    { photo: 'reza', name: 'Reza Kashani', role: 'Backend' },
    { photo: 'mohammadmahdi', name: 'MohammadMahdi Khakdaman', role: 'CRM Engineer' },
    { photo: 'ali', name: 'Ali Bayat', role: 'CRM Engineer' }
  ];

  function lead(member) {
    return '<div class="member">' + DECK.nicheHtml(member) +
      '<div class="m-name">' + member.name + '</div>' +
      '<div class="m-role">' + member.role + '</div></div>';
  }

  function wider(member) {
    return '<div class="wm">' + DECK.nicheHtml(member) +
      '<b>' + member.name + '</b><i>' + member.role + '</i></div>';
  }

  return '<div class="wrap stack center">' +
    '<div class="eyebrow" data-anim>The team</div>' +
    '<div class="team" data-anim>' + LEADS.map(lead).join('') + '</div>' +
    '<div class="wider" data-anim>' +
    '<div class="wider-label"><span>And the wider team</span></div>' +
    '<div class="wider-row">' + WIDER.map(wider).join('') + '</div>' +
    '</div></div>';
})();
