# Assets

Every image in the project, in one tree. Both decks and the homepage reach it
with the same prefix, `../assets/`, so no path depends on which deck is asking.

| Folder | Holds | Used by |
| --- | --- | --- |
| `brand/` | `favicon.svg`, `apple-touch-icon.png` | every page |
| `social/` | one Open Graph card per deck, named after it | the shell of that deck |
| `team/` | one portrait per person, plus `claude-mark.svg` | `core/config.js`, `customers/config.js` |
| `screens/` | panel screenshots for My Customers, and [its own README](screens/README.md) | `customers/config.js` |

Nothing here is generated at build time, because there is no build step. A file
dropped in is served as it is.

## Adding a portrait

Drop the file in `team/`, named `firstname-lastname.jpg`, then point the
person's key at it in the deck's `config.js`. A niche renders the image
cropped to 3:4 through `object-fit:cover`, so a portrait taller than it is
wide needs no preparation. Set a key back to `null` and that niche renders a
PHOTO PENDING marker instead, which is how the deck refuses to be presented
half dressed.
