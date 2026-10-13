# Architecture

## The shape of it

### Directory tree

```
site/
  .gitignore                   adds tools/baseline/
  .nojekyll                    unchanged, keeps Pages from running Jekyll
  README.md                    what the decks are, how to run them, where to edit
  ARCHITECTURE.md              the map: every file, its job, and how to add a deck
  PRESENTING.md                the pre presentation checklist
  REFACTOR_PLAN.md             the plan this history followed, stage by stage
  index.html                   the homepage: asks which deck, links to all four
  assets/                      every image, in one tree. See assets/README.md
    README.md                  the tree, and how to add a portrait
    brand/                     favicon.svg, apple-touch-icon.png
    social/                    one Open Graph card per deck: core.jpg, customers.png, reports.png, pay.png
    team/                      one portrait per person, plus claude-mark.svg
    screens/                   panel screenshots and wireframes, and their README
  engine/
    css/
      tokens.css               every token, for both decks and the homepage
      base.css                 reset, the kraft ground, the paper grain
      shell.css                .deck, .slide, .wrap, the enter animation
      type.css                 .eyebrow, h1, h2, .lead, .support, .stack
      motif.css                the arch, the voussoirs and their states, the plinth, loose bricks
      member.css               the member tile: .member, .niche and its states, .m-name, .m-role
      layout.css               .split, .arcrow, .pier
      title.css                .title-grid, .title-arch, .hint, .closing, .sign
      hud.css                  .hud, .ticks, .nav, .count
      compact.css              opt in: shared primitives restacked for a narrow frame
      motion.css               prefers-reduced-motion
    js/
      motif.js                 builds the arches and the piles, and rebuilds them on resize
      stagger.js               gives every [data-anim] element its --d
      niche.js                 fills every [data-photo] niche: photo, glyph, or pending
      render.js                turns a slides array into .slide sections
      presentation.js          which slide is showing: show, next, prev, ticks, counter, hash
      input.js                 keyboard, click, buttons, touch
      start.js                 wires the above in one fixed order, then freezes DECK
  home/
    css/home.css               the chooser's own styles, and nothing else
    main.js                    draws each card's arch with the engine primitive
  core/
    index.html                 Core: shell only
    css/
      team.css                 the two tier team grid
      slides.css               the components only Core's slides use
    content/
      team.js                  the 14 members, and the markup of the team slide
      slides-opening.js        slides 01 and 02
      slides-problem.js        slides 03 to 05
      slides-platform.js       slides 06 to 12
      slides-vocabulary.js     slides 13 to 17
      slides-closing.js        slides 18 and 19
    config.js                  presentation time values and the photo map
    copy.js                    injects the config's copy into the slides that need it
    main.js                    calls DECK.start
  customers/
    index.html                 My Customers: shell only
    css/
      team.css                 the team grid and the project row
      screens.css              the panel screenshot frame and its pending state
      slides.css               the components only Customers' slides use
    content/
      team.js                  the 5 members, and the markup of the team slide
      slides-opening.js        slides 01 to 04
      slides-phase-one.js      slides 05 to 09
      slides-beyond.js         slides 10 and 11
      slides-closing.js        slides 12 to 14
    config.js                  the screenshot map, the photo map
    screens.js                 fills every [data-shot] frame, or marks it pending
    main.js                    calls DECK.start
  reports/
    index.html                 Front Office Reports: shell only
    css/
      team.css                 the two members beside the project facts
      trace.css                the trace, this deck's motif: marks joined by a line
      screens.css              the wireframe frame, its highlights and their legend
      pins.css                 where each highlight sits on each wireframe
      slides.css               the components only Reports' slides use
    content/
      team.js                  the 2 members, and the markup of the context slide
      slides-opening.js        slides 01 to 05
      slides-money.js          slides 06 to 08
      slides-network.js        slides 09 to 11
      slides-closing.js        slides 12 to 14
    config.js                  the wireframe map, the photo map
    screens.js                 fills every [data-shot] frame, or marks it pending
    main.js                    calls DECK.start
  pay/
    index.html                 Pay Link: shell only
    css/
      team.css                 the one member beside the project facts
      rail.css                 the rail, this deck's motif: seven stops joined by a line
      steps.css                the three columns every step slide is laid out in
      slides.css               the components only Pay Link's slides use
    content/
      team.js                  the 1 member, and the markup of the context slide
      slides-opening.js        slides 01 to 05
      slides-seller.js         slides 06 to 08
      slides-customer.js       slides 09 to 11
      slides-pay.js            slides 12 to 15
      slides-after.js          slides 16 to 20
    config.js                  the photo map
    rail.js                    fills every [data-rail] with the seven stops
    main.js                    calls DECK.start
  tools/
    parity.mjs                 the per slide parity harness
    lint.mjs                   the rules below, as code
    baseline/                  recorded fingerprints, git ignored
```

## Every file and its one job

Throughout: "may read" means may reference at runtime. Nothing imports anything,
because there are no modules; the boundary is what a file is allowed to name.

#### The homepage

**`index.html`**
Asks which deck and links to both. It is not a deck and never starts one: it
links `tokens.css`, `base.css`, `type.css`, `motif.css` and `motion.css`, then
loads `engine/js/motif.js` and calls `DECK.buildMotifs` through `home/main.js`
to draw the small arch on each card. `DECK` is never frozen here, because
`start.js` is never loaded.
Unlike a deck shell it carries its own markup, because nothing renders it for
it. It obeys every other rule: no `<style>` block, no `style` attribute, at
most 200 lines, no web fonts.
It carries `.is-active` on `.home`, which is the engine's word for revealed,
and is what makes each arch's bricks opaque. Its entrance is a keyframe on the
same 65ms beat as a slide, so both cards stay readable if the script never
runs. Both links point at a file, not a directory, so the page works over
`file://` as well as over HTTP.

#### The deck shells

**`core/index.html`, `customers/index.html`, `reports/index.html`, `pay/index.html`**
One responsibility: declare the document, link the stylesheets, provide the six
element ids the engine needs, and load the scripts in order.
May contain: `<meta>`, `<title>`, `<link>`, the `#deck` element, the HUD footer,
and `<script src>` tags.
May not contain: any `<style>` block, any `style` attribute, any slide copy, any
`<section class="slide">`, or any JavaScript statement.
The six ids it must provide, which are the engine's contract: `deck`, `ticks`,
`cNow`, `cAll`, `prevBtn`, `nextBtn`.

#### `engine/css/*`

Each file owns one band of the design system and may use only the custom
properties declared in `engine/css/tokens.css`. None of them may name a deck
specific class.

- **`tokens.css`** declares every token, once, for both decks and the homepage.
  A deck declares none of its own. The single exception is `--tile`, which a
  deck may narrow in its own `css/team.css` because the cap follows the grid:
  see the comment at the top of that file for the measured reason.
- **`base.css`** the reset, the page ground, the grain overlay. Nothing else may
  style `html` or `body`.
- **`shell.css`** the deck frame, slide visibility and the enter animation.
  Owner of `[data-anim]` and of the `--d` to delay arithmetic.
- **`type.css`** the type scale. Owner of `h1`, `h2`, `.lead`, `.support`,
  `.eyebrow`, `.stack`.
- **`motif.css`** the whole brick vocabulary, including the states only one deck
  uses today: `is-ghost`, `is-new`, `is-key`, `is-lift`, `.loose`, `.lb`. These
  are inert without the matching data attributes, which is how a deck specific
  motif feature plugs in without forking the engine.
- **`member.css`** the member tile primitive, sized by `--tile`, `--m-name` and
  `--m-role`. Owner of `.niche` and all three of its contents: a photo, the
  `glyph` variant, the `is-pending` variant.
- **`layout.css`** the shared slide layouts: the two column split, the row of
  three piers.
- **`title.css`** the title and closing slide layout.
- **`hud.css`** the footer: ticks, buttons, counter.
- **`compact.css`** opt in. The narrow frame treatment of the shared primitives
  in `layout.css` and `hud.css`. Core does not link it: adopting it would change
  how Core renders below 760px, which is a visible change and therefore outside
  this refactor. Customers links it, which is exactly what it does today.
- **`motion.css`** the reduced motion override. Nothing else may use
  `!important`.

#### `engine/js/*`

Every file is one IIFE taking the namespace. No file may declare anything at
column zero except that wrapper and its comments. No file may name a deck, a
deck's config, or a deck specific class.

- **`motif.js`** builds `.arch` and `.loose` elements from their data attributes,
  and rebuilds on resize and on load. Exposes `DECK.buildMotifs(root)`. Owner of
  the brick geometry and of the resize debounce. May read only the DOM.
- **`stagger.js`** gives every `[data-anim]` element its `--d`, from `data-d` if
  it declares one and from document order otherwise. Exposes
  `DECK.applyStagger(root)`.
- **`niche.js`** fills `[data-photo]` niches. Exposes
  `DECK.createNicheDecorator(photos)`, which returns a decorator. The photo map
  comes from the deck, so this file names no path.
- **`render.js`** turns an array of `{id, name, html}` into `.slide` sections
  inside the mount. Exposes `DECK.renderSlides(mount, slides)`. The only file
  allowed to write `innerHTML` from deck content.
- **`presentation.js`** holds which slide is showing. Exposes
  `DECK.createPresentation(options)` returning `{show, next, prev, total}`. Owner
  of the tick row, the counter and the hash. Holds the deck's only mutable
  state, in a closure.
- **`input.js`** binds keyboard, click, button and touch input to a
  presentation. Exposes `DECK.bindInput(presentation, buttons)`. Carries
  deferred items 3, 4 and 7 unchanged.
- **`start.js`** the one place that knows the order of operations, and the one
  place that knows the six element ids. Exposes `DECK.start({slides,
  decorators})` and calls `Object.freeze(DECK)`. Must be the last engine script
  a shell loads.

#### `core/*`, `customers/*`, `reports/*` and `pay/*`

- **`css/team.css`** the team slide's grid and tier labels for that deck. May
  override `.niche` properties the engine leaves open, and may narrow `--tile`,
  `--m-name` and `--m-role` where its own column count demands it. Every such
  override states the measurement that forced it.
- **`css/slides.css`** the components only that deck's slides use. May not
  redefine an engine primitive.
- **`css/screens.css`** (Customers and Reports) the screenshot frame and its
  pending state. Customers frames every capture to one ratio. Reports gives
  each frame the ratio of its own wireframe, and also owns the highlight box
  `.hl` and its numbered legend `.keys`.
- **`css/trace.css`** (Reports only) the trace: a row of marks joined by a
  line, with the states `is-key`, `is-off` and `cut`. It is built in CSS
  alone, so it needs nothing from `engine/js/motif.js`.
- **`css/rail.css`** (Pay Link only) the rail: seven bricks set on edge,
  joined by a line, with the states `is-key` and `is-off`. The stops are
  drawn by `pay/rail.js`, so a slide states only which one it is about.
- **`css/steps.css`** (Pay Link only) the layout every step slide shares:
  what the user does, what the system does, what the user gets.
- **`css/pins.css`** (Reports only) the position of every highlight, as a
  share of its wireframe's width and height. Replace a wireframe and its
  boxes here need measuring again.
- **`content/*.js`** each declares exactly one top level `const`, holding an
  array of slide objects or, in `team.js`, a markup string. A Reports or Pay Link slide
  also carries `notes`, the presenter's line for it, which the engine
  ignores. May name only its
  own deck's config const and `DECK`. May not contain a `style` attribute.
- **`config.js`** declares exactly one top level `const`, frozen, holding every
  presentation time value: placeholder copy and its confirmation flag, the
  screenshot map, the photo map. The only file a presenter edits before
  presenting.
- **`copy.js`**, **`screens.js`**, **`rail.js`** each declare exactly one top level `const`,
  holding a decorator function. May name their deck's config.
- **`main.js`** composes the acts and calls `DECK.start`. No other statement.

#### `tools/*`

Developer scaffolding. Not loaded by the browser, so the 200 line limit does not
apply. Requires Node 18 or later and Google Chrome. Neither deck requires
either.

## Where to edit a slide

Find the slide in the table, open that file, edit the html string. Nothing else needs to change.

| Deck | No | id | Slide | File |
| --- | --- | --- | --- | --- |
| Core | 01 | `title` | Title | `core/content/slides-opening.js` |
| Core | 02 | `team` | The team, in two tiers | `core/content/team.js` |
| Core | 03 | `from-zero` | Today, every new insurance line starts from zero | `core/content/slides-problem.js` |
| Core | 04 | `same-shape` | The same shape, built again every time | `core/content/slides-problem.js` |
| Core | 05 | `real-cost` | Engineering capacity decides the roadmap | `core/content/slides-problem.js` |
| Core | 06 | `what-core-is` | What core is: the part we stop rebuilding | `core/content/slides-platform.js` |
| Core | 07 | `promise` | The promise | `core/content/slides-platform.js` |
| Core | 08 | `one-week` | Months to one week | `core/content/slides-platform.js` |
| Core | 09 | `pricing` | One place sets the price | `core/content/slides-platform.js` |
| Core | 10 | `bff` | BFF, Backend For Frontend | `core/content/slides-platform.js` |
| Core | 11 | `go-rules` | go rules | `core/content/slides-platform.js` |
| Core | 12 | `before-after` | What that looks like in practice | `core/content/slides-platform.js` |
| Core | 13 | `vocabulary` | Vocabulary | `core/content/slides-vocabulary.js` |
| Core | 14 | `rfq` | RFQ | `core/content/slides-vocabulary.js` |
| Core | 15 | `quote-list` | Quote list | `core/content/slides-vocabulary.js` |
| Core | 16 | `rfs` | RFS | `core/content/slides-vocabulary.js` |
| Core | 17 | `journey` | The journey | `core/content/slides-vocabulary.js` |
| Core | 18 | `hold-questions` | Hold questions until the end | `core/content/slides-closing.js` |
| Core | 19 | `handoff` | Handoff to the demo | `core/content/slides-closing.js` |
| My Customers | 01 | `title` | Title | `customers/content/slides-opening.js` |
| My Customers | 02 | `team` | The team and the project | `customers/content/team.js` |
| My Customers | 03 | `purpose` | Review the design before we build it | `customers/content/slides-opening.js` |
| My Customers | 04 | `problems` | Four problems, one missing piece | `customers/content/slides-opening.js` |
| My Customers | 05 | `p1-f1` | Every order belongs to a customer | `customers/content/slides-phase-one.js` |
| My Customers | 06 | `p2-f2-f3` | Find anyone, and see everything about them | `customers/content/slides-phase-one.js` |
| My Customers | 07 | `p3-f5` | Every policy of each customer in one place | `customers/content/slides-phase-one.js` |
| My Customers | 08 | `p4-f4` | Document management of each customer | `customers/content/slides-phase-one.js` |
| My Customers | 09 | `p5-f6` | The money, at a glance | `customers/content/slides-phase-one.js` |
| My Customers | 10 | `p6-f7` | The paper diary moves in, beyond phase 1 | `customers/content/slides-beyond.js` |
| My Customers | 11 | `f8` | Add a customer before the first order, beyond phase 1 | `customers/content/slides-beyond.js` |
| My Customers | 12 | `scope` | Six capabilities, one section | `customers/content/slides-closing.js` |
| My Customers | 13 | `discussion` | Does this fit the way you work? | `customers/content/slides-closing.js` |
| My Customers | 14 | `closing` | One record each | `customers/content/slides-closing.js` |
| Reports | 01 | `title` | Every number should explain itself | `reports/content/slides-opening.js` |
| Reports | 02 | `context` | The project and the product, with the team | `reports/content/team.js` |
| Reports | 03 | `purpose` | Review the design before we build it | `reports/content/slides-opening.js` |
| Reports | 04 | `found` | The numbers exist. The story behind them does not | `reports/content/slides-opening.js` |
| Reports | 05 | `direction` | From summary to investigation | `reports/content/slides-opening.js` |
| Reports | 06 | `dashboard` | The business, at a glance | `reports/content/slides-money.js` |
| Reports | 07 | `sales-commission` | A sale is not complete until its income is understandable | `reports/content/slides-money.js` |
| Reports | 08 | `payments` | Every payment should be explainable | `reports/content/slides-money.js` |
| Reports | 09 | `network` | See the network from the top. Drill into each branch | `reports/content/slides-network.js` |
| Reports | 10 | `campaigns` | A reward should be trackable, not just promotional | `reports/content/slides-network.js` |
| Reports | 11 | `campaign-detail` | From eligibility to payout | `reports/content/slides-network.js` |
| Reports | 12 | `capabilities` | Six capabilities, one clearer financial experience | `reports/content/slides-closing.js` |
| Reports | 13 | `validation` | The experience is clearer. Some rules still need validation | `reports/content/slides-closing.js` |
| Reports | 14 | `feedback` | Does this fit the way Partners and the business actually work? | `reports/content/slides-closing.js` |
| Pay Link | 01 | `title` | The customer pays, from a link | `pay/content/slides-opening.js` |
| Pay Link | 02 | `context` | The project and the product | `pay/content/team.js` |
| Pay Link | 03 | `reading` | Every click, and what it sets off | `pay/content/slides-opening.js` |
| Pay Link | 04 | `scope` | Which orders this covers | `pay/content/slides-opening.js` |
| Pay Link | 05 | `owner` | BimeBazar decides the money. We run the path to it | `pay/content/slides-opening.js` |
| Pay Link | 06 | `link` | One link, bound to one order and one phone | `pay/content/slides-seller.js` |
| Pay Link | 07 | `send` | Two SMS providers, so the link arrives | `pay/content/slides-seller.js` |
| Pay Link | 08 | `seller-pay` | The seller can still pay it themselves | `pay/content/slides-seller.js` |
| Pay Link | 09 | `open` | The first screen shows almost nothing | `pay/content/slides-customer.js` |
| Pay Link | 10 | `code` | A code, sent to the phone the seller typed | `pay/content/slides-customer.js` |
| Pay Link | 11 | `invoice` | The amount comes live from BimeBazar | `pay/content/slides-customer.js` |
| Pay Link | 12 | `pay` | Checked again, then sent to the bank | `pay/content/slides-pay.js` |
| Pay Link | 13 | `answers` | Seven answers, and what the screen does with each | `pay/content/slides-pay.js` |
| Pay Link | 14 | `gate` | Two people can pay. One bank page at a time | `pay/content/slides-pay.js` |
| Pay Link | 15 | `states` | Six words for where an attempt stands | `pay/content/slides-pay.js` |
| Pay Link | 16 | `paid` | Who paid? Recorded only when there is one answer | `pay/content/slides-after.js` |
| Pay Link | 17 | `commission` | Commission is set early, and frozen once paid | `pay/content/slides-after.js` |
| Pay Link | 18 | `listing` | Unpaid orders now show up, with a label | `pay/content/slides-after.js` |
| Pay Link | 19 | `trail` | Every attempt leaves a trail | `pay/content/slides-after.js` |
| Pay Link | 20 | `questions` | Which step should we walk again? | `pay/content/slides-after.js` |

## The rules

These hold for every change, not just the refactor that introduced them.
`tools/lint.mjs` enforces the checkable ones.

1. **File length.** No file the browser loads may exceed **200 physical lines**,
   counting blanks and comments, ignoring one trailing newline. That is every
   `.css` and `.js` file under `engine/`, `core/`, `customers/`,
   `reports/` and `pay/`, and the shells. `tools/` is exempt: it is not loaded by the browser.
2. **Move, do not rewrite.** When code changes place, it travels verbatim.
   Change only what the task calls for. Do not reformat, do not reorder
   declarations, do not modernise, do not fix a typo in a comment, do not
   "improve" a selector on the way past. A diff that mixes a move with an edit
   hides the edit.
3. **No globals.** `window.DECK` is the only global the engine creates, it holds
   only functions, and `start.js` freezes it. Every engine and deck script keeps
   everything else inside a wrapper: no `var`, `let`, `const` or `function` at
   column zero in any file under `engine/js/`. A deck script may declare exactly
   one `const` at column zero, in `SCREAMING_SNAKE_CASE`, and nothing else.
   `window.__rt` must not survive.
4. **No `var`.** Nowhere under `engine/` or in a deck's `.js` files. Use `const`,
   or `let` where the binding is reassigned.
5. **No em dashes.** Not in any file here, not in code, comments, commit
   messages or documentation. Use a comma, a
   colon, a full stop or a pair of parentheses. The multiplication sign in
   `'1280 × 832'` is not an em dash: it is rendered slide text and must survive
   byte for byte.
6. **Rendering changes only on purpose.** Slide text and slide order are fixed.
   Colours, typography, enter animation timing, arch geometry and brick reveal
   order change only when a change is the point of the work. Then it is stated
   plainly, its blast radius is read off `node tools/parity.mjs check` before
   anything is re-recorded, and the reason is written where the value lives.
   A rendering change nobody asked for is a bug, whatever it looks like.
7. **Naming.** Files are lowercase with hyphens. CSS classes follow the idiom
   already in the repo: short, lowercase, one word where possible, modifiers as
   a second class (`tight`, `sm`, `narrow`, `pale`, `thin`). Engine functions are
   `camelCase` verbs on `DECK` (`buildMotifs`, `applyStagger`, `renderSlides`).
   Deck consts are `SCREAMING_SNAKE_CASE` prefixed with the deck name
   (`CORE_`, `CUSTOMERS_`, `REPORTS_`, `PAY_`).
8. **Comments explain why.** Carry every existing explanatory comment with the
   code it explains. Do not add a comment that restates the code.
9. **Every commit ends working.** Every deck must open and present correctly
   before a commit, and the homepage must reach each one. A change is finished only
   when parity and lint both pass.
10. **No web fonts.** No `@font-face`, no `fonts.googleapis.com`, no
    `fonts.gstatic.com`, no font file in `assets/`. Lint enforces this.
11. **Stop, do not improvise.** If a check fails unexpectedly, stop and report
    the command and its output. Do not guess at a fix, do not skip the step and
    do not re-record the baseline to make the red go away. An unexpected failure
    means the plan was wrong, and that is worth more than a workaround.
    Re-recording is legitimate only for a change rule 6 already accounted for,
    after the check has been read and the differing pairs are the expected ones.

Run `node tools/lint.mjs` before every commit.

## Adding another deck

Front Office Reports and Pay Link were added this way. Reports is the nearest
example for a deck with screenshots, Pay Link for one without.
Nothing under `engine/` changes. Create:

- `<deck>/index.html`, a shell: copy `customers/index.html` and change the
  meta, the deck's own stylesheet links and its own script tags.
- `<deck>/css/slides.css`, for anything only this deck's slides use.
- `<deck>/content/*.js`, one file per act, each declaring one const holding
  an array of `{id, name, html}`.
- `<deck>/config.js`, one frozen const holding every value that needs a
  decision before presenting.
- `<deck>/main.js`, which concatenates the acts and calls `DECK.start`.

Link `engine/css/compact.css` if the deck wants the shared layout
primitives to restack on a narrow screen. Pass a decorator to `DECK.start`
if the deck has assets to fill in, such as screenshots or portraits.

Then add the deck to `DECKS` in `tools/parity.mjs`, with its page path and
its slide count, and record a baseline for it. Add its shell to `SHELLS` in
`tools/lint.mjs`, and its folder to the three prefix checks beside it, so
every rule reaches it.

Finally give it a card on the homepage: copy one `.choice` block in
`index.html`, point its `href` at the deck's `index.html` rather than its
directory, and give its arch a `data-` attribute that says something true
about the deck. A fifth card will want another column, or a second row, in
`home/css/home.css`, and another `.choice:nth-child` beat for its entrance.
