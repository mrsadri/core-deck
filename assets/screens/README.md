# Screens

Panel screenshots for the My Customers deck. They live in the shared `assets/`
tree with every other image; only the deck's code lives in `customers/`.

Capture at **1280 x 832** so the frames in the deck match without cropping.

Save a file, then point the matching key at it in `CUSTOMERS_CONFIG.SCREENSHOTS`
in `../../customers/config.js`:

| Key | Slide | What it shows |
| --- | --- | --- |
| `p2_f2` | 06 | The customer list, mid search, opening into a customer's full profile |
| `p3_f5` | 07 | The policies list, with status and file |
| `p4_f4` | 08 | A vehicle's documents and related policies, filed under the customer |
| `p5_f6` | 09 | The financial status view |
| `f7` | 10 | Calls and notes in the profile, beyond phase 1 |
| `f8` | 11 | Adding a prospective customer by hand, beyond phase 1 |

Any key left as `null`, or pointed at a file that is not here, renders a
dotted frame tagged SCREENSHOT PENDING instead.

`p1_f1` and `p3_f3` were retired: slide 05 (order &rarr; customer record) is
now text/motif only, and slide 07's old "customer profile page" concept was
merged into slide 06 (find + see everything about a customer in one search).

## Front Office Reports

Wireframes for the Front Office Reports deck, all prefixed `reports-`. They
are exports of the Persian wireframes, flattened onto white, and several are
crops of one page. Each frame in the deck takes the proportions of its own
file, so there is no size to capture at.

Point the matching key at a file in `REPORTS_CONFIG.SCREENSHOTS` in
`../../reports/config.js`:

| Key | Slide | File | What it shows |
| --- | --- | --- | --- |
| `dashboard` | 06 | `reports-dashboard.png` | The whole dashboard page |
| `sales` | 07 | `reports-sales.png` | The dashboard from the totals down to the sales and commission table |
| `payments` | 08 | `reports-payments.png` | The payments list, the first payment expanded |
| `network` | 09 | `reports-network.png` | The network section of the dashboard |
| `campaigns` | 10 | `reports-campaigns.png` | The campaigns list |
| `progress` | 11 | `reports-campaign-progress.png` | Campaign detail, upper half: progress, reward and payout |
| `rules` | 11 | `reports-campaign-rules.png` | Campaign detail, lower half: what counts as an eligible sale |

Replacing a file with one of another size takes two more edits: its ratio,
width over height, in `../../reports/css/screens.css`, and the position of
its highlights in `../../reports/css/pins.css`.
