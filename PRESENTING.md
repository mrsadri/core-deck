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
`customers/css/tokens.css` and every frame follows.

- [ ] **The tech lead's name.** `customers/content/team.js`. The deck follows
  the spelling used in the Core deck, "Mehdi Mohammad Rezaei". Confirm it.
- [ ] **The social card.** `customers/assets/og.png` is a render of the deck's
  own title slide, made with headless Chrome. It is a placeholder for a
  designed card, not a design. Replace it if the deck is shared widely.

## Both decks

- [ ] Open each deck at every viewport you will present at, and walk it end to
  end. `node tools/parity.mjs check` proves nothing moved since the last
  baseline, but it cannot tell you whether a screenshot is legible from the
  back of the room.
