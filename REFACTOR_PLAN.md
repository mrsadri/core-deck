# Refactor plan: one shared engine, two thin decks

Written for the model that will execute it (Claude Sonnet 5.5) and for the
senior engineer who will review the result.

Baseline commit: `1e7429efdf046e2cde67919f6a05336dadcb10c0`
Branch to work on: `refactor/shared-engine`

Section 2 records why there are now two reference commits instead of one, and
names the second: `dfe2bd0`, for `customers/index.html` only.

---

## 1. Summary

### Goal

Both decks are served by one shared engine. Each deck owns nothing but its
content, its own styles and its presentation time config. A third deck can be
added without touching a single file under `engine/`. Every slide of both decks
looks and reads exactly as it does today.

### Scope

These audit findings are in scope:

1. Duplicated engine: the stylesheet, `buildArch`, the navigation and the
   stagger code are copied into both HTML files and have diverged.
2. Content fused with engine: slide copy sits in markup next to 99 inline
   `style` attributes.
6. Script architecture: top level globals, mixed `const` and `var`.
8. Documentation and config drift: a stale README claim, a shared social card,
   presentation TODOs recorded only as flags in code.

### Out of scope: do not touch

The following are deliberately left exactly as they are. No checklist item in
this plan may fix them, alter them, or make them worse. If you notice them while
moving code, move the code anyway and leave the behaviour alone.

- **Item 3. Enter, Space and Backspace are captured globally.** The `keydown`
  handler claims these keys for the whole document. Move it byte for byte. Do
  not add a target check, do not drop a `case`, do not remove a
  `preventDefault()`.
- **Item 4. A click anywhere advances the deck, and `hashchange` is not
  handled.** Move the `click` listener byte for byte. Do not add a
  `hashchange` listener.
- **Item 5. Accessibility: no `aria-live`, slides are unlabelled.** Do not add
  `aria-*` attributes, roles, or a live region to any slide or to the deck.
- **Item 7. `requestFullscreen` is unguarded.** Keep
  `document.documentElement.requestFullscreen()` exactly as written. Do not add
  a feature test, a `catch`, or a fallback.

One further carve out, inside item 6:

- **The motif is still rebuilt from scratch on every resize and twice on
  load.** This is deliberate and must be preserved. Rebuilding destroys and
  recreates every brick, which restarts the brick reveal transition, so the
  second build on `load` is visible. Skipping it, or memoising on width, would
  change the animation and would break the parity constraint. What item 6 does
  fix here is the state: `window.__rt` becomes a closure variable, and the
  top level `idx`, `slides`, `arches`, `piles`, `total`, `ticks`, `tickEls`,
  `tx` and `start` globals disappear. The rebuild cost is recorded as a follow
  up alongside items 3, 4, 5 and 7.

---

## 2. Audit confirmation

Two reference commits, not one. This plan was first written against
`1e7429e`. While stage 0 was being executed, `customers/index.html` was
edited live on disk by a human working in parallel: six panel screenshots
landed, two slides merged, one slide was replaced, and the team grew from
three members to five. `index.html` (Core) was never touched and is still
exactly `1e7429e`. The live edits were committed as two ordinary commits so
they are not lost and so this plan has a fixed point to cite:

- `1e7429e` for every `index.html` (Core) citation.
- `dfe2bd0` for every `customers/index.html` citation, which carries
  `e8e3dd4` (the slide merge, the replacement slide, the screenshots) and
  `dfe2bd0` (Ali Marateb added to the team) on top of `1e7429e`.

Read any cited range with `git show <commit>:<path>` so the numbers stay
valid after earlier stages have edited the file.

### Item 1. Duplicated engine: confirmed, with measured divergence

| Fact | Evidence |
| --- | --- |
| `index.html` is 855 lines, `customers/index.html` is 961 | `wc -l` |
| The navigation engine is byte identical in both | `index.html` 790 to 852 equals `customers/index.html` 896 to 958, 63 lines, verified with `diff -q` |
| `buildArch` in Customers is a strict superset of the one in Core | `index.html` 736 to 779 against `customers/index.html` 791 to 844. Customers adds `lift`, `placed` and `gone`. With no `data-lift`, `data-place` or `data-ghostat` present, `gone` and `placed` are empty, `lift` is `-1`, and the three extra branches cannot fire, so the Customers version reproduces Core's output exactly. |
| The stylesheets share most of their rules | `index.html` 18 to 367 against `customers/index.html` 18 to 417 |

Divergences found, each of which this plan resolves explicitly:

| What | Core | Customers |
| --- | --- | --- |
| `--tile` | `min(158px, 18vh)` (line 46) | `min(204px, 24vh)` (line 46) |
| `h1` font size | `clamp(4rem,13vw,15rem)` (line 104) | `clamp(3.2rem,10vw,11.5rem)` (line 108) |
| `.m-name` font size | `clamp(.8rem,1.05vw,1.1rem)` (line 193) | `clamp(.86rem,1.15vw,1.22rem)` (line 271) |
| `.m-role` font size | `clamp(.7rem,.9vw,.94rem)` (line 197) | `clamp(.74rem,.95vw,1rem)` (line 274) |
| Narrow frame HUD fix | absent | present, `customers/index.html` 406 to 412 |
| Narrow frame `.arcrow` and `.pier` stacking | absent | present, `customers/index.html` 391 to 392 |
| Lifted brick, loose bricks, thin plinth | absent | present, `customers/index.html` 153 to 173 |
| Pending niche state | absent | present, `customers/index.html` 258 to 269 |
| Claude glyph niche | present, `index.html` 182 to 191 | absent |

The last four rows are the cases where Customers has a feature Core lacks. The
first four are the same declaration carrying different values.

### Item 2. Content fused with engine: confirmed, 99 inline style attributes exactly

`grep -o 'style="' index.html | wc -l` gives 51 and the same count on
`customers/index.html` gives 48. Total 99. Every one of them sits in the slide
markup, not in the stylesheet. The breakdown:

| Kind | Count | Example |
| --- | --- | --- |
| A stagger index alone, `--d:N` | 74 | `index.html:462` |
| A stagger index plus a one off declaration | 14 | `index.html:481` |
| A one off declaration alone | 6 | `index.html:465` |
| Photo framing on a team portrait | 5 | `index.html:390` |

All 99 are removable. Stage 6 converts the 88 that carry `--d`, stage 7 the 20
one off declarations, and stage 8 the 5 photo framings. See those stages for the
exact replacement of each one.

### Item 6. Script architecture: confirmed

Nine top level `var` declarations in each deck, so nine properties on `window`
per deck, plus `window.__rt`:

- Core, `index.html`: `rfs` (720), `arches` (781), `slides` (799), `total`
  (800), `idx` (801), `ticks` (803), `tickEls` (805), `tx` (842), `start` (851),
  and `window.__rt` (785).
- Customers, `customers/index.html`: `arches` (886), `piles` (887), `slides`
  (905), `total` (906), `idx` (907), `ticks` (909), `tickEls` (911), `tx` (948),
  `start` (957), and `window.__rt` (891).

Mixed declarations: exactly one `const` per deck (the `CONFIG` object, line 710
in Core and 709 in Customers) and `var` everywhere else.

Rebuild cost: `buildAll()` is called once at parse time (`index.html:783`) and
again on `load` (`index.html:788`), and the resize handler rebuilds every arch
and every pile after a 120ms debounce (`index.html:784` to `787`).

### Item 8. Documentation and config drift: confirmed

- `README.md:59` reads
  `**Live:** https://mrsadri.github.io/core-deck/customers/ (once this branch is merged)`.
  The branch is merged: `main`, `origin/main` and `refactor/shared-engine` all
  point at `1e7429e`, and `git cat-file -e main:customers/index.html` succeeds.
  The claim is stale.
- Both decks point `og:image` at the same file: `index.html:13` and
  `customers/index.html:13` both read
  `https://mrsadri.github.io/core-deck/assets/og.jpg`. That image is 1200x630
  and was made for Core.
- `README.md:30` still says config lives in "the `<script>` block in
  `index.html`", which stops being true at stage 4.
- `customers/assets/screens/README.md:8` points at
  `../../index.html`, which stops being true at stage 5.
- `README.md:65` to `83` still describes the 15 slide deck from before this
  plan's own stage 0 caught the deck being revised live: it names a slide 07
  ("One page holds the whole customer") that no longer exists, and a slide 09
  ("Returning or new, answered at once") that was replaced by a different
  slide entirely. This is new drift, caused by this refactor's own stage 0,
  not by the original audit, and stage 10 corrects it.
- Presentation TODOs exist only as values in code: `RFS_CONFIRMED: false`
  (`index.html:713`), `TODAY_DURATION: 'Months'` (`index.html:716`), and the
  tech lead's name spelling. The README describes them in prose but there is
  no checklist to work through. Customers' own placeholders are gone as of
  `dfe2bd0`: all six `CONFIG.SCREENSHOTS` entries and all five
  `CONFIG.PHOTOS` entries (`customers/index.html:710` to `727`) now point at
  real files, all of which exist on disk. Section 7 of this plan keeps that
  true: no step may reintroduce a `null`.

### Three findings the audit did not list

Each is dead code: a rule no markup can reach. Removing a dead rule cannot
change rendering, and stage 9 removes these three under the parity gate.

| Rule | Where | Why it is dead |
| --- | --- | --- |
| `.arch.flat .vsr > i{transition-delay:0ms}` | `index.html:143` | No element in either deck carries the class `flat` |
| `.leg b.dash{...}` | `index.html:250` | The only legend, on slide 6, uses `brown` and `yellow` only |
| `.farsi{...}` | `customers/index.html:126` | No element carries the class `farsi` |

Two more rules are overridden everywhere they apply, so collapsing them changes
no computed value. Stage 7 handles both:

- `h1{font-size:clamp(3.2rem,10vw,11.5rem)}` (`customers/index.html:108`). The
  deck has exactly one `h1`, on the closing slide, and it overrides the size
  inline.
- `.motif-wide{width:min(560px,46vw)}` (`customers/index.html:177`) and its
  narrow frame counterpart `min(420px,70vw)` (line 388). All four uses of
  `.motif-wide` set `width` inline, and an inline declaration beats a media
  query, so neither rule is ever the winning declaration.

---

## 3. Technology decision

### Criteria, in the order given

(a) An architecture an AI agent can navigate and edit with minimal context.
(b) One shared engine, and one obvious place for each deck's content.
(c) Static hosting on GitHub Pages.
(d) The fewest dependencies and the least tooling that satisfy (a) to (c).

### The decision

**External classic scripts and external stylesheets, linked from a thin HTML
shell per deck. No build step, no package manager, no dependencies. Slide
content is declared as data in plain `.js` files.**

The engine exposes exactly one global identifier, `DECK`, which holds only
functions and is frozen before the first slide is shown. All mutable state lives
inside the objects the engine creates and never escapes to global scope.

### Why this wins

It is the only option that satisfies all four criteria at once, and the deciding
fact is measured rather than assumed.

**ES modules do not load over `file://`.** This was tested with the Chrome
already installed on the machine:

```
<script type="module">import {marker} from './mod.js'</script>   blocked
<script src="classic.js"></script>                                loads
<link rel="stylesheet" href="s.css">                              loads
```

A module graph is blocked by the file scheme's opaque origin, with no error the
page can see. A classic script and an external stylesheet both load. The decks
are presented in meeting rooms, where the ability to double click
`index.html` and present with no network and no local server is a real
property worth keeping. It is also what the parity harness depends on: it drives
Chrome at `file://` URLs.

Classic scripts cost one thing: the engine's functions have to reach the deck's
scripts through a shared name rather than through `import`. One frozen namespace
object is a small, visible, reviewable price. Mutable state, which is what the
audit actually complains about, is removed completely either way.

### Rejected alternatives

**ES modules with no build step.** The cleanest possible dependency graph:
`import` and `export` state every edge, and there is no namespace object at all.
Rejected because it breaks `file://`, which breaks both offline presenting and
the parity harness. Recovering either would mean asking a presenter to start
`python3 -m http.server`, which is a worse failure mode in a meeting room than a
namespace object is in a code review. If the project later gains a dev server as
a hard requirement, this is the migration to make, and the file layout in
section 4 maps one to one onto it: each engine file becomes a module, the IIFE
wrapper becomes `export`, and `main.js` becomes the entry point.

**A static site generator (Eleventy, Astro, Vite).** Would give real templating,
real includes, per slide files and a single built artifact. Rejected on criterion
(d): it introduces `node_modules`, a lockfile, a build command, a deploy
workflow and a version treadmill, to serve two decks of 19 and 14 slides that
have no dynamic data. It also makes the deployed artifact different from the
source, which costs an AI agent context rather than saving it.

**Keep one file per deck, extract only the shared parts into `<!-- #include -->`
style comments processed by hand.** Rejected: no mechanism enforces it, so the
two copies drift again, which is exactly how the current divergence happened.

**Web components with declarative shadow DOM.** Would scope styles per slide
type. Rejected on criteria (a) and (d): it adds a component registration layer
and shadow boundaries that the parity harness would have to pierce, in exchange
for scoping that two decks with a shared design system do not need.

---

## 4. Target architecture

Styles are linked in this order on every shell, and the order is part of the
contract: engine sheets first, then `engine/css/compact.css` if the deck opts in,
then the deck's own sheets. Several rules rely on it, so a sheet moved earlier or
later will change rendering.

### Directory tree

```
site/
  .gitignore                   adds tools/baseline/
  .nojekyll                    unchanged, keeps Pages from running Jekyll
  README.md                    what the decks are, how to run them, where to edit
  ARCHITECTURE.md              the map: every file, its job, and how to add a deck
  PRESENTING.md               the pre presentation checklist
  REFACTOR_PLAN.md             this file
  index.html                   Core: shell only
  assets/                      shared assets, unchanged
    favicon.svg  apple-touch-icon.png  og.jpg  team/*.jpg  team/claude-mark.svg
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
    assets/screens/            unchanged, plus its README repointed
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

### Every file: its one responsibility, and its boundaries

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

### How a deck declares its slides

A slide is a plain object:

```js
{
  id: 'one-week',
  name: 'Months to one week',
  html: '<div class="wrap stack center">...</div>'
}
```

`id` is the stable handle used in docs and commit messages. `name` is the line
from the README's narrative arc, so an agent can grep the deck for a slide by
the words a human would use. `html` is the slide's inner markup: exactly what
sits inside `<section class="slide">` today.

A content file declares one const holding an array of these, in slide order:

```js
const CORE_SLIDES_PROBLEM = [ /* slides 03, 04, 05 */ ];
```

`main.js` concatenates the acts in order and hands them to the engine. Slide
order is therefore the concatenation order in `main.js` plus the array order in
each act file, and nothing else.

### How a deck specific motif feature plugs in

It does not need to. Every feature the audit lists as deck specific is a data
attribute on an element, read by `engine/js/motif.js`:

| Feature | Attribute | Effect |
| --- | --- | --- |
| Partly built span | `data-fill="n"` | bricks from `n` up are ghosts |
| The new line | `data-new="n"` | `n` bricks at the crown are yellow |
| The keystone | `data-key="1"` | the centre brick is orange |
| A search hit | `data-lift="i"` | brick `i` stands clear of the curve |
| Stones set early | `data-place="i,j"` | those bricks are laid in an unbuilt span |
| Stones missing | `data-ghostat="i,j"` | those bricks are ghosts in a built span |
| A pile of orders | `data-loose="n" data-rows="r"` | `n` loose bricks in `r` rows |

Because Core's `buildArch` is a strict subset of Customers', the engine takes the
Customers version verbatim and Core's output is unchanged. A deck that uses none
of these attributes pays nothing.

The one extension point that does exist is the decorator list. A decorator is a
function `(root) => void` that the engine runs once, after rendering and before
any measuring. Core passes one (inject the config's copy). Customers passes two
(fill the screenshot frames, fill the niches). A third deck passes whatever it
needs, or none.

### Where presentation time config lives

In `core/config.js` and `customers/config.js`, one frozen const each, and nowhere
else. `PRESENTING.md` lists what is still open and points at the exact const
member for each item. No engine file may name a config value.

---

## 5. Rules the executor must obey throughout

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
12. **Source line ranges are read from the baseline.** Always
    `git show 1e7429e:index.html` or `git show 1e7429e:customers/index.html`,
    never the working copy, whose line numbers shift as you go.

---

## 6. Parity verification

### What proves what

`tools/parity.mjs` already exists in the working tree, untracked. Stage 0 commits
it and extends its probe. It records five fingerprints for every slide of every
deck at every viewport, then compares them against a baseline recorded before any
change. Four viewports times 33 slides gives **132 slide and viewport pairs**.

| Required proof | Fingerprint | How it is captured |
| --- | --- | --- |
| Slide text | `text` | `innerText` of the active slide, exact string |
| Slide order | `counter`, `ticksOn` | the rendered counter and how many ticks are lit, per hash |
| Layout | `pixels`, `anims[].width`, `.maxWidth`, `.marginTop`, `.textAlign` | SHA-256 of the settled screenshot, plus the computed box of every animated element |
| Colours | `pixels` | SHA-256 of the settled screenshot |
| Typography | `pixels`, `anims[].fontSize` | screenshot hash, plus computed font size per animated element |
| Enter animation timing | `anims[].d`, `anims[].delay` | computed `--d` and computed `transition-delay` per animated element |
| Arch geometry | `motifs[].transform`, `.width`, `.height`, `.left`, `.top`, `.faceHeight`, `.faceTop` | the exact inline style strings the builder writes on every brick |
| Brick reveal order | `motifs[].i`, `motifs[].cls` | computed `--i` and the state class per brick |
| Team portraits | `photos[]` | src, alt, class, computed object position, transform and box per portrait |

`anims`, `motifs` and `photos` are read after scripting settles, so they are
exact rather than sampled. `pixels` is captured over the same CDP connection,
after a fixed real time margin past the enter animation and, on the title
slide only, past the hint's fade, and after an explicit readiness promise
confirms every image has decoded and every font has loaded. The promise is
the part that matters: real images decode on their own schedule, off the
page's own timers, and a fixed margin alone raced with that decode under
load, producing a different settled frame from run to run on exactly the
slides that carry a real photo or screenshot.

The probe compares computed values, not class names, for animated elements. That
is deliberate: stage 7 renames inline declarations into classes, and what must
not change is the computed effect, not the name it arrives under. Brick state
classes are engine generated and are compared, because those are the output.

### Viewports

Chosen to cross every breakpoint in both stylesheets: `1440x900`, `1280x800`,
`768x1024` (crosses `max-aspect-ratio:1/1`), `390x844` (crosses both
`max-aspect-ratio:1/1` and `max-width:760px`).

### Commands

Run from the repository root, `site/`.

```
# once, at stage 0, before any file is changed
node tools/parity.mjs record

# at the end of every stage, before the commit
node tools/parity.mjs check
node tools/lint.mjs
```

Expected output from `check`:

```
parity: 132/132 slide-viewport pairs identical
every slide matches the baseline on pixels, text, animation and motif geometry.
```

Expected output from `lint.mjs`:

```
lint: every rule holds
```

`node tools/parity.mjs frames` is a one off determinism probe for frames captured
partway through the enter animation. It is informational. The gate uses settled
frames, which are deterministic. A `NOT deterministic` line from `frames` is not
a reason to stop.

### Rules about the baseline

- Record it exactly once, at stage 0, from the untouched baseline commit.
- `tools/baseline/` is git ignored. It is the evidence for this one run of the
  refactor, not a repository asset.
- **Never re-record it.** Re-recording after a change makes the gate agree with
  whatever you just did, which destroys the only proof the refactor is faithful.
  If `check` fails, stop and report (rule 11).
- Do not delete `tools/baseline/` until stage 11 has passed.

### Requirement on a failure

`check` prints, for each failing pair, which fingerprints differ and the first
differing entry of `anims`, `motifs` and `photos`. Report that output verbatim.

---

## 7. URL and offline impact

Nothing in this section is a silent change. Items marked **changes** are the
complete list of behaviour the refactor alters.

### Live URLs: unchanged

`https://mrsadri.github.io/core-deck/` serves Core and
`https://mrsadri.github.io/core-deck/customers/` serves My Customers, from
`index.html` and `customers/index.html`, exactly as today. No redirect, no
rename, no new entry point. `#7` still opens slide 7 on both. `.nojekyll` stays,
so Pages keeps serving the tree as is.

The new directories (`engine/`, `core/`, `customers/css/`,
`customers/content/`) are served as static files at predictable paths. They are
not user facing and no deck links to them from a slide.

### Offline behaviour: unchanged

Verified rather than assumed, with the installed Chrome at a `file://` URL: an
external classic `<script src>` loads, and an external `<link rel="stylesheet">`
loads. Double clicking `index.html` therefore still presents the whole deck with
no server, no network and no build. There is no `fetch`, no `import`, no CDN and
no runtime network request of any kind after the refactor, which is why ES
modules were rejected (section 3).

**Changes:** the number of files the browser requests rises from one HTML file
plus its assets to one HTML file plus eleven to twelve stylesheets plus eight to
ten scripts plus its assets. Over `file://` these are local reads. Over GitHub
Pages they are HTTP/2 requests against a CDN. Justification: this is the price of
having one engine instead of two copies, it is paid once per load before the
first slide, and no alternative without a build step avoids it.

### The "no web fonts" rule: unchanged, and now enforced

Typography stays Iowan Old Style with the existing fallback stack, against the
system sans. There is no `@font-face` and no external font request today, and
`tools/lint.mjs` now fails the build if one appears. The rule moves from a README
claim to a checked rule, which is strictly stronger.

### The social card: changes

Today both decks point `og:image` at `assets/og.jpg`, a 1200x630 image made for
Core. Stage 10 gives My Customers its own card at `customers/assets/og.png`,
rendered at 1200x630 from its own title slide with the same headless Chrome the
parity harness uses, and repoints only that deck's `og:image`. Core's card is
untouched.

Justification: a deck whose social card advertises a different deck is the drift
the audit found, and this removes it with no new dependency and no fabricated
artwork. The card is a true picture of the deck's first slide. It is a generated
placeholder, not a designed card, and `PRESENTING.md` records that a designed
one may replace it.

### A niche with a missing photo: changes

Today a missing Core portrait renders an empty brown niche, while a missing
Customers portrait renders a dotted PHOTO PENDING niche. Stage 8 routes both
decks through one niche primitive, so Core gains the same PHOTO PENDING
fallback.

Justification: it removes the duplicated photo handling, and it is unreachable
with the current assets, so no slide of either deck renders differently. It is
listed here because it is a behaviour difference under conditions the decks do
not currently meet.

### Developer requirements: changes

`tools/parity.mjs` and `tools/lint.mjs` need Node 18 or later, and the parity
harness needs Google Chrome at the macOS application path it already hardcodes.
Neither deck needs either at any point. Justification: the gates are developer
scaffolding, and keeping them out of the decks is what preserves the zero
dependency property.

### The presentation time placeholders: unchanged

`TO CONFIRM` on Core's RFS expansion, `SCREENSHOT PENDING` on a null panel
frame, and `PHOTO PENDING` on a null portrait all work exactly as they do now,
rendering from a flag or a null in that deck's `config.js` precisely as before.
Customers has none of its own left to show today, since all six screenshots
and all five portraits are real files as of `dfe2bd0`, but the mechanism is
unchanged and fires the moment any one of them is set back to `null`. What
changes is that `PRESENTING.md` now lists what is still open as a checklist,
so Core's two remaining items can be worked
through rather than rediscovered.

---

## 8. Execution checklist

Work on `refactor/shared-engine`. Run every command from the repository root,
`site/`. Read every cited source line range with
`git show <commit>:<path> | sed -n 'X,Yp'`, never from the working copy, where
`<commit>` is `1e7429e` for `index.html` and `dfe2bd0` for
`customers/index.html`. Every citation below already names which file it is.

Where an item says "copy verbatim", the copied text must be byte identical to
the source, including indentation and comments. Where an item gives code in a
block, write exactly that code.

Twelve stages, 121 items.

---

### Stage 0. Lock the baseline and the gates

Nothing about either deck changes in this stage. It exists so that every later
stage can be proved.

- [x] **0.1** `tools/parity.mjs` exists in the working tree but is untracked.
  Run `git add tools/parity.mjs`.
  **Check:** `git status --short tools/parity.mjs` prints `A  tools/parity.mjs`.
  **If it fails:** stop and report. Do not recreate the file.

- [x] **0.2** The Chrome on this machine does not behave the way the comment
  above `DETERMINISM_FLAGS` assumes. A fresh profile's first run launches
  Google Update's wake-all cycle, which reaches out to Google's servers and,
  with no route to them, hangs for a very long time; separately, this
  Chrome does not reliably exit a `--screenshot` process after writing the
  file, budget or no budget. In `tools/parity.mjs`, replace the comment and
  the `DETERMINISM_FLAGS` array with:
  ```js
  /**
   * Flags that make two runs of the same page produce the same bytes. Software
   * rendering, a fixed colour profile and grayscale antialiasing remove the
   * machine dependent parts of text rasterisation; an isolated profile keeps one
   * capture's disk cache from changing the next capture's image decode timing.
   *
   * The background service flags stop a fresh profile from launching Google
   * Update's wake-all cycle on first run. That cycle reaches out to Google's
   * update servers, and on a machine with no route to them it hangs for a long
   * time, which otherwise leaves the --screenshot process sitting well past
   * its virtual time budget even though the screenshot itself was written.
   */
  const DETERMINISM_FLAGS = [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--force-color-profile=srgb',
    '--disable-lcd-text',
    '--disable-font-subpixel-positioning',
    '--disable-partial-raster',
    '--disable-skia-runtime-opts',
    '--run-all-compositor-stages-before-draw',
    '--disable-new-content-rendering-timeout',
    '--disable-image-animation-resync',
    '--disable-background-timer-throttling',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-domain-reliability',
    '--disable-sync',
    '--disable-client-side-phishing-detection',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--metrics-recording-only'
  ];
  ```
  **Check:** `node --check tools/parity.mjs` exits 0, and
  `grep -c 'disable-background-networking' tools/parity.mjs` prints `1`.

- [x] **0.3** The native `--screenshot` flag has a second problem beyond not
  exiting: it can write the file before a real `<img>` has finished
  decoding, which is invisible on a deck with no real images and was never
  caught until My Customers carried real photos and panel screenshots. Two
  runs of `check` against the same content then disagree on `pixels` for
  exactly the slides that carry a real image, on no fixed pattern, because
  decode runs on its own schedule and a fixed wait only usually outlasts it.
  The fix is to stop guessing a wait and ask the page directly, over the same
  CDP connection already used for the probe, then capture the frame with
  `Page.captureScreenshot` instead of the native flag.

  In `tools/parity.mjs`, make five changes.

  First, replace this comment block (the one above `*   pixels  SHA-256 of
  the settled screenshot   layout, colour, type, geometry`'s surrounding
  paragraph):
  ```js
   * The last three are read after scripting settles and are time independent,
   * so they are exact rather than sampled. Pixels are captured through Chrome's
   * virtual time clock, which makes repeat runs byte identical.
  ```
  with:
  ```js
   * The last three are read after scripting settles and are time independent,
   * so they are exact rather than sampled. Pixels are captured over the same
   * CDP connection used for the probe: real images and fonts are waited on
   * explicitly through a readiness promise evaluated in the page, rather than
   * inferred from a timing budget, because a fixed budget raced with image
   * decode under load and produced a different settled frame from run to run
   * on slides that carry a real photo or screenshot.
  ```

  Second, replace
  ```js
  /**
   * Long enough for everything time dependent to reach its end state: the 120ms
   * resize debounce, every transition, and the title hint's 6s fade that does
   * not start until 2.4s. Stopping mid fade would sample a moving opacity.
   */
  const SETTLE_BUDGET_MS = 12000;
  ```
  with:
  ```js
  /**
   * Real wall clock milliseconds, long enough for everything time dependent to
   * reach its end state after navigation. SHORT comfortably clears the enter
   * animation and every brick reveal, whose slowest observed transition
   * finishes under 1.2s. LONG additionally clears the title hint's 6s fade,
   * which does not start until 2.4s after the slide becomes active; stopping
   * mid fade would sample a moving opacity. Only slide 1 of each deck carries
   * that hint. These are fixed margins rather than measured waits because they
   * only have to be safely past the slowest known transition they cover.
   */
  const SETTLE_MARGIN_SHORT_MS = 1800;
  const SETTLE_MARGIN_LONG_MS = 9000;

  /**
   * A promise, evaluated in the page, that resolves once every image has
   * either decoded or failed and every font face has loaded. Real images and
   * fonts decode on their own schedule, off the page's own timers, so nothing
   * about the enter animation's timing implies they are ready: this is the
   * only way to know for certain before a screenshot is taken.
   */
  const IMAGES_READY_EXPRESSION = `Promise.all([
    document.fonts.ready,
    ...[...document.images].map(img => img.decode().catch(() => {}))
  ])`;
  ```

  Third, replace the whole block that reads, in order: the `Pixels: one
  Chrome per capture` section comment, `waitForStableFile`, and
  `capturePixels`, up to (but not including) the `DOM probe` section comment,
  with:
  ```js
  /**
   * Polls a file on disk until its size stops changing. Used only by the mid
   * animation frame probe below, whose native `--screenshot` process does not
   * reliably exit on its own even after writing the file.
   */
  async function waitForStableFile(path, { intervalMs = 50, stableChecks = 2, timeoutMs = 20000 } = {}) {
    const deadline = Date.now() + timeoutMs;
    let lastSize = -1;
    let stableCount = 0;
    while (Date.now() < deadline) {
      const size = existsSync(path) ? (await readFile(path)).length : -1;
      if (size > 0 && size === lastSize) {
        stableCount++;
        if (stableCount >= stableChecks) return;
      } else {
        stableCount = 0;
      }
      lastSize = size;
      await new Promise(res => setTimeout(res, intervalMs));
    }
    throw new Error(`timed out waiting for ${path} to settle`);
  }
  ```
  and change the following section comment, `DOM probe: one Chrome per
  viewport, reused across that deck's slides.`, to:
  ```js
  /* ------------------------------------------------------------------ *
   * DOM probe and pixels: one Chrome per viewport, reused across that
   * deck's slides. The same CDP connection drives both.
   * ------------------------------------------------------------------ */
  ```

  Fourth, in the `Browser` class, replace the `send` method:
  ```js
    send(method, params = {}) {
      const id = ++this.#nextId;
      return new Promise(res => {
        this.#pending.set(id, message => res(message.result));
        this.#ws.send(JSON.stringify({ id, method, params }));
      });
    }
  ```
  with a version that fails loudly instead of hanging forever when Chrome
  never answers, and add a `screenshot` method right after `probe`:
  ```js
    /**
     * A CDP call that never responds would otherwise hang this forever: Chrome
     * gives no signal that it has stalled, so nothing else can tell the
     * difference between "about to resolve" and "never going to". The timeout
     * is the only backstop, and it is long enough to never fire on a call that
     * was always going to complete.
     */
    send(method, params = {}, timeoutMs = 15000) {
      const id = ++this.#nextId;
      return new Promise((res, rej) => {
        const timer = setTimeout(() => {
          this.#pending.delete(id);
          rej(new Error(`${method} did not respond within ${timeoutMs}ms`));
        }, timeoutMs);
        this.#pending.set(id, message => {
          clearTimeout(timer);
          res(message.result);
        });
        this.#ws.send(JSON.stringify({ id, method, params }));
      });
    }
  ```
  and, immediately after the existing `probe()` method, add:
  ```js
    /**
     * Waits out a settle margin, then waits on an explicit readiness promise
     * for every image and font before asking Chrome for a PNG over CDP. The
     * margin covers the enter animation and, for slide 1, the title hint's
     * fade; the promise covers real image decode, which runs on its own
     * schedule and is not implied by anything about the page's own timers
     * having settled.
     */
    async screenshot(slide) {
      const margin = slide === 1 ? SETTLE_MARGIN_LONG_MS : SETTLE_MARGIN_SHORT_MS;
      await new Promise(res => setTimeout(res, margin));
      await this.send('Runtime.evaluate', {
        expression: IMAGES_READY_EXPRESSION,
        awaitPromise: true
      });
      const result = await this.send('Page.captureScreenshot', { format: 'png' });
      if (!result || typeof result.data !== 'string') {
        throw new Error('screenshot returned nothing');
      }
      return Buffer.from(result.data, 'base64');
    }
  ```

  Fifth, `recordDeckAtViewport` no longer needs a shot directory, since
  nothing touches disk for a screenshot any more. Replace it, and the two
  functions that called it, exactly:
  ```js
  async function recordDeckAtViewport(deck, viewport) {
    const browser = await Browser.launch(viewport);
    const slides = [];
    try {
      for (let slide = 1; slide <= deck.slides; slide++) {
        await browser.open(slideUrl(deck.page, slide));
        const probed = await browser.probe();
        const pixels = sha256(await browser.screenshot(slide));
        slides.push({ slide, pixels, ...probed });
        process.stdout.write('.');
      }
    } finally {
      await browser.close();
    }
    return slides;
  }

  async function record() {
    await mkdir(BASELINE_DIR, { recursive: true });
    for (const deck of DECKS) {
      for (const viewport of VIEWPORTS) {
        process.stdout.write(`recording ${deck.name} at ${viewport.name} `);
        const slides = await recordDeckAtViewport(deck, viewport);
        const file = join(BASELINE_DIR, `${deck.name}-${viewport.name}.json`);
        await writeFile(file, JSON.stringify({ deck: deck.name, viewport: viewport.name, slides }, null, 2) + '\n');
        process.stdout.write(' ok\n');
      }
    }
    console.log(`\nbaseline written to tools/baseline/`);
  }
  ```
  and, in `check()`, remove the `shotDir` creation and cleanup and the `try`
  / `finally` wrapping them, and change the call it makes to
  `recordDeckAtViewport(deck, viewport)` (two arguments, not three). Leave
  everything else in `check()` as it is.
  **Check:** `node --check tools/parity.mjs` exits 0,
  `grep -c 'capturePixels\|shotDir\|SETTLE_BUDGET_MS' tools/parity.mjs` prints
  `0`, and `grep -c 'Page.captureScreenshot\|IMAGES_READY_EXPRESSION' tools/parity.mjs`
  prints `3`.
  **If a check fails:** stop and report. Do not proceed to record a baseline
  on a harness you have not confirmed still parses and no longer names the
  removed symbols.

- [x] **0.4** Append one line to `.gitignore` so the recorded fingerprints stay
  out of the repository. The file becomes exactly:
  ```
  .DS_Store
  tools/baseline/
  ```
  **Check:** `cat .gitignore` prints those two lines.

- [x] **0.5** In `tools/parity.mjs`, make the animated element probe compare
  computed effect rather than class name. Replace these four lines inside
  `const describe` (lines 120 to 123):
  ```js
      tag: el.tagName.toLowerCase(),
      cls: el.className,
      d: computed.getPropertyValue('--d').trim(),
      delay: computed.transitionDelay
  ```
  with:
  ```js
      tag: el.tagName.toLowerCase(),
      d: computed.getPropertyValue('--d').trim(),
      delay: computed.transitionDelay,
      fontSize: computed.fontSize,
      maxWidth: computed.maxWidth,
      width: computed.width,
      marginTop: computed.marginTop,
      textAlign: computed.textAlign
  ```
  **Check:** `grep -c 'cls: el.className' tools/parity.mjs` prints `1`, the one
  remaining occurrence being inside `const brick`, which must keep it.
  **If it prints 0 or 2:** stop and report.

- [x] **0.6** In the same file, add a portrait fingerprint. Replace the line
  ```js
    motifs: [...active.querySelectorAll('.vsr, .lb')].map(brick)
  ```
  with:
  ```js
    motifs: [...active.querySelectorAll('.vsr, .lb')].map(brick),
    photos: [...active.querySelectorAll('.niche img')].map(el => {
      const computed = getComputedStyle(el);
      return {
        src: el.getAttribute('src'),
        alt: el.alt,
        cls: el.className,
        objectPosition: computed.objectPosition,
        transform: computed.transform,
        width: computed.width,
        height: computed.height
      };
    })
  ```
  **Check:** `grep -c 'photos:' tools/parity.mjs` prints `1`.

- [x] **0.7** In the same file, replace
  ```js
  const FINGERPRINTS = ['pixels', 'text', 'anims', 'motifs'];
  ```
  with
  ```js
  const FINGERPRINTS = ['pixels', 'text', 'anims', 'motifs', 'photos'];
  ```
  **Check:** `grep -c "'photos'\]" tools/parity.mjs` prints `1`.

- [x] **0.8** In the same file, make the failure report print portrait diffs too.
  Replace
  ```js
    for (const key of ['anims', 'motifs']) {
  ```
  with
  ```js
    for (const key of ['anims', 'motifs', 'photos']) {
  ```
  **Check:** `grep -c "'anims', 'motifs', 'photos'" tools/parity.mjs` prints `1`.

- [x] **0.9** Create `tools/lint.mjs` with exactly this content:
  ```js
  /**
   * The rules in REFACTOR_PLAN.md section 5, as code.
   *
   * Usage:
   *   node tools/lint.mjs
   *
   * Prints one line and exits 0 when every rule holds. Prints one line per
   * violation and exits 1 otherwise. No dependencies.
   */

  import { readdir, readFile } from 'node:fs/promises';
  import { dirname, extname, join, resolve } from 'node:path';
  import { fileURLToPath } from 'node:url';

  const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

  /** Extensions worth reading. Everything else in assets is binary. */
  const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.md']);

  /** Shells join the browser file rules in the last stage of the refactor. */
  const SHELLS = [];

  const MAX_LINES = 200;

  /** A file the browser loads, so the length and style rules apply to it. */
  function isBrowserFile(file) {
    if (SHELLS.includes(file)) return true;
    const ext = extname(file);
    if (ext !== '.css' && ext !== '.js') return false;
    return file.startsWith('engine/') || file.startsWith('core/') || file.startsWith('customers/');
  }

  /** A deck file that declares slide content. */
  function isContentFile(file) {
    return file.startsWith('core/content/') || file.startsWith('customers/content/');
  }

  /** A script written for this engine: engine or deck, never tools. */
  function isDeckScript(file) {
    if (extname(file) !== '.js') return false;
    return file.startsWith('engine/js/') || file.startsWith('core/') || file.startsWith('customers/');
  }

  function lineCount(text) {
    return text.replace(/\n$/, '').split('\n').length;
  }

  const RULES = [
    {
      name: 'no em dash',
      applies: () => true,
      check: text => text.includes('\u2014') ? 'contains an em dash' : null
    },
    {
      name: 'at most 200 lines',
      applies: isBrowserFile,
      check: text => {
        const lines = lineCount(text);
        return lines > MAX_LINES ? `${lines} lines, limit ${MAX_LINES}` : null;
      }
    },
    {
      name: 'no web fonts',
      applies: isBrowserFile,
      check: text => /@font-face|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(text)
        ? 'declares or fetches a web font'
        : null
    }
    // Later stages append their rules here.
  ];

  async function walk(dir) {
    const found = [];
    let entries;
    try {
      entries = await readdir(join(SITE_ROOT, dir), { withFileTypes: true });
    } catch {
      return found;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const child = dir === '.' ? entry.name : dir + '/' + entry.name;
      if (child === 'tools/baseline') continue;
      if (entry.isDirectory()) found.push(...(await walk(child)));
      else if (TEXT.has(extname(entry.name))) found.push(child);
    }
    return found;
  }

  const violations = [];

  for (const file of (await walk('.')).sort()) {
    const text = await readFile(join(SITE_ROOT, file), 'utf8');
    for (const rule of RULES) {
      if (!rule.applies(file)) continue;
      const problem = rule.check(text, file);
      if (problem) violations.push(`${file}: ${rule.name}: ${problem}`);
    }
  }

  if (violations.length) {
    for (const line of violations) console.error(line);
    console.error(`\nlint: ${violations.length} violation(s)`);
    process.exit(1);
  }

  console.log('lint: every rule holds');
  ```
  The em dash in that rule must be written as the escape `\u2014`, never as
  the character itself, or the file fails its own rule.
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds` and exits 0.
  **If it reports an em dash:** stop and report which file. Do not edit a deck
  file to satisfy it at this stage.

- [x] **0.10** Record the baseline from the untouched decks.
  Run `node tools/parity.mjs record`.
  **Check:** `ls tools/baseline | wc -l` prints `8`, and
  `node -e "const s=require('./tools/baseline/core-1440x900.json').slides; console.log(s.length)"`
  prints `19`.
  **If `record` fails for lack of Chrome:** stop and report. The whole plan
  depends on this gate; there is no fallback.

- [x] **0.11** Prove the gate is reproducible on this machine, before anything
  has changed. Run `node tools/parity.mjs check`.
  **Check:** the output contains
  `parity: 132/132 slide-viewport pairs identical`.
  **If it is anything other than 132/132:** stop and report. The harness is not
  deterministic here and no later result would mean anything.

- [x] **0.12** Run the mid animation determinism probe once, for the record:
  `node tools/parity.mjs frames`.
  **Check:** the command exits 0 and prints three lines. The verdicts are
  informational. Paste them into the commit message.
  **If it fails to run:** note it and continue. This probe is not a gate.

- [x] **0.13** Commit.
  ```
  Add the parity and lint gates this refactor is measured by

  parity.mjs records five fingerprints per slide per viewport: the settled
  screenshot, the slide's text, the computed delay and box of every animated
  element, the geometry and reveal index of every brick, and every portrait.
  132 slide and viewport pairs in all.

  The animated element probe compares computed values rather than class
  names, because a later stage moves inline declarations into classes and
  what must not change is the effect, not the name.

  Two bugs in the harness itself needed fixing before it could be trusted.
  A fresh Chrome profile's first run launches Google Update's wake-all
  cycle, which hangs for a long time with no route to its servers; the
  background service flags stop that. Native --screenshot, separately,
  can write its file before a real image has finished decoding, which a
  fixed timing budget cannot see and which only showed up once My Customers
  carried real photos and panel screenshots: pixels now wait on an explicit
  readiness promise for every image and font, evaluated over the same CDP
  connection as the probe, before Page.captureScreenshot is called.

  lint.mjs holds the rules the refactor sets itself: a 200 line limit on
  anything the browser loads, no em dashes, no web fonts.
  ```

---

### Stage 1. Move the shared stylesheet into engine/css

Both decks keep working throughout: each shell links the engine sheets and keeps
a `<style>` block holding only its own rules.

- [x] **1.1** Create `engine/css/tokens.css`. Write this header, then on the next
  line `:root{`, then baseline `index.html` lines 26 to 44 verbatim, then `}` on
  its own line.
  ```css
  /* ============================================================
     Shared tokens: every value both decks agree on.

     Four more tokens are named here and declared by each deck in its
     own css/tokens.css, because their values differ per deck:
       --h1       the display size of an h1
       --tile     the width of a member portrait
       --m-name   the size of a member's name
       --m-role   the size of a member's role
     ============================================================ */
  ```
  **Check:** `grep -c -- '--kraft:' engine/css/tokens.css` prints `1` and
  `grep -c -- '--tile' engine/css/tokens.css` prints `1`, the one occurrence
  being in the header comment.

- [x] **1.2** Create `engine/css/base.css`: the line
  `/* The page itself: the reset, the kraft ground, the paper grain. */`
  then baseline `index.html` lines 49 to 69 verbatim.
  **Check:** `grep -c 'feTurbulence' engine/css/base.css` prints `1`.

- [x] **1.3** Create `engine/css/shell.css`: the line
  `/* The deck frame, slide visibility, and the enter animation. */`
  then baseline `index.html` lines 71 to 90 verbatim.
  **Check:** `grep -c 'var(--d,0) \* 65ms' engine/css/shell.css` prints `1`.

- [x] **1.4** Create `engine/css/type.css` from three parts in this order:
  1. baseline `index.html` lines 92 to 101 verbatim;
  2. this block, which replaces baseline lines 102 to 105 and is the only edit,
     moving the display size out to a deck token:
     ```css
     h1{
       font-family:var(--serif);font-weight:400;
       font-size:var(--h1);line-height:.86;letter-spacing:-.035em;
     }
     ```
  3. baseline `index.html` lines 106 to 123 verbatim.
  **Check:** `grep -c 'font-size:var(--h1)' engine/css/type.css` prints `1` and
  `grep -c 'clamp(4rem,13vw,15rem)' engine/css/type.css` prints `0`.

- [x] **1.5** Create `engine/css/motif.css` from five parts in this order. The
  order preserves both decks' cascade exactly, so do not rearrange it.
  1. baseline `index.html` lines 125 to 143 verbatim;
  2. baseline `customers/index.html` lines 153 to 158 verbatim;
  3. baseline `index.html` lines 145 to 146 verbatim;
  4. baseline `customers/index.html` line 160 verbatim;
  5. baseline `customers/index.html` lines 162 to 173 verbatim.
  **Check:** every selector is present exactly once:
  ```
  for s in '.arch{' '.vsr{' 'is-ghost' 'is-new' 'is-key' 'is-lift >' '.plinth{' '.plinth.thin{' '.loose{' '.lb{' '.lb.pale{'; do
    printf '%-16s %s\n' "$s" "$(grep -cF "$s" engine/css/motif.css)"
  done
  ```
  Every line prints `1`. Also `node tools/lint.mjs` still passes.

- [x] **1.6** Create `engine/css/member.css` from six parts in this order:
  1. this header and rule:
     ```css
     /* ---------- the member tile ---------- */
     /* One niche, shared by every deck, sized by three deck tokens:
        --tile, --m-name and --m-role. A niche holds a photo, the Claude
        glyph, or a pending marker. */
     .member{width:100%;text-align:center}
     ```
  2. baseline `index.html` lines 165 to 181 verbatim;
  3. baseline `index.html` lines 182 to 191 verbatim;
  4. baseline `customers/index.html` lines 258 to 269 verbatim;
  5. this block, which replaces baseline `index.html` lines 192 to 197 and moves
     the two sizes out to deck tokens:
     ```css
     .m-name{
       font-size:var(--m-name);font-weight:600;line-height:1.28;letter-spacing:-.012em;
       min-height:2.56em; /* keeps every role on the same baseline */
       overflow-wrap:break-word;
     }
     .m-role{font-size:var(--m-role);color:var(--brick);margin-top:.28rem;letter-spacing:.02em}
     ```
  6. this block, the part of each deck's narrow frame rules that is identical in
     both:
     ```css
     /* a narrow, tall frame */
     @media (max-width:760px) and (max-aspect-ratio:1/1){
       .niche{padding:4px}
       .niche::after{width:8px;height:8px;top:-4px}
     }
     ```
  **Check:** `grep -c 'var(--m-name)\|var(--m-role)\|var(--tile)' engine/css/member.css`
  prints `3`.

- [x] **1.7** Create `engine/css/layout.css`: baseline `index.html` lines 230 to
  235 verbatim, then lines 253 to 278 verbatim.
  **Check:** `grep -c '\.split{\|\.arcrow{\|\.pier{' engine/css/layout.css`
  prints `3`.

- [x] **1.8** Create `engine/css/title.css`: baseline `index.html` lines 148 to
  155 verbatim, then lines 334 to 336 verbatim.
  **Check:** `grep -c 'keyframes fade\|\.title-arch\|\.sign{' engine/css/title.css`
  prints `3`.

- [x] **1.9** Create `engine/css/hud.css`: baseline `index.html` lines 338 to 362
  verbatim.
  **Check:** `grep -c 'focus-visible' engine/css/hud.css` prints `1`.

- [x] **1.10** Create `engine/css/compact.css` with exactly this content. The
  first block is baseline `customers/index.html` lines 391 and 392, the second is
  lines 406 to 412, both lifted out of that deck's media queries so a deck can
  opt in by linking one sheet.
  ```css
  /* ---------- a narrow frame, opt in ---------- */
  /* The shared primitives in layout.css and hud.css, restacked for a narrow
     screen. A deck opts in by linking this sheet after those two.

     Core does not link it. Adopting it would change how Core renders below
     760px, which is a visible change and outside this refactor. */

  @media (max-aspect-ratio:1/1){
    .arcrow{grid-template-columns:1fr;gap:.8rem;padding-top:1.2rem}
    .pier:nth-child(1),.pier:nth-child(2),.pier:nth-child(3){transform:none}
  }

  /* on a phone the tick row crowded the counter off the edge */
  @media (max-width:760px){
    .hud{gap:.7rem}
    .ticks{flex:0 1 auto;min-width:0;overflow:hidden}
    .ticks b{width:7px;flex:none}
    .nav,.count{flex:none}
  }
  ```
  **Check:** `node -e "console.log(require('fs').readFileSync('engine/css/compact.css','utf8').match(/@media/g).length)"`
  prints `2`.

- [x] **1.11** Create `engine/css/motion.css`: baseline `index.html` lines 364 to
  366 verbatim.
  **Check:** `grep -c 'prefers-reduced-motion' engine/css/motion.css` prints `1`.

- [x] **1.12** In `index.html`, replace baseline lines 18 to 367, that is the
  whole `<style>` element including both tags, with the ten link elements below
  followed by a `<style>` element holding only Core's own rules.
  The links, in exactly this order:
  ```html
  <link rel="stylesheet" href="engine/css/tokens.css">
  <link rel="stylesheet" href="engine/css/base.css">
  <link rel="stylesheet" href="engine/css/shell.css">
  <link rel="stylesheet" href="engine/css/type.css">
  <link rel="stylesheet" href="engine/css/motif.css">
  <link rel="stylesheet" href="engine/css/member.css">
  <link rel="stylesheet" href="engine/css/layout.css">
  <link rel="stylesheet" href="engine/css/title.css">
  <link rel="stylesheet" href="engine/css/hud.css">
  <link rel="stylesheet" href="engine/css/motion.css">
  ```
  Then `<style>`, then, in this order:
  1. this header and token block:
     ```css
     /* ============================================================
        CORE / Shoraka internal deck
        The shared system lives in engine/css. What is left here is only
        what Core's own slides use.
        ============================================================ */

     :root{
       --h1: clamp(4rem,13vw,15rem);
       /* one tile size for every member, in both tiers */
       --tile: min(158px, 18vh);
       --m-name: clamp(.8rem,1.05vw,1.1rem);
       --m-role: clamp(.7rem,.9vw,.94rem);
     }
     ```
  2. baseline `index.html` lines 157 to 163 verbatim;
  3. this line, which replaces baseline line 164 now that `.member` lives in the
     engine:
     ```css
     .wm{width:100%;text-align:center}
     ```
  4. baseline `index.html` lines 199 to 218 verbatim;
  5. this block, which replaces baseline lines 220 to 228. The two niche
     declarations the engine now owns are gone, and the two member font sizes
     become token redeclarations:
     ```css
     /* a narrow, tall frame: fewer columns and smaller tiles, both tiers alike */
     @media (max-width:760px) and (max-aspect-ratio:1/1){
       :root{--tile:58px;--m-name:.7rem;--m-role:.66rem}
       .team,.wider-row{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:1rem}
       .niche{margin-bottom:.45rem}
       .wm b{font-size:.7rem}
       .wm i{font-size:.66rem}
     }
     ```
  6. baseline `index.html` lines 237 to 251 verbatim;
  7. baseline `index.html` lines 280 to 332 verbatim;
  then `</style>`.
  **Check:** `grep -c '<link rel="stylesheet" href="engine/css/' index.html`
  prints `10`, and `grep -c 'box-sizing\|feTurbulence\|prefers-reduced-motion' index.html`
  prints `0`.

- [x] **1.13** In `customers/index.html`, replace baseline lines 18 to 417, the
  whole `<style>` element including both tags, with eleven link elements followed
  by a `<style>` element holding only Customers' own rules.
  The links, in exactly this order:
  ```html
  <link rel="stylesheet" href="../engine/css/tokens.css">
  <link rel="stylesheet" href="../engine/css/base.css">
  <link rel="stylesheet" href="../engine/css/shell.css">
  <link rel="stylesheet" href="../engine/css/type.css">
  <link rel="stylesheet" href="../engine/css/motif.css">
  <link rel="stylesheet" href="../engine/css/member.css">
  <link rel="stylesheet" href="../engine/css/layout.css">
  <link rel="stylesheet" href="../engine/css/title.css">
  <link rel="stylesheet" href="../engine/css/hud.css">
  <link rel="stylesheet" href="../engine/css/compact.css">
  <link rel="stylesheet" href="../engine/css/motion.css">
  ```
  Then `<style>`, then, in this order:
  1. baseline `customers/index.html` lines 19 to 24 verbatim, the header comment;
  2. this token block:
     ```css
     :root{
       --h1: clamp(3.2rem,10vw,11.5rem);
       --tile: min(204px, 24vh);
       --m-name: clamp(.86rem,1.15vw,1.22rem);
       --m-role: clamp(.74rem,.95vw,1rem);

       /* the panel screenshot frame. Change this one value if the real
          captures come back at a different size. */
       --shot-ratio: 1280 / 832;
     }
     ```
  3. baseline `customers/index.html` line 116 verbatim (`h2.sm`);
  4. baseline line 121 verbatim (`.lead.sm`);
  5. baseline lines 126 to 128 verbatim (`.farsi`, the bidi comment, `.fa`);
  6. baseline line 133 verbatim (`.stack.narrow`);
  7. baseline lines 175 to 194 verbatim (the motif slot, `.sol`, `.pnote`);
  8. baseline lines 196 to 225 verbatim (the screenshot frame);
  9. baseline lines 227 to 233 verbatim (the beyond phase one badge);
  10. baseline lines 235 to 239 verbatim (the team header and `.team3`);
  11. baseline lines 276 to 285 verbatim (the project row);
  12. baseline lines 317 to 343 verbatim (`.plist`, `.twoarch`, `.scope`);
  13. this block, which replaces baseline lines 383 to 394 with `.split` removed
      (now in `engine/css/layout.css`) and `.arcrow` and `.pier` removed (now in
      `engine/css/compact.css`):
      ```css
      /* ---------- narrow and tall frames ---------- */
      @media (max-aspect-ratio:1/1){
        .sol{grid-template-columns:1fr;gap:clamp(1.2rem,3vh,2.2rem)}
        .sol .shot{order:-1}
        .motif{width:min(240px,42vw)}
        .motif-wide{width:min(420px,70vw)}
        .plist{grid-template-columns:repeat(2,minmax(0,1fr))}
        .scope{grid-template-columns:repeat(2,minmax(0,1fr))}
        .proj{grid-template-columns:1fr;gap:1rem;text-align:center}
      }
      ```
  14. this block, which replaces baseline lines 395 to 404 with the two niche
      declarations the engine now owns removed and the two member font sizes
      turned into token redeclarations:
      ```css
      @media (max-width:760px) and (max-aspect-ratio:1/1){
        :root{--tile:84px;--m-name:.78rem;--m-role:.7rem}
        .team3{gap:.8rem;grid-template-columns:repeat(2,minmax(0,1fr))}
        .niche{margin-bottom:.5rem}
        .plist{grid-template-columns:1fr;gap:.7rem}
        .scope{grid-template-columns:1fr;gap:.7rem}
      }
      ```
  then `</style>`.
  Baseline lines 406 to 412, the narrow frame HUD block, are not carried here:
  they are now in `engine/css/compact.css`, which this shell links.
  **Check:** `grep -c '<link rel="stylesheet" href="../engine/css/' customers/index.html`
  prints `11`, and `grep -c 'feTurbulence\|\.hud{' customers/index.html` prints `0`.

- [x] **1.14** Run the gates.
  ```
  node tools/parity.mjs check
  node tools/lint.mjs
  ```
  **Check:** `parity: 132/132 slide-viewport pairs identical` and
  `lint: every rule holds`.
  **If parity fails:** stop and report the full output. The most likely cause is
  a sheet linked out of order or a rule left in two places; do not re-record the
  baseline.

- [x] **1.15** Commit.
  ```
  Move the shared stylesheet into engine/css

  Eleven sheets, one band of the design system each. Both decks linked them
  in place of their own copy, and keep a style block holding only what their
  own slides use.

  Four values differed between the two copies: the h1 display size, the
  portrait width, and the two member label sizes. They are now tokens the
  engine names and each deck declares.

  compact.css is opt in. It carries the narrow frame treatment of the shared
  primitives, which only My Customers has today. Core does not link it,
  because adopting it would change how Core renders below 760px.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 2. Give each deck its own stylesheet

- [x] **2.1** Create `core/css/tokens.css`: the `:root` block from the `<style>`
  element of `index.html`, including the header comment above it, moved verbatim.
  **Check:** `grep -c -- '--h1:' core/css/tokens.css` prints `1`.

- [x] **2.2** Create `core/css/team.css`: from the `<style>` element of
  `index.html`, move verbatim the team section header, the two tier comment, the
  `.team,.wider-row` rule, the `.wm{width:100%;text-align:center}` rule, the
  `.wider` block, and the narrow frame media block. That is parts 2 to 5 of item
  1.12.
  **Check:** `grep -cF -- '--tile:58px' core/css/team.css` prints `1`,
  `grep -cF '.wider-label' core/css/team.css` prints `2`, and
  `grep -cF '.team,.wider-row' core/css/team.css` prints `2`.

- [x] **2.3** Create `core/css/slides.css`: from the `<style>` element of
  `index.html`, move verbatim everything that remains, that is parts 6 and 7 of
  item 1.12: the repeated builds, the legend, the big number, the BFF geometry,
  the before and after block, and the vocabulary block.
  **Check:** `grep -c '\.repeat{\|\.legend{\|\.punch{\|\.bff{\|\.ba{\|\.acr{' core/css/slides.css`
  prints `6`.

- [x] **2.4** In `index.html`, delete the whole `<style>` element, both tags
  included, and add three link elements after the ten engine links, in exactly
  this order:
  ```html
  <link rel="stylesheet" href="core/css/tokens.css">
  <link rel="stylesheet" href="core/css/team.css">
  <link rel="stylesheet" href="core/css/slides.css">
  ```
  **Check:** `grep -c '<style' index.html` prints `0` and
  `grep -c '<link rel="stylesheet"' index.html` prints `13`.

- [x] **2.5** Create `customers/css/tokens.css`: from the `<style>` element of
  `customers/index.html`, move verbatim the header comment and the `:root` block,
  that is parts 1 and 2 of item 1.13.
  **Check:** `grep -c -- '--shot-ratio' customers/css/tokens.css` prints `1`.

- [x] **2.6** Create `customers/css/team.css` by moving these, verbatim, out of
  the `<style>` element of `customers/index.html`: the team header and `.team3`
  (part 10 of item 1.13), the project row (part 11), the `.proj` line from the
  narrow aspect media block, and the `:root`, `.team3` and `.niche` lines from
  the 760px media block. The two media blocks become:
  ```css
  @media (max-aspect-ratio:1/1){
    .proj{grid-template-columns:1fr;gap:1rem;text-align:center}
  }

  @media (max-width:760px) and (max-aspect-ratio:1/1){
    :root{--tile:84px;--m-name:.78rem;--m-role:.7rem}
    .team3{gap:.8rem;grid-template-columns:repeat(2,minmax(0,1fr))}
    .niche{margin-bottom:.5rem}
  }
  ```
  **Check:** `grep -c '\.team3{\|\.proj{\|--tile:84px' customers/css/team.css`
  prints `3`.

- [x] **2.7** Create `customers/css/screens.css` by moving, verbatim, the
  screenshot frame section out of the `<style>` element of
  `customers/index.html`, that is part 8 of item 1.13.
  **Check:** `grep -c '\.shot{\|is-pending\|shot-ratio-note' customers/css/screens.css`
  prints `3`.

- [x] **2.8** Create `customers/css/slides.css` by moving, verbatim, everything
  that remains in the `<style>` element of `customers/index.html`: `h2.sm`,
  `.lead.sm`, `.farsi`, the bidi comment and `.fa`, `.stack.narrow`, the motif
  slot, `.sol`, `.pnote`, the beyond badge, `.plist`, `.twoarch`, `.scope`, and
  the two media blocks reduced to the rules those components own:
  ```css
  /* ---------- narrow and tall frames ---------- */
  @media (max-aspect-ratio:1/1){
    .sol{grid-template-columns:1fr;gap:clamp(1.2rem,3vh,2.2rem)}
    .sol .shot{order:-1}
    .motif{width:min(240px,42vw)}
    .motif-wide{width:min(420px,70vw)}
    .plist{grid-template-columns:repeat(2,minmax(0,1fr))}
    .scope{grid-template-columns:repeat(2,minmax(0,1fr))}
  }

  @media (max-width:760px) and (max-aspect-ratio:1/1){
    .plist{grid-template-columns:1fr;gap:.7rem}
    .scope{grid-template-columns:1fr;gap:.7rem}
  }
  ```
  **Check:** every component is present:
  ```
  for s in 'h2.sm{' '.lead.sm{' '.farsi{' '.fa{' '.stack.narrow{' '.motif{' '.motif-cap{' '.sol{' '.pnote{' '.beyond{' '.plist{' '.twoarch{' '.scope{'; do
    printf '%-16s %s\n' "$s" "$(grep -cF "$s" customers/css/slides.css)"
  done
  ```
  Every line prints at least `1`. Nothing from this file may remain in
  `customers/index.html`: `grep -c '<style' customers/index.html` prints `0`.

- [x] **2.9** In `customers/index.html`, delete the whole `<style>` element, both
  tags included, and add four link elements after the eleven engine links, in
  exactly this order:
  ```html
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/team.css">
  <link rel="stylesheet" href="css/screens.css">
  <link rel="stylesheet" href="css/slides.css">
  ```
  **Check:** `grep -c '<style' customers/index.html` prints `0` and
  `grep -c '<link rel="stylesheet"' customers/index.html` prints `15`.

- [x] **2.10** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails:** stop and report. A deck sheet linked before an engine
  sheet, or a media block split wrongly, are the likely causes.

- [x] **2.11** Commit.
  ```
  Give each deck its own stylesheet

  Neither shell carries a style element any more. Core has three sheets and
  My Customers four, each one the components its own slides use. Deck sheets
  are always linked after the engine sheets, which is what lets a deck
  redeclare a token inside a media query.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 3. Move the slide engine into engine/js

The whole of this stage is a move. Every function body comes from the baseline
unchanged except that `var` becomes `const` or `let`, and the globals the audit
found become closure variables.

- [x] **3.1** Create `engine/js/motif.js`. Copy the arch builder and the loose
  brick builder from baseline `customers/index.html` (`dfe2bd0`), which is the
  superset version: lines 780 to 789 (the comment and `idxList`), 791 to 844
  (`buildArch`), and 846 to 884 (the jitter comment, `jitter` and `buildLoose`).
  Wrap all of it in the standard engine wrapper, rename `idxList` to
  `indexList`, change every `var` inside the functions to `const`, except the
  three loop counters `i` in `buildArch` and `buildLoose` which become `let`,
  and add the builder factory. The file is:
  Every range below is a whole block, opening comment or brace to closing brace
  included, so there is no judgement about where a function starts or ends:

  | Put here | Baseline `customers/index.html` lines |
  | --- | --- |
  | the arch builder's comment, carried as is | 780 to 785 |
  | `idxList`, renamed to `indexList` | 786 to 789 |
  | `buildArch` | 791 to 844 |
  | the loose bricks comment, carried as is | 846 to 849 |
  | `jitter` | 850 to 853 |
  | `buildLoose` | 855 to 884 |

  ```js
  (function (DECK) {
    'use strict';

    /* baseline lines 780 to 785, the comment, verbatim */

    /* baseline lines 786 to 789, with idxList renamed to indexList */

    /* baseline lines 791 to 844, buildArch */

    /* baseline lines 846 to 849, the comment, verbatim */

    /* baseline lines 850 to 853, jitter */

    /* baseline lines 855 to 884, buildLoose */

    /**
     * Builds every motif in the tree, and rebuilds them on resize and on load.
     *
     * The rebuild is deliberately total: it destroys and recreates every
     * brick, which restarts the reveal transition. The second build on load is
     * part of how the deck looks, so it stays.
     */
    function buildMotifs(root) {
      const arches = Array.prototype.slice.call(root.querySelectorAll('.arch'));
      const piles = Array.prototype.slice.call(root.querySelectorAll('.loose'));
      let resizeTimer = null;

      function buildAll() {
        arches.forEach(buildArch);
        piles.forEach(buildLoose);
      }

      buildAll();
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildAll, 120);
      });
      window.addEventListener('load', buildAll);
    }

    DECK.buildMotifs = buildMotifs;
  })(window.DECK = window.DECK || {});
  ```
  Inside `buildArch`, the two calls to `idxList` become `indexList`.
  **Check:** `grep -c 'var ' engine/js/motif.js` prints `0`,
  `grep -c '__rt' engine/js/motif.js` prints `0`, and
  `grep -c 'data-lift\|data-place\|data-ghostat' engine/js/motif.js` prints `3`,
  those three lines being the carried comment that documents them.

- [x] **3.2** Create `engine/js/stagger.js` with exactly this content. The body
  is baseline `index.html` lines 791 to 796 unchanged.
  ```js
  (function (DECK) {
    'use strict';

    /* The enter order: an element keeps a --d it already declares, and takes
       its position in the slide otherwise. */
    function applyStagger(root) {
      root.querySelectorAll('.slide').forEach(function (slide) {
        slide.querySelectorAll('[data-anim]').forEach(function (el, i) {
          if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i);
        });
      });
    }

    DECK.applyStagger = applyStagger;
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c "setProperty('--d', i)" engine/js/stagger.js` prints `1`.

- [x] **3.3** Create `engine/js/presentation.js` with exactly this content. The
  body of `show` is baseline `index.html` lines 809 to 814 with `idx` renamed to
  `index`, and the setup is lines 799 to 806.
  ```js
  (function (DECK) {
    'use strict';

    /**
     * Holds which slide is showing. This closure is the deck's only mutable
     * state, and nothing outside it can reach the index.
     */
    function createPresentation(options) {
      const slides = options.slides;
      const total = slides.length;
      const tickRow = options.ticks;
      let index = 0;

      for (let t = 0; t < total; t++) tickRow.appendChild(document.createElement('b'));
      const tickEls = tickRow.children;
      options.counterAll.textContent = '/ ' + String(total).padStart(2, '0');

      function show(n) {
        index = Math.max(0, Math.min(total - 1, n));
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
        for (let i = 0; i < total; i++) tickEls[i].classList.toggle('on', i <= index);
        options.counterNow.textContent = String(index + 1).padStart(2, '0');
        if (location.hash !== '#' + (index + 1)) history.replaceState(null, '', '#' + (index + 1));
      }

      return {
        show: show,
        next: function () { show(index + 1); },
        prev: function () { show(index - 1); },
        total: total
      };
    }

    DECK.createPresentation = createPresentation;
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c 'replaceState' engine/js/presentation.js` prints `1` and
  `grep -c 'var \|window.idx' engine/js/presentation.js` prints `0`.

- [x] **3.4** Create `engine/js/input.js` with exactly this content. The three
  handler bodies are baseline `index.html` lines 818 to 849 unchanged.

  This file carries deferred items 3, 4 and 7. Do not narrow the key list, do not
  remove a `preventDefault()`, do not add a target check to the click handler,
  do not add a `hashchange` listener, and do not guard `requestFullscreen`.
  ```js
  (function (DECK) {
    'use strict';

    /**
     * Keyboard, click, button and touch input.
     *
     * Three known issues are deliberately preserved here, deferred to a later
     * pass: Enter, Space and Backspace are claimed for the whole document, a
     * click anywhere advances the deck, and requestFullscreen is unguarded.
     */
    function bindInput(presentation, buttons) {
      document.addEventListener('keydown', function (e) {
        switch (e.key) {
          case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
            e.preventDefault(); presentation.next(); break;
          case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
            e.preventDefault(); presentation.prev(); break;
          case 'Home': e.preventDefault(); presentation.show(0); break;
          case 'End': e.preventDefault(); presentation.show(presentation.total - 1); break;
          case 'f': case 'F':
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen();
            break;
        }
      });

      /* click: right side forward, far left back */
      document.addEventListener('click', function (e) {
        if (e.clientX < window.innerWidth * 0.14) presentation.prev();
        else presentation.next();
      });

      buttons.previous.addEventListener('click', function (e) {
        e.stopPropagation();
        presentation.prev();
      });
      buttons.next.addEventListener('click', function (e) {
        e.stopPropagation();
        presentation.next();
      });

      /* touch */
      let touchX = null;
      document.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      document.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 45) { dx < 0 ? presentation.next() : presentation.prev(); }
        touchX = null;
      }, { passive: true });
    }

    DECK.bindInput = bindInput;
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c "case ' '\|case 'Enter'\|case 'Backspace'" engine/js/input.js`
  prints `2`, and
  `grep -c 'documentElement.requestFullscreen()' engine/js/input.js` prints `1`.

- [x] **3.5** Create `engine/js/start.js` with exactly this content. The hash
  read is baseline `index.html` lines 851 to 852. The order of operations in
  `start` is the order the baseline scripts run in, and must not be changed.
  ```js
  (function (DECK) {
    'use strict';

    /* The six element ids a shell must provide. */
    const IDS = {
      deck: 'deck',
      ticks: 'ticks',
      counterNow: 'cNow',
      counterAll: 'cAll',
      previous: 'prevBtn',
      next: 'nextBtn'
    };

    function slideFromHash() {
      const n = parseInt((location.hash || '').replace('#', ''), 10);
      return isNaN(n) ? 0 : n - 1;
    }

    /**
     * Starts a deck. The order below is the order the two decks ran their
     * inline scripts in, and the motif build has to come before the stagger
     * for the result to be identical.
     */
    function start(options) {
      const deck = document.getElementById(IDS.deck);
      (options.decorators || []).forEach(function (decorate) { decorate(deck); });
      DECK.buildMotifs(deck);
      DECK.applyStagger(deck);

      const presentation = DECK.createPresentation({
        slides: deck.querySelectorAll('.slide'),
        ticks: document.getElementById(IDS.ticks),
        counterNow: document.getElementById(IDS.counterNow),
        counterAll: document.getElementById(IDS.counterAll)
      });

      DECK.bindInput(presentation, {
        previous: document.getElementById(IDS.previous),
        next: document.getElementById(IDS.next)
      });

      presentation.show(slideFromHash());
      return presentation;
    }

    DECK.start = start;
    Object.freeze(DECK);
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c 'Object.freeze(DECK)' engine/js/start.js` prints `1`.

- [x] **3.6** In `index.html`, replace the whole `<script>` element, baseline
  lines 706 to 853 including both tags, with five script elements followed by one
  inline script. The elements, in exactly this order:
  ```html
  <script src="engine/js/motif.js"></script>
  <script src="engine/js/stagger.js"></script>
  <script src="engine/js/presentation.js"></script>
  <script src="engine/js/input.js"></script>
  <script src="engine/js/start.js"></script>
  <script>
  ```
  then, inside that inline script, in this order:
  1. baseline `index.html` lines 707 to 719 verbatim, the config block and its
     comment banner;
  2. this decorator and start call, which replaces baseline lines 721 to 733 and
     lines 781 to 852:
     ```js
     /* copy injection */
     function injectCopy(root){
       root.querySelectorAll('.js-dur').forEach(function(el){ el.textContent = CONFIG.TODAY_DURATION_SMALL; });
       root.querySelectorAll('.js-dur-cap').forEach(function(el){ el.textContent = CONFIG.TODAY_DURATION; });

       var rfs = root.querySelector('#rfsExpand');
       rfs.textContent = CONFIG.RFS_EXPANSION;
       if (CONFIG.RFS_CONFIRMED) {
         rfs.classList.remove('tbd');
       } else {
         var tag = document.createElement('em');
         tag.textContent = 'to confirm';
         rfs.appendChild(tag);
       }
     }

     DECK.start({ decorators: [injectCopy] });
     ```
  then `</script>`.
  This inline script is temporary: stage 4 replaces it with `core/config.js`,
  `core/copy.js` and `core/main.js`, which is why it still uses `var`.
  **Check:** `grep -c 'function buildArch\|addEventListener' index.html` prints
  `0` and `grep -c 'DECK.start' index.html` prints `1`.

- [x] **3.7** In `customers/index.html`, replace the whole `<script>` element,
  baseline lines 709 to 972 including both tags, with five script elements
  followed by one inline script. The elements, in exactly this order:
  ```html
  <script src="../engine/js/motif.js"></script>
  <script src="../engine/js/stagger.js"></script>
  <script src="../engine/js/presentation.js"></script>
  <script src="../engine/js/input.js"></script>
  <script src="../engine/js/start.js"></script>
  <script>
  ```
  then, inside that inline script, in this order:
  1. baseline `customers/index.html` lines 697 to 729 verbatim, the config block
     and its comment banner;
  2. baseline lines 731 to 746 verbatim, `pendingShot`;
  3. this pair of decorators, which replaces baseline lines 748 to 778 by
     wrapping each loop in a function that takes the root, and the start call,
     which replaces baseline lines 886 to 958:
     ```js
     function fillShots(root){
       root.querySelectorAll('[data-shot]').forEach(function(box){
         /* baseline customers/index.html lines 749 to 760, verbatim */
       });
     }

     function fillPhotos(root){
       root.querySelectorAll('[data-photo]').forEach(function(niche){
         /* baseline customers/index.html lines 764 to 777, verbatim */
       });
     }

     DECK.start({ decorators: [fillShots, fillPhotos] });
     ```
  then `</script>`.
  This inline script is temporary: stage 5 replaces it with
  `customers/config.js`, `customers/screens.js` and `customers/main.js`.
  **Check:** `grep -c 'function buildArch\|function buildLoose\|function jitter' customers/index.html`
  prints `0` and `grep -c 'DECK.start' customers/index.html` prints `1`.

- [x] **3.8** Append the three script rules to `RULES` in `tools/lint.mjs`,
  replacing the line `// Later stages append their rules here.` with:
  ```js
    ,
    {
      name: 'no var',
      applies: isDeckScript,
      check: text => /\bvar\s/.test(text) ? 'declares a var' : null
    },
    {
      name: 'nothing at column zero',
      applies: file => file.startsWith('engine/js/'),
      check: text => /^(var|let|const|function)\s/m.test(text)
        ? 'declares something outside the wrapper'
        : null
    },
    {
      name: 'at most one top level const',
      applies: file => isDeckScript(file) && !file.startsWith('engine/js/'),
      check: text => {
        const tops = text.match(/^(var|let|const|function)\s/gm) || [];
        if (tops.length > 1) return `${tops.length} top level declarations, limit 1`;
        if (tops.some(top => !top.startsWith('const'))) return 'a top level declaration is not a const';
        return null;
      }
    }
    // Later stages append their rules here.
  ```
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds`.
  **If it reports `no var` against a deck script:** the two temporary inline
  scripts live in `.html` files, which these rules do not reach, so a violation
  means a `var` survived in `engine/js/`. Fix it there, not by weakening a rule.

- [x] **3.9** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails on `motifs`:** the arch builder was not copied from the
  Customers superset, or a `var` to `const` change altered a value. Report the
  first differing brick from the output.

- [x] **3.10** Commit.
  ```
  Move the slide engine into engine/js

  Five files, one job each: the motif builder, the stagger, the presentation
  state, the input bindings, and the one place that knows the order to wire
  them in.

  The arch builder is the My Customers version, which is a strict superset of
  Core's: with no data-lift, data-place or data-ghostat present its three
  extra branches cannot fire, so Core's output is unchanged.

  window.__rt and the nine top level vars per deck are gone. The slide index
  now lives in a closure that nothing outside it can reach. DECK holds only
  functions and start.js freezes it.

  What is deliberately unchanged: the motif is still rebuilt from scratch on
  every resize and twice on load, because the rebuild restarts the brick
  reveal and is part of how the deck looks. Enter, Space and Backspace are
  still claimed globally, a click anywhere still advances, and
  requestFullscreen is still unguarded. Those are a separate pass.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 4. Declare Core's slides as content

- [x] **4.1** Create `engine/js/render.js` with exactly this content:
  ```js
  (function (DECK) {
    'use strict';

    /**
     * Turns a deck's slides into sections in the mount, in array order.
     *
     * A slide is {id, name, html}: id is its stable handle, name is its line
     * from the deck's narrative arc, html is the markup that sits inside the
     * section. Whitespace at the edges of html becomes a text node, which the
     * slide's grid does not render.
     */
    function renderSlides(mount, slides) {
      mount.textContent = '';
      slides.forEach(function (slide) {
        const section = document.createElement('section');
        section.className = 'slide';
        section.innerHTML = slide.html;
        mount.appendChild(section);
      });
    }

    DECK.renderSlides = renderSlides;
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c 'DECK.renderSlides = renderSlides' engine/js/render.js`
  prints `1`.

- [x] **4.2** In `engine/js/start.js`, render the slides before anything measures
  them. Replace the line
  ```js
      const deck = document.getElementById(IDS.deck);
  ```
  with
  ```js
      const deck = document.getElementById(IDS.deck);
      if (options.slides) DECK.renderSlides(deck, options.slides);
  ```
  The condition is temporary: stage 5 removes it once both decks pass slides.
  **Check:** `grep -c 'if (options.slides)' engine/js/start.js` prints `1`.

- [x] **4.3** Create `core/config.js` with exactly this content. The four values
  and their comments are baseline `index.html` lines 711 to 717.
  ```js
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
  ```
  **Check:** `grep -c 'RFS_CONFIRMED: false' core/config.js` prints `1`.

- [x] **4.4** Create `core/copy.js` with exactly this content. The body is
  baseline `index.html` lines 722 to 733, with `CONFIG` renamed to
  `CORE_CONFIG`, `document` scoped to `root`, and `var` changed to `const`.
  ```js
  /**
   * Core: puts the config's copy into the slides that carry a placeholder.
   */
  const CORE_COPY = (function () {
    'use strict';

    return function (root) {
      root.querySelectorAll('.js-dur').forEach(function (el) {
        el.textContent = CORE_CONFIG.TODAY_DURATION_SMALL;
      });
      root.querySelectorAll('.js-dur-cap').forEach(function (el) {
        el.textContent = CORE_CONFIG.TODAY_DURATION;
      });

      const rfs = root.querySelector('#rfsExpand');
      rfs.textContent = CORE_CONFIG.RFS_EXPANSION;
      if (CORE_CONFIG.RFS_CONFIRMED) {
        rfs.classList.remove('tbd');
      } else {
        const tag = document.createElement('em');
        tag.textContent = 'to confirm';
        rfs.appendChild(tag);
      }
    };
  })();
  ```
  **Check:** `grep -c "textContent = 'to confirm'" core/copy.js` prints `1`.

- [x] **4.5** Create `core/content/team.js`. For now it holds the team slide's
  markup verbatim; stage 8 turns it into data.
  ```js
  /**
   * Core, slide 02: the team, in two tiers.
   */
  const CORE_TEAM_HTML = `
  <baseline index.html lines 386 to 451, verbatim>
  `;
  ```
  **Check:** `grep -c 'wider-label' core/content/team.js` prints `1` and
  `node tools/lint.mjs` passes.

- [x] **4.6** Create `core/content/slides-opening.js`:
  ```js
  /**
   * Core, slides 01 and 02.
   */
  const CORE_SLIDES_OPENING = [
    {
      id: 'title',
      name: 'Title',
      html: `
  <baseline index.html lines 375 to 381, verbatim>
  `
    },
    {
      id: 'team',
      name: 'The team, in two tiers',
      html: CORE_TEAM_HTML
    }
  ];
  ```
  **Check:** `grep -c "id: 'title'\|id: 'team'" core/content/slides-opening.js`
  prints `2`.

- [x] **4.7** Create `core/content/slides-problem.js` holding
  `const CORE_SLIDES_PROBLEM`, an array of three slides in this order, each
  built like the entries in item 4.6 with its `html` taken verbatim from the
  baseline:

  | id | name | html from `index.html` |
  | --- | --- | --- |
  | `from-zero` | Today, every new insurance line starts from zero | lines 456 to 467 |
  | `same-shape` | The same shape, built again every time | lines 472 to 482 |
  | `real-cost` | Engineering capacity decides the roadmap | lines 487 to 491 |

  **Check:** `grep -c 'id: ' core/content/slides-problem.js` prints `3`.

- [x] **4.8** Create `core/content/slides-platform.js` holding
  `const CORE_SLIDES_PLATFORM`, an array of seven slides in this order:

  | id | name | html from `index.html` |
  | --- | --- | --- |
  | `what-core-is` | What core is: the part we stop rebuilding | lines 496 to 510 |
  | `promise` | The promise | lines 515 to 523 |
  | `one-week` | Months to one week | lines 528 to 536 |
  | `pricing` | One place sets the price | lines 541 to 552 |
  | `bff` | BFF, Backend For Frontend | lines 557 to 572 |
  | `go-rules` | go rules | lines 577 to 589 |
  | `before-after` | What that looks like in practice | lines 594 to 602 |

  **Check:** `grep -c 'id: ' core/content/slides-platform.js` prints `7` and the
  file is at most 200 lines.

- [x] **4.9** Create `core/content/slides-vocabulary.js` holding
  `const CORE_SLIDES_VOCABULARY`, an array of five slides in this order:

  | id | name | html from `index.html` |
  | --- | --- | --- |
  | `vocabulary` | Vocabulary | lines 607 to 611 |
  | `rfq` | RFQ | lines 616 to 627 |
  | `quote-list` | Quote list | lines 632 to 643 |
  | `rfs` | RFS | lines 648 to 659 |
  | `journey` | The journey | lines 664 to 673 |

  **Check:** `grep -c 'id: ' core/content/slides-vocabulary.js` prints `5`.

- [x] **4.10** Create `core/content/slides-closing.js` holding
  `const CORE_SLIDES_CLOSING`, an array of two slides in this order:

  | id | name | html from `index.html` |
  | --- | --- | --- |
  | `hold-questions` | Hold questions until the end | lines 678 to 683 |
  | `handoff` | Handoff to the demo | lines 688 to 692 |

  **Check:** `grep -c 'id: ' core/content/slides-closing.js` prints `2`.

- [x] **4.11** Create `core/main.js` with exactly this content:
  ```js
  /**
   * Core. The shell has loaded the engine, the config and every act. This is
   * the only place that fixes the slide order.
   */
  DECK.start({
    slides: CORE_SLIDES_OPENING
      .concat(CORE_SLIDES_PROBLEM)
      .concat(CORE_SLIDES_PLATFORM)
      .concat(CORE_SLIDES_VOCABULARY)
      .concat(CORE_SLIDES_CLOSING),
    decorators: [CORE_COPY]
  });
  ```
  **Check:** `grep -c 'CORE_SLIDES' core/main.js` prints `5`.

- [x] **4.12** Replace `index.html` entirely with the shell below. Items in
  angle brackets are verbatim copies from the baseline.
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Core | Shoraka</title>
  <baseline index.html lines 7 to 17, verbatim>
  <link rel="stylesheet" href="engine/css/tokens.css">
  <link rel="stylesheet" href="engine/css/base.css">
  <link rel="stylesheet" href="engine/css/shell.css">
  <link rel="stylesheet" href="engine/css/type.css">
  <link rel="stylesheet" href="engine/css/motif.css">
  <link rel="stylesheet" href="engine/css/member.css">
  <link rel="stylesheet" href="engine/css/layout.css">
  <link rel="stylesheet" href="engine/css/title.css">
  <link rel="stylesheet" href="engine/css/hud.css">
  <link rel="stylesheet" href="engine/css/motion.css">
  <link rel="stylesheet" href="core/css/tokens.css">
  <link rel="stylesheet" href="core/css/team.css">
  <link rel="stylesheet" href="core/css/slides.css">
  </head>
  <body>

  <div class="deck" id="deck"></div>

  <baseline index.html lines 697 to 704, verbatim>

  <script src="engine/js/motif.js"></script>
  <script src="engine/js/stagger.js"></script>
  <script src="engine/js/render.js"></script>
  <script src="engine/js/presentation.js"></script>
  <script src="engine/js/input.js"></script>
  <script src="engine/js/start.js"></script>
  <script src="core/config.js"></script>
  <script src="core/copy.js"></script>
  <script src="core/content/team.js"></script>
  <script src="core/content/slides-opening.js"></script>
  <script src="core/content/slides-problem.js"></script>
  <script src="core/content/slides-platform.js"></script>
  <script src="core/content/slides-vocabulary.js"></script>
  <script src="core/content/slides-closing.js"></script>
  <script src="core/main.js"></script>
  </body>
  </html>
  ```
  **Check:** `grep -c '<section\|<style\|style=' index.html` prints `0`,
  `grep -c 'id="deck"\|id="ticks"\|id="cNow"\|id="cAll"\|id="prevBtn"\|id="nextBtn"' index.html`
  prints `5`, because `cNow` and `cAll` share the counter line, and
  `wc -l < index.html` prints a number at most 70. It should be about 61: the
  links and the script tags are most of it.

- [x] **4.13** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails on `text` for one Core slide:** that slide's html was copied
  from the wrong line range. Report which slide and which range you used.

- [x] **4.14** Commit.
  ```
  Declare Core's slides as content

  Nineteen slides, five act files, one object each: a stable id, the line
  from the deck's narrative arc, and the markup that sits inside the section.
  main.js is the only place that fixes the order.

  index.html is now a shell: meta, links, six element ids, script tags.
  Nothing else.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 5. Declare My Customers' slides as content

- [x] **5.1** Create `customers/config.js` with exactly this content. The body is
  baseline `customers/index.html` (`dfe2bd0`) lines 697 to 728, with the banner
  comment kept and the object frozen.
  ```js
  /**
   * My Customers: everything that needs filling before presenting.
   * PRESENTING.md lists what is still open and points back here.
   *
   * SCREENSHOTS maps a slide key to an image under assets/screens/.
   * Leave a value as null, or point it at a file that is not there,
   * and the slide renders a dotted frame tagged SCREENSHOT PENDING so
   * the deck cannot be presented half dressed by accident.
   *
   * Captures are laid out for 1280 x 832. If the real ones come back
   * at another size, change --shot-ratio once in css/tokens.css.
   */
  const CUSTOMERS_CONFIG = Object.freeze({
    SCREENSHOTS: Object.freeze({
      p2_f2: 'assets/screens/p2_f2.png',   // slide 06  the customer list, opening into a profile
      p3_f5: 'assets/screens/p3_f5.png',   // slide 07  the policies list, with status and file
      p4_f4: 'assets/screens/p4_f4.png',   // slide 08  a vehicle's documents and related policies
      p5_f6: 'assets/screens/p5_f6.png',   // slide 09  the financial status view
      f7:    'assets/screens/f7.png',      // slide 10  Notes in the profile
      f8:    'assets/screens/f8.png'       // slide 11  adding a prospective customer by hand
    }),

    // Team photos for slide 02, all five reused from the root deck's
    // assets. Set one to null and that niche renders a PHOTO PENDING tag.
    PHOTOS: Object.freeze({
      ali:      '../assets/team/ali-marateb.jpg',
      ghazaleh: '../assets/team/ghazale-ebrahimi.jpg',
      mehdi:    '../assets/team/mehdi-mohammad-rezaei.jpg',
      masih:    '../assets/team/masih-sadri.jpg',
      sana:     '../assets/team/sana-mohammadzadeh.jpg'
    })
  });
  ```
  Every value here is a real file, not a placeholder: this config has no `null`
  to find.
  **Check:** `grep -c 'null' customers/config.js` prints `0`, and every file it
  names resolves: `node -e "const c=require('fs').readFileSync('customers/config.js','utf8'); const base=require('path').resolve('customers'); let ok=true; for (const m of c.matchAll(/'((?:\.\.\/)?assets\/[^']+)'/g)) { const p=require('path').resolve(base, m[1]); if (!require('fs').existsSync(p)) { console.error('missing', p); ok=false; } } console.log(ok ? 'all present' : 'missing files')"`
  prints `all present`.

- [x] **5.2** Create `customers/screens.js`. The two function bodies are baseline
  `customers/index.html` lines 731 to 746 (`pendingShot`, comment included) and
  749 to 760 (the loop body), with `CONFIG` renamed to `CUSTOMERS_CONFIG`,
  `document` scoped to `root`, and `var` changed to `const`.
  ```js
  /**
   * My Customers: fills every panel screenshot frame, or marks it pending.
   * The pending marker speaks in the same voice as Core's TO CONFIRM.
   */
  const CUSTOMERS_SCREENS = (function () {
    'use strict';

    /* baseline customers/index.html lines 731 to 746, pendingShot, with var
       changed to const */

    return function (root) {
      root.querySelectorAll('[data-shot]').forEach(function (box) {
        /* baseline customers/index.html lines 749 to 760, the loop body, with
           CONFIG renamed to CUSTOMERS_CONFIG and var changed to const */
      });
    };
  })();
  ```
  The string `'1280 × 832'` inside `pendingShot` is rendered slide text. Copy it
  byte for byte; the character between the numbers is a multiplication sign, not
  an em dash and not the letter x.
  **Check:** `grep -c '1280 × 832' customers/screens.js` prints `1` and
  `grep -c 'shot-ratio-note' customers/screens.js` prints `1`.

- [x] **5.3** Create `customers/photos.js`. This is temporary: stage 8 deletes it
  and moves the behaviour into the engine's niche primitive. The body is baseline
  `customers/index.html` lines 764 to 777.
  ```js
  /**
   * My Customers: fills the five niches on the team slide.
   */
  const CUSTOMERS_PHOTOS = (function () {
    'use strict';

    return function (root) {
      root.querySelectorAll('[data-photo]').forEach(function (niche) {
        /* baseline customers/index.html lines 764 to 777, the loop body, with
           CONFIG renamed to CUSTOMERS_CONFIG and var changed to const */
      });
    };
  })();
  ```
  **Check:** `grep -c 'photo<br>pending' customers/photos.js` prints `1`.

- [x] **5.4** Create `customers/content/team.js`. For now it holds the team
  slide's markup verbatim; stage 8 turns it into data.
  ```js
  /**
   * My Customers, slide 02: the team and the project.
   */
  const CUSTOMERS_TEAM_HTML = `
  <baseline customers/index.html lines 435 to 464, verbatim>
  `;
  ```
  **Check:** `grep -c 'class="proj"' customers/content/team.js` prints `1` and
  `grep -c 'class="member"' customers/content/team.js` prints `5`.

- [x] **5.5** Create `customers/content/slides-opening.js` holding
  `const CUSTOMERS_SLIDES_OPENING`, an array of four slides in this order. The
  second slide's `html` is `CUSTOMERS_TEAM_HTML`, not a line range.

  | id | name | html from `customers/index.html` |
  | --- | --- | --- |
  | `title` | Title | lines 425 to 430 |
  | `team` | The team and the project | `CUSTOMERS_TEAM_HTML` |
  | `purpose` | Review the design before we build it | lines 469 to 477 |
  | `problems` | Six problems, one missing piece | lines 482 to 498 |

  **Check:** `grep -c 'id: ' customers/content/slides-opening.js` prints `4`.

- [x] **5.6** Create `customers/content/slides-phase-one.js` holding
  `const CUSTOMERS_SLIDES_PHASE_ONE`, an array of five slides in this order.
  Slide 06 absorbed the old separate "find a customer" and "see their profile"
  slides when the deck was revised during this refactor's own stage 0 (commit
  `e8e3dd4`): it is one slide here because it is one slide in the deck.

  | id | name | html from `customers/index.html` |
  | --- | --- | --- |
  | `p1-f1` | Every order belongs to a customer | lines 503 to 522 |
  | `p2-f2-f3` | Find anyone, and see everything about them | lines 527 to 549 |
  | `p3-f5` | Every policy of each customer in one place | lines 554 to 567 |
  | `p4-f4` | Document management of each customer | lines 572 to 585 |
  | `p5-f6` | The money, at a glance | lines 590 to 603 |

  **Check:** `grep -c 'id: ' customers/content/slides-phase-one.js` prints `5`
  and the file is at most 200 lines.

- [x] **5.7** Create `customers/content/slides-beyond.js` holding
  `const CUSTOMERS_SLIDES_BEYOND`, an array of two slides in this order:

  | id | name | html from `customers/index.html` |
  | --- | --- | --- |
  | `p6-f7` | The paper diary moves in, beyond phase 1 | lines 608 to 622 |
  | `f8` | Add a customer before the first order, beyond phase 1 | lines 627 to 641 |

  **Check:** `grep -c 'id: ' customers/content/slides-beyond.js` prints `2`.

- [x] **5.8** Create `customers/content/slides-closing.js` holding
  `const CUSTOMERS_SLIDES_CLOSING`, an array of three slides in this order:

  | id | name | html from `customers/index.html` |
  | --- | --- | --- |
  | `scope` | Six capabilities, one section | lines 646 to 663 |
  | `discussion` | Does this fit the way you work? | lines 668 to 673 |
  | `closing` | One record each | lines 678 to 682 |

  **Check:** `grep -c 'id: ' customers/content/slides-closing.js` prints `3`.

- [x] **5.9** Create `customers/main.js` with exactly this content:
  ```js
  /**
   * My Customers. The shell has loaded the engine, the config and every act.
   * This is the only place that fixes the slide order.
   */
  DECK.start({
    slides: CUSTOMERS_SLIDES_OPENING
      .concat(CUSTOMERS_SLIDES_PHASE_ONE)
      .concat(CUSTOMERS_SLIDES_BEYOND)
      .concat(CUSTOMERS_SLIDES_CLOSING),
    decorators: [CUSTOMERS_SCREENS, CUSTOMERS_PHOTOS]
  });
  ```
  The decorator order matters: it is the order the baseline ran them in.
  **Check:** `grep -c 'CUSTOMERS_SLIDES' customers/main.js` prints `4`.

- [x] **5.10** Replace `customers/index.html` entirely with the shell below.
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Customers | BimeBazar partner panel</title>
  <baseline customers/index.html lines 7 to 17, verbatim>
  <link rel="stylesheet" href="../engine/css/tokens.css">
  <link rel="stylesheet" href="../engine/css/base.css">
  <link rel="stylesheet" href="../engine/css/shell.css">
  <link rel="stylesheet" href="../engine/css/type.css">
  <link rel="stylesheet" href="../engine/css/motif.css">
  <link rel="stylesheet" href="../engine/css/member.css">
  <link rel="stylesheet" href="../engine/css/layout.css">
  <link rel="stylesheet" href="../engine/css/title.css">
  <link rel="stylesheet" href="../engine/css/hud.css">
  <link rel="stylesheet" href="../engine/css/compact.css">
  <link rel="stylesheet" href="../engine/css/motion.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/team.css">
  <link rel="stylesheet" href="css/screens.css">
  <link rel="stylesheet" href="css/slides.css">
  </head>
  <body>

  <div class="deck" id="deck"></div>

  <baseline customers/index.html lines 687 to 694, verbatim>

  <script src="../engine/js/motif.js"></script>
  <script src="../engine/js/stagger.js"></script>
  <script src="../engine/js/render.js"></script>
  <script src="../engine/js/presentation.js"></script>
  <script src="../engine/js/input.js"></script>
  <script src="../engine/js/start.js"></script>
  <script src="config.js"></script>
  <script src="screens.js"></script>
  <script src="photos.js"></script>
  <script src="content/team.js"></script>
  <script src="content/slides-opening.js"></script>
  <script src="content/slides-phase-one.js"></script>
  <script src="content/slides-beyond.js"></script>
  <script src="content/slides-closing.js"></script>
  <script src="main.js"></script>
  </body>
  </html>
  ```
  **Check:** `grep -c '<section\|<style\|style=' customers/index.html` prints `0`,
  `grep -c 'id="deck"\|id="ticks"\|id="cNow"\|id="cAll"\|id="prevBtn"\|id="nextBtn"' customers/index.html`
  prints `5`, and `wc -l < customers/index.html` prints a number at most 70.

- [x] **5.11** In `engine/js/start.js`, make rendering unconditional now that
  both decks pass slides. Replace
  ```js
      if (options.slides) DECK.renderSlides(deck, options.slides);
  ```
  with
  ```js
      DECK.renderSlides(deck, options.slides);
  ```
  **Check:** `grep -c 'if (options.slides)' engine/js/start.js` prints `0`.

- [x] **5.12** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.

- [x] **5.13** Commit.
  ```
  Declare My Customers' slides as content

  Fourteen slides, four act files, the same shape Core uses. Both shells are
  now thin: no style element, no slide markup, no statement.

  Both decks run the same engine from the same files. A third deck needs a
  shell, a tokens sheet, its content and a main.js, and nothing under
  engine/.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 6. Declare the enter order as data, not inline style

Of the 99 inline style attributes the audit found, 88 carry the stagger index
`--d`. The index is the slide's beat order, which is content, so it becomes a
`data-d` attribute the engine reads.

This stage must be atomic. Once the stagger reads `data-d`, an element still
carrying `--d` inline would have it overwritten by its document position. Do not
commit partway through.

- [x] **6.1** In `engine/js/stagger.js`, replace the comment and the function
  body with:
  ```js
    /* The enter order: an element takes the beat its slide declares in data-d,
       and its position in the slide otherwise. */
    function applyStagger(root) {
      root.querySelectorAll('.slide').forEach(function (slide) {
        slide.querySelectorAll('[data-anim]').forEach(function (el, i) {
          const declared = el.dataset.d;
          el.style.setProperty('--d', declared === undefined ? i : declared);
        });
      });
    }
  ```
  **Check:** `grep -c 'el.dataset.d' engine/js/stagger.js` prints `1`.

- [x] **6.2** In every file under `core/content/` and `customers/content/`,
  replace each inline style that carries only a stagger index. For each
  occurrence of `style="--d:N"`, where N is a single digit, write `data-d="N"` in
  its place, keeping it in the same position in the tag.
  Example, `core/content/slides-problem.js`:
  `<div data-anim style="--d:2">` becomes `<div data-anim data-d="2">`.
  **Check:** `grep -o 'style="--d:[0-9]"' core/content/*.js customers/content/*.js | wc -l`
  prints `0`.

- [x] **6.3** In the same files, split each inline style that carries a stagger
  index plus a declaration. There are exactly fourteen, listed here in full. The
  left column is what to find, the right column what to write in its place.

  | Find | Replace with |
  | --- | --- |
  | `style="--d:2;width:100%"` (3 occurrences: Core slides 07 and 17, Customers slide 03) | `data-d="2" style="width:100%"` |
  | `style="--d:3;max-width:44ch"` (Core slide 04) | `data-d="3" style="max-width:44ch"` |
  | `style="--d:2;max-width:38ch"` (Core slide 05) | `data-d="2" style="max-width:38ch"` |
  | `style="--d:2;max-width:40ch"` (Core slide 08) | `data-d="2" style="max-width:40ch"` |
  | `style="--d:3;max-width:42ch"` (Core slide 17) | `data-d="3" style="max-width:42ch"` |
  | `style="--d:1;font-size:clamp(2.6rem,7.4vw,8.4rem)"` (Core slide 15) | `data-d="1" style="font-size:clamp(2.6rem,7.4vw,8.4rem)"` |
  | `style="--d:1;font-size:clamp(2.8rem,8.4vw,9rem)"` (Core slide 19) | `data-d="1" style="font-size:clamp(2.8rem,8.4vw,9rem)"` |
  | `style="--d:2;width:min(620px,60vw);margin-top:.5rem"` (Customers slide 04) | `data-d="2" style="width:min(620px,60vw);margin-top:.5rem"` |
  | `style="--d:4;width:min(400px,36vw)"` (2 occurrences: Customers slides 05 and 06) | `data-d="4" style="width:min(400px,36vw)"` |
  | `style="--d:2;width:min(300px,26vw)"` (Customers slide 12) | `data-d="2" style="width:min(300px,26vw)"` |
  | `style="--d:1;font-size:clamp(2.6rem,7.6vw,8.2rem)"` (Customers slide 14) | `data-d="1" style="font-size:clamp(2.6rem,7.6vw,8.2rem)"` |

  **Check:** `grep -c -- '--d:' core/content/*.js customers/content/*.js` prints
  `0` for every file, and
  `grep -o 'data-d="' core/content/*.js customers/content/*.js | wc -l` prints
  `88`.
  **If the count is not 88:** stop and report the count and the files. A missed
  attribute shifts every later beat on that slide.

- [x] **6.4** Append the stagger rule to `RULES` in `tools/lint.mjs`, replacing
  the line `// Later stages append their rules here.` with:
  ```js
    ,
    {
      name: 'no inline stagger index',
      applies: isContentFile,
      check: text => text.includes('--d:') ? 'declares --d inline' : null
    }
    // Later stages append their rules here.
  ```
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds`.

- [x] **6.5** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails on `anims`:** report the first differing entry. A `d` of a
  document position where the baseline had a declared number means a `data-d`
  was dropped on that slide.

- [x] **6.6** Commit.
  ```
  Declare the enter order as data, not inline style

  Eighty eight of the 99 inline style attributes carried nothing but the
  stagger index. The index is the slide's beat order, so it is now a data-d
  attribute the engine reads, next to the data-anim it already reads.

  lint now fails on any --d written inline in a content file.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 7. Name every one off style the slides were carrying inline

Twenty inline declarations remain in the content files, plus the five photo
framings that stage 8 handles. Each one becomes a named rule in the stylesheet
that owns it. Specificity is given with each rule and has been checked against
the rule it must beat: write them exactly as written.

- [x] **7.1** In `engine/css/layout.css`, give `.arcrow` the width all three of
  its uses set inline. Change the first declaration of the `.arcrow` rule from
  ```css
  .arcrow{
    position:relative;display:grid;grid-template-columns:repeat(3,1fr);
  ```
  to
  ```css
  .arcrow{
    position:relative;display:grid;grid-template-columns:repeat(3,1fr);width:100%;
  ```
  **Check:** `grep -c 'width:100%' engine/css/layout.css` prints `1`.

- [x] **7.2** In `engine/css/title.css`, append this rule. It replaces the
  `max-width:40ch` that slide 01 of both decks sets inline on its lead, and wins
  over `.lead{max-width:34ch}` on specificity.
  ```css
  /* the subtitle under a title arch sets its own measure */
  .title-grid .lead{max-width:40ch}
  ```
  **Check:** `grep -c '.title-grid .lead' engine/css/title.css` prints `1`.

- [x] **7.3** Append this block to `core/css/slides.css`:
  ```css
  /* ---------- one off measures and sizes, each named for its slide ---------- */
  .support.note{margin-top:1.4rem;text-align:center}
  .support.note.wide{max-width:none}
  .stack.center .lead.repeat-sum{max-width:44ch}
  .lead.cost-sum{max-width:38ch}
  .stack.center .lead.punch-sum{max-width:40ch}
  .stack.center .lead.journey-sum{max-width:42ch}
  h2.bff-title{font-size:clamp(2rem,4.4vw,4.6rem)}
  h1.handoff{font-size:clamp(2.8rem,8.4vw,9rem)}
  .acr.phrase{font-size:clamp(2.6rem,7.4vw,8.4rem)}
  ```
  Three of them carry `.stack.center` because the rule they must beat,
  `.stack.center .lead{max-width:38ch}` in `engine/css/type.css`, is three
  classes deep. Do not shorten them.
  **Check:** `grep -c 'repeat-sum\|cost-sum\|punch-sum\|journey-sum\|bff-title\|handoff\|acr.phrase\|support.note' core/css/slides.css`
  prints `9`.

- [x] **7.4** In the Core content files, remove the twelve inline styles those
  rules replace:

  | File and slide | Find | Replace with |
  | --- | --- | --- |
  | `slides-opening.js`, title | `<p class="lead" data-anim style="max-width:40ch">` | `<p class="lead" data-anim>` |
  | `slides-problem.js`, from-zero | `<p class="support" style="margin-top:1.4rem;text-align:center">` | `<p class="support note">` |
  | `slides-problem.js`, same-shape | `<p class="lead" data-anim data-d="3" style="max-width:44ch">` | `<p class="lead repeat-sum" data-anim data-d="3">` |
  | `slides-problem.js`, real-cost | `<p class="lead" data-anim data-d="2" style="max-width:38ch">` | `<p class="lead cost-sum" data-anim data-d="2">` |
  | `slides-platform.js`, promise | `<div class="arcrow" data-anim data-d="2" style="width:100%">` | `<div class="arcrow" data-anim data-d="2">` |
  | `slides-platform.js`, one-week | `<p class="lead" data-anim data-d="2" style="max-width:40ch">` | `<p class="lead punch-sum" data-anim data-d="2">` |
  | `slides-platform.js`, bff | `<h2 data-anim style="font-size:clamp(2rem,4.4vw,4.6rem)">` | `<h2 class="bff-title" data-anim>` |
  | `slides-platform.js`, go-rules | `<p class="support" style="margin-top:1.4rem;text-align:center;max-width:none">` | `<p class="support note wide">` |
  | `slides-vocabulary.js`, quote-list | `<div class="acr" data-anim data-d="1" style="font-size:clamp(2.6rem,7.4vw,8.4rem)">` | `<div class="acr phrase" data-anim data-d="1">` |
  | `slides-vocabulary.js`, journey | `<div class="arcrow" data-anim data-d="2" style="width:100%">` | `<div class="arcrow" data-anim data-d="2">` |
  | `slides-vocabulary.js`, journey | `<p class="lead" data-anim data-d="3" style="max-width:42ch">` | `<p class="lead journey-sum" data-anim data-d="3">` |
  | `slides-closing.js`, handoff | `<h1 data-anim data-d="1" style="font-size:clamp(2.8rem,8.4vw,9rem)">` | `<h1 class="handoff" data-anim data-d="1">` |

  **Check:** `grep -c 'style=' core/content/slides-*.js` prints `0` for all five
  files.

- [x] **7.5** Append this block to `customers/css/slides.css`:
  ```css
  /* ---------- the motif slot, sized for what it carries ---------- */
  .motif-pile{width:min(620px,60vw);margin-top:.5rem}
  .motif-pair{width:min(400px,36vw)}
  .motif-span{width:min(300px,26vw)}
  h2.scope-title{font-size:clamp(2rem,4.2vw,4.4rem)}
  ```
  **Check:** `grep -c 'motif-pile\|motif-pair\|motif-span\|scope-title' customers/css/slides.css`
  prints `4`.

- [x] **7.6** In `customers/css/slides.css`, delete both `.motif-wide` rules: the
  base `.motif-wide{width:min(560px,46vw)}` and the
  `.motif-wide{width:min(420px,70vw)}` inside the narrow aspect media block. All
  four uses set `width` inline and an inline declaration beats a media query, so
  neither rule was ever the winning declaration, and item 7.7 removes the class
  from the markup.
  **Check:** `grep -c 'motif-wide' customers/css/slides.css` prints `0`.

- [x] **7.7** In the Customers content files, remove the eight inline styles
  those rules replace:

  | File and slide | Find | Replace with |
  | --- | --- | --- |
  | `slides-opening.js`, title | `<p class="lead" data-anim style="max-width:40ch">` | `<p class="lead" data-anim>` |
  | `slides-opening.js`, purpose | `<div class="arcrow" data-anim data-d="2" style="width:100%">` | `<div class="arcrow" data-anim data-d="2">` |
  | `slides-opening.js`, problems | `<div class="motif-wide" data-anim data-d="2" style="width:min(620px,60vw);margin-top:.5rem">` | `<div class="motif-pile" data-anim data-d="2">` |
  | `slides-phase-one.js`, p1-f1 | `<div class="motif-wide" data-anim data-d="4" style="width:min(400px,36vw)">` | `<div class="motif-pair" data-anim data-d="4">` |
  | `slides-phase-one.js`, p2-f2-f3 | `<div class="motif-wide" data-anim data-d="4" style="width:min(400px,36vw)">` | `<div class="motif-pair" data-anim data-d="4">` |
  | `slides-closing.js`, scope | `<h2 class="tight" data-anim style="font-size:clamp(2rem,4.2vw,4.4rem)">` | `<h2 class="tight scope-title" data-anim>` |
  | `slides-closing.js`, scope | `<div class="motif-wide" data-anim data-d="2" style="width:min(300px,26vw)">` | `<div class="motif-span" data-anim data-d="2">` |
  | `slides-closing.js`, closing | `<h1 data-anim data-d="1" style="font-size:clamp(2.6rem,7.6vw,8.2rem)">` | `<h1 data-anim data-d="1">` |

  **Check:** `grep -c 'style=\|motif-wide' customers/content/slides-*.js` prints
  `0` for all four files.

- [x] **7.8** The last row of item 7.7 removed the only size the deck's single
  `h1` had. In `customers/css/tokens.css`, change
  ```css
    --h1: clamp(3.2rem,10vw,11.5rem);
  ```
  to
  ```css
    /* the deck has one h1, on the closing slide */
    --h1: clamp(2.6rem,7.6vw,8.2rem);
  ```
  The old value was never the winning declaration, because the only `h1` in the
  deck overrode it inline, so the computed size does not change.
  **Check:** `grep -c 'clamp(2.6rem,7.6vw,8.2rem)' customers/css/tokens.css`
  prints `1` and `grep -c 'clamp(3.2rem,10vw,11.5rem)' customers/css/tokens.css`
  prints `0`.

- [x] **7.9** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`. Also
  `grep -l 'style=' core/content/*.js customers/content/*.js` prints exactly one
  path, `core/content/team.js`, whose five photo framings stage 8 removes.
  **If parity fails on `anims.maxWidth`, `.fontSize`, `.width`, `.marginTop` or
  `.textAlign`:** a new rule lost a specificity contest. Report the slide, the
  property, and both values. Do not add `!important`.

- [x] **7.10** Commit.
  ```
  Name every one off style the slides were carrying inline

  Twenty inline declarations became named rules in the stylesheet that owns
  the component. Each is named for the slide it belongs to, and three carry
  the .stack.center prefix because that is what they have to outrank.

  Three rules that were never the winning declaration are gone: both
  .motif-wide widths, which every use overrode inline, and the h1 size in My
  Customers, whose only h1 did the same. The remaining h1 size moved into
  that deck's token.

  .arcrow carries width:100% in the engine now, which all three of its uses
  set by hand.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 8. Build both team slides from one niche primitive

Core repeats fourteen near identical portrait blocks in markup, and both decks
carry their own copy of the photo filling logic. One engine primitive replaces
both.

- [x] **8.1** Create `engine/js/niche.js` with exactly this content. The pending
  markup is baseline `customers/index.html` line 769 and the glyph markup is
  baseline `index.html` line 414, both carried byte for byte.
  ```js
  (function (DECK) {
    'use strict';

    /**
     * The niche: one portrait frame, shared by every deck.
     *
     * A deck's team content puts the element in place with nicheHtml, and the
     * decorator fills it once the deck starts. A key with no value in the
     * deck's photo map, or a file that will not load, renders a PHOTO PENDING
     * marker in the same voice as the screenshot frames.
     */
    function nicheHtml(member) {
      return '<div class="niche" data-photo="' + member.photo +
        '" data-alt="' + (member.alt || member.name) + '"' +
        (member.pos ? ' data-pos="' + member.pos + '"' : '') +
        (member.scale ? ' data-scale="' + member.scale + '"' : '') +
        (member.glyph ? ' data-glyph' : '') +
        '></div>';
    }

    function pending(niche) {
      niche.classList.add('is-pending');
      niche.innerHTML = '<div class="inner"><span class="tag">photo<br>pending</span></div>';
    }

    /* an official mark, unmodified, in its own colour */
    function glyph(niche, src, alt) {
      niche.classList.add('glyph');
      niche.innerHTML = '<div class="inner"><img class="mark" src="' + src +
        '" alt="' + alt + '" width="248" height="248" loading="eager"></div>';
    }

    function photo(niche, src, alt) {
      const img = document.createElement('img');
      img.alt = alt;
      if (niche.dataset.pos) img.style.objectPosition = niche.dataset.pos;
      if (niche.dataset.scale) img.style.transform = 'scale(' + niche.dataset.scale + ')';
      img.addEventListener('error', function () { pending(niche); });
      img.src = src;
      niche.appendChild(img);
    }

    function createNicheDecorator(photos) {
      return function (root) {
        root.querySelectorAll('[data-photo]').forEach(function (niche) {
          const alt = niche.dataset.alt || '';
          const src = photos[niche.dataset.photo];
          if (!src) { pending(niche); return; }
          if (niche.dataset.glyph !== undefined) { glyph(niche, src, alt); return; }
          photo(niche, src, alt);
        });
      };
    }

    DECK.nicheHtml = nicheHtml;
    DECK.createNicheDecorator = createNicheDecorator;
  })(window.DECK = window.DECK || {});
  ```
  **Check:** `grep -c 'width="248" height="248" loading="eager"' engine/js/niche.js`
  prints `1`.

- [x] **8.2** In `core/config.js`, append this member to the frozen object, after
  `TODAY_DURATION_SMALL`. Add a comma to that line first.
  ```js
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
  ```
  **Check:** `grep -c "assets/team/" core/config.js` prints `14`, and every path
  exists: `node -e "const c=require('fs').readFileSync('core/config.js','utf8'); for (const m of c.matchAll(/'(assets\/team\/[^']+)'/g)) if (!require('fs').existsSync(m[1])) { console.error('missing', m[1]); process.exit(1); } console.log('all present')"`
  prints `all present`.
  **If a path is missing:** stop and report. Do not rename an asset.

- [x] **8.3** Replace the whole content of `core/content/team.js` with this. Every
  name, role, alt text and framing value is taken from baseline `index.html`
  lines 389 to 448.
  ```js
  /**
   * Core, slide 02: the team, in two tiers.
   *
   * Both tiers share one tile size, so every member is set at the same weight.
   * The niches are filled by the engine's niche decorator from
   * CORE_CONFIG.PHOTOS.
   */
  const CORE_TEAM_HTML = (function () {
    'use strict';

    const LEADS = [
      { photo: 'mehdi', alt: 'Mehdi Mohammad Rezaei', name: 'Mehdi<br>Mohammad Rezaei', role: 'Tech Lead', pos: '58% 38%' },
      { photo: 'mohammadreza', alt: 'MohammadReza HosseinZadeh', name: 'MohammadReza<br>HosseinZadeh', role: 'Backend', pos: '34% 26%' },
      { photo: 'amirhossein', alt: 'AmirHossein KhanZadeh', name: 'AmirHossein<br>KhanZadeh', role: 'Backend', pos: '46% 42%', scale: '1.06' },
      { photo: 'shabnam', alt: 'Shabnam Nouri', name: 'Shabnam<br>Nouri', role: 'Frontend', pos: '50% 22%' },
      { photo: 'masih', alt: 'Masih Sadri', name: 'Masih<br>Sadri', role: 'Designer', pos: '48% 26%' },
      { photo: 'vida', alt: 'Vida GolZadeh', name: 'Vida<br>GolZadeh', role: 'QA' },
      { photo: 'claude', alt: 'Claude', name: 'Claude<br>by Anthropic', role: 'AI assistant', glyph: true }
    ];

    const WIDER = [
      { photo: 'javid', name: 'Javid IzadFar', role: 'Frontend' },
      { photo: 'sana', name: 'Sana MohammadZadeh', role: 'PM' },
      { photo: 'amirreza', name: 'AmirReza Mahouti', role: 'APM' },
      { photo: 'hamid', name: 'Hamid BahramPour', role: 'Backend' },
      { photo: 'reza', name: 'Reza Kashani', role: 'Backend' },
      { photo: 'mohammadmahdi', name: 'MohammadMahdi Khakdaman', role: 'CRM Engineer' },
      { photo: 'ali', name: 'Ali Bayat', role: 'CRM Engineer' }
    ];

    function lead(member) {
      return '<div class="member">' + DECK.nicheHtml(member) +
        '<div class="m-name">' + member.name + '</div>' +
        '<div class="m-role">' + member.role + '</div></div>';
    }

    function wider(member) {
      return '<div class="wm">' + DECK.nicheHtml(member) +
        '<b>' + member.name + '</b><i>' + member.role + '</i></div>';
    }

    return '<div class="wrap stack center">' +
      '<div class="eyebrow" data-anim>The team</div>' +
      '<div class="team" data-anim>' + LEADS.map(lead).join('') + '</div>' +
      '<div class="wider" data-anim>' +
      '<div class="wider-label"><span>And the wider team</span></div>' +
      '<div class="wider-row">' + WIDER.map(wider).join('') + '</div>' +
      '</div></div>';
  })();
  ```
  **Check:** `grep -c "photo: '" core/content/team.js` prints `14` and
  `grep -c 'style=' core/content/team.js` prints `0`.

- [x] **8.4** Replace the whole content of `customers/content/team.js` with this.
  The five members come from baseline `customers/index.html` lines 438 to 457
  and the project row from lines 460 to 462.
  ```js
  /**
   * My Customers, slide 02: the team and the project.
   *
   * The niches are filled by the engine's niche decorator from
   * CUSTOMERS_CONFIG.PHOTOS. Set one of those to null and it renders a PHOTO
   * PENDING marker.
   */
  const CUSTOMERS_TEAM_HTML = (function () {
    'use strict';

    const MEMBERS = [
      { photo: 'ali', alt: 'Ali Marateb', name: 'Ali<br>Marateb', role: 'Product Lead' },
      { photo: 'masih', alt: 'Masih Sadri', name: 'Masih<br>Sadri', role: 'Product Manager', pos: '48% 26%' },
      { photo: 'mehdi', alt: 'Mehdi Mohammad Rezaei', name: 'Mehdi<br>Mohammad Rezaei', role: 'Tech Lead', pos: '58% 38%' },
      { photo: 'ghazaleh', alt: 'Ghazaleh Ebrahimi', name: 'Ghazaleh<br>Ebrahimi', role: 'Product Designer', pos: '47% 50%' },
      { photo: 'sana', alt: 'Sana Mohammadzadeh', name: 'Sana<br>Mohammadzadeh', role: 'PM Consultant' }
    ];

    const PROJECT = '<div class="pj"><div class="k">The project</div><div class="v">Customer Management<small>A new section, <span class="fa">My Customers</span></small></div></div>' +
      '<div class="pj"><div class="k">Where it lives</div><div class="v">Partner panel<small><span class="fa">Front Office</span></small></div></div>' +
      '<div class="pj"><div class="k">Who uses it</div><div class="v">Partners<small>Independent sellers who register orders and earn commission</small></div></div>';

    function member(person) {
      return '<div class="member">' + DECK.nicheHtml(person) +
        '<div class="m-name">' + person.name + '</div>' +
        '<div class="m-role">' + person.role + '</div></div>';
    }

    return '<div class="wrap stack center">' +
      '<div class="eyebrow" data-anim>The team and the project</div>' +
      '<div class="team3" data-anim>' + MEMBERS.map(member).join('') + '</div>' +
      '<div class="proj" data-anim>' + PROJECT + '</div></div>';
  })();
  ```
  **Check:** `grep -c "photo: '" customers/content/team.js` prints `5` and
  `grep -c 'Independent sellers who register orders and earn commission' customers/content/team.js`
  prints `1`.

- [x] **8.5** Delete `customers/photos.js`. Its behaviour now lives in
  `engine/js/niche.js`.
  Run `git rm customers/photos.js`.
  **Check:** `test ! -e customers/photos.js && echo gone` prints `gone`.

- [x] **8.6** In `core/main.js`, change the decorators line from
  ```js
    decorators: [CORE_COPY]
  ```
  to
  ```js
    decorators: [CORE_COPY, DECK.createNicheDecorator(CORE_CONFIG.PHOTOS)]
  ```
  **Check:** `grep -c 'createNicheDecorator' core/main.js` prints `1`.

- [x] **8.7** In `customers/main.js`, change the decorators line from
  ```js
    decorators: [CUSTOMERS_SCREENS, CUSTOMERS_PHOTOS]
  ```
  to
  ```js
    decorators: [CUSTOMERS_SCREENS, DECK.createNicheDecorator(CUSTOMERS_CONFIG.PHOTOS)]
  ```
  The order is unchanged: the screenshot frames are filled before the niches, as
  in the baseline.
  **Check:** `grep -c 'CUSTOMERS_PHOTOS' customers/main.js` prints `0`.

- [x] **8.8** Add the niche script to both shells, immediately after the stagger
  script, so it is attached before `start.js` freezes `DECK`. In `index.html` add
  ```html
  <script src="engine/js/niche.js"></script>
  ```
  and in `customers/index.html` add
  ```html
  <script src="../engine/js/niche.js"></script>
  ```
  In `customers/index.html`, also delete the line
  `<script src="photos.js"></script>`.
  **Check:** `grep -c 'niche.js' index.html customers/index.html` prints `1` for
  each, and `grep -c 'photos.js' customers/index.html` prints `0`.

- [x] **8.9** Append the inline style rule to `RULES` in `tools/lint.mjs`,
  replacing the line `// Later stages append their rules here.` with:
  ```js
    ,
    {
      name: 'no inline style in content',
      applies: isContentFile,
      check: text => text.includes('style=') ? 'carries an inline style attribute' : null
    }
    // Later stages append their rules here.
  ```
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds`. All 99
  inline style attributes the audit found are now gone.

- [x] **8.10** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails on `photos`:** report the first differing entry. A differing
  `objectPosition` means a `pos` value was mistyped; a differing `src` means a
  photo key does not match the config; a differing `cls` on the Claude mark means
  the glyph markup was not copied byte for byte.
  **If parity fails on `text` for slide 02 of either deck:** a name or role
  string was mistyped. Report the before and after text.

- [x] **8.11** Commit.
  ```
  Build both team slides from one niche primitive

  The niche is now an engine primitive: the deck's content puts the element in
  place and one decorator fills it, with a photo, an official mark, or a
  PHOTO PENDING marker. Fourteen hand written portrait blocks in Core became
  fourteen rows of data, and the duplicated photo filling logic in My
  Customers is gone.

  Core's niches gain the PHOTO PENDING fallback My Customers already had. It
  is unreachable while every portrait is present, so no slide renders
  differently, but it is a behaviour difference and it is recorded in
  REFACTOR_PLAN.md section 7.

  lint now fails on any inline style in a content file. All 99 the audit
  counted are gone.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 9. Drop the stylesheet rules no markup uses

Three rules no element in either deck can match. Removing a rule nothing matches
cannot change rendering, and the parity gate proves it.

- [x] **9.1** In `engine/css/motif.css`, delete the line
  ```css
  .arch.flat .vsr > i{transition-delay:0ms}
  ```
  No element in either deck carries the class `flat`.
  **Check:** `grep -rc 'flat' engine/ core/ customers/ --include='*.css' --include='*.js' --include='*.html' | grep -v ':0$'`
  prints nothing.

- [x] **9.2** In `core/css/slides.css`, delete the line
  ```css
  .leg b.dash{border:1.5px dashed rgba(43,27,18,.4)}
  ```
  The only legend in the deck, on slide 06, uses `brown` and `yellow` only.
  **Check:** `grep -rc 'dash"' core/ --include='*.js'` prints `0` for every file
  and `grep -c 'b.dash' core/css/slides.css` prints `0`.

- [x] **9.3** In `customers/css/slides.css`, delete the line
  ```css
  .farsi{font-size:.42em;color:var(--brick);letter-spacing:0;display:block;margin-top:.5em;font-family:var(--sans)}
  ```
  No element carries the class `farsi`. The Persian runs on slide 02 use `.fa`,
  which stays.
  **Check:** `grep -rc 'farsi' customers/ --include='*.css' --include='*.js' | grep -v ':0$'`
  prints nothing, and `grep -c 'class="fa"' customers/content/team.js` prints `2`,
  one for "My Customers" and one for "Front Office" in the project row.

- [x] **9.4** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`.
  **If parity fails:** one of the three rules was not dead after all. Report
  which slide changed and restore that rule only.

- [x] **9.5** Commit.
  ```
  Drop three stylesheet rules no markup uses

  .arch.flat, .leg b.dash and .farsi were each defined and never matched. The
  parity gate confirms nothing rendered differently.

  Parity: 132/132 slide and viewport pairs identical.
  ```

---

### Stage 10. Document the architecture, and give My Customers its own card

- [x] **10.1** Render a social card for My Customers from its own title slide.
  A fresh profile on this Chrome triggers Google Update's wake-all cycle on
  first run, which hangs for a long time with no route to its servers, and
  separately this Chrome does not reliably exit a `--screenshot` process on
  its own even after writing the file. Running Chrome in the foreground and
  chaining a cleanup after it with `&&` therefore never reaches the cleanup:
  the shell blocks on Chrome forever. Run Chrome in the background instead,
  from the repository root:
  ```
  PROFILE=$(mktemp -d)
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --force-color-profile=srgb \
    --disable-lcd-text --disable-font-subpixel-positioning \
    --disable-background-networking --disable-component-update \
    --disable-domain-reliability --disable-sync \
    --disable-client-side-phishing-detection --no-first-run \
    --no-default-browser-check --disable-extensions --metrics-recording-only \
    --user-data-dir="$PROFILE" \
    --window-size=1200,630 --virtual-time-budget=12000 \
    --screenshot=customers/assets/og.png \
    "file://$PWD/customers/index.html#1" &
  CHROME_PID=$!
  sleep 14
  kill -9 "$CHROME_PID" 2>/dev/null
  pkill -9 -f "user-data-dir=$PROFILE" 2>/dev/null
  rm -rf "$PROFILE"
  ```
  The `&` backgrounds Chrome so the `sleep 14` runs concurrently with it
  rather than waiting for it to return. 14 seconds clears the 12 second
  virtual time budget, which itself clears the title hint's fade, with 2
  seconds of margin for the write. Killing the process after that does not
  lose the file: it is already written by the time the budget expires.
  **Check:** `file customers/assets/og.png` reports `PNG image data, 1200 x 630`.
  **If Chrome fails or the size is wrong:** stop and report. Do not point
  `og:image` at a file that is not there and do not reuse Core's card.

- [x] **10.2** In `customers/index.html`, change
  ```html
  <meta property="og:image" content="https://mrsadri.github.io/core-deck/assets/og.jpg">
  ```
  to
  ```html
  <meta property="og:image" content="https://mrsadri.github.io/core-deck/customers/assets/og.png">
  ```
  Leave `index.html` alone: Core keeps `assets/og.jpg`.
  **Check:** `grep -c 'customers/assets/og.png' customers/index.html` prints `1`
  and `grep -c 'assets/og.jpg' customers/index.html` prints `0`.

- [x] **10.3** Create `ARCHITECTURE.md` at the repository root. It must contain
  these five sections, in this order, with these exact headings:

  1. `## The shape of it` : the directory tree from section 4 of
     `REFACTOR_PLAN.md`, copied verbatim, including the one line description
     against each entry.
  2. `## Every file and its one job` : the file by file list from section 4 of
     `REFACTOR_PLAN.md` under the heading "Every file: its one responsibility,
     and its boundaries", copied verbatim.
  3. `## Where to edit a slide` : the sentence
     `Find the slide in the table, open that file, edit the html string. Nothing else needs to change.`
     followed by a table with the columns `Deck`, `No`, `id`, `Slide`, `File`,
     with one row for each of the 33 slides, in deck and slide order, taken from
     the id and name values in stages 4 and 5 and the file each one lives in. The
     two team slides point at the deck's `content/team.js`.
  4. `## The rules` : rules 1 to 11 from section 5 of `REFACTOR_PLAN.md`, copied
     verbatim, followed by the line
     `tools/lint.mjs enforces the checkable ones. Run it before every commit.`
  5. `## Adding a third deck` : this exact content:
     ```markdown
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
     ```
  **Check:** `grep -c '^## ' ARCHITECTURE.md` prints `5`, the slide table has 33
  data rows, and `grep -c 'engine/' ARCHITECTURE.md` is greater than `0` while
  the `Adding a third deck` section lists no file under `engine/` to create.

- [x] **10.4** Create `PRESENTING.md` at the repository root with exactly this
  content:
  ```markdown
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
  ```
  **Check:** `grep -c '^- \[ \]' PRESENTING.md` prints `5`.

- [x] **10.5** In `README.md`, make these eight replacements. Each one is given
  as the exact text to find, then the exact text to write in its place.
  Everything else in the file is still accurate and must be left alone.

  Replacement 1, the stale live claim. Find:
  ```
  **Live:** https://mrsadri.github.io/core-deck/customers/ (once this branch is merged)
  ```
  Write:
  ```
  **Live:** https://mrsadri.github.io/core-deck/customers/
  ```

  Replacement 2, the claim that the deck carries its own engine. Find:
  ```
  Source: `customers/index.html`. Self contained, with its own copy of the engine and styles, so changes here cannot affect the Core deck.
  ```
  Write:
  ```
  Source: `customers/`. Both decks run the same engine from `engine/`, and each owns only its content, its own styles and its config. See [ARCHITECTURE.md](ARCHITECTURE.md).
  ```

  Replacement 3, where Core's config lives. Find:
  ```
  Two values need confirming. Both live in the `CONFIG` object at the top of the `<script>` block in `index.html`.
  ```
  Write:
  ```
  Two values need confirming. Both live in `core/config.js`. [PRESENTING.md](PRESENTING.md) is the full checklist.
  ```

  Replacement 4, where Customers' config lives. Find:
  ```
  Everything that needs filling lives in the `CONFIG` object at the top of the `<script>` block in `customers/index.html`.
  ```
  Write:
  ```
  Everything that needs filling lives in `customers/config.js`. [PRESENTING.md](PRESENTING.md) is the full checklist.
  ```

  Replacement 5, where the shot ratio lives. Find:
  ```
  If the real captures come back at a size other than 1280 x 832, change `--shot-ratio` once in the stylesheet and every frame follows.
  ```
  Write:
  ```
  If the real captures come back at a size other than 1280 x 832, change `--shot-ratio` once in `customers/css/tokens.css` and every frame follows.
  ```

  Replacement 6, the photo map. Find:
  ```
  - **Photos.** Done. `CONFIG.PHOTOS` carries all three portraits from `assets/team/`. Setting any one back to `null` renders a PHOTO PENDING niche in its place.
  ```
  Write:
  ```
  - **Photos.** Done. `CUSTOMERS_CONFIG.PHOTOS` in `customers/config.js` carries all five portraits from `assets/team/`. Setting any one back to `null` renders a PHOTO PENDING niche in its place.
  ```

  Replacement 7, the narrative arc, which still describes the 15 slide deck
  from before this plan's own stage 0 found the deck being revised live. Find
  these three pieces, in order, and replace each with what is given.

  Find:
  ```
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
  ```
  Write:
  ```
  14 slides. The arc runs from problem to solution:

  1. Title
  2. The team and the project
  3. Review the design before we build it
  4. Six problems, one missing piece
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
  ```

  Find:
  ```
  Slides 5 to 12 each carry a panel screenshot. Slides 11 and 12 are marked beyond phase 1 on the slide itself.
  ```
  Write:
  ```
  Slides 6 to 11 each carry a panel screenshot. Slides 10 and 11 are marked beyond phase 1 on the slide itself.
  ```

  Then add one pointer. Find:
  ```
  Open `index.html`. No build step and no dependencies.
  ```
  Write:
  ```
  Open `index.html`. No build step and no dependencies.

  To change a slide, find it in the table in
  [ARCHITECTURE.md](ARCHITECTURE.md#where-to-edit-a-slide).
  ```

  **Check:** `grep -c 'once this branch is merged\|Self contained\|<script> block' README.md`
  prints `0`, `grep -c 'CUSTOMERS_CONFIG.PHOTOS' README.md` prints `1`,
  `grep -c '15 slides\|Returning or new, answered' README.md` prints `0`, and
  `grep -c 'ARCHITECTURE.md\|PRESENTING.md' README.md` prints at least `4`.

- [x] **10.6** In `customers/assets/screens/README.md`, replace
  ```
  Save a file, then point the matching key at it in the `CONFIG.SCREENSHOTS`
  object at the top of the `<script>` block in `../../index.html`:
  ```
  with
  ```
  Save a file, then point the matching key at it in `CUSTOMERS_CONFIG.SCREENSHOTS`
  in `../../config.js`:
  ```
  **Check:** `grep -c 'config.js' customers/assets/screens/README.md` prints `1`
  and `grep -c '<script> block' customers/assets/screens/README.md` prints `0`.

- [x] **10.7** Run the gates: `node tools/parity.mjs check` then
  `node tools/lint.mjs`.
  **Check:** `132/132` and `lint: every rule holds`. Changing a `<meta>` tag and
  adding documentation cannot move a slide, so a parity failure here means an
  earlier edit was left unfinished. Stop and report.

- [x] **10.8** Commit. Note that `customers/assets/og.png` is a new binary and
  must be added.
  ```
  Document the architecture, and give My Customers its own card

  ARCHITECTURE.md is the map: the tree, every file and its one job, a table
  that points at the file holding any of the 33 slides, the rules the
  refactor set itself, and what it takes to add a third deck, which is
  nothing under engine/.

  PRESENTING.md turns the placeholders into a checklist. They were flags in
  code and a paragraph of prose; now they are five boxes that point at the
  exact config member.

  My Customers no longer advertises Core's social card. Its own is a 1200x630
  render of its own title slide, made with the headless Chrome the parity
  harness already uses. Core's card is untouched.

  The README no longer claims the deck goes live once a merged branch is
  merged, and no longer says the deck carries its own copy of the engine.
  ```

---

### Stage 11. Hold the shells to the same limits as the rest

- [x] **11.1** In `tools/lint.mjs`, bring the two shells into the browser file
  rules. Replace
  ```js
  /** Shells join the browser file rules in the last stage of the refactor. */
  const SHELLS = [];
  ```
  with
  ```js
  /** The two deck shells. Held to the same limits as everything else. */
  const SHELLS = ['index.html', 'customers/index.html'];
  ```
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds`. Both shells
  are well under 200 lines.
  **If a shell exceeds 200 lines:** stop and report its length. It means content
  was left behind in it.

- [x] **11.2** Append the shell rule to `RULES` in `tools/lint.mjs`, replacing
  the line `// Later stages append their rules here.` with:
  ```js
    ,
    {
      name: 'a shell carries no styles',
      applies: file => SHELLS.includes(file),
      check: text => {
        if (text.includes('<style')) return 'carries a style element';
        if (text.includes('style=')) return 'carries an inline style attribute';
        if (text.includes('<section')) return 'carries slide markup';
        return null;
      }
    }
  ```
  **Check:** `node tools/lint.mjs` prints `lint: every rule holds`.

- [x] **11.3** Run the gates one last time, and keep the output.
  ```
  node tools/parity.mjs check
  node tools/lint.mjs
  ```
  **Check:** `parity: 132/132 slide-viewport pairs identical` and
  `lint: every rule holds`.

- [x] **11.4** Confirm the refactor's own claims, one command each:
  ```
  # no inline styles anywhere the browser loads
  grep -rc 'style=' index.html customers/index.html core/ customers/content/ core/content/

  # one global, and no resize timer on window
  grep -rn 'window\.' engine/js/ | grep -v 'window.DECK\|window.addEventListener\|window.innerWidth'

  # nothing at column zero in the engine
  grep -rn '^\(var\|let\|const\|function\) ' engine/js/

  # no var anywhere the browser loads
  grep -rn '\bvar ' engine/ core/ customers/ --include='*.js'
  ```
  **Check:** the first prints `0` for every file. The other three print nothing.
  **If any prints a line:** stop and report it.

- [x] **11.5** Commit.
  ```
  Hold the shells to the same limits as the rest

  Both shells are now inside lint's scope: the 200 line limit, and a rule
  that fails them if a style element, an inline style or a slide section
  reappears.

  Final parity: 132/132 slide and viewport pairs identical, across 19 Core
  slides and 14 My Customers slides at four viewports, on the settled
  screenshot, the slide text, the computed delay and box of every animated
  element, the geometry and reveal index of every brick, and every portrait.
  ```

---

## What this plan does not do

Recorded so the next pass has a starting point, and so a reviewer can see these
were decisions rather than oversights.

- Items 3, 4, 5 and 7 from the audit are untouched, as section 1 requires:
  Enter, Space and Backspace are claimed for the whole document; a click
  anywhere advances; there is no `aria-live` and slides are unlabelled;
  `requestFullscreen` is unguarded.
- The motif is still rebuilt from scratch on every resize and twice on load.
  The rebuild restarts the brick reveal, so it is visible, and removing it would
  change the animation. The waste is real and the fix is a behaviour change.
- Core does not adopt `engine/css/compact.css`. Adopting it would change how
  Core renders below 760px, which is a visible improvement but a visible change.
- `engine/css/member.css` carries both the `glyph` and `is-pending` niche
  variants for both decks, even though each deck uses only one today. They are
  inert without the matching data attribute, and a third deck gets both.
- `customers/assets/og.png` is a render of a slide, not a designed social card.
