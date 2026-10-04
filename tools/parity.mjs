/**
 * Per-slide parity harness.
 *
 * Proves that a refactor changed structure without changing output. For every
 * slide of every deck, at every viewport, it records four fingerprints:
 *
 *   pixels  SHA-256 of the settled screenshot   layout, colour, type, geometry
 *   text    the slide's rendered innerText      slide copy and slide order
 *   anims   --d and transition-delay per item   the enter animation
 *   motifs  per-brick geometry and reveal index arch builds and brick order
 *
 * The last three are read after scripting settles and are time independent,
 * so they are exact rather than sampled. Pixels are captured over the same
 * CDP connection used for the probe: real images and fonts are waited on
 * explicitly through a readiness promise evaluated in the page, rather than
 * inferred from a timing budget, because a fixed budget raced with image
 * decode under load and produced a different settled frame from run to run
 * on slides that carry a real photo or screenshot.
 *
 * Usage:
 *   node tools/parity.mjs record    write tools/baseline/
 *   node tools/parity.mjs check     compare against tools/baseline/
 *   node tools/parity.mjs frames    determinism probe for mid-animation frames
 *
 * No dependencies. Node's built in fetch and WebSocket drive the Chrome that
 * is already installed.
 */

import { createHash } from 'node:crypto';
import { execFile, spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_DIR = join(SITE_ROOT, 'tools', 'baseline');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * Flags that make two runs of the same page produce the same bytes. Software
 * rendering, a fixed colour profile and grayscale antialiasing remove the
 * machine dependent parts of text rasterisation; an isolated profile keeps one
 * capture's disk cache from changing the next capture's image decode timing.
 *
 * The background service flags stop a fresh profile from launching Google
 * Update's wake-all cycle on first run. That cycle reaches out to Google's
 * update servers, and on a machine with no route to them it hangs for a long
 * time, which otherwise leaves the --screenshot process sitting well past
 * its virtual time budget even though the screenshot itself was written.
 */
const DETERMINISM_FLAGS = [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--force-color-profile=srgb',
  '--disable-lcd-text',
  '--disable-font-subpixel-positioning',
  '--disable-partial-raster',
  '--disable-skia-runtime-opts',
  '--run-all-compositor-stages-before-draw',
  '--disable-new-content-rendering-timeout',
  '--disable-image-animation-resync',
  '--disable-background-timer-throttling',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-domain-reliability',
  '--disable-sync',
  '--disable-client-side-phishing-detection',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--metrics-recording-only'
];

/** The decks under test, and how many slides each one has. */
const DECKS = [
  { name: 'core', page: 'index.html', slides: 19 },
  { name: 'customers', page: 'customers/index.html', slides: 14 }
];

/** Viewports chosen to exercise every breakpoint in the stylesheets. */
const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 }
];

/**
 * Real wall clock milliseconds, long enough for everything time dependent to
 * reach its end state after navigation. SHORT comfortably clears the enter
 * animation and every brick reveal, whose slowest observed transition
 * finishes under 1.2s. LONG additionally clears the title hint's 6s fade,
 * which does not start until 2.4s after the slide becomes active; stopping
 * mid fade would sample a moving opacity. Only slide 1 of each deck carries
 * that hint. These are fixed margins rather than measured waits because they
 * only have to be safely past the slowest known transition they cover.
 */
const SETTLE_MARGIN_SHORT_MS = 1800;
const SETTLE_MARGIN_LONG_MS = 9000;

/**
 * A promise, evaluated in the page, that resolves once every image has
 * either decoded or failed and every font face has loaded. Real images and
 * fonts decode on their own schedule, off the page's own timers, so nothing
 * about the enter animation's timing implies they are ready: this is the
 * only way to know for certain before a screenshot is taken.
 */
const IMAGES_READY_EXPRESSION = `Promise.all([
  document.fonts.ready,
  ...[...document.images].map(img => img.decode().catch(() => {}))
])`;

const slideUrl = (page, slide) => `${pathToFileURL(join(SITE_ROOT, page)).href}#${slide}`;

const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');

/**
 * Polls a file on disk until its size stops changing. Used only by the mid
 * animation frame probe below, whose native `--screenshot` process does not
 * reliably exit on its own even after writing the file.
 */
async function waitForStableFile(path, { intervalMs = 50, stableChecks = 2, timeoutMs = 20000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastSize = -1;
  let stableCount = 0;
  while (Date.now() < deadline) {
    const size = existsSync(path) ? (await readFile(path)).length : -1;
    if (size > 0 && size === lastSize) {
      stableCount++;
      if (stableCount >= stableChecks) return;
    } else {
      stableCount = 0;
    }
    lastSize = size;
    await new Promise(res => setTimeout(res, intervalMs));
  }
  throw new Error(`timed out waiting for ${path} to settle`);
}

/* ------------------------------------------------------------------ *
 * DOM probe and pixels: one Chrome per viewport, reused across that
 * deck's slides. The same CDP connection drives both.
 * ------------------------------------------------------------------ */

/** What the probe reads out of a settled page. Runs inside the browser. */
const PROBE_EXPRESSION = `(() => {
  const active = document.querySelector('.slide.is-active');
  if (!active) return JSON.stringify({ error: 'no active slide' });
  const describe = el => {
    const computed = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      d: computed.getPropertyValue('--d').trim(),
      delay: computed.transitionDelay,
      fontSize: computed.fontSize,
      maxWidth: computed.maxWidth,
      width: computed.width,
      marginTop: computed.marginTop,
      textAlign: computed.textAlign
    };
  };
  const brick = el => {
    const face = el.querySelector('i');
    return {
      cls: el.className,
      i: getComputedStyle(el).getPropertyValue('--i').trim(),
      transform: el.style.transform,
      width: el.style.width,
      height: el.style.height,
      left: el.style.left,
      top: el.style.top,
      faceHeight: face ? face.style.height : '',
      faceTop: face ? face.style.top : ''
    };
  };
  return JSON.stringify({
    text: active.innerText,
    counter: (document.getElementById('cNow') || {}).textContent + ' ' +
             (document.getElementById('cAll') || {}).textContent,
    ticksOn: document.querySelectorAll('#ticks b.on').length,
    anims: [...active.querySelectorAll('[data-anim]')].map(describe),
    motifs: [...active.querySelectorAll('.vsr, .lb')].map(brick),
    photos: [...active.querySelectorAll('.niche img')].map(el => {
      const computed = getComputedStyle(el);
      return {
        src: el.getAttribute('src'),
        alt: el.alt,
        cls: el.className,
        objectPosition: computed.objectPosition,
        transform: computed.transform,
        width: computed.width,
        height: computed.height
      };
    })
  });
})()`;

class Browser {
  #ws;
  #nextId = 0;
  #pending = new Map();
  #process;
  #profileDir;

  static async launch(viewport) {
    const browser = new Browser();
    await browser.#start(viewport);
    return browser;
  }

  async #start(viewport) {
    const port = 9400 + Math.floor(Math.random() * 500);
    this.#profileDir = await mkdtemp(join(tmpdir(), 'parity-profile-'));
    this.#process = execFile(CHROME, [
      ...DETERMINISM_FLAGS,
      `--window-size=${viewport.width},${viewport.height}`,
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${this.#profileDir}`,
      'about:blank'
    ]);

    const target = await this.#waitForTarget(port);
    this.#ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      this.#ws.onopen = res;
      this.#ws.onerror = rej;
    });
    this.#ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id && this.#pending.has(message.id)) {
        this.#pending.get(message.id)(message);
        this.#pending.delete(message.id);
      }
    };
    await this.send('Page.enable');
    await this.send('Runtime.enable');
  }

  async #waitForTarget(port) {
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
        if (response.ok) return await response.json();
      } catch {
        // Chrome has not opened the port yet.
      }
      await new Promise(res => setTimeout(res, 200));
    }
    throw new Error('Chrome did not expose a debugging target');
  }

  /**
   * A CDP call that never responds would otherwise hang this forever: Chrome
   * gives no signal that it has stalled, so nothing else can tell the
   * difference between "about to resolve" and "never going to". The timeout
   * is the only backstop, and it is long enough to never fire on a call that
   * was always going to complete.
   */
  send(method, params = {}, timeoutMs = 15000) {
    const id = ++this.#nextId;
    return new Promise((res, rej) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        rej(new Error(`${method} did not respond within ${timeoutMs}ms`));
      }, timeoutMs);
      this.#pending.set(id, message => {
        clearTimeout(timer);
        res(message.result);
      });
      this.#ws.send(JSON.stringify({ id, method, params }));
    });
  }

  /** Full reload, so the deck re-reads the hash. A bare hash change would not. */
  async open(url) {
    await this.send('Page.navigate', { url: 'about:blank' });
    await new Promise(res => setTimeout(res, 60));
    await this.send('Page.navigate', { url });
    await new Promise(res => setTimeout(res, 900));
  }

  async probe() {
    const result = await this.send('Runtime.evaluate', {
      expression: PROBE_EXPRESSION,
      returnByValue: true
    });
    if (!result || !result.result || typeof result.result.value !== 'string') {
      throw new Error('probe returned nothing');
    }
    return JSON.parse(result.result.value);
  }

  /**
   * Waits out a settle margin, then waits on an explicit readiness promise
   * for every image and font before asking Chrome for a PNG over CDP. The
   * margin covers the enter animation and, for slide 1, the title hint's
   * fade; the promise covers real image decode, which runs on its own
   * schedule and is not implied by anything about the page's own timers
   * having settled.
   */
  async screenshot(slide) {
    const margin = slide === 1 ? SETTLE_MARGIN_LONG_MS : SETTLE_MARGIN_SHORT_MS;
    await new Promise(res => setTimeout(res, margin));
    await this.send('Runtime.evaluate', {
      expression: IMAGES_READY_EXPRESSION,
      awaitPromise: true
    });
    const result = await this.send('Page.captureScreenshot', { format: 'png' });
    if (!result || typeof result.data !== 'string') {
      throw new Error('screenshot returned nothing');
    }
    return Buffer.from(result.data, 'base64');
  }

  async close() {
    try { this.#ws.close(); } catch { /* already gone */ }
    try { this.#process.kill(); } catch { /* already gone */ }
    await rm(this.#profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

/* ------------------------------------------------------------------ *
 * Recording
 * ------------------------------------------------------------------ */

async function recordDeckAtViewport(deck, viewport) {
  const browser = await Browser.launch(viewport);
  const slides = [];
  try {
    for (let slide = 1; slide <= deck.slides; slide++) {
      await browser.open(slideUrl(deck.page, slide));
      const probed = await browser.probe();
      const pixels = sha256(await browser.screenshot(slide));
      slides.push({ slide, pixels, ...probed });
      process.stdout.write('.');
    }
  } finally {
    await browser.close();
  }
  return slides;
}

async function record() {
  await mkdir(BASELINE_DIR, { recursive: true });
  for (const deck of DECKS) {
    for (const viewport of VIEWPORTS) {
      process.stdout.write(`recording ${deck.name} at ${viewport.name} `);
      const slides = await recordDeckAtViewport(deck, viewport);
      const file = join(BASELINE_DIR, `${deck.name}-${viewport.name}.json`);
      await writeFile(file, JSON.stringify({ deck: deck.name, viewport: viewport.name, slides }, null, 2) + '\n');
      process.stdout.write(' ok\n');
    }
  }
  console.log(`\nbaseline written to tools/baseline/`);
}

/* ------------------------------------------------------------------ *
 * Checking
 * ------------------------------------------------------------------ */

const FINGERPRINTS = ['pixels', 'text', 'anims', 'motifs', 'photos'];

function compareSlide(before, after) {
  const changed = [];
  for (const key of FINGERPRINTS) {
    const a = JSON.stringify(before[key]);
    const b = JSON.stringify(after[key]);
    if (a !== b) changed.push(key);
  }
  if (before.counter !== after.counter) changed.push('counter');
  if (before.ticksOn !== after.ticksOn) changed.push('ticks');
  return changed;
}

async function check() {
  if (!existsSync(BASELINE_DIR) || (await readdir(BASELINE_DIR)).length === 0) {
    console.error('no baseline recorded. run: node tools/parity.mjs record');
    process.exit(2);
  }

  const failures = [];
  let pairs = 0;

  for (const deck of DECKS) {
    for (const viewport of VIEWPORTS) {
      const file = join(BASELINE_DIR, `${deck.name}-${viewport.name}.json`);
      const baseline = JSON.parse(await readFile(file, 'utf8'));
      process.stdout.write(`checking ${deck.name} at ${viewport.name} `);
      const current = await recordDeckAtViewport(deck, viewport);

      for (const after of current) {
        pairs++;
        const before = baseline.slides.find(s => s.slide === after.slide);
        const changed = compareSlide(before, after);
        if (changed.length) {
          failures.push({ deck: deck.name, viewport: viewport.name, slide: after.slide, changed, before, after });
        }
      }
      process.stdout.write(failures.length ? ' DIFF\n' : ' ok\n');
    }
  }

  report(pairs, failures);
  process.exit(failures.length ? 1 : 0);
}

function report(pairs, failures) {
  console.log(`\n${'='.repeat(64)}`);
  console.log(`parity: ${pairs - failures.length}/${pairs} slide-viewport pairs identical`);
  console.log('='.repeat(64));

  if (!failures.length) {
    console.log('every slide matches the baseline on pixels, text, animation and motif geometry.');
    return;
  }

  for (const failure of failures) {
    console.log(`\nFAIL ${failure.deck} slide ${failure.slide} at ${failure.viewport}`);
    console.log(`  differs in: ${failure.changed.join(', ')}`);
    if (failure.changed.includes('text')) {
      console.log(`  before: ${JSON.stringify(failure.before.text).slice(0, 160)}`);
      console.log(`  after:  ${JSON.stringify(failure.after.text).slice(0, 160)}`);
    }
    for (const key of ['anims', 'motifs', 'photos']) {
      if (!failure.changed.includes(key)) continue;
      const before = failure.before[key];
      const after = failure.after[key];
      if (before.length !== after.length) {
        console.log(`  ${key}: ${before.length} before, ${after.length} after`);
        continue;
      }
      const first = before.findIndex((item, i) => JSON.stringify(item) !== JSON.stringify(after[i]));
      console.log(`  ${key}[${first}] before: ${JSON.stringify(before[first])}`);
      console.log(`  ${key}[${first}] after:  ${JSON.stringify(after[first])}`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Mid-animation determinism probe
 * ------------------------------------------------------------------ *
 * Settled frames are byte identical between runs. Frames captured partway
 * through the enter animation are only useful as a gate if they are too, so
 * this measures that before any claim is made about animation timing.
 */

async function frames() {
  const budgets = [250, 500, 900];
  const viewport = VIEWPORTS[0];
  const shotDir = await mkdtemp(join(tmpdir(), 'parity-frames-'));
  console.log('mid-animation frame determinism, core slide 1 at 1440x900\n');

  try {
    for (const budget of budgets) {
      const hashes = [];
      for (const pass of ['a', 'b']) {
        const file = join(shotDir, `f-${budget}-${pass}.png`);
        const profileDir = await mkdtemp(join(tmpdir(), 'parity-frame-'));
        const child = spawn(CHROME, [
          ...DETERMINISM_FLAGS,
          `--user-data-dir=${profileDir}`,
          `--window-size=${viewport.width},${viewport.height}`,
          `--virtual-time-budget=${budget}`,
          `--screenshot=${file}`,
          slideUrl('index.html', 1)
        ], { stdio: 'ignore' });
        child.on('error', () => {});
        await waitForStableFile(file).catch(() => {});
        try { child.kill('SIGKILL'); } catch { /* already gone */ }
        await rm(profileDir, { recursive: true, force: true }).catch(() => {});
        hashes.push(sha256(await readFile(file)));
      }
      const stable = hashes[0] === hashes[1];
      console.log(`  ${String(budget).padStart(4)}ms  ${stable ? 'deterministic' : 'NOT deterministic'}  ${hashes[0].slice(0, 16)}`);
    }
  } finally {
    await rm(shotDir, { recursive: true, force: true });
  }
}

/* ------------------------------------------------------------------ */

const command = process.argv[2];
if (command === 'record') await record();
else if (command === 'check') await check();
else if (command === 'frames') await frames();
else {
  console.error('usage: node tools/parity.mjs record|check|frames');
  process.exit(2);
}
