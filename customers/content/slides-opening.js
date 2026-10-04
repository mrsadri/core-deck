/**
 * My Customers, slides 01 to 04.
 */
const CUSTOMERS_SLIDES_OPENING = [
  {
    id: 'title',
    name: 'Title',
    html: `
    <div class="wrap title-grid">
      <div class="eyebrow" data-anim>BimeBazar &nbsp;/&nbsp; Partner panel &nbsp;/&nbsp; Design review</div>
      <div class="title-arch" data-anim><div class="arch" data-bricks="15" data-depth=".2" data-key="1"></div><div class="plinth"></div></div>
      <p class="lead" data-anim style="max-width:40ch">The panel stops listing orders and starts knowing people.</p>
      <p class="hint" data-anim>A walk through the design, then your feedback</p>
    </div>
`
  },
  {
    id: 'team',
    name: 'The team and the project',
    html: CUSTOMERS_TEAM_HTML
  },
  {
    id: 'purpose',
    name: 'Review the design before we build it',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Why we are here</div>
      <h2 class="tight" data-anim>Review the design before we build it.</h2>
      <div class="arcrow" data-anim style="--d:2;width:100%">
        <div class="pier"><span class="num">01</span><div class="pt">The problems we heard</div><div class="ps">A short review of what partners told us</div></div>
        <div class="pier"><span class="num">02</span><div class="pt">The design</div><div class="ps">Customer Management, screen by screen</div></div>
        <div class="pier"><span class="num">03</span><div class="pt">Your feedback</div><div class="ps">Whether this fits the way you work</div></div>
      </div>
    </div>
`
  },
  {
    id: 'problems',
    name: 'Six problems, one missing piece',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>What we found</div>
      <h2 class="tight" data-anim>Six problems, one missing piece.</h2>
      <div class="motif-wide" data-anim style="--d:2;width:min(620px,60vw);margin-top:.5rem">
        <div class="loose" data-loose="20" data-rows="3"></div>
        <div class="plinth thin"></div>
        <div class="motif-cap">Orders, and no one to attach them to</div>
      </div>
      <div class="plist" data-anim style="--d:3">
        <div class="pitem"><span class="n">01</span><span class="t">Work revolves around the order list, not the customer.</span></div>
        <div class="pitem"><span class="n">02</span><span class="t">Finding one customer takes too long.</span></div>
        <div class="pitem"><span class="n">03</span><span class="t">A customer's information is out of reach.</span></div>
        <div class="pitem"><span class="n">04</span><span class="t">A customer's documents aren't filed under their record.</span></div>
        <div class="pitem"><span class="n">05</span><span class="t">Installments and purchase history are hard to read.</span></div>
        <div class="pitem"><span class="n">06</span><span class="t">Notes still live in a paper diary.</span></div>
      </div>
    </div>
`
  }
];
