/**
 * Pay Link, slides 12 to 15: the Pay click. What it checks, every answer it
 * can give, the gate both payers share, and the words an attempt ends in.
 *
 * A word in a code element is spelled the way the system spells it, so the
 * room can match it to what support and the logs will say.
 */
const PAY_SLIDES_PAY = [
  {
    id: 'pay',
    name: 'Checked again, then sent to the bank',
    notes: 'Everything is checked a second time because minutes may have passed since the invoice loaded. The bank address is only handed over once we have written down which operation it belongs to, so we can always say who opened it.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 06 &nbsp;/&nbsp; The customer clicks Pay</div>
      <h2 class="sm" data-anim>Checked again, then sent to the bank.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="6"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The customer does</div><ul class="pts">
          <li>Clicks Pay, once</li>
          <li>The button locks while the request runs, so a second click sends nothing</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Rechecks the pass, the link, the quote's signature, and the amount at BimeBazar</li>
          <li>Reserves an attempt, then asks BimeBazar to open an <b>online</b> payment</li>
          <li>Saves the bank operation's ID and address <b>before</b> answering</li>
          <li>Accepts the address only if it is BimeBazar's own secure bank page</li>
        </ul></div>
        <div class="col"><div class="ch">The customer gets</div><ul class="pts">
          <li>Sent straight to the bank page</li>
          <li><b>Reaching the bank is not having paid.</b> Nothing is marked paid here</li>
        </ul></div>
      </div>
      <p class="support" data-anim>If the amount changed since the quote, nothing is sent to the bank. The customer is shown the new amount instead.</p>
    </div>
`
  },
  {
    id: 'answers',
    name: 'Seven answers, and what the screen does with each',
    notes: 'This is the slide to leave up for questions. The two that sound alike are the last two: in progress means we know a bank page exists, unknown means we never heard back.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 06, continued &nbsp;/&nbsp; Every answer Pay can give</div>
      <h2 class="sm" data-anim>Seven answers, and what the screen does with each.</h2>
      <div class="outs" data-anim>
        <div class="orow head"><span>Pay answers</span><span>The customer sees</span><span>What happens next</span></div>
        <div class="orow"><span>A bank address</span><span class="see">The bank page, at once</span><span>Payment is not confirmed yet</span></div>
        <div class="orow"><code>reload</code><span class="see">The invoice, loaded again</span><span>Fresh amount and quote. Wait for another Pay click</span></div>
        <div class="orow"><code>quote_invalid</code><span class="see">The invoice, loaded again</span><span>The quote ran out. Asked to click Pay again</span></div>
        <div class="orow"><code>amount_changed</code><span class="see">The new amount</span><span>Must confirm it before paying</span></div>
        <div class="orow"><code>payment_rejected</code><span class="see">The reason it was rejected</span><span>Pay is enabled again</span></div>
        <div class="orow"><code>payment_in_progress</code><span class="see">A payment is already open</span><span>Pay is off until the time the server gives</span></div>
        <div class="orow"><code>pay_outcome_unknown</code><span class="see">The last result is not known</span><span>Pay is off until the given time, or free at once if none is given</span></div>
      </div>
      <p class="claim sm" data-anim>Nothing clicks Pay for the customer. Not an error, not a refresh, not a countdown ending.</p>
    </div>
`
  },
  {
    id: 'gate',
    name: 'Two people can pay. One bank page at a time',
    notes: 'The bars are drawn to scale. The honest caveat is the last row: letting the customer retry after silence means BimeBazar may have opened a page we never heard about. We chose a possible retry over a customer locked out for 17 minutes.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Behind Pay &nbsp;/&nbsp; One order, one gate</div>
      <h2 class="sm" data-anim>Two people can pay. One bank page at a time.</h2>
      <p class="lead sm" data-anim>The seller and the customer share one gate per order. How long it stays shut depends on what came back.</p>
      <div class="spans" data-anim>
        <div class="srow"><span class="sn">Request on its way</span><div class="track"><i class="brief"></i></div><span class="sd"><b>Up to 60 seconds,</b> or BimeBazar's own timeout if that is longer</span></div>
        <div class="srow"><span class="sn">Bank page issued</span><div class="track"><i class="full"></i></div><span class="sd"><b>17 minutes</b> from the moment it is issued, for seller and customer alike</span></div>
        <div class="srow"><span class="sn">No bank page came back</span><div class="track open"></div><span class="sd"><b>Open at once:</b> a timeout, a server error or an answer that does not check out</span></div>
      </div>
      <p class="claim sm" data-anim>Opening the gate allows another try. It does not prove the earlier one failed at BimeBazar.</p>
    </div>
`
  },
  {
    id: 'states',
    name: 'Six words for where an attempt stands',
    notes: 'These are the words support will read on an attempt. Unknown is the one to dwell on: it means the answer was lost, and it is kept as unknown for good unless exact evidence from the bank operation turns up.',
    html: `
    <div class="wrap stack center">
      <div class="eyebrow" data-anim>Behind Pay &nbsp;/&nbsp; What an attempt can be</div>
      <h2 class="sm" data-anim>Six words for where an attempt stands.</h2>
      <div class="states" data-anim>
        <div class="state"><code>initiating</code>Reserved. The request is on its way to BimeBazar</div>
        <div class="state"><code>issued</code>A valid bank address and operation ID are saved. The bank page exists</div>
        <div class="state"><code>paid</code>BimeBazar's paid event was matched to this operation</div>
        <div class="state"><code>failed</code>BimeBazar turned the request down</div>
        <div class="state"><code>expired</code>Its window passed without a payment. A worker sweeps every five minutes</div>
        <div class="state is-key"><code>unknown</code>No answer we could trust came back. It stays unknown until exact evidence arrives</div>
      </div>
      <p class="claim sm" data-anim>Unknown is never quietly turned into failed or expired. We do not guess.</p>
      <p class="support" data-anim>A valid bank address that arrives late still counts as issued, and changes only its own attempt.</p>
    </div>
`
  }
];
