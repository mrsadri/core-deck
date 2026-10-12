# Core

An internal presentation introducing Shoraka's core insurance platform to senior managers and business stakeholders. It runs immediately before a live product demo.

**Live:** https://mrsadri.github.io/core-deck/core/

This repository hosts three decks. https://mrsadri.github.io/core-deck/ is a homepage that asks which one you want and links to each: Core, below, [My Customers](#my-customers) and [Front Office Reports](#front-office-reports), which reuse the same engine.

Core used to live at the root. It moved down to `core/` so the homepage could take its place, so an old link now lands on the chooser rather than on the deck.

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

Open `index.html` and pick a deck, or open `core/index.html` directly. No build step and no dependencies, and it works from the file system as well as over HTTP.

To change a slide, find it in the table in
[ARCHITECTURE.md](ARCHITECTURE.md#where-to-edit-a-slide).

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

Two values need confirming. Both live in `core/config.js`. [PRESENTING.md](PRESENTING.md) is the full checklist.

- **`RFS_EXPANSION`** is currently a placeholder, "Request For Submission". It renders with a dotted underline and a "TO CONFIRM" tag so it cannot be shown by accident. Confirm the wording the team actually uses, set it, then set `RFS_CONFIRMED: true` to remove the marker.
- **`TODAY_DURATION`** is the time a new insurance line takes to launch today. It currently reads "Months" because no real figure was available. A specific number lands considerably harder on slide 8.

## My Customers

A design review of Customer Management ("مشتریان من"), a new section of the BimeBazar partner panel ("Front Office"). Partners are independent insurance sellers who register orders for their own customers and earn commission. The deck runs in a meeting where the design is reviewed before implementation.

**Live:** https://mrsadri.github.io/core-deck/customers/

Source: `customers/`. Both decks run the same engine from `engine/`, and each owns only its content, its own styles and its config. See [ARCHITECTURE.md](ARCHITECTURE.md).

### The deck

14 slides. The arc runs from problem to solution:

1. Title
2. The team and the project
3. Review the design before we build it
4. Four problems, one missing piece
5. Every order belongs to a customer (P1 to F1)
6. Find anyone, and see everything about them (P2 to F2, P3 to F3)
7. Every policy of each customer in one place (P3 to F5)
8. Document management of each customer (P4 to F4)
9. The money, at a glance (P5 to F6)
10. The paper diary moves in (P6 to F7, beyond phase 1)
11. Add a customer before the first order (F8, beyond phase 1)
12. Six capabilities, one section
13. Does this fit the way you work?
14. One record each

Slides 6 to 11 each carry a panel screenshot. Slides 10 and 11 are marked beyond phase 1 on the slide itself.

Navigation, hash routing and fullscreen behave exactly as in Core. See the table above.

### Before presenting

Everything that needs filling lives in `customers/config.js`. [PRESENTING.md](PRESENTING.md) is the full checklist.

- **Screenshots.** Done. All six entries in `CUSTOMERS_CONFIG.SCREENSHOTS` point at a real capture in `assets/screens/`. Set any one back to `null`, or point it at a file that is not there, and that slide renders a dotted frame tagged SCREENSHOT PENDING instead, so the deck cannot be presented half dressed by accident. Captures are laid out for 1280 x 832. The keys and the shot each one needs are listed in `assets/screens/README.md`.
- **Photos.** Done. `CUSTOMERS_CONFIG.PHOTOS` in `customers/config.js` carries all five portraits from the shared `assets/team/`. Setting any one back to `null` renders a PHOTO PENDING niche in its place.
- **The tech lead's name.** The deck follows the spelling used in the Core deck, "Mehdi Mohammad Rezaei". Confirm it before presenting.

If the real captures come back at a size other than 1280 x 832, change `--shot-ratio` once in `engine/css/tokens.css` and every frame follows.

## Front Office Reports

A design review of the redesigned reporting experience in the partner panel ("Front Office"): the dashboard, sales and commission, payments, network sales, and campaigns and rewards. The deck runs in a meeting where the wireframes are reviewed before implementation. Its one idea is that a financial number should not be a dead end: Number, Reason, Source, Detail.

**Live:** https://mrsadri.github.io/core-deck/reports/

Source: `reports/`. The brief it was built from is `newslides/front_office_reports_presentation_brief.md`, one level above this repository.

### The deck

14 slides. The arc runs context, problems, direction, the screens, capabilities, open questions, feedback:

1. Every number should explain itself
2. The project and the product, with the team
3. Review the design before we build it
4. The numbers exist. The story behind them does not
5. From summary to investigation
6. The business, at a glance (Dashboard)
7. A sale is not complete until its income is understandable (Sales and Commission)
8. Every payment should be explainable (Payments)
9. See the network from the top. Drill into each branch (Network Sales)
10. A reward should be trackable, not just promotional (Campaigns)
11. From eligibility to payout (Campaign detail)
12. Six capabilities, one clearer financial experience
13. The experience is clearer. Some rules still need validation
14. Does this fit the way Partners and the business actually work?

Slides 6 to 11 each carry a wireframe with numbered highlights, and the same numbers are spelled out beside it. The wireframes are in Persian and are shown as they are. Every slide object carries a `notes` line, the presenter's words for it, taken from the brief.

Navigation, hash routing and fullscreen behave exactly as in Core. See the table above.

### Before presenting

Everything that needs filling lives in `reports/config.js`. [PRESENTING.md](PRESENTING.md) is the full checklist.

- **Photos.** Done. Both portraits on slide 2 are in `assets/team/`. Point a key in `REPORTS_CONFIG.PHOTOS` at a file that is not there and that niche renders PHOTO PENDING instead.
- **Wireframes.** All seven entries in `REPORTS_CONFIG.SCREENSHOTS` point at a file in `assets/screens/`. Replace one with a newer export and its highlights need checking against `reports/css/pins.css`.

## Design

The structural motif is the rowlock arch: bricks set on edge, radiating around a curve. It is generated in code rather than drawn, so the same primitive carries the argument across the deck. A partly built arch is the problem, an arch whose crown bricks are the only new work is core, and the keystone is the rules engine.

My Customers extends the same primitive to a second argument. Loose bricks are the order list before anyone owns it, an arch is one customer record, a stone pulled clear of the curve is a search result, a band of yellow stones is the policies, and a dashed stone is anything beyond phase 1.

Front Office Reports keeps the ground, the palette and the type, and swaps the arch for a motif of its own, the trace: a row of marks joined by a line, where each mark is a record and each line is the way back to the one before it. A solid mark can be seen today, the orange mark is the one a slide is about, and a dashed mark is one the Partner cannot reach yet. The arch still sits on its homepage card, partly built.

Palette is kraft paper, brick brown, brick yellow, and a single accent in `#D97757`.

Typography is Iowan Old Style with a Georgia fallback, set against the system sans. No web fonts, so the deck renders identically offline.

## Credits

The Claude mark on the team slide is the trademark of Anthropic and is used to identify Claude as a contributor. Team photographs belong to the individuals pictured.
