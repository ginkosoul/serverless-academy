import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const chatsPath = path.join(__dirname, "db", "chats.txt");

async function getChats() {
  try {
    const data = await fs.readFile(chatsPath, "utf-8");
    const chats = JSON.parse(data);
    if (chats && Array.isArray(chats)) return chats;
    return [];
  } catch (error) {
    return [];
  }
}

async function getLastChatId() {
  const chatList = await getChats();
  return chatList.pop()?.id || null;
}

async function addChat(newChats) {
  const chatList = await getChats();
  if (chatList.length) {
    const chats = chatList.filter(
      (chat) => !newChats.some((el) => el.id === chat.id)
    );
    chats.push(...newChats);
    await fs.writeFile(chatsPath, JSON.stringify(chatList));
    return chats;
  }
  await fs.writeFile(chatsPath, JSON.stringify(newChats));
  return newChats || null;
}

export { getChats, addChat, getLastChatId };
