# Core

An internal presentation introducing Shoraka's core insurance platform to senior managers and business stakeholders. It runs immediately before a live product demo.

**Live:** https://mrsadri.github.io/core-deck/

This repository also hosts a second deck, [My Customers](#my-customers), which reuses the same engine and motif.

## The deck

19 slides, one idea each. The narrative arc:

1. Title
2. The team, in two tiers
3. Today, every new insurance line starts from zero
4. The same shape, built again every time
5. Engineering capacity decides the roadmap
6. What core is: the part we stop rebuilding
7. The promise
8. Months to one week
9. One place sets the price
10. BFF, Backend For Frontend
11. go rules
12. What that looks like in practice
13. Vocabulary
14. RFQ
15. Quote list
16. RFS
17. The journey
18. Hold questions until the end
19. Handoff to the demo

## Running it

Open `index.html`. No build step and no dependencies.

| Input | Action |
| --- | --- |
| `→` `↓` `Space` `Enter` | Next slide |
| `←` `↑` `Backspace` | Previous slide |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen |
| Click | Next slide, or previous on the far left edge |
| Swipe | Next / previous |

The URL hash tracks the current slide, so `#7` opens straight to slide 7.

## Before presenting

Two values need confirming. Both live in the `CONFIG` object at the top of the `<script>` block in `index.html`.

- **`RFS_EXPANSION`** is currently a placeholder, "Request For Submission". It renders with a dotted underline and a "TO CONFIRM" tag so it cannot be shown by accident. Confirm the wording the team actually uses, set it, then set `RFS_CONFIRMED: true` to remove the marker.
- **`TODAY_DURATION`** is the time a new insurance line takes to launch today. It currently reads "Months" because no real figure was available. A specific number lands considerably harder on slide 8.

## My Customers

A design review of Customer Management ("مشتریان من"), a new section of the BimeBazar partner panel ("Front Office"). Partners are independent insurance sellers who register orders for their own customers and earn commission. The deck runs in a meeting where the design is reviewed before implementation.

**Live:** https://mrsadri.github.io/core-deck/customers/ (once this branch is merged)

Source: `customers/index.html`. Self contained, with its own copy of the engine and styles, so changes here cannot affect the Core deck.

### The deck

15 slides. The arc runs from problem to solution:

1. Title
2. The team and the project
3. Review the design before we build it
4. Six problems, one missing piece
5. Every order belongs to a customer (P1 to F1)
6. Find anyone in one search (P2 to F2)
7. One page holds the whole customer (P3 to F3)
8. Every policy in one place (P3 to F5)
9. Returning or new, answered at once (P4 to F4)
10. The money, at a glance (P5 to F6)
11. The paper diary moves in (P6 to F7, beyond phase 1)
12. Add a customer before the first order (F8, beyond phase 1)
13. Six capabilities, one section
14. Does this fit the way you work?
15. One record each

Slides 5 to 12 each carry a panel screenshot. Slides 11 and 12 are marked beyond phase 1 on the slide itself.

Navigation, hash routing and fullscreen behave exactly as in Core. See the table above.

### Before presenting

Everything that needs filling lives in the `CONFIG` object at the top of the `<script>` block in `customers/index.html`.

- **Screenshots.** All eight entries in `CONFIG.SCREENSHOTS` are `null`. Each one renders a dotted frame tagged SCREENSHOT PENDING, so the deck cannot be presented half dressed by accident. Capture at 1280 x 832, drop the files in `customers/assets/screens/`, then point each key at its file. The keys and the shot each one needs are listed in `customers/assets/screens/README.md`.
- **Photos.** Done. `CONFIG.PHOTOS` carries all three portraits from `assets/team/`. Setting any one back to `null` renders a PHOTO PENDING niche in its place.
- **The tech lead's name.** The deck follows the spelling used in the Core deck, "Mehdi Mohammad Rezaei". Confirm it before presenting.

If the real captures come back at a size other than 1280 x 832, change `--shot-ratio` once in the stylesheet and every frame follows.

## Design

The structural motif is the rowlock arch: bricks set on edge, radiating around a curve. It is generated in code rather than drawn, so the same primitive carries the argument across the deck. A partly built arch is the problem, an arch whose crown bricks are the only new work is core, and the keystone is the rules engine.

My Customers extends the same primitive to a second argument. Loose bricks are the order list before anyone owns it, an arch is one customer record, a stone pulled clear of the curve is a search result, a band of yellow stones is the policies, and a dashed stone is anything beyond phase 1.

Palette is kraft paper, brick brown, brick yellow, and a single accent in `#D97757`.

Typography is Iowan Old Style with a Georgia fallback, set against the system sans. No web fonts, so the deck renders identically offline.

## Credits

The Claude mark on the team slide is the trademark of Anthropic and is used to identify Claude as a contributor. Team photographs belong to the individuals pictured.
