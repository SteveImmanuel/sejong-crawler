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
        console.log(announcement);
        await announcementModel.addAnnouncement(
          announcement.id,
          announcement.title,
          announcement.link,
          announcement.date,
          announcement.writer,
        );

        console.log(`Translating announcement ${announcement.id}`);
        const [translatedText, success] = await translator.translate(announcement.content);
        const users = await userModel.getAllSubscribedUsers();

        console.log(`Sending announcement ${announcement.id} to subscribed users`);
        await Promise.all(users.map(async (user) => {
          try {
            await bot.sendMessage(user.id, translatedText);
            let additionalMessage = '';
            if (!success) {
              additionalMessage = 'There was a problem with the translation.\n';
            }
            bot.sendMessage(
              user.id,
              `${additionalMessage}Original Announcement: <a href='${announcement.link}'>Tap here</a>`,
              { parse_mode: 'HTML' },
            );
          } catch (error) {
            console.error(error);
          }
        }));
      }
    }));
  }

  console.timeEnd('Total Time of Crawling Announcement');
};

// cron.schedule('*/20 * * * * *', async () => {
//   await crawlAnnouncement();
// });

const test = async () => {
  // const users = await userModel.getAllSubscribedUsers();
  // console.log(users);
  // await Promise.all(users.map(async (user) => {

  //   const additionalMessage = 'There was a problem with the translation.\n';
  //   bot.sendMessage(
  //     user.id,
  //     `${additionalMessage}Original Announcement: <a href='https://google.com'>Tap here</a>`,
  //     { parse_mode: 'HTML' },
  //   );
  // }));

  // const result = await worker.scrap(333);
  // await Promise.all(result.map(async (announcement) => {
  //   const saved = await announcementModel.getAnnouncementById(announcement.id);
  //   if (!saved) {
  //     await announcementModel.addAnnouncement(
  //       announcement.id,
  //       announcement.title,
  //       announcement.link,
  //       announcement.date,
  //       announcement.writer,
  //     );

  //     const translatedText = await translator.translate(announcement.content);
  //     const users = await userModel.getAllSubscribedUsers();

  //     await Promise.all(users.map(async (user) => {
  //       await bot.sendMessage(user.id, translatedText);
  //       bot.sendMessage(
  //         user.id,
  //         `Original Announcement: <a href='${announcement.link}'>Tap here</a>`,
  //         { parse_mode: 'HTML' },
  //       );
  //     }));
  //   }
  // }));
  await crawlAnnouncement();
};

test();
