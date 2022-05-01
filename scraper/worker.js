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
  const browserPage = (await browser.pages())[0];

  await browserPage.goto(buildUrl(topicId, page));
  await browserPage.waitForSelector('.text-board');
  const announcementList = await parseTextBoard(browserPage);

  await browserPage.close();

  const detailedAnnouncements = announcementList.map(async (announcement) => {
    const newPage = await browser.newPage();
    await newPage.goto(announcement.link);
    await newPage.waitForSelector('.text-view-board');
    const result = await parseAnnouncement(newPage);
    await newPage.close();
    return result;
  });

  const result = await Promise.all(detailedAnnouncements);
  await browser.close();
  return result;
};

module.exports = { scrap };
