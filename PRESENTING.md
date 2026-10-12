# Before presenting

Everything on this list is a real decision, not a formatting detail. Each one
renders a visible marker until it is settled, so neither deck can be presented
half dressed by accident.

## Core

- [ ] **The RFS expansion.** `core/config.js`, `RFS_EXPANSION`. It currently
  reads "Request For Submission", a placeholder, and renders with a dotted
  underline and a TO CONFIRM tag. Confirm the wording the team actually uses,
  set it, then set `RFS_CONFIRMED: true` to remove the marker.
- [ ] **How long a new line takes today.** `core/config.js`,
  `TODAY_DURATION` and `TODAY_DURATION_SMALL`. They read "Months" and "months
  of work" because no real figure was available. A specific number lands
  considerably harder on slide 08.

## My Customers

All six panel screenshots and all five team photos are in place: nothing in
`customers/config.js` is still `null`. If the real captures ever come back at
a size other than 1280 x 832, change `--shot-ratio` once in
`engine/css/tokens.css` and every frame follows.

- [ ] **The tech lead's name.** `customers/content/team.js`. The deck follows
  the spelling used in the Core deck, "Mehdi Mohammad Rezaei". Confirm it.
- [ ] **The social card.** `assets/social/customers.png` is a render of the deck's
  own title slide, made with headless Chrome. It is a placeholder for a
  designed card, not a design. Replace it if the deck is shared widely.

## Front Office Reports

All seven wireframes are in place in `assets/screens/`, and both team photos
in `assets/team/`.

- [ ] **Amir Reza Mahouti's photo.** Slide 02 uses the portrait already in
  `assets/team/amirreza-mahouti.jpg`, the one Core uses. Replace that file,
  or point `amirreza` in `reports/config.js` at a new one, if this deck
  should carry a different picture.
- [ ] **The two roles on slide 02.** `reports/content/team.js` reads
  "Product Designer and PM" and "Consultant". Confirm the wording.
- [ ] **The screen labels.** Slides 06 to 11 are labelled by area, "01 /
  Dashboard" to "06 / Campaign detail", not "Problem 01" to "Problem 05" as
  in the brief, because slide 04 lists four problems and the two sets of
  numbers did not line up.
- [ ] **Network drill-down.** Slide 09 highlights only what the wireframe
  shows. Branch, member and lower branch appear as dashed marks, captioned
  as the intended drill-down, because no wireframe of them exists yet.
- [ ] **The speaker notes.** Each slide's `notes` line in
  `reports/content/` is the brief's speaker note. Nothing shows them on
  screen: read them before the meeting.
- [ ] **The social card.** `assets/social/reports.png` is a render of the
  deck's own title slide, made with headless Chrome. It is a placeholder
  for a designed card, not a design.

## Every deck

- [ ] Open the homepage and click through to each of the three decks, so you are not hunting
  for a URL in front of the room. Core now lives at `core/`, not at the root.
- [ ] Open each deck at every viewport you will present at, and walk it end to
  end. `node tools/parity.mjs check` proves nothing moved since the last
  baseline, but it cannot tell you whether a screenshot is legible from the
  back of the room.
