/**
 * Pay Link, slides 06 to 08: the seller's side. Making the link, sending
 * it, and the path where the seller pays without one.
 *
 * A step slide is a .trio: what the user does, what the system does, what
 * the user gets. The rail above it is drawn by pay/rail.js from data-rail.
 */
const PAY_SLIDES_SELLER = [
  {
    id: 'link',
    name: 'One link, bound to one order and one phone',
    notes: 'The link is useless to anyone but the person holding that phone, which is why the phone is asked for first. We keep a fingerprint of the secret, not the secret, so a leaked database cannot open a link.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 01 &nbsp;/&nbsp; The seller makes a link</div>
      <h2 class="sm" data-anim>One link, bound to one order and one phone.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="1"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The seller does</div><ul class="pts">
          <li>Opens an unpaid body or health order</li>
          <li>Enters the customer's mobile number</li>
          <li>Asks for a payment link</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Asks BimeBazar, fresh, whether the order is payable</li>
          <li>Creates a link tied to <b>this order and this phone</b></li>
          <li>Stores the phone, the seller and a fingerprint of the link's secret. The secret itself is never stored</li>
        </ul></div>
        <div class="col"><div class="ch">The seller gets</div><ul class="pts">
          <li>A URL to copy or to send</li>
          <li>It opens for <b>six hours</b>, then stops</li>
          <li>Only the seller who made it can be shown it again</li>
        </ul></div>
      </div>
      <div class="chips" data-anim>
        <div class="chip"><b>6 hours</b>a link stays open</div>
        <div class="chip"><b>1</b>active link per order</div>
      </div>
      <p class="support" data-anim>Asking twice with the same request returns the same link. A new request replaces the old link, unless that one is being sent or a payment is in progress.</p>
    </div>
`
  },
  {
    id: 'send',
    name: 'Two SMS providers, so the link arrives',
    notes: 'The seller can skip the SMS entirely and paste the URL into any chat. If they do send it, the question to expect is the double SMS: when the first provider does not answer clearly we send through the second, because one message too many beats none.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>Step 02 &nbsp;/&nbsp; The seller sends it</div>
      <h2 class="sm" data-anim>Two SMS providers, so the link arrives.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="2"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The seller does</div><ul class="pts">
          <li>Taps Send, and the customer gets an SMS</li>
          <li>Or copies the URL and shares it any other way</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Checks again that the order is payable</li>
          <li>Tries <b>Armaghan</b> first. Anything short of a clear yes, and it tries <b>Kavenegar</b></li>
          <li>Saves the message, the provider and the result, with an audit entry</li>
        </ul></div>
        <div class="col"><div class="ch">The seller gets</div><ul class="pts">
          <li><b>Accepted:</b> this link cannot be sent again, and the order waits ten minutes before another SMS</li>
          <li><b>Failed or unknown:</b> try again after one minute</li>
          <li>Either way, the link itself still works</li>
        </ul></div>
      </div>
      <div class="chips" data-anim>
        <div class="chip"><b>10 min</b>wait after an accepted SMS</div>
        <div class="chip"><b>1 min</b>wait after a failed one</div>
        <div class="chip"><b>2 min</b>before a stuck send is closed as timed out</div>
      </div>
      <p class="support" data-anim>If the first provider's answer is unclear, the customer may get two messages. That is preferred to getting none.</p>
    </div>
`
  },
  {
    id: 'seller-pay',
    name: 'The seller can still pay it themselves',
    notes: 'Nothing changed for the seller on the surface. Behind it, the seller and the customer now share one gate per order, which slide 14 opens up.',
    html: `
    <div class="wrap stack center step">
      <div class="eyebrow" data-anim>The other path &nbsp;/&nbsp; The seller pays</div>
      <h2 class="sm" data-anim>The seller can still pay it themselves.</h2>
      <div class="rail-row" data-anim><div class="rail" data-rail="6"></div></div>
      <div class="trio" data-anim>
        <div class="col"><div class="ch">The seller does</div><ul class="pts">
          <li>Clicks Pay on the order's invoice, exactly as before</li>
        </ul></div>
        <div class="col sys"><div class="ch">The system does</div><ul class="pts">
          <li>Confirms the seller owns the order</li>
          <li>Records the attempt <b>before</b> anything is sent</li>
          <li>Passes the request to BimeBazar, and the answer back, both unchanged</li>
        </ul></div>
        <div class="col"><div class="ch">The seller gets</div><ul class="pts">
          <li>BimeBazar's own answer, usually a bank page</li>
          <li>Or a wait message, if the customer already has a bank page open for this order</li>
        </ul></div>
      </div>
      <p class="support" data-anim>BimeBazar accepts or rejects the seller's request. Our part is to make sure the order is not at the bank twice.</p>
    </div>
`
  }
];
