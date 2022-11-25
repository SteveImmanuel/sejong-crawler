const { idToTopic } = require('./topics');
const constant = require('../constants');

const createLangIKM = (userLang) => {
  const inlineKeyboardMarkup = Object.entries(constant.languages).map((lang) => {
    let text = lang[1];
    if (lang[0] === userLang) {
      text += ' (Selected)';
    }

    return [{ text, callback_data: `lang$${lang[0]}` }];
  });

  return inlineKeyboardMarkup;
};

const createTopicsIKM = (subscriptions) => {
  const inlineKeyboardMarkup = [];
  idToTopic.forEach((topic, id) => {
    let text = topic;
    if (subscriptions.has(id)) {
      text = `✅ ${text}`;
    }

    inlineKeyboardMarkup.push([{ text, callback_data: `topic$${id}` }]);
  });

  return inlineKeyboardMarkup;
};

module.exports = { createLangIKM, createTopicsIKM };
