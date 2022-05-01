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

const scrap = async (topicId, page = 1, concurrencyLimit = 10) => {
  try {
    const browser = await startBrowser();
    const browserPage = (await browser.pages())[0];

    await browserPage.goto(buildUrl(topicId, page));
    await browserPage.waitForSelector('.text-board');
    let announcementList = await parseTextBoard(browserPage);
    announcementList = announcementList.slice(0, concurrencyLimit);

    await browserPage.close();

    const detailedAnnouncements = announcementList.map(async (announcement) => {
      const newPage = await browser.newPage();
      await newPage.goto(announcement.link);
      await newPage.waitForSelector('.text-view-board');
      const result = await parseAnnouncement(newPage);
      await newPage.close();
      return { id: announcement.id, link: announcement.link, ...result };
    });

    const result = await Promise.all(detailedAnnouncements);
    await browser.close();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = { scrap };
