const { startBrowser } = require('./browser');
const {
  parseTextBoard, parseAnnouncement, parseBoardTable, parseGraduateAnnouncement,
} = require('./parser');
const constant = require('../constants');

const buildUgradApiUrl = (topicId, page = 1) => {
  const { apiUrl } = constant.scraper.general;
  const params = new URLSearchParams({
    bbsConfigFK: topicId,
    currentPage: page,
  });

  return `${apiUrl}?${params.toString()}`;
};

const scrap = async (apiUrl, scrappedIds, concurrencyLimit = 10, isGraduate = false) => {
  let browser;
  let result;

  try {
    browser = await startBrowser();
  } catch (error) {
    console.error('Failed launching browser');
    return [];
  }

  let parseMainPage;
  let parseDetailAnnouncement;
  if (isGraduate) {
    parseMainPage = parseBoardTable;
    parseDetailAnnouncement = parseGraduateAnnouncement;
  } else {
    parseMainPage = parseTextBoard;
    parseDetailAnnouncement = parseAnnouncement;
  }

  try {
    const browserPage = (await browser.pages())[0];

    await browserPage.goto(apiUrl);
    let announcementList = await parseMainPage(browserPage);
    announcementList = announcementList.filter((ann) => !scrappedIds.has(ann.id));
    announcementList = announcementList.slice(0, concurrencyLimit);
    await browserPage.close();

    const detailedAnnouncements = announcementList.map(async (announcement) => {
      const newPage = await browser.newPage();
      const parsedAnnouncement = await parseDetailAnnouncement(newPage, announcement);
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

// scrap(constant.scraper.graduate.apiUrl.information, new Set(), 10, true);
scrap(buildUgradApiUrl(335), new Set(), 10, false);

module.exports = { scrap, buildUgradApiUrl };
