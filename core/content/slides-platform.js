/**
 * Core, slides 06 to 12.
 */
const CORE_SLIDES_PLATFORM = [
  {
    id: 'what-core-is',
    name: 'What core is: the part we stop rebuilding',
    html: `
    <div class="wrap split">
      <div class="stack">
        <div class="eyebrow" data-anim>Core</div>
        <h2 data-anim>The part we stop rebuilding.</h2>
        <p class="lead" data-anim style="--d:2">Built once, shared by every line. A new product only adds the last few bricks.</p>
        <div class="legend" data-anim style="--d:3">
          <div class="leg"><b class="brown"></b><span>Core</span>&nbsp;built once, used by all</div>
          <div class="leg"><b class="yellow"></b><span>The new line</span>&nbsp;the only part that changes</div>
        </div>
      </div>
      <div data-anim style="--d:2">
        <div class="arch" data-bricks="15" data-depth=".2" data-new="3"></div>
        <div class="plinth"></div>
      </div>
    </div>
`
  },
  {
    id: 'promise',
    name: 'The promise',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>The promise</div>
      <h2 class="tight" data-anim>Three things change.</h2>
      <div class="arcrow" data-anim style="--d:2;width:100%">
        <div class="pier"><span class="num">01</span><div class="pt">A new line in one week</div><div class="ps">Instead of a build that runs for months</div></div>
        <div class="pier"><span class="num">02</span><div class="pt">One place sets the price</div><div class="ps">Every channel quotes from the same engine</div></div>
        <div class="pier"><span class="num">03</span><div class="pt">Published without a build</div><div class="ps">Set up and released by the product team</div></div>
      </div>
    </div>
`
  },
  {
    id: 'one-week',
    name: 'Months to one week',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Speed</div>
      <div class="punch" data-anim style="--d:1">
        <span class="was js-dur-cap"></span>
        <span class="arrowg">&rarr;</span>
        <span class="now">One <em>week</em></span>
      </div>
      <p class="lead" data-anim style="--d:2;max-width:40ch">From the decision to sell a new line, to that line being live for customers.</p>
    </div>
`
  },
  {
    id: 'pricing',
    name: 'One place sets the price',
    html: `
    <div class="wrap split">
      <div class="stack">
        <div class="eyebrow" data-anim>Pricing</div>
        <h2 data-anim>One place decides the price.</h2>
        <p class="lead" data-anim style="--d:2">Every channel asks the same engine, so the number a customer sees is always the same number.</p>
        <p class="support" data-anim style="--d:3">One place to change it. One place to check it.</p>
      </div>
      <div data-anim style="--d:2">
        <div class="arch" data-bricks="13" data-depth=".22" data-key="1"></div>
        <div class="plinth"></div>
      </div>
    </div>
`
  },
  {
    id: 'bff',
    name: 'BFF, Backend For Frontend',
    html: `
    <div class="wrap split tip">
      <div class="stack">
        <div class="eyebrow" data-anim>BFF</div>
        <h2 data-anim style="font-size:clamp(2rem,4.4vw,4.6rem)">Backend For Frontend</h2>
        <p class="lead" data-anim style="--d:2">Every customer facing surface gets its own service counter, served from the same core.</p>
        <p class="support" data-anim style="--d:3">The app, the website and our partners stop queueing behind each other.</p>
      </div>
      <div class="bff" data-anim style="--d:2">
        <div class="bff-row">
          <div class="opening"><span>App</span></div>
          <div class="opening"><span>Website</span></div>
          <div class="opening"><span>Partners</span></div>
        </div>
        <div class="base">One core</div>
      </div>
    </div>
`
  },
  {
    id: 'go-rules',
    name: 'go rules',
    html: `
    <div class="wrap split">
      <div class="stack">
        <div class="eyebrow" data-anim>go rules</div>
        <h2 data-anim>The business logic lives as rules.</h2>
        <p class="lead" data-anim style="--d:2">Pricing, eligibility and product behaviour become settings that the business can change.</p>
        <p class="support" data-anim style="--d:3">This is the keystone. It is what makes publishing without engineering real.</p>
      </div>
      <div data-anim style="--d:2">
        <div class="arch" data-bricks="13" data-depth=".24" data-key="1"></div>
        <div class="plinth"></div>
        <p class="support" style="margin-top:1.4rem;text-align:center;max-width:none">Take the keystone out and nothing stands.</p>
      </div>
    </div>
`
  },
  {
    id: 'before-after',
    name: 'What that looks like in practice',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>What that looks like</div>
      <h2 class="tight" data-anim>Changing a price band.</h2>
      <div class="ba" data-anim style="--d:2">
        <div class="ba-col"><div class="k">Before</div><div class="v">A ticket, a release,<br>a place in the queue.</div></div>
        <div class="ba-rule"></div>
        <div class="ba-col after"><div class="k">After</div><div class="v">A rule change,<br>live the same day.</div></div>
      </div>
    </div>
`
  }
];
