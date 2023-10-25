import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { formatData } from "./hepers.js";

let weather = null;
const chatsToUpdate = [];

const token = process.env.TELEGRAM_API_KEY.trim();

const bot = new TelegramBot(token, {
  polling: true,
});

const weatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/forecast",
  params: {
    appid: process.env.OPEN_WEATHER_API_KEY,
    units: "metric",
    q: "Kyiv",
  },
});

const getWeather = async (q) => {
  if (q) weatherApi.defaults.params.q = q;
  const { data } = await weatherApi.get();
  return data;
};

const getBtnMarkup = (isOptions = false) => {
  const btnMainMenu = [
    [{ text: "Forecast in Nice", callback_data: "forecast" }],
    [{ text: "Change City", callback_data: "city" }],
  ];
  const btnOpts = [
    [{ text: "at intervals of 3 hour", callback_data: "interval_3" }],
    [{ text: "at intervals of 6 hours", callback_data: "interval_6" }],
  ];
  return {
    reply_markup: {
      inline_keyboard: isOptions ? btnOpts : btnMainMenu,
      one_time_keyboard: false,
    },
  };
};

bot.onText(/\/start/, function (message) {
  const chatId = message.chat.id;
  getWeather().then((res) => {
    weather = res;
    bot.sendMessage(
      chatId,
      `Use this bot for Weather forecast.\nCurrent City: ${weather.city.name}`,
      getBtnMarkup()
    );
  });
});

bot.on("callback_query", handleQuery);
bot.on("message", updateCityName);

function handleQuery(query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  switch (data) {
    case "forecast":
      bot.editMessageText(`Weather in ${weather.city.name}`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: getBtnMarkup(true).reply_markup,
      });

      break;

    case "city":
      chatsToUpdate.push(chatId);
      bot.editMessageText(`Enter city name:`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {},
      });
      break;

    case "interval_3":
      bot.editMessageText(formatData(weather, true), {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {},
      });
      break;

    case "interval_6":
      bot.editMessageText(formatData(weather), {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {},
      });
      break;

    default:
      break;
  }
}

function updateCityName(message) {
  const chatId = message.chat.id;
  if (chatsToUpdate.includes(chatId)) {
    chatsToUpdate.splice(chatsToUpdate.indexOf(chatId), 1);
    getWeather(message.text)
      .then((res) => {
        weather = res;
        bot.sendMessage(
          chatId,
          `Location updated.\nCurrent City: ${weather.city.name}`,
          getBtnMarkup()
        );
      })
      .catch(() => {
        bot.sendMessage(
          chatId,
          "Something went wrong. restart the bot with /start"
        );
      });
  }
}
