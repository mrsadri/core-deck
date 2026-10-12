/**
 * Front Office Reports, slides 06 to 08: the dashboard, what it says about
 * sales and commission, and the payments list.
 *
 * A highlight is an empty .hl inside its frame, numbered to match the list
 * beside it. Where each one sits is in css/pins.css.
 */
const REPORTS_SLIDES_MONEY = [
  {
    id: 'dashboard',
    name: 'The business, at a glance',
    notes: 'The dashboard is not meant to contain every detail. Its job is to answer the most important questions quickly and provide clear entry points into deeper investigation.',
    html: `
    <div class="wrap sol tall">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>01 &nbsp;/&nbsp; Dashboard</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>Partners need to look across different parts of the panel to understand sales, commissions, order status, and network performance.</span></div>
        <h2 class="sm" data-anim data-d="2">The business, at a glance.</h2>
        <p class="lead sm" data-anim data-d="3">One place to understand what happened, what was earned, and what needs attention.</p>
        <ol class="keys" data-anim data-d="4">
          <li>Orders waiting for Partner action</li>
          <li>Total order value</li>
          <li>Received commissions</li>
          <li>Received rewards</li>
          <li>Order status breakdown</li>
          <li>Sales and commission detail</li>
          <li>Network performance summary</li>
        </ol>
        <div class="trace-step" data-anim data-d="5">
          <div class="trace sm">
            <div class="tn is-key"><span class="dot"></span><span class="tk">Number</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Reason</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Source</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Detail</span></div>
          </div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="dashboard" data-what="The whole dashboard, from the orders waiting for action down to the network summary">
        <i class="hl n1" data-n="1"></i><i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
        <i class="hl n5" data-n="5"></i><i class="hl n6" data-n="6"></i><i class="hl n7" data-n="7"></i>
      </div></div>
    </div>
`
  },
  {
    id: 'sales-commission',
    name: 'A sale is not complete until its income is understandable',
    notes: 'The goal is to help the Partner understand both performance and financial outcome without treating them as the same thing.',
    html: `
    <div class="wrap sol wide">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>02 &nbsp;/&nbsp; Sales &amp; Commission</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>Sales and income may be visible, but the relationship between what was sold, what was earned, what was received, and what remains is not clear enough.</span></div>
        <h2 class="sm" data-anim data-d="2">A sale is not complete until its income is understandable.</h2>
        <p class="lead sm" data-anim data-d="3">The redesigned view separates business performance from financial outcome.</p>
        <ol class="keys one" data-anim data-d="4">
          <li>How much was sold?</li>
          <li>How much commission was received?</li>
          <li>How much is still outstanding?</li>
          <li>Which categories created the value?</li>
        </ol>
        <div class="trace-step" data-anim data-d="5">
          <div class="trace sm">
            <div class="tn"><span class="dot"></span><span class="tk">Number</span></div>
            <div class="tn is-key"><span class="dot"></span><span class="tk">Reason</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Source</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Detail</span></div>
          </div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="sales" data-what="The dashboard totals, the order status row and the sales and commission breakdown">
        <i class="hl n1" data-n="1"></i><i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
      </div></div>
    </div>
`
  },
  {
    id: 'payments',
    name: 'Every payment should be explainable',
    notes: 'This directly addresses one of the most repeated questions: what exactly was this money for?',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>03 &nbsp;/&nbsp; Payments</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>A Partner may see a payment amount but still not know exactly what it was for.</span></div>
        <h2 class="sm" data-anim data-d="2">Every payment should be explainable.</h2>
        <p class="lead sm" data-anim data-d="3">Payment changes from &ldquo;a number&rdquo; into &ldquo;a record with context.&rdquo;</p>
        <ol class="keys" data-anim data-d="4">
          <li>Payment type and reason</li>
          <li>Customer</li>
          <li>Insurance category</li>
          <li>Order tracking code</li>
          <li>Related policy sale amount</li>
          <li>Amount paid</li>
          <li>Go to order: the link to the related order</li>
        </ol>
        <div class="trace-step" data-anim data-d="5">
          <div class="trace sm">
            <div class="tn"><span class="dot"></span><span class="tk">Number</span></div>
            <div class="tn"><span class="dot"></span><span class="tk">Reason</span></div>
            <div class="tn is-key"><span class="dot"></span><span class="tk">Source</span></div>
            <div class="tn"><span class="dot"></span><span class="tk">Detail</span></div>
          </div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="payments" data-what="The payments list, with a direct sale commission expanded into its record">
        <i class="hl n1" data-n="1"></i><i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
        <i class="hl n5" data-n="5"></i><i class="hl n6" data-n="6"></i><i class="hl n7" data-n="7"></i>
      </div></div>
    </div>
`
  }
];
