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
  TODAY_DURATION_SMALL: 'months of work'  // used under each repeated arch
});
