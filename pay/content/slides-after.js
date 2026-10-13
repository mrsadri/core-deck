/**
 * Pay Link, slides 16 to 20: after the bank. Who paid, the seller's
 * commission, what shows up in My Insurances, the trail left behind, and
 * the questions.
 */
const PAY_SLIDES_AFTER = [
  {
    id: 'paid',
    name: 'Who paid? Recorded only when there is one answer',
    notes: 'The order being paid is BimeBazar telling us so. Who paid is our own conclusion, so we only write it down when exactly one bank page could have been the one.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 07 &nbsp;/&nbsp; The bank says paid</div>
      <h2 class="sm" data-anim>Who paid? Recorded only when there is one answer.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="7"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The payer does</div><ul class="pts">
          <li>Finishes the payment on the bank page</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Receives BimeBazar's paid event</li>
          <li>Looks back <b>17 minutes</b> from the event's own time</li>
          <li><b>One bank page in that window:</b> marks it paid, with the time, and who opened it</li>
          <li><b>Several, or an unknown one:</b> records no payer</li>
        </ul></div>
        <div class="col"><div class="ch">Everyone gets</div><ul class="pts">
          <li>The order's paid state, which is BimeBazar's to give</li>
          <li>The payer on record as seller or customer, when it is certain</li>
          <li>The link used up, once BimeBazar says the order is no longer payable</li>
        </ul></div>
      </div>
      <p class="support" data-anim>A payment opened outside these two paths has no attempt on our side, and a paid event alone does not invent one.</p>
    </div>
`
  },
  {
    id: 'commission',
    name: 'Commission is set early, and frozen once paid',
    notes: 'Three questions come up here: can it change after payment (no), can it be paid twice (no, one wallet payment per order), and is it taken back on cancellation (not automatically).',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>After payment &nbsp;/&nbsp; Cash commission</div>
      <h2 class="sm" data-anim>Commission is set early, and frozen once paid.</h2>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">When</div><ul class="pts">
          <li>A body or health <b>cash</b> order, non-touch, is established</li>
          <li>Later, it reaches finalized and issued</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Adds the fixed rate to the BimeBazar rate, rounds down, and stores it as the seller's income</li>
          <li>At first payment or finalization, <b>freezes</b> price, company, type, payment method and commission</li>
          <li>At finalized and issued, creates <b>exactly one</b> wallet payment for the order</li>
          <li>Every quarter hour, looks for any it missed</li>
        </ul></div>
        <div class="col"><div class="ch">The seller sees</div><ul class="pts">
          <li>On the invoice, the commission row shows this commission, not BimeBazar's discount</li>
          <li>The amount payable to BimeBazar does not change</li>
          <li>No automatic clawback if the order is cancelled later</li>
        </ul></div>
      </div>
      <p class="support" data-anim>Later syncs, a cancellation or a deletion do not move a frozen figure.</p>
    </div>
`
  },
  {
    id: 'listing',
    name: 'Unpaid orders now show up, with a label',
    notes: 'Each switch is independent, so recipient payment can be turned off without touching commission or the list. Turning it off hides the feature and keeps the history.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>After payment &nbsp;/&nbsp; My Insurances and the switches</div>
      <h2 class="sm" data-anim>Unpaid orders now show up, with a label.</h2>
      <div class="pair" data-anim data-d="2">
        <div class="side">
          <div class="ch">My Insurances</div>
          <ul class="pts">
            <li>Paid orders stay visible, as before</li>
            <li>Eligible body and health orders that are completed or paid now appear too</li>
            <li>Completed shows as <b>payment pending</b>. Not yet issued shows as <b>issuing</b></li>
            <li>Being listed is not permission to pay, and the list never shows a payment link</li>
          </ul>
        </div>
        <div class="side">
          <div class="ch">Three switches, each on its own</div>
          <ul class="pts">
            <li><b>Recipient payment:</b> the link, the code and the customer's Pay</li>
            <li><b>Cash commission payout:</b> the wallet payment</li>
            <li><b>Payment state in My Insurances:</b> the two labels</li>
            <li>Turning recipient payment off keeps every link, attempt and audit record</li>
          </ul>
        </div>
      </div>
    </div>
`
  },
  {
    id: 'trail',
    name: 'Every attempt leaves a trail',
    notes: 'For support: start from the attempt ID on the row, then read the log lines that carry it. The row says where things ended, the log says how they got there.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>When someone asks &nbsp;/&nbsp; Investigation</div>
      <h2 class="sm" data-anim>Every attempt leaves a trail.</h2>
      <div class="pair" data-anim data-d="2">
        <div class="side">
          <div class="ch">Written down</div>
          <ul class="pts">
            <li>An attempt ID, which ties each log line to its record</li>
            <li>The state before and after, the gate's deadline, and the result</li>
            <li>How each paid event was matched, or why it was not</li>
            <li>For Pay: the HTTP status, and whether the bank address passed its check, with the reason</li>
          </ul>
        </div>
        <div class="side dim">
          <div class="ch">Kept out</div>
          <ul class="pts">
            <li>The text of an SMS, link secrets and codes</li>
            <li>Any bank address that could still be used</li>
            <li>Credentials and payment tokens</li>
            <li>What the SMS provider sent back, in full</li>
          </ul>
        </div>
      </div>
      <p class="claim sm" data-anim data-d="3">A response being ready does not prove the browser opened the bank page, and a 200 does not prove BimeBazar accepted.</p>
    </div>
`
  },
  {
    id: 'questions',
    name: 'Which step should we walk again?',
    notes: 'Go back to any step by its number on the rail. Then on to the live demo.',
    html: `
    <div class="wrap title-grid closing">
      <div class="eyebrow" data-anim>Over to you</div>
      <div class="rail-cover" data-anim><div class="rail lg" data-rail="0"></div></div>
      <h2 class="mid" data-anim>Which step should we walk again?</h2>
      <p class="lead" data-anim>Any click, any wait, any message on the way.</p>
      <div class="sign" data-anim>Recipient payment link</div>
    </div>
`
  }
];
