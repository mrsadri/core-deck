/**
 * Front Office Reports: everything that needs filling before presenting.
 * PRESENTING.md lists what is still open and points back here.
 *
 * SCREENSHOTS maps a frame key to a wireframe under ../assets/screens/.
 * Leave a value as null, or point it at a file that is not there, and the
 * slide renders a dotted frame tagged WIREFRAME PENDING so the deck cannot
 * be presented half dressed by accident.
 *
 * Each frame takes the proportions of its own wireframe, set next to the
 * frame in css/screens.css. A wireframe that comes back at another size
 * needs its ratio changed there, and its highlights checked in css/pins.css.
 */
const REPORTS_CONFIG = Object.freeze({
  SCREENSHOTS: Object.freeze({
    dashboard: '../assets/screens/reports-dashboard.png',          // slide 06  the whole dashboard
    sales:     '../assets/screens/reports-sales.png',              // slide 07  the totals, order status and the breakdown table
    payments:  '../assets/screens/reports-payments.png',           // slide 08  the payments list, one row expanded
    network:   '../assets/screens/reports-network.png',            // slide 09  the network section of the dashboard
    campaigns: '../assets/screens/reports-campaigns.png',          // slide 10  the campaigns list
    progress:  '../assets/screens/reports-campaign-progress.png',  // slide 11  campaign detail: progress, reward, payout
    rules:     '../assets/screens/reports-campaign-rules.png'      // slide 11  campaign detail: what counts as an eligible sale
  }),

  // Team photos for slide 02, both from the shared team assets. Set one to
  // null and that niche renders a PHOTO PENDING tag.
  PHOTOS: Object.freeze({
    amir:     '../assets/team/amir-souri.jpg',
    amirreza: '../assets/team/amirreza-mahouti.jpg'
  })
});
