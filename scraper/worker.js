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
  let browser;
  let result;

  try {
    browser = await startBrowser();
  } catch (error) {
    console.error('Failed launching browser');
    return [];
  }

  try {
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
      const parsedAnnouncement = await parseAnnouncement(newPage);
      await newPage.close();
      return parsedAnnouncement;
    });

    result = await Promise.all(detailedAnnouncements);
    result = result.filter((value, index, self) => {
      const duplicateIndex = self.findIndex((t) => (t.id === value.id));
      return index === duplicateIndex;
    });
  } catch (error) {
    console.error(error);
    result = [];
  } finally {
    await browser.close();
  }

  return result;
};

module.exports = { scrap };
