/**
 * Core: everything that needs a decision before presenting.
 * PRESENTING.md lists what is still open and points back here.
 */
const CORE_CONFIG = Object.freeze({
  // Confirm with the team, then set RFS_CONFIRMED to true to drop the marker.
  RFS_EXPANSION: 'Request For Submission',
  RFS_CONFIRMED: false,

  // How long a new line takes today. Swap in the real figure if you have it.
  TODAY_DURATION: 'Months',               // used on the big before/after slide
  TODAY_DURATION_SMALL: 'months of work', // used under each repeated arch

  // Every portrait on the team slide, in the order it is set. Set one to
  // null and that niche renders a PHOTO PENDING marker in its place.
  PHOTOS: Object.freeze({
    mehdi:         'assets/team/mehdi-mohammad-rezaei.jpg',
    mohammadreza:  'assets/team/mohammadreza-hosseinzadeh.jpg',
    amirhossein:   'assets/team/amirhossein-khanzadeh.jpg',
    shabnam:       'assets/team/shabnam-nouri.jpg',
    masih:         'assets/team/masih-sadri.jpg',
    vida:          'assets/team/vida-golzadeh.jpg',
    claude:        'assets/team/claude-mark.svg',
    javid:         'assets/team/javid-izadfar.jpg',
    sana:          'assets/team/sana-mohammadzadeh.jpg',
    amirreza:      'assets/team/amirreza-mahouti.jpg',
    hamid:         'assets/team/hamid-bahrampour.jpg',
    reza:          'assets/team/reza-kashani.jpg',
    mohammadmahdi: 'assets/team/mohammadmahdi-khakdaman.jpg',
    ali:           'assets/team/ali-bayat.jpg'
  })
});
