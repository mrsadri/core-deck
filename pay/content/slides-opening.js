/**
 * Pay Link, slides 01 to 05: what the deck is, how to read it, and the two
 * lines drawn before the first click.
 *
 * Every slide carries a notes line: what the presenter says over it. The
 * engine renders id, name and html, and leaves notes alone.
 */
const PAY_SLIDES_OPENING = [
  {
    id: 'title',
    name: 'The customer pays, from a link',
    notes: 'One sentence of framing: the seller used to be the only one who could pay an invoice. This deck walks the new path, click by click.',
    html: `
    <div class="wrap title-grid">
      <div class="eyebrow" data-anim>BimeBazar &nbsp;/&nbsp; Partner panel &nbsp;/&nbsp; Product demo</div>
      <div class="rail-cover" data-anim><div class="rail lg" data-rail="0"></div></div>
      <h1 class="say" data-anim>The customer pays, from a link.</h1>
      <p class="lead" data-anim>Every step of paying a body or health invoice: what the user does, what the system does, and what comes back.</p>
      <div class="sign" data-anim>Recipient payment link</div>
    </div>
`
  },
  {
    id: 'context',
    name: 'The project and the product',
    notes: 'Where this lives and who touches it. Two kinds of user from here on: the seller, and the customer the seller sends a link to.',
    html: PAY_TEAM_HTML
  },
  {
    id: 'reading',
    name: 'Every click, and what it sets off',
    notes: 'Set the pattern once so nobody has to relearn it. Every step slide has the same three columns in the same place. The middle one is how the tech did the task.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>How to read this deck</div>
      <h2 class="tight" data-anim>Every click, and what it sets off.</h2>
      <div class="arcrow" data-anim data-d="2">
        <div class="pier"><span class="num">01</span><div class="pt">The user does</div><div class="ps">What the seller or the customer clicks, types or opens</div></div>
        <div class="pier"><span class="num">02</span><div class="pt">The system does</div><div class="ps">What runs behind that action, in plain words, in the order it runs</div></div>
        <div class="pier"><span class="num">03</span><div class="pt">The user gets</div><div class="ps">What comes back on the screen, and what it means</div></div>
      </div>
      <p class="claim sm" data-anim data-d="3">Seven steps, and the same three questions asked of each.</p>
    </div>
`
  },
  {
    id: 'scope',
    name: 'Which orders this covers',
    notes: 'The six states are the spelled out list from the backend. Recalculate is in on purpose: an order that was paid once can owe a new charge. Everything on the right keeps working exactly as it did.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Before the first click</div>
      <h2 class="sm" data-anim>Which orders this covers.</h2>
      <div class="pair" data-anim data-d="2">
        <div class="side">
          <div class="ch">Covered</div>
          <ul class="pts">
            <li><b>BimeBazar body and health orders</b> that are not deleted</li>
            <li>Paid in <b>cash</b> or with <b>BimeBazar BNPL</b></li>
            <li>In one of six states: created, completed, just pay, correction needed, safe correction needed, or recalculate</li>
            <li>An order paid once before can still owe a new charge after a recalculation</li>
          </ul>
        </div>
        <div class="side dim">
          <div class="ch">Unchanged</div>
          <ul class="pts">
            <li>Third party and motorcycle third party</li>
            <li>Every provider other than BimeBazar</li>
            <li>Routine BNPL installments</li>
            <li>Their payment, SMS, commission and listing all work as before</li>
          </ul>
        </div>
      </div>
      <p class="claim sm" data-anim data-d="3">On top of that, the customer's side only moves while BimeBazar, asked fresh, says the order is payable.</p>
    </div>
`
  },
  {
    id: 'owner',
    name: 'BimeBazar decides the money. We run the path to it',
    notes: 'This answers most pricing questions before they are asked. We do not hold a price, we do not lock a price, and we do not decide that something was paid. Commission is ours and never changes what the customer pays.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Before the first click</div>
      <h2 class="sm" data-anim>BimeBazar decides the money. We run the path to it.</h2>
      <div class="pair" data-anim data-d="2">
        <div class="side dim">
          <div class="ch">BimeBazar owns</div>
          <ul class="pts">
            <li>The premium, the credit and the discount</li>
            <li>The amount payable right now</li>
            <li>The bank operation</li>
            <li>Whether the order ends up paid</li>
          </ul>
        </div>
        <div class="side">
          <div class="ch">We own</div>
          <ul class="pts">
            <li>The link, the SMS and the code</li>
            <li>A record of every attempt to pay</li>
            <li>One rule: the same order is never sent to the bank twice at once</li>
            <li>The seller's commission, which never changes what the customer pays</li>
          </ul>
        </div>
      </div>
      <p class="claim sm" data-anim data-d="3">We never invent a price lock or a payment result on BimeBazar's behalf.</p>
    </div>
`
  }
];
