/**
 * Core, slides 03 to 05.
 */
const CORE_SLIDES_PROBLEM = [
  {
    id: 'from-zero',
    name: 'Today, every new insurance line starts from zero',
    html: `
    <div class="wrap split">
      <div class="stack">
        <div class="eyebrow" data-anim>Today</div>
        <h2 data-anim>Every new insurance line starts from zero.</h2>
        <p class="lead" data-anim>New product, new code, written by hand, from the ground up.</p>
      </div>
      <div data-anim data-d="2">
        <div class="arch" data-bricks="15" data-depth=".2" data-fill="4"></div>
        <div class="plinth"></div>
        <p class="support" style="margin-top:1.4rem;text-align:center">Travel insurance, still being laid.</p>
      </div>
    </div>
`
  },
  {
    id: 'same-shape',
    name: 'The same shape, built again every time',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>The pattern</div>
      <h2 class="tight" data-anim>Same shape. Built again every time.</h2>
      <div class="repeat" data-anim data-d="2">
        <div class="rep-col"><div class="arch" data-bricks="9" data-depth=".24"></div><div class="plinth"></div><div class="rep-name">Car</div><div class="rep-cost js-dur"></div></div>
        <div class="rep-col"><div class="arch" data-bricks="9" data-depth=".24"></div><div class="plinth"></div><div class="rep-name">Travel</div><div class="rep-cost js-dur"></div></div>
        <div class="rep-col"><div class="arch" data-bricks="9" data-depth=".24"></div><div class="plinth"></div><div class="rep-name">Fire</div><div class="rep-cost js-dur"></div></div>
        <div class="rep-col"><div class="arch" data-bricks="9" data-depth=".24"></div><div class="plinth"></div><div class="rep-name">Life</div><div class="rep-cost js-dur"></div></div>
      </div>
      <p class="lead" data-anim data-d="3" style="max-width:44ch">Four products, four foundations, and almost nothing shared between them.</p>
    </div>
`
  },
  {
    id: 'real-cost',
    name: 'Engineering capacity decides the roadmap',
    html: `
    <div class="wrap stack">
      <div class="eyebrow" data-anim>The real cost</div>
      <h2 data-anim data-d="1">Engineering capacity decides the roadmap.</h2>
      <p class="lead" data-anim data-d="2" style="max-width:38ch">Not the market, and not the business. What we can build is what we can sell.</p>
    </div>
`
  }
];
