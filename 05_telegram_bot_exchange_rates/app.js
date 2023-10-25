import TelegramBot from "node-telegram-bot-api";
import { getExchangeRate, getWeather } from "./api.js";
import { formatBy, formatWeatherBy } from "./utils.js";

const token = process.env.TELEGRAM_API_KEY.trim();

const bot = new TelegramBot(token, {
  polling: true,
});

const btnMarkup = {
  main: {
    reply_markup: {
      keyboard: [["Курс валют"], ["Погода"]],
      resize_keyboard: true,
    },
  },
  exchnge: {
    reply_markup: {
      keyboard: [["USD", "EUR"], ["Попереднє меню"]],
      resize_keyboard: true,
    },
  },
  weather: {
    reply_markup: {
      keyboard: [
        ["Кожні 3 години", "Кожні 6 години"],
        ["Вітер"],
        ["Попереднє меню"],
      ],
      resize_keyboard: true,
    },
  },
  hide: {
    reply_markup: {
      remove_keyboard: true,
    },
  },
};

bot.onText(/(\/start)|(Попереднє меню)/, function (message) {
  const chatId = message.chat.id;
  bot.sendMessage(chatId, `Що будемо робити?`, btnMarkup.main);
});
bot.onText(/Курс валют/, function (message) {
  const chatId = message.chat.id;
  bot.sendMessage(chatId, "Оберіть опцію", btnMarkup.exchnge);
});
bot.onText(/Погода/, function (message) {
  const chatId = message.chat.id;
  bot.sendMessage(chatId, "Оберіть опцію", btnMarkup.weather);
});
bot.onText(/Кожні 3 години/, function (message) {
  const chatId = message.chat.id;
  getWeather().then((res) => {
    bot.sendMessage(chatId, formatWeatherBy(res, "3"), btnMarkup.hide);
  });
});
bot.onText(/Кожні 6 години/, function (message) {
  const chatId = message.chat.id;
  getWeather().then((res) => {
    bot.sendMessage(chatId, formatWeatherBy(res, "6"), btnMarkup.hide);
  });
});
bot.onText(/USD/, function (message) {
  const chatId = message.chat.id;
  getExchangeRate().then((res) => {
    bot.sendMessage(chatId, formatBy(res, "USD"), btnMarkup.hide);
  });
});
bot.onText(/EUR/, function (message) {
  const chatId = message.chat.id;
  getExchangeRate().then((res) => {
    bot.sendMessage(chatId, formatBy(res, "EUR"), btnMarkup.hide);
  });
});
