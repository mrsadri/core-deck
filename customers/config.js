/**
 * My Customers: everything that needs filling before presenting.
 * PRESENTING.md lists what is still open and points back here.
 *
 * SCREENSHOTS maps a slide key to an image under ../assets/screens/.
 * Leave a value as null, or point it at a file that is not there,
 * and the slide renders a dotted frame tagged SCREENSHOT PENDING so
 * the deck cannot be presented half dressed by accident.
 *
 * Captures are laid out for 1280 x 832. If the real ones come back
 * at another size, change --shot-ratio once in css/tokens.css.
 */
const CUSTOMERS_CONFIG = Object.freeze({
  SCREENSHOTS: Object.freeze({
    p2_f2: '../assets/screens/p2_f2.png',   // slide 06  the customer list, opening into a profile
    p3_f5: '../assets/screens/p3_f5.png',   // slide 07  the policies list, with status and file
    p4_f4: '../assets/screens/p4_f4.png',   // slide 08  a vehicle's documents and related policies
    p5_f6: '../assets/screens/p5_f6.png',   // slide 09  the financial status view
    f7:    '../assets/screens/f7.png',      // slide 10  Notes in the profile
    f8:    '../assets/screens/f8.png'       // slide 11  adding a prospective customer by hand
  }),

  // Team photos for slide 02, all five from the shared team
  // assets. Set one to null and that niche renders a PHOTO PENDING tag.
  PHOTOS: Object.freeze({
    ali:      '../assets/team/ali-marateb.jpg',
    ghazaleh: '../assets/team/ghazale-ebrahimi.jpg',
    mehdi:    '../assets/team/mehdi-mohammad-rezaei.jpg',
    masih:    '../assets/team/masih-sadri.jpg',
    sana:     '../assets/team/sana-mohammadzadeh.jpg'
  })
});
