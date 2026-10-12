/**
 * Front Office Reports, slides 01 to 05.
 *
 * Every slide carries a notes line: what the presenter says over it. The
 * engine renders id, name and html, and leaves notes alone.
 */
const REPORTS_SLIDES_OPENING = [
  {
    id: 'title',
    name: 'Every number should explain itself',
    notes: 'This project is not only about redesigning report screens. The real goal is to help Partners understand the financial story behind the numbers they see.',
    html: `
    <div class="wrap title-grid">
      <div class="eyebrow" data-anim>BimeBazar &nbsp;/&nbsp; Partner panel &nbsp;/&nbsp; Design review</div>
      <div class="trace-cover" data-anim>
        <div class="trace lg">
          <div class="tn"><span class="dot"></span><span class="tk">Sale</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Commission</span></div>
          <div class="tn is-key"><span class="dot"></span><span class="tk">Payment</span></div>
        </div>
      </div>
      <h1 class="say" data-anim>Every number should explain itself.</h1>
      <p class="lead" data-anim>A clearer way for Partners to understand sales, income, payments, network performance, and rewards.</p>
      <div class="sign" data-anim>Front Office Reports Redesign</div>
    </div>
`
  },
  {
    id: 'context',
    name: 'The project and the product',
    notes: 'This redesign covers the reporting experience across several related parts of the Front Office, not just one isolated page.',
    html: REPORTS_TEAM_HTML
  },
  {
    id: 'purpose',
    name: 'Review the design before we build it',
    notes: 'The purpose of this session is not to confirm every backend rule. The goal is to validate whether the proposed experience fits how the business and Partners actually work.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Why we are here</div>
      <h2 class="tight" data-anim>Review the design before we build it.</h2>
      <div class="arcrow" data-anim data-d="2">
        <div class="pier"><span class="num">01</span><div class="pt">What we found</div><div class="ps">A short review of the problems Partners face today</div></div>
        <div class="pier"><span class="num">02</span><div class="pt">The proposed design</div><div class="ps">How the new experience responds to those problems</div></div>
        <div class="pier"><span class="num">03</span><div class="pt">Your feedback</div><div class="ps">What is correct, what is missing, and what needs to change before implementation</div></div>
      </div>
      <p class="claim sm" data-anim data-d="3">Nothing here is too expensive to change yet.</p>
    </div>
`
  },
  {
    id: 'found',
    name: 'The numbers exist. The story behind them does not',
    notes: 'These patterns were identified through a current-state audit, stakeholder interviews, and real support and SWAT cases. Do not spend time explaining the full research methodology.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>What we found</div>
      <h2 class="mid" data-anim>The numbers exist. The story behind them does not.</h2>
      <div class="trace-row" data-anim data-d="2">
        <div class="trace cut">
          <div class="tn"><span class="dot"></span><span class="tk">Sale</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Commission</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Payment</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Wallet</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Network</span></div>
          <div class="tn"><span class="dot"></span><span class="tk">Campaign</span></div>
        </div>
      </div>
      <div class="plist" data-anim data-d="3">
        <div class="pitem"><span class="n">01</span><span class="t"><b>Payment source is unclear</b>Partners may see a payment but cannot always understand which sale, order, or activity created it.</span></div>
        <div class="pitem"><span class="n">02</span><span class="t"><b>Expected and paid income are not clear enough</b>It can be difficult to understand what has been earned, finalized, paid, or is still outstanding.</span></div>
        <div class="pitem"><span class="n">03</span><span class="t"><b>Financial mismatches are hard to investigate</b>When system numbers differ from what a Partner expects, there is not enough information to understand why.</span></div>
        <div class="pitem"><span class="n">04</span><span class="t"><b>The financial journey is fragmented</b>Sales, commissions, payments, wallet activity, network income, and campaign rewards are spread across separate views.</span></div>
      </div>
      <p class="claim sm" data-anim data-d="4">The main problem is not lack of reports. It is lack of traceability, transparency, and self-service.</p>
    </div>
`
  },
  {
    id: 'direction',
    name: 'From summary to investigation',
    notes: 'The experience is based on progressive disclosure: start with the summary, then go deeper only when investigation is needed.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Design direction</div>
      <h2 data-anim>From summary to investigation.</h2>
      <div class="trace-row" data-anim data-d="2">
        <div class="trace">
          <div class="tn"><span class="dot"></span><span class="num">01</span><span class="tt">Overview</span><span class="ts">Understand the overall financial situation quickly.</span></div>
          <div class="tn"><span class="dot"></span><span class="num">02</span><span class="tt">Breakdown</span><span class="ts">Understand what an important number is made of.</span></div>
          <div class="tn is-key"><span class="dot"></span><span class="num">03</span><span class="tt">Detail</span><span class="ts">Trace the result back to the relevant order, payment, network member, or campaign.</span></div>
        </div>
      </div>
      <p class="claim" data-anim data-d="3">No important financial number should be a dead end.</p>
    </div>
`
  }
];
