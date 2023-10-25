import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const chatsPath = path.join(__dirname, "db", "chats.txt");

export function parseArgv(argv) {
  let dirFlag = false;
  const args = argv.slice(2);
  const paths = [];
  const funcs = [];
  args.forEach((e) => {
    if (e.match(/(\-u)|(\-\-unique)/)) {
      console.log("uniqueValues");
      funcs.push("uniqueValues");
    } else if (e.match(/(\-a)|(\-\-all)/)) {
      console.log("existInAllFiles");
      funcs.push("existInAllFiles");
    } else if (e.match(/(\-t)|(\-\-ten)/)) {
      console.log("existInAtleastTen");
      funcs.push("existInAtleastTen");
    } else if (e.match(/(\-d)|(\-\-director)/)) {
      dirFlag = true;
    } else {
      const filepath = path.isAbsolute(e)
        ? path.normalize(e)
        : path.join(__dirname, e);

      paths.push(filepath);
    }
  });
  return [dirFlag, paths];
}

export async function readFiles(paths, directory) {
  const filesList = [];
  const dirList = [];

  const stats = await Promise.all(paths.map((path) => fs.stat(path)));
  stats.forEach((stat, idx) => {
    if (stat.isDirectory()) {
      dirList.push(paths[idx]);
    } else if (stat.isFile()) {
      filesList.push(paths[idx]);
    }
  });
  const filesFromDir = await Promise.all(dirList.map((dir) => fs.readdir(dir)));
  filesFromDir.forEach((files, id) => {
    files.forEach((file) => {
      filesList.push(path.join(dirList[id], file));
    });
  });
  return await Promise.all(filesList.map((path) => fs.readFile(path, "utf8")));
}

export function uniqueValues(files) {
  const timeStamps = [];
  const length = files.length;
  const ten = 10;
  //   const unique = new Set();
  const count = {};
  files.forEach((file, idx) => {
    file.split("\n").forEach((value) => {
      const v = value.trim();
      if (!count[v]) {
        count[v] = new Array(length).fill(false);
      }
      count[v][idx] = true;

      //   if (unique.has(value)) {
      //     count[value] = count[value] ? count[value] + 1 : 1;
      //   } else {
      //     unique.add(value);
      //   }
    });
  });
  timeStamps.push(Date.now());
  const uniqueArr = Object.entries(count);
  const [uniqueTen, uniqueAll] = uniqueArr.reduce(
    (acc, [key, value]) => {
      const countInFiles = value.reduce((acc, e) => (e ? acc + 1 : acc), 0);
      if (countInFiles >= ten) acc[0] += 1;
      if (countInFiles === length) acc[1] += 1;
      return acc;
    },
    [0, 0]
  );
  timeStamps.push(Date.now());
  return { unique: uniqueArr.length, uniqueTen, uniqueAll, timeStamps };
}
