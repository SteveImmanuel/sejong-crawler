const cron = require('node-cron');
const worker = require('./scraper/worker');
const bot = require('./bot/telegram');
const announcementModel = require('./models/announcements');
const userModel = require('./models/users');
const translator = require('./utils/translator');
const constant = require('./constants');

const crawlAnnouncement = async () => {
  console.time('Total Time of Crawling Announcement');

  const topics = Object.entries(constant.scraper.topics);
  for (let i = 0; i < topics.length; i += 1) {
    const [key, value] = topics[i];
    console.log(`Scraping announcement of ${value}`);

    // eslint-disable-next-line no-await-in-loop
    const result = await worker.scrap(key);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(result.map(async (announcement) => {
      const saved = await announcementModel.getAnnouncementById(announcement.id);
      if (!saved) {
        console.log(`New announcement found, id: ${announcement.id}`);
        try {
          await announcementModel.addAnnouncement(
            announcement.id,
            announcement.title,
            announcement.link,
            announcement.date,
            announcement.writer,
          );
        } catch (err) {
          console.error(err);
        }

        console.log(`Translating announcement ${announcement.id}`);
        const [[transText, trans1Success], [transTitle, trans2Success]] = await Promise.all([
          translator.translate(announcement.content),
          translator.translate(announcement.title),
        ]);
        const users = await userModel.getAllSubscribedUsers();

        console.log(`Sending announcement ${announcement.id} to subscribed users`);
        await Promise.all(users.map(async (user) => {
          try {
            let announcementContent = transText;
            if (transText.length > constant.bot.telegram.maxLength) {
              announcementContent = 'Announcement is too long to be sent 😥, please check the announcement link.';
            }

            let additionalMessage = '';
            if (!trans1Success || !trans2Success) {
              additionalMessage = 'There was a problem with the translation.\n';
            }
            await bot.sendMessage(
              user.id,
              `Title: <b>${transTitle}</b>\nOriginal Announcement: <a href='${announcement.link}'>Tap here</a>\n${additionalMessage}`,
              { parse_mode: 'HTML' },
            );
            await bot.sendMessage(user.id, announcementContent);
          } catch (error) {
            console.error(error);
          }
        }));
      }
    }));
  }

  console.timeEnd('Total Time of Crawling Announcement');
};

// schedule task to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  await crawlAnnouncement();
});
