import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const usersPath = path.join(__dirname, "db", "users.txt");

async function listUsers() {
  const data = await fs.readFile(usersPath, "utf-8");
  const users = JSON.parse(data);
  if (users && Array.isArray(users)) return users;
  throw Error("No users loaded");
}

async function getUsersByName(text) {
  const username = text.trim().toLowerCase();
  const userList = await listUsers();
  const users = userList.filter(({ name }) =>
    name.toLowerCase().includes(username)
  );
  return users || [];
}

async function addUser(newUser) {
  const userList = await listUsers();
  userList.push(newUser);
  await fs.writeFile(usersPath, JSON.stringify(userList, null, 2));
  return newUser || null;
}

export { listUsers, addUser, getUsersByName };
