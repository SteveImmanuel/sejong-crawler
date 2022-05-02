const TelegramBot = require('node-telegram-bot-api');
const userModel = require('../models/users');
const constant = require('../constants');

const bot = new TelegramBot(constant.bot.telegram.token, { polling: true });

bot.onText(/\/subscribe/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = await userModel.getUserById(chatId);

    if (user) {
      if (user.isSubscribed) {
        await bot.sendMessage(chatId, constant.bot.messages.alreadySubscribe);
      } else {
        await userModel.updateSubscription(chatId, true);
        await bot.sendMessage(chatId, constant.bot.messages.successSubscribe);
      }
    } else {
      await userModel.addUser(chatId, `${msg.chat.first_name} ${msg.chat.last_name}`);
      await bot.sendMessage(chatId, constant.bot.messages.successSubscribe);
    }
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/unsubscribe/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = await userModel.getUserById(chatId);

    if (user) {
      await userModel.updateSubscription(chatId, false);
      await bot.sendMessage(chatId, constant.bot.messages.successUnsubscribe);
    } else {
      await bot.sendMessage(chatId, constant.bot.messages.failUnsubscribe);
    }
  } catch (err) {
    console.error(err);
  }
});

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
    await bot.sendMessage(msg.chat.id, constant.bot.messages.start);
  } catch (err) {
    console.error(err);
  }
});

bot.on('polling_error', (error) => {
  console.error(error.code);
});

module.exports = bot;
