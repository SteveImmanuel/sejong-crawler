const axios = require('axios');
const constant = require('../constants');

const fixNewline = (text) => text.replace(/\n\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/&nbsp;/g, ' ');
const convertToUrlEncoding = (text) => text.replace(/\n/g, '%0A').replace(/\s/g, '%20'); // space and newline

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
  try {
    const result = await postRequest(
      constant.translator.apiTranslateUrl,
      {
        source: sourceLang,
        target: targetLang,
        text,
      },
    );

    return [result?.data?.message?.result?.translatedText, true];
  } catch (error) {
    console.error('Error in API call to translator');
    console.error(error?.data?.errorMessage);
    return [text, false];
  }
};

const translateUnl = async (browser, text, targetLang = 'en', timeout = 2000) => {
  let browserPage;

  try {
    browserPage = await browser.newPage();
  } catch (error) {
    console.error('Failed new tab in translator browser');
    return [false, false];
  }

  let result;
  let success = true;

  try {
    result = fixNewline(text);
    await browserPage.goto(`https://papago.naver.com/?sk=auto&tk=${targetLang}`);

    await browserPage.waitForTimeout(timeout);
    await browserPage.keyboard.type(result);
    await browserPage.waitForTimeout(timeout);

    result = await browserPage.waitForSelector('#txtTarget');
    result = await result.evaluate((el) => {
      let translated = el.innerHTML;
      translated = translated.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
      return translated;
    });

    await browserPage.waitForTimeout(100000);
  } catch (error) {
    success = false;
    console.error(error);
  } finally {
    await browserPage.close();
  }

  return [result, success];
};

// const { startBrowser } = require('../scraper/browser');
// const worker = require('../scraper/worker');

// const test = async () => {
//   const result = await worker.scrap(worker.buildUgradApiUrl(333), new Set(), false, 2);
//   const browser = await startBrowser();
//   console.log(result[0].content);
//   const text = result[0].content;
//   const translated = await translateUnl(browser, text, 'en', 2000);
//   console.log(translated);
// };
// test();

module.exports = {
  translate, translateUnl, fixNewline, convertToUrlEncoding,
};
