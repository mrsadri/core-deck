# Screens

Panel screenshots for the My Customers deck go here.

Capture at **1280 x 832** so the frames in the deck match without cropping.

Save a file, then point the matching key at it in the `CONFIG.SCREENSHOTS`
object at the top of the `<script>` block in `../../index.html`:

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
