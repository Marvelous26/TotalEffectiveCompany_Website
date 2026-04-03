const puppeteer = require('puppeteer');
const path = require('path');

const FILE = path.resolve(__dirname, 'test-option3.html');
const URL  = 'file:///' + FILE.replace(/\\/g, '/');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // Force all animated elements to their final visible state
  await page.addStyleTag({
    content: `
      .reveal { opacity: 1 !important; transform: none !important; }
      .hero-logo, .hero-content h1, .hero-rule, .hero-tagline,
      .hero-location, .hero-btns, .hero-stats {
        animation-delay: 0s !important;
        animation-duration: 0.01s !important;
        opacity: 1 !important;
        transform: none !important;
      }
      #hero::before { animation-duration: 0.01s !important; }
    `
  });

  await page.waitForNetworkIdle({ idleTime: 600 }).catch(() => {});
  await page.screenshot({ path: 'screenshots/test-option3-desktop.png', fullPage: false });
  console.log('done');
  await browser.close();
})();
