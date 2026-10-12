/**
 * Front Office Reports, slides 12 to 14.
 */
const REPORTS_SLIDES_CLOSING = [
  {
    id: 'capabilities',
    name: 'Six capabilities, one clearer financial experience',
    notes: 'These capabilities matter more than individual UI components. They summarize what changes in the Partner experience.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>What changes</div>
      <h2 class="mid" data-anim>Six capabilities, one clearer financial experience.</h2>
      <div class="trace six fold" data-anim data-d="2">
        <div class="tn"><span class="dot"></span><span class="num">01</span><span class="tt">Financial overview</span><span class="ts">Sales, commission, rewards, order status, and network performance in one dashboard.</span></div>
        <div class="tn"><span class="dot"></span><span class="num">02</span><span class="tt">Earned vs received visibility</span><span class="ts">A clearer view of received and remaining commission.</span></div>
        <div class="tn"><span class="dot"></span><span class="num">03</span><span class="tt">Traceable payments</span><span class="ts">A payment can be understood and connected to its source.</span></div>
        <div class="tn"><span class="dot"></span><span class="num">04</span><span class="tt">Network performance exploration</span><span class="ts">Understand income by level and branch, with drill-down.</span></div>
        <div class="tn"><span class="dot"></span><span class="num">05</span><span class="tt">Campaign progress</span><span class="ts">See active campaigns, milestones, and progress.</span></div>
        <div class="tn is-key"><span class="dot"></span><span class="num">06</span><span class="tt">Reward payment visibility</span><span class="ts">Understand earned rewards and when they are expected to be paid.</span></div>
      </div>
    </div>
`
  },
  {
    id: 'validation',
    name: 'The experience is clearer. Some rules still need validation',
    notes: 'The wireframes were intentionally created before every technical rule was fully validated. The next step is to validate feasibility and detailed business rules after the experience is aligned.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Open for validation</div>
      <h2 class="mid" data-anim>The experience is clearer. Some rules still need validation.</h2>
      <div class="vlist" data-anim data-d="2">
        <div class="vrow"><span class="ring"></span><span class="vt">Payment and order relationship</span><span class="vs">Validate how reliably related orders can be retrieved for all payment types.</span></div>
        <div class="vrow"><span class="ring"></span><span class="vt">Expected, final and paid commission</span><span class="vs">Validate data availability and business rules across different products.</span></div>
        <div class="vrow"><span class="ring"></span><span class="vt">Campaign business rules</span><span class="vs">Validate detailed reward logic and edge cases.</span></div>
        <div class="vrow"><span class="ring"></span><span class="vt">Data availability</span><span class="vs">Confirm which breakdowns and drill-down relationships are available today.</span></div>
        <div class="vrow"><span class="ring"></span><span class="vt">Special products</span><span class="vs">Validate exceptions for products such as Life Insurance and Counter.</span></div>
      </div>
      <p class="claim sm" data-anim data-d="3">These are data and business-rule dependencies, not reasons to stop reviewing the experience.</p>
    </div>
`
  },
  {
    id: 'feedback',
    name: 'Does this fit the way Partners and the business actually work?',
    notes: 'The goal is to leave the meeting with clear design feedback and a list of business and data validations, not silent approval.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Over to you</div>
      <h2 class="mid" data-anim data-d="1">Does this fit the way Partners and the business actually work?</h2>
      <p class="lead sm" data-anim data-d="2">Tell us where it helps, where it gets in the way, and what is missing before we build it.</p>
      <ul class="asks" data-anim data-d="3">
        <li>Is the financial mental model understandable?</li>
        <li>Is any important information missing?</li>
        <li>Are any business rules represented incorrectly?</li>
        <li>Does the level of detail feel right?</li>
        <li>Are there important edge cases we have not considered?</li>
        <li>Which parts should change before implementation?</li>
      </ul>
      <p class="claim" data-anim data-d="4">This is the cheapest moment to change it.</p>
    </div>
`
  }
];
