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
      topics: {
        987: {
          apiUrl: 'https://graduate.sejong.ac.kr/graduate/information/notice.do',
          name: 'General Notice (공지) - Graduate',
        },
        988: {
          apiUrl: 'https://graduate.sejong.ac.kr/graduate/information/etc-notice.do',
          name: 'Employment (취업) - Graduate',
        },
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
      start: '🫡 Ok, I am ready to notify you of all new announcements. You can send me:\n/status to get your subscription details\n/topics to update the announcement topics you want to subscribe to\n/lang to select your preferred language',
      topics: '🫠 Select all the topics you want to subscribe to:',
      help: 'You can use the following commands:\n/start - Get started\n/status - See your current subscription details\n/lang - Set your preferred language\n/topics - Set all the topics you want to subscribe\n/contribute - Show the contribution guide\n/about - See how this bot works',
      about: '😎 I monitor the announcements from the Sejong University Board periodically.\nEverytime there is a new announcement, I will translate it to your preferred language and send it to you',
      contribute: 'This bot is created by @steve_immanuel 👋. If you have any idea/feature you want to implement, you can contribute to this bot by sending a pull request on GitHub.\ngithub.com/SteveImmanuel/sejong-crawler\n\nIf you have any questions, you can contact at:\nKakao: @steveimm\nLine: @steve_immanuel3',
      langChoose: '🌎 Select one of the languages below:',
      langUpdate: 'Language successfully selected 👌',
      topicUpdate: 'Topics successfully updated 👌',
      askRegister: 'You have not registered yet. Please send me /start 🥺',
      statusLang: 'Language:',
      statusTopics: 'Below are the topics you are subscribed to:',
      noSubscription: 'You are not subscribed to any topics 😓\nPlease use /topics to subscribe',
    },
  },
  system: {
    crawlInterval: process.env.CRAWL_INTERVAL,
  },
  languages: {
    ko: '🇰🇷 Korean',
    en: '🇬🇧 English',
    id: '🇲🇨 Indonesian',
    vi: '🇻🇳 Vietnamese',
    'zh-CN': '🇨🇳 Chinese',
    fr: '🇫🇷 France',
    ja: '🇯🇵 Japanese',
  },
};
