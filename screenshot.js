const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const FILE = path.resolve(__dirname, 'index.html');
const URL  = 'file:///' + FILE.replace(/\\/g, '/');

const VIEWPORTS = [
  { name: 'desktop',  width: 1440, height: 900  },
  { name: 'tablet',   width: 768,  height: 1024 },
  { name: 'mobile',   width: 375,  height: 812  },
];

const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Inject AFTER navigation so styles survive the page load
    await page.addStyleTag({
      content: `*, *::before, *::after { transition: none !important; animation: none !important; }
                .reveal { opacity: 1 !important; transform: none !important; }`
    });

    // Wait for Google Fonts to load
    await page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});

    const outFile = path.join(OUT_DIR, `tec-${vp.name}-${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: outFile, fullPage: true });
    console.log(`✓  ${vp.name.padEnd(8)} → screenshots/tec-${vp.name}-${vp.width}x${vp.height}.png`);
  }

  await browser.close();
  console.log('\nDone! All screenshots saved to /screenshots');
})();
