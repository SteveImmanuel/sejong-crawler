const TelegramBot = require('node-telegram-bot-api');
const userModel = require('../models/users');
const subscriptionModel = require('../models/subscriptions');
const constant = require('../constants');
const { idToTopic, topicToId, topics } = require('../utils/topics');
const { idToLang } = require('../utils/languages');
const { createLangIKM, createTopicsIKM } = require('../utils/bot');

const bot = new TelegramBot(constant.bot.telegram.token, { polling: true });

bot.onText(/\/help/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, constant.bot.messages.help);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/about/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, constant.bot.messages.about);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/contribute/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, constant.bot.messages.contribute);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = await userModel.getUserById(chatId);

    if (!user) {
      await userModel.addUser(msg.chat.id, `${msg.chat.first_name} ${msg.chat.last_name}`);
      await subscriptionModel.addSubscription(msg.chat.id, topicToId.get(topics[0]));
    }
    await bot.sendMessage(msg.chat.id, constant.bot.messages.start);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/status/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = await userModel.getUserById(chatId);

    if (user) {
      let subscriptions = await subscriptionModel.getSubscriptionsByUserId(chatId);
      subscriptions = subscriptions.map((x) => idToTopic.get(x.topicId));

      let response = `<b>${constant.bot.messages.statusLang}</b> ${idToLang.get(user.lang)}\n`;
      if (subscriptions.length > 0) {
        response += `<b>${constant.bot.messages.statusTopics}</b>`;
        subscriptions.forEach((topic) => {
          response += `\n- ${topic}`;
        });
      } else {
        response += constant.bot.messages.statusNoSubscriptions;
      }
      await bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
    } else {
      await bot.sendMessage(chatId, constant.bot.messages.askRegister);
    }
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/lang/, async (msg) => {
  try {
    const chatId = msg.chat.id;

    const user = await userModel.getUserById(chatId);
    if (user) {
      const inlineKeyboardMarkup = createLangIKM(user.lang);
      await bot.sendMessage(chatId, constant.bot.messages.langChoose, {
        reply_markup: { inline_keyboard: inlineKeyboardMarkup },
      });
    } else {
      await bot.sendMessage(chatId, constant.bot.messages.askRegister);
    }
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/topics/, async (msg) => {
  try {
    const chatId = msg.chat.id;

    const user = await userModel.getUserById(chatId);
    if (user) {
      let subscriptions = await subscriptionModel.getSubscriptionsByUserId(chatId);
      subscriptions = new Set(subscriptions.map((x) => x.topicId));
      const inlineKeyboardMarkup = createTopicsIKM(subscriptions);

      await bot.sendMessage(chatId, constant.bot.messages.topics, {
        reply_markup: { inline_keyboard: inlineKeyboardMarkup },
      });
    } else {
      await bot.sendMessage(chatId, constant.bot.messages.askRegister);
    }
  } catch (err) {
    console.error(err);
  }
});

bot.on('callback_query', async (query) => {
  try {
    const [type, data] = query.data.split('$');
    const userId = query.from.id;

    if (type === 'lang') {
      await userModel.updateLang(userId, data);
      const inlineKeyboardMarkup = createLangIKM(data);

      await bot.editMessageReplyMarkup(
        { inline_keyboard: inlineKeyboardMarkup },
        {
          message_id: query.message.message_id,
          chat_id: query.message.chat.id,
        },
      );
      await bot.answerCallbackQuery(query.id, { text: constant.bot.messages.langUpdate });
    } else if (type === 'topic') {
      const subscription = await subscriptionModel.getSubscriptionsByUserIdAndTopicId(userId, data);
      if (subscription) {
        await subscriptionModel.deleteSubscription(userId, data);
      } else {
        await subscriptionModel.addSubscription(userId, data);
      }

      let subscriptions = await subscriptionModel.getSubscriptionsByUserId(userId);
      subscriptions = new Set(subscriptions.map((x) => x.topicId));
      const inlineKeyboardMarkup = createTopicsIKM(subscriptions);

      await bot.editMessageReplyMarkup(
        { inline_keyboard: inlineKeyboardMarkup },
        {
          message_id: query.message.message_id,
          chat_id: query.message.chat.id,
        },
      );
      await bot.answerCallbackQuery(query.id, { text: constant.bot.messages.topicUpdate });
    }
  } catch (err) {
    console.error(err);
  }
});

bot.on('polling_error', (error) => {
  console.error(error.code);
});

module.exports = bot;
