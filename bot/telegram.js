const TelegramBot = require('node-telegram-bot-api');
const userModel = require('../models/users');
const constant = require('../constants');

const bot = new TelegramBot(constant.bot.telegram.token, { polling: true });

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  await userModel.addUser(msg.chat.id, `${msg.chat.first_name} ${msg.chat.last_name}`);
  bot.sendMessage(chatId, msg.text);
});

bot.onText(/test/, async (msg) => {
  const chatId = msg.chat.id;
  const all = await userModel.getAllSubscribedUsers();
  console.log(all);
  bot.sendMessage(chatId, msg.text);
});

module.exports = bot;
