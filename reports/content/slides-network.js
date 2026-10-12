/**
 * Front Office Reports, slides 09 to 11: network sales, the campaigns
 * list, and one campaign in detail.
 */
const REPORTS_SLIDES_NETWORK = [
  {
    id: 'network',
    name: 'See the network from the top. Drill into each branch',
    notes: 'This is intentionally designed as progressive exploration. The dashboard should provide insight, not visualize a complete 30+ person hierarchy at once.',
    html: `
    <div class="wrap sol wide">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>04 &nbsp;/&nbsp; Network Sales</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>Partners can see network performance, but large multi-level structures make it difficult to understand where income is actually coming from.</span></div>
        <h2 class="sm" data-anim data-d="2">See the network from the top. Drill into each branch.</h2>
        <p class="lead sm" data-anim data-d="3">Start with the most useful overview, then explore deeper only when needed.</p>
        <ol class="keys" data-anim data-d="4">
          <li>Total network income</li>
          <li>Total network sales</li>
          <li>Number of downline members</li>
          <li>Income by network level</li>
        </ol>
        <div class="trace-step" data-anim data-d="5">
          <div class="trace sm">
            <div class="tn is-key"><span class="dot"></span><span class="tk">Network</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Branch</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Member</span></div>
            <div class="tn is-off"><span class="dot"></span><span class="tk">Lower branch</span></div>
          </div>
          <div class="trace-cap">Solid: shown here. Dashed: the intended drill-down.</div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="network" data-what="The network section of the dashboard: income, sales, members and income by level">
        <i class="hl n1" data-n="1"></i><i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
      </div></div>
    </div>
`
  },
  {
    id: 'campaigns',
    name: 'A reward should be trackable, not just promotional',
    notes: 'The Partner should understand where they are now and what they need to do next without contacting Support.',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>05 &nbsp;/&nbsp; Campaigns</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>Partners may not always understand how far they progressed, what reward they earned, or whether the reward has been paid.</span></div>
        <h2 class="sm" data-anim data-d="2">A reward should be trackable, not just promotional.</h2>
        <p class="lead sm" data-anim data-d="3">Campaigns become a measurable financial journey.</p>
        <ol class="keys" data-anim data-d="4">
          <li>Active campaigns</li>
          <li>Progress toward the next milestone</li>
          <li>Reward earned, awaiting payout</li>
          <li>Reward already paid</li>
          <li>Time remaining</li>
          <li>Campaign status</li>
          <li>Closest opportunity, the next target</li>
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
      <div data-anim data-d="2"><div class="shot" data-shot="campaigns" data-what="The campaigns list: active campaigns with progress, reward and time remaining">
        <i class="hl n1" data-n="1"></i><i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
        <i class="hl n5" data-n="5"></i><i class="hl n6" data-n="6"></i><i class="hl n7" data-n="7"></i>
      </div></div>
    </div>
`
  },
  {
    id: 'campaign-detail',
    name: 'From eligibility to payout',
    notes: 'The campaign should remain understandable even after the Partner has already earned a reward.',
    html: `
    <div class="wrap sol wide">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>06 &nbsp;/&nbsp; Campaign detail</div>
        <h2 class="sm" data-anim data-d="1">From eligibility to payout.</h2>
        <p class="lead sm" data-anim data-d="2">One place to understand the rules, progress, reward, and payment timing.</p>
        <ol class="keys one" data-anim data-d="3">
          <li>Am I eligible?</li>
          <li>Where am I in the campaign?</li>
          <li>What have I earned?</li>
          <li>When will I receive it?</li>
        </ol>
        <div class="trace-step" data-anim data-d="4">
          <div class="trace sm">
            <div class="tn"><span class="dot"></span><span class="tk">Number</span></div>
            <div class="tn"><span class="dot"></span><span class="tk">Reason</span></div>
            <div class="tn"><span class="dot"></span><span class="tk">Source</span></div>
            <div class="tn is-key"><span class="dot"></span><span class="tk">Detail</span></div>
          </div>
        </div>
      </div>
      <div class="shots" data-anim data-d="2">
        <div class="shot" data-shot="progress" data-what="Campaign detail: eligible sales, milestone levels, earned reward and the payment timeline">
          <i class="hl n2" data-n="2"></i><i class="hl n3" data-n="3"></i><i class="hl n4" data-n="4"></i>
        </div>
        <div class="shot" data-shot="rules" data-what="Campaign detail: the insurance categories, companies, payment types and policy durations that count">
          <i class="hl n1" data-n="1"></i>
        </div>
      </div>
    </div>
`
  }
];
