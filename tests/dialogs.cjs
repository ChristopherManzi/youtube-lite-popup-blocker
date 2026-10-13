const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../extension');
const script = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'content.css'), 'utf8');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.TEST_BROWSER_PATH ? { executablePath: process.env.TEST_BROWSER_PATH } : {}) });
  try {
    const page = await browser.newPage();
    await page.setContent('<style>tp-yt-paper-dialog, tp-yt-iron-overlay-backdrop {display:block}</style><main>YouTube fixture</main>');
    await page.addStyleTag({ content: css });
    await page.addScriptTag({ content: script });
    async function insert(html) {
      await page.evaluate(html => { document.querySelector('main').innerHTML = html; }, html);
    }
    async function hidden(id) {
      await page.waitForFunction(id => getComputedStyle(document.getElementById(id)).display === 'none', id);
    }
    await insert('<tp-yt-iron-overlay-backdrop id="backdrop" opened></tp-yt-iron-overlay-backdrop><tp-yt-paper-dialog id="upgrade" opened><h2>Noch bessere Qualität&nbsp;– mit Premium</h2><button>Premium kaufen</button></tp-yt-paper-dialog>');
    await hidden('upgrade');
    await hidden('backdrop');
    assert.equal(await page.locator('#upgrade').getAttribute('data-yt-lite-blocked'), 'true');
    console.log('PASS: supplied title and fallback backdrop hidden');

    await page.evaluate(() => { document.getElementById('upgrade').innerHTML = '<h2>Video melden</h2><button>Melden</button>'; });
    await page.waitForFunction(() => !document.getElementById('upgrade').hasAttribute('data-yt-lite-blocked'));
    assert.notEqual(await page.locator('#backdrop').evaluate(el => getComputedStyle(el).display), 'none');
    console.log('PASS: reused dialog and backdrop restored for unrelated content');

    await insert('<tp-yt-paper-dialog id="upgrade" opened><div role="dialog">Noch bessere Qualität – mit Premium<button aria-label="Schließen">X</button></div></tp-yt-paper-dialog>');
    await page.evaluate(() => {
      const dialog = document.getElementById('upgrade');
      // Reopen after attaching the fixture handler.
      dialog.removeAttribute('opened');
      dialog.querySelector('button').onclick = () => { window.closeClicks = (window.closeClicks || 0) + 1; dialog.removeAttribute('opened'); dialog.style.display = 'none'; };
    });
    await page.evaluate(() => { const d = document.getElementById('upgrade'); d.style.display = ''; d.setAttribute('opened', ''); });
    await page.waitForFunction(() => window.closeClicks === 1);
    console.log('PASS: nested dialog dismissed through its close button');

    await insert('<tp-yt-iron-overlay-backdrop id="backdrop" opened></tp-yt-iron-overlay-backdrop><section role="dialog" id="upgrade">Noch bessere Qualität – mit Premium</section><section role="dialog" id="report">Video melden</section>');
    await hidden('upgrade');
    assert.notEqual(await page.locator('#report').evaluate(el => getComputedStyle(el).display), 'none');
    assert.notEqual(await page.locator('#backdrop').evaluate(el => getComputedStyle(el).display), 'none');
    console.log('PASS: simultaneous unrelated dialog keeps backdrop');

    await insert('<section role="dialog" id="upgrade"><img src="https://gstatic.com/youtube/img/unlimited/ytu_mobile_premium_logo_short_dark_193x40.png">Videos für Offlinewiedergabe herunterladen Videos im Hintergrund abspielen</section>');
    await hidden('upgrade');
    console.log('PASS: logo and benefit detection');
    await insert('<section role="dialog" id="account">YouTube Premium Lite verwalten</section><article>Noch bessere Qualität – mit Premium</article>');
    assert.equal(await page.locator('[data-yt-lite-blocked]').count(), 0);
    console.log('PASS: account dialog and non-dialog page text unaffected');

    await insert('<dialog id="upgrade">Noch bessere Qualität – mit Premium</dialog>');
    await page.evaluate(() => document.getElementById('upgrade').showModal());
    await page.waitForFunction(() => !document.getElementById('upgrade').open);
    console.log('PASS: native modal closed');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
