const axios = require('axios');
const constant = require('../constants');

const postRequest = async (url, body, config = {}) => axios.post(
  url,
  body,
  {
    headers: {
      'X-Naver-Client-Id': constant.translator.clientId,
      'X-Naver-Client-Secret': constant.translator.clientSecret,
    },
    ...config,
  },
);

const translate = async (text, sourceLang = 'ko', targetLang = 'en') => {
  const result = await postRequest(
    constant.translator.apiTranslateUrl,
    {
      source: sourceLang,
      target: targetLang,
      text,
    },
  );

  return result?.data?.message?.result?.translatedText;
};

module.exports = { translate };