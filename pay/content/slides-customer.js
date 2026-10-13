/**
 * Pay Link, slides 09 to 11: the customer's side, up to the invoice.
 * Opening the link, proving the phone, reading what is owed.
 */
const PAY_SLIDES_CUSTOMER = [
  {
    id: 'open',
    name: 'The first screen shows almost nothing',
    notes: 'A link can be forwarded, so opening it proves nothing about who is holding it. The page shows just enough for the customer to recognise who sent it.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 03 &nbsp;/&nbsp; The customer opens the link</div>
      <h2 class="sm" data-anim>The first screen shows almost nothing.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="3"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The customer does</div><ul class="pts">
          <li>Taps the link, from the SMS or wherever the seller shared it</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Checks the link is still active and less than six hours old</li>
          <li>Returns <b>three things only:</b> the phone the link is bound to, the agent's name, and when it expires</li>
        </ul></div>
        <div class="col"><div class="ch">The customer gets</div><ul class="pts">
          <li>A page saying who sent the link</li>
          <li>If the agent has no name on file, the seller's phone number, masked</li>
          <li><b>No invoice yet,</b> and nothing of the seller's account</li>
        </ul></div>
      </div>
      <p class="support" data-anim>A link older than six hours stops here, even if its record still reads active.</p>
    </div>
`
  },
  {
    id: 'code',
    name: 'A code, sent to the phone the seller typed',
    notes: 'The pass is the thing to explain: it is what lets the customer read the invoice and pay without typing a code again, and it is short on purpose. If Redis is down nobody gets in, which is the safe way to fail.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 04 &nbsp;/&nbsp; The customer proves the phone</div>
      <h2 class="sm" data-anim>A code, sent to the phone the seller typed.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="4"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The customer does</div><ul class="pts">
          <li>Enters the exact phone number the link is bound to</li>
          <li>Receives a code by SMS and types it in</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Logs the request: link, phone, IP address and browser</li>
          <li>Sends the code through the same two providers. Only a fingerprint of it is kept, in Redis, never in the database</li>
          <li>On the right code: records the time, counts the link as opened once, and issues <b>a pass</b> for this link</li>
        </ul></div>
        <div class="col"><div class="ch">The customer gets</div><ul class="pts">
          <li>Into the invoice</li>
          <li>The pass lasts <b>fifteen minutes</b> at most, and never past the link's own expiry</li>
        </ul></div>
      </div>
      <div class="chips" data-anim>
        <div class="chip"><b>2 min</b>a code is valid, and before a resend</div>
        <div class="chip"><b>5</b>requests per phone, per hour</div>
        <div class="chip"><b>20</b>per IP, per ten minutes</div>
        <div class="chip"><b>5</b>wrong tries end the code</div>
      </div>
      <p class="support" data-anim>If the provider did not accept the SMS, that code cannot be used. If Redis is down, nobody gets in.</p>
    </div>
`
  },
  {
    id: 'invoice',
    name: 'The amount comes live from BimeBazar',
    notes: 'The quote is a signed note saying this link, this order, this amount, until this time. It is how we know at Pay that the customer is paying the number they were shown.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 05 &nbsp;/&nbsp; The customer reads the invoice</div>
      <h2 class="sm" data-anim>The amount comes live from BimeBazar.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="5"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The customer does</div><ul class="pts">
          <li>Lands on the invoice, or refreshes it</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Checks the pass, and that the order is still payable</li>
          <li>Reads the invoice and the payable amount from BimeBazar, <b>now</b></li>
          <li>Signs <b>a quote</b> that ties this link and this order to this amount</li>
        </ul></div>
        <div class="col"><div class="ch">The customer gets</div><ul class="pts">
          <li>The full invoice, and the amount to pay</li>
          <li>A quote, which the page holds for the Pay click</li>
          <li>On a refresh: the current amount, and a new quote</li>
        </ul></div>
      </div>
      <div class="chips" data-anim>
        <div class="chip"><b>2 min</b>a quote is good for, at most</div>
        <div class="chip"><b>15 min</b>the pass behind it, at most</div>
      </div>
      <p class="support" data-anim>A quote never outlives the pass or the link it was made for.</p>
    </div>
`
  }
];
