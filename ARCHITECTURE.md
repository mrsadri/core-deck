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
  index.html                   Core: shell only
  assets/                      every image, in one tree. See assets/README.md
    README.md                  the tree, and how to add a portrait
    brand/                     favicon.svg, apple-touch-icon.png
    social/                    one Open Graph card per deck: core.jpg, customers.png
    team/                      one portrait per person, plus claude-mark.svg
    screens/                   My Customers panel screenshots, and their README
  engine/
    css/
      tokens.css               shared custom properties, and the names of the deck tokens
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
  core/
    css/
      tokens.css               Core's values for the engine's deck tokens
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
      tokens.css               Customers' values for the engine's deck tokens
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
  tools/
    parity.mjs                 the per slide parity harness
    lint.mjs                   the rules in section 5, as code
    baseline/                  recorded fingerprints, git ignored
```

## Every file and its one job

Throughout: "may read" means may reference at runtime. Nothing imports anything,
because there are no modules; the boundary is what a file is allowed to name.

#### The shells

**`index.html`, `customers/index.html`**
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
properties declared in `engine/css/tokens.css` plus the four deck tokens that
file names. None of them may name a deck specific class.

- **`tokens.css`** declares every shared custom property, and documents the four
  tokens each deck must declare for itself: `--h1`, `--tile`, `--m-name`,
  `--m-role`.
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

#### `core/*` and `customers/*`

- **`css/tokens.css`** declares the deck's values for the four engine tokens,
  and nothing else.
- **`css/team.css`** the team slide's grid and tier labels for that deck. May
  override `.niche` properties the engine leaves open, and may redeclare the
  deck tokens inside a media query.
- **`css/slides.css`** the components only that deck's slides use. May not
  redefine an engine primitive.
- **`css/screens.css`** (Customers only) the panel screenshot frame and its
  pending state.
- **`content/*.js`** each declares exactly one top level `const`, holding an
  array of slide objects or, in `team.js`, a markup string. May name only its
  own deck's config const and `DECK`. May not contain a `style` attribute.
- **`config.js`** declares exactly one top level `const`, frozen, holding every
  presentation time value: placeholder copy and its confirmation flag, the
  screenshot map, the photo map. The only file a presenter edits before
  presenting.
- **`copy.js`**, **`screens.js`** each declare exactly one top level `const`,
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
| My Customers | 04 | `problems` | Six problems, one missing piece | `customers/content/slides-opening.js` |
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

## The rules

These hold for every stage. `tools/lint.mjs` enforces the checkable ones, and
each stage runs it.

1. **File length.** No file the browser loads may exceed **200 physical lines**,
   counting blanks and comments, ignoring one trailing newline. That is every
   `.css` and `.js` file under `engine/`, `core/` and `customers/`, and from
   stage 11 the two shells as well. `tools/` is exempt: it is not loaded by the
   browser.
2. **Move, do not rewrite.** When an item gives a source line range, copy those
   lines verbatim. Change only what the item tells you to change. Do not
   reformat, do not reorder declarations, do not modernise, do not fix a typo in
   a comment, do not "improve" a selector. Declarations inside a moved function
   change from `var` to `const` or `let` only where an item says so.
3. **No globals.** `window.DECK` is the only global the engine creates, it holds
   only functions, and `start.js` freezes it. Every engine and deck script keeps
   everything else inside a wrapper: no `var`, `let`, `const` or `function` at
   column zero in any file under `engine/js/`. A deck script may declare exactly
   one `const` at column zero, in `SCREAMING_SNAKE_CASE`, and nothing else.
   `window.__rt` must not survive.
4. **No `var`.** Nowhere under `engine/` or in a deck's `.js` files. Use `const`,
   or `let` where the binding is reassigned.
5. **No em dashes.** Not in this plan, not in any file it tells you to write,
   not in code, comments, commit messages or documentation. Use a comma, a
   colon, a full stop or a pair of parentheses. The multiplication sign in
   `'1280 × 832'` is not an em dash: it is rendered slide text and must survive
   byte for byte.
6. **No behaviour change.** Slide text and slide order are fixed. Rendered
   output, colours, typography, enter animation timing, arch geometry and brick
   reveal order are fixed. The deferred items in section 1 are fixed.
7. **Naming.** Files are lowercase with hyphens. CSS classes follow the idiom
   already in the repo: short, lowercase, one word where possible, modifiers as
   a second class (`tight`, `sm`, `narrow`, `pale`, `thin`). Engine functions are
   `camelCase` verbs on `DECK` (`buildMotifs`, `applyStagger`, `renderSlides`).
   Deck consts are `SCREAMING_SNAKE_CASE` prefixed with the deck name
   (`CORE_`, `CUSTOMERS_`).
8. **Comments explain why.** Carry every existing explanatory comment with the
   code it explains. Do not add a comment that restates the code.
9. **Every stage ends working.** Both decks must open and present correctly at
   the end of every stage, before the commit. A stage is finished only when
   parity and lint both pass.
10. **No web fonts.** No `@font-face`, no `fonts.googleapis.com`, no
    `fonts.gstatic.com`, no font file in `assets/`. Lint enforces this.
11. **Stop, do not improvise.** If an acceptance check fails, stop and report:
    the stage, the item, the command you ran, and the output. Do not guess at a
    fix, do not skip the item, do not re-record the parity baseline, do not
    continue to the next stage. A failing check means the plan was wrong, and
    that is information worth more than a workaround.

tools/lint.mjs enforces the checkable ones. Run it before every commit.

## Adding a third deck

Nothing under `engine/` changes. Create:

- `<deck>/index.html`, a shell: copy `customers/index.html` and change the
  meta, the deck's own stylesheet links and its own script tags.
- `<deck>/css/tokens.css`, declaring the four tokens the engine names:
  `--h1`, `--tile`, `--m-name`, `--m-role`.
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
its slide count, and record a baseline for it.
