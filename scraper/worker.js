const { startBrowser } = require('./browser');
const { parseTextBoard, parseAnnouncement } = require('./parser');
const constant = require('../constants');

const buildUrl = (topicId, page = 1) => {
  const { apiUrl } = constant.scraper;
  const params = new URLSearchParams({
    bbsConfigFK: topicId,
    currentPage: page,
  });

  return `${apiUrl}?${params.toString()}`;
};

const scrap = async (topicId, page = 1) => {
  const browser = await startBrowser();
  const browserPage = await browser.newPage();

  await browserPage.goto(buildUrl(topicId, page));
  await browserPage.waitForSelector('.text-board');
  const annoucementList = await parseTextBoard(browserPage);

  await browserPage.goto(annoucementList[0].link);
  await browserPage.waitForSelector('.text-view-board');
  const announcement = await parseAnnouncement(browserPage);
  console.log(announcement);
};

module.exports = { scrap };
