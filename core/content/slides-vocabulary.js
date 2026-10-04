/**
 * Core, slides 13 to 17.
 */
const CORE_SLIDES_VOCABULARY = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    html: `
    <div class="wrap stack">
      <div class="eyebrow" data-anim>Vocabulary</div>
      <h2 data-anim data-d="1">Three words you will hear in the demo.</h2>
      <p class="lead" data-anim data-d="2">All three are steps in one customer journey.</p>
    </div>
`
  },
  {
    id: 'rfq',
    name: 'RFQ',
    html: `
    <div class="wrap split">
      <div class="term">
        <div class="stepdots" data-anim><b class="on"></b><b></b><b></b></div>
        <div class="acr" data-anim data-d="1">RFQ</div>
        <div class="expand" data-anim data-d="2">Request For Quote</div>
        <p class="lead" data-anim data-d="3">The moment a customer asks to see what is available for them.</p>
      </div>
      <div data-anim data-d="2">
        <div class="arch" data-bricks="13" data-depth=".22" data-fill="5"></div>
        <div class="plinth"></div>
      </div>
    </div>
`
  },
  {
    id: 'quote-list',
    name: 'Quote list',
    html: `
    <div class="wrap split">
      <div class="term">
        <div class="stepdots" data-anim><b class="on"></b><b class="on"></b><b></b></div>
        <div class="acr" data-anim data-d="1" style="font-size:clamp(2.6rem,7.4vw,8.4rem)">Quote list</div>
        <div class="expand" data-anim data-d="2">The offers that come back</div>
        <p class="lead" data-anim data-d="3">What we return, side by side, for the customer to compare and choose from.</p>
      </div>
      <div data-anim data-d="2">
        <div class="arch" data-bricks="13" data-depth=".22" data-fill="9"></div>
        <div class="plinth"></div>
      </div>
    </div>
`
  },
  {
    id: 'rfs',
    name: 'RFS',
    html: `
    <div class="wrap split">
      <div class="term">
        <div class="stepdots" data-anim><b class="on"></b><b class="on"></b><b class="on"></b></div>
        <div class="acr" data-anim data-d="1">RFS</div>
        <div class="expand" data-anim data-d="2"><span class="tbd" id="rfsExpand"></span></div>
        <p class="lead" data-anim data-d="3">Everything we still need to collect before the policy can be issued.</p>
      </div>
      <div data-anim data-d="2">
        <div class="arch" data-bricks="13" data-depth=".22" data-key="1"></div>
        <div class="plinth"></div>
      </div>
    </div>
`
  },
  {
    id: 'journey',
    name: 'The journey',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>The journey</div>
      <h2 class="tight" data-anim>Ask. Compare. Issue.</h2>
      <div class="arcrow" data-anim data-d="2" style="width:100%">
        <div class="pier"><span class="num">RFQ</span><div class="pt">The customer asks</div></div>
        <div class="pier"><span class="num">Quote list</span><div class="pt">The customer chooses</div></div>
        <div class="pier"><span class="num">RFS</span><div class="pt">The policy is issued</div></div>
      </div>
      <p class="lead" data-anim data-d="3" style="max-width:42ch">One span, three stones. You will watch all three in a moment.</p>
    </div>
`
  }
];
