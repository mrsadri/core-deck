/**
 * My Customers, slides 05 to 09.
 */
const CUSTOMERS_SLIDES_PHASE_ONE = [
  {
    id: 'p1-f1',
    name: 'Every order belongs to a customer',
    html: `
    <div class="wrap stack center narrow">
      <div class="eyebrow" data-anim>Problem 01 &nbsp;/&nbsp; F1</div>
      <div class="pnote" data-anim data-d="1"><span><b>Today</b>Work revolves around the order list, not the customer.</span></div>
      <h2 class="sm" data-anim data-d="2">Every order belongs to a customer.</h2>
      <p class="lead sm" data-anim data-d="3">Each order is linked to one customer record, so the panel has someone to organise around.</p>
      <div class="motif-pair" data-anim data-d="4">
        <div class="pair">
          <div class="ta">
            <div class="loose" data-loose="9" data-rows="3"></div>
            <div class="plinth thin"></div>
            <div class="lbl">Orders in a heap</div>
          </div>
          <div class="ta">
            <div class="bond" data-bricks="9" data-courses="3" data-tags="Orders||Customer" data-key="1"></div>
            <div class="plinth thin"></div>
            <div class="lbl">Filed under one record</div>
          </div>
        </div>
      </div>
    </div>
`
  },
  {
    id: 'p2-f2-f3',
    name: 'Find anyone, and see everything about them',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>Problem 02&ndash;03 &nbsp;/&nbsp; F2&ndash;F3</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>Finding a customer takes too long, and once found, their information is scattered.</span></div>
        <h2 class="sm" data-anim data-d="2">Find anyone, and see everything about them.</h2>
        <p class="lead sm" data-anim data-d="3">The customer list searches by name, national ID, phone number and licence plate &mdash; each result opens a comprehensive profile with everything the partner knows about that person.</p>
        <div class="motif-pair" data-anim data-d="4">
          <div class="pair">
            <div class="ta">
              <div class="bond" data-bricks="9" data-courses="3" data-lift="4"></div>
              <div class="plinth thin"></div>
              <div class="lbl">Found</div>
            </div>
            <div class="ta">
              <div class="bond" data-bricks="9" data-courses="3" data-tags="Documents|Policies|Person"></div>
              <div class="plinth thin"></div>
              <div class="lbl">Known</div>
            </div>
          </div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="p2_f2" data-what="The customer list, opening into a customer's full profile"></div></div>
    </div>
`
  },
  {
    id: 'p3-f5',
    name: 'Every policy of each customer in one place',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>Problem 03 &nbsp;/&nbsp; F5</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>A customer's policies and documents are spread across separate orders.</span></div>
        <h2 class="sm" data-anim data-d="2">Every policy of each customer in one place.</h2>
        <p class="lead sm" data-anim data-d="3">All of a customer's policies on the profile, each with its status and a file to download.</p>
        <div class="motif" data-anim data-d="4">
          <div class="bond" data-bricks="12" data-courses="3" data-new="4" data-tags="Policies||"></div>
          <div class="plinth thin"></div>
          <div class="motif-cap">The policies, on one labelled shelf</div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="p3_f5" data-what="The policies list on the customer profile, with status and download"></div></div>
    </div>
`
  },
  {
    id: 'p4-f4',
    name: 'Document management of each customer',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>Problem 04 &nbsp;/&nbsp; F4</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>A customer's documents &mdash; identity, vehicle papers, technical inspection &mdash; aren't filed under the record they belong to.</span></div>
        <h2 class="sm" data-anim data-d="2">Document management of each customer.</h2>
        <p class="lead sm" data-anim data-d="3">Every document for every insured item, filed under the customer and vehicle it belongs to, with the related policies alongside it.</p>
        <div class="motif" data-anim data-d="4">
          <div class="bond" data-bricks="12" data-courses="3" data-tags="Inspection|Vehicle papers|Identity"></div>
          <div class="plinth thin"></div>
          <div class="motif-cap">Every document under its own label</div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="p4_f4" data-what="A vehicle's documents and related policies, filed under the customer"></div></div>
    </div>
`
  },
  {
    id: 'p5-f6',
    name: 'The money, at a glance',
    html: `
    <div class="wrap sol">
      <div class="stack narrow">
        <div class="eyebrow" data-anim>Problem 05 &nbsp;/&nbsp; F6</div>
        <div class="pnote" data-anim data-d="1"><span><b>Today</b>A customer's installment and purchase history is not easy to see.</span></div>
        <h2 class="sm" data-anim data-d="2">The money, at a glance.</h2>
        <p class="lead sm" data-anim data-d="3">A view of the customer's financial status, so what is settled and what is outstanding is readable in a moment.</p>
        <div class="motif" data-anim data-d="4">
          <div class="bond" data-bricks="12" data-courses="3" data-fill="8" data-tags="Outstanding||Settled"></div>
          <div class="plinth thin"></div>
          <div class="motif-cap">Settled below, outstanding above</div>
        </div>
      </div>
      <div data-anim data-d="2"><div class="shot" data-shot="p5_f6" data-what="The financial status view on the customer profile"></div></div>
    </div>
`
  }
];
