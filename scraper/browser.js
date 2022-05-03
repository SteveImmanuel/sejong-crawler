const puppeteer = require('puppeteer');

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox', '--no-sandbox'],
    ignoreHTTPSErrors: true,
  });

  return browser;
};

module.exports = {
  startBrowser,
};
