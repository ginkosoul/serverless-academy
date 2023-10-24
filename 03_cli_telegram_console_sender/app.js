import { Command } from "commander";
import TelegramBot from "node-telegram-bot-api";
import { addChat, getLastChatId } from "./chats.js";
// import fs from "fs";

const program = new Command();
program
  .option("-m, --message <string>", "send a message")
  .option("-p, --photo <path>", "send a photo");

program.parse(process.argv);
const argv = program.opts();

const token = process.env.TELEGRAM_API;
const bot = new TelegramBot(token);

async function getChatId() {
  const updates = await bot.getUpdates({ offset: -1 });

  if (updates.length) {
    const uniqueChats = [];
    for (const update of updates) {
      if (!uniqueChats.some((el) => el.id === update.message.chat.id))
        uniqueChats.push(update.message.chat);
    }
    await addChat(uniqueChats);
    return uniqueChats.pop().id;
  } else {
    console.log("Useless message: ");
    return await getLastChatId();
  }
}

async function invokeAction({ message, photo }) {
  const chatId = await getChatId();

  if (chatId) {
    if (message) {
      await bot.sendMessage(chatId, message);
      bot.get;
    }
    if (photo) {
      //   const stream = fs.createReadStream(photo);
      await bot.sendPhoto(chatId, photo);
    }
  } else {
    console.log("There is no chat");
  }
}

try {
  await invokeAction(argv);
} catch (error) {
  console.log("error Occured");
} finally {
  process.exit(0);
}
