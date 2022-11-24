const axios = require('axios');
const constant = require('../constants');
const { startBrowser } = require('../scraper/browser');

const fixNewline = (text) => text.replace(/\n\n/g, '\n').replace(/\n{3,}/g, '\n\n');
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

const translateUnl = async (text, targetLang = 'en', timeout = 2000) => {
  let browser;
  let result;

  try {
    browser = await startBrowser();
  } catch (error) {
    console.error('Failed launching browser');
    return false;
  }

  try {
    const browserPage = (await browser.pages())[0];
    const formattedText = convertToUrlEncoding(fixNewline(text));
    await browserPage.goto(`https://papago.naver.com/?sk=auto&tk=${targetLang}&st=${formattedText}`);
    await browserPage.waitForTimeout(timeout);
    result = await browserPage.waitForSelector('#txtTarget');
    result = await result.evaluate((el) => {
      let translated = el.innerHTML;
      translated = translated.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
      return translated;
    });
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
  console.log(result);
  return result;
};

// const text = '1. 할인권 구매 대상\n\n가. 신입생 및 재학생 : 당 학기 등록금을 완납한 신입생 및 재학생\n\n;
// translateUnl(text);

module.exports = { translate, translateUnl };
