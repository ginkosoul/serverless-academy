import { groupVacations } from "./utils.js";
import { readFile, writeFile } from "fs/promises";
const json = JSON.parse(
  await readFile(new URL("./data.json", import.meta.url))
);

// writeFile(new URL("./newData.json", import.meta.url), JSON.stringify(groupVacations(json), null, 2))

console.log(JSON.stringify(groupVacations(json), null, 2));
