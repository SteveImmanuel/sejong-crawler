module.exports = {
  scraper: {
    general: {
      apiUrl: 'https://board.sejong.ac.kr/boardlist.do',
      topics: {
        333: 'General Notice (공지)',
        334: 'Admission (입학)',
        335: 'Bachelor (학사)',
        674: 'International Exchange (국제교류)',
        337: 'Employment (취업)',
        338: 'Scholarship (장학)',
        339: 'School Recruitment (교네모집)',
      },
    },
    graduate: {
      apiUrl: {
        information: 'https://graduate.sejong.ac.kr/graduate/information/notice.do',
        others: 'https://graduate.sejong.ac.kr/graduate/information/etc-notice.do',
      },
    },
  },
  translator: {
    apiTranslateUrl: 'https://openapi.naver.com/v1/papago/n2mt',
    apiDetectUrl: 'https://openapi.naver.com/v1/papago/detectLangs',
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  bot: {
    telegram: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      maxLength: 4096,
    },
    messages: {
      start: 'Send me /subscribe to get started!',
      successSubscribe: 'Successfully subscribed. I will notify you when there is a new announcement! 😊',
      alreadySubscribe: 'You have already subscribed 👍',
      successUnsubscribe: 'Successfully unsubscribed. I will not notify you anymore 😔',
      failUnsubscribe: 'You never subscribed in the first place! 😡',
      help: 'You can use the following commands:\n/subscribe - Get notified of new announcements\n/unsubscribe - Remove notifications of new announcements\n/help - Show all commands\n/about - Explain how this bot works\n/contribute - Show the contribution guide',
      about: 'I watch the announcements from the Sejong University Board periodically.\nEverytime there is a new announcement, I will translate it to English and send it to all subscribed users.',
      contribute: 'This bot is created by @steve_immanuel. If you have any idea/feature you want to implement, you can contribute to this bot by sending me a pull request on GitHub.\ngithub.com/SteveImmanuel/sejong-crawler',
    },
  },
  system: {
    crawlInterval: process.env.CRAWL_INTERVAL,
  },
};
