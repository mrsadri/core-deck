# Core

An internal presentation introducing BimeBazar's core insurance platform to senior managers and business stakeholders. It runs immediately before a live product demo.

**Live:** https://mrsadri.github.io/core-deck/

## The deck

19 slides, one idea each. The narrative arc:

1. Title
2. The team
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

## Design

The structural motif is the rowlock arch: bricks set on edge, radiating around a curve. It is generated in code rather than drawn, so the same primitive carries the argument across the deck. A partly built arch is the problem, an arch whose crown bricks are the only new work is core, and the keystone is the rules engine.

Palette is kraft paper, brick brown, brick yellow, and a single accent in `#D97757`.

Typography is Iowan Old Style with a Georgia fallback, set against the system sans. No web fonts, so the deck renders identically offline.

## Credits

The Claude mark on the team slide is the trademark of Anthropic and is used to identify Claude as a contributor. Team photographs belong to the individuals pictured.
