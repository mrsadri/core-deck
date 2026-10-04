# Screens

Panel screenshots for the My Customers deck go here.

Capture at **1280 x 832** so the frames in the deck match without cropping.

Save a file, then point the matching key at it in the `CONFIG.SCREENSHOTS`
object at the top of the `<script>` block in `../../index.html`:

| Key | Slide | What it shows |
| --- | --- | --- |
| `p1_f1` | 05 | An order showing the customer record it is linked to |
| `p2_f2` | 06 | The customer list, mid search |
| `p3_f3` | 07 | The customer profile page |
| `p3_f5` | 08 | The policies list, with status and file |
| `p4_f4` | 09 | The returning or new signal after an order is registered |
| `p5_f6` | 10 | The financial status view |
| `f7` | 11 | Calls and notes in the profile, beyond phase 1 |
| `f8` | 12 | Adding a prospective customer by hand, beyond phase 1 |

Any key left as `null`, or pointed at a file that is not here, renders a
dotted frame tagged SCREENSHOT PENDING instead.
