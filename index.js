const cron = require('node-cron');
const worker = require('./scraper/worker');
const bot = require('./bot/telegram');
const announcementModel = require('./models/announcements');
const { topics } = require('./utils/topics');
const userModel = require('./models/users');
const translator = require('./utils/translator');
const constant = require('./constants');
const { startBrowser } = require('./scraper/browser');

const translateAndBroadcastAnnouncement = async (browser, announcement, topicId) => {
  console.log(`Translating announcement ${announcement.id}`);

  const users = await userModel.getUserByTopicId(topicId);
  const uniqueLangs = Array.from(new Set(users.map((user) => user.lang)));
  const translated = new Map();

  await Promise.all(uniqueLangs.map(async (lang) => {
    const [[transText, trans1Success], [transTitle, trans2Success]] = await Promise.all([
      translator.translateUnl(browser, announcement.content, lang),
      translator.translateUnl(browser, announcement.title, lang),
    ]);
    translated.set(lang, {
      title: transTitle,
      text: transText,
      success: trans1Success && trans2Success,
    });
  }));

  console.log(`Sending announcement ${announcement.id} to subscribed users`);
  await Promise.all(users.map(async (user) => {
    try {
      const annTitle = translated.get(user.lang).title;
      let annContent = translated.get(user.lang).text;
      let additionalMessage = '';

      // 200 is the length of the header
      if (annContent.length > constant.bot.telegram.maxLength - 200) {
        annContent = 'Announcement is too long to be sent 😥, please check the announcement link.';
      } else if (!translated.get(user.lang).success && user.lang !== 'ko') {
        additionalMessage = 'There was a problem with the translation.\n';
      }

      await bot.sendMessage(
        user.id,
        `<b>${annTitle}</b>\n<a href='${announcement.link}'>Original Link</a>\n${additionalMessage}\n${annContent}`,
        { parse_mode: 'HTML' },
      );
    } catch (error) {
      console.error(error);
    }
  }));
};

const crawlAnnouncement = async () => {
  let translatorBrowser;
  try {
    translatorBrowser = await startBrowser();
  } catch (error) {
    console.error('Failed launching browser');
  }

  console.time('Total Time of Crawling Announcement');

  try {
    const announcementIds = await announcementModel.getAllAnnoucementIds();
    const scrappedIds = new Set(announcementIds.map((ann) => ann.announcementId));
    await Promise.all(topics.map(async ([id, topic]) => {
      console.log(`Scraping undergraduate announcement of ${topic}`);

      let result;
      if (id > 900) {
        result = await worker.scrap(
          constant.scraper.graduate.topics[id].apiUrl,
          scrappedIds,
          true,
          10,
        );
      } else {
        result = await worker.scrap(worker.buildUgradApiUrl(id), scrappedIds, false, 10);
      }

      await Promise.all(result.map(async (announcement) => {
        console.log(`New announcement found, id: ${announcement.id}`);
        try {
          await announcementModel.addAnnouncement(
            announcement.id,
            announcement.title,
            announcement.link,
            id,
          );
        } catch (err) {
          console.error(err);
        }

        await translateAndBroadcastAnnouncement(translatorBrowser, announcement, id);
      }));
    }));
  } catch (error) {
    console.error(error);
  } finally {
    await translatorBrowser.close();
  }

  console.timeEnd('Total Time of Crawling Announcement');
};

crawlAnnouncement();

// schedule task to run periodically
cron.schedule(`*/${constant.system.crawlInterval} * * * *`, async () => {
  await crawlAnnouncement();
});
