const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR:', err.stack || err.message);
  });
  page.on('console', (msg) => {
    console.log('BROWSER LOG:', msg.type(), msg.text());
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
