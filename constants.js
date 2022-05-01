module.exports = {
  scraper: {
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
  translator: {
    apiTranslateUrl: 'https://openapi.naver.com/v1/papago/n2mt',
    apiDetectUrl: 'https://openapi.naver.com/v1/papago/detectLangs',
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  bot: {
    telegram: {
      token: process.env.TELEGRAM_BOT_TOKEN,
    },
  },
};
