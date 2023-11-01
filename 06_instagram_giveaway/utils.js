import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const getCount = createCount();

export function parseArgv(argv) {
  const args = argv.slice(2);
  const paths = [];
  const funcs = [];
  args.forEach((e) => {
    if (e.match(/(\-u)|(\-\-unique)/)) {
      funcs.push(uniqueValues);
    } else if (e.match(/(\-a)|(\-\-all)/)) {
      funcs.push(existInAllFiles);
    } else if (e.match(/(\-t)|(\-\-ten)/)) {
      funcs.push(existInAtleastTen);
    } else {
      const filepath = path.isAbsolute(e)
        ? path.normalize(e)
        : path.join(__dirname, e);

      paths.push(filepath);
    }
  });
  return [funcs, paths];
}

export async function readFiles(paths) {
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

function createCount() {
  const count = {};
  return (files) => {
    if (Object.keys(count).length) return count;
    const length = files.length;
    files.forEach((file, idx) => {
      file.forEach((value) => {
        const v = value.trim();
        if (!count[v]) {
          count[v] = new Array(length).fill(false);
        }
        count[v][idx] = true;
      });
    });
    return count;
  };
}

export function uniqueValues(files) {
  const count = getCount(files);

  return `Total unique count: ${Object.keys(count).length}`;
}

export function existInAllFiles(files) {
  const length = files.length;
  const count = getCount(files);

  const uniqueArr = Object.values(count);
  const existInAll = uniqueArr.reduce((acc, value) => {
    const countInFiles = value.reduce((acc, e) => (e ? acc + 1 : acc), 0);
    if (countInFiles === length) return acc + 1;
    return acc;
  }, 0);

  return `At list ten files count: ${existInAll}`;
}

export function existInAtleastTen(files) {
  const ten = 10;
  const count = getCount(files);
  const uniqueArr = Object.values(count);
  const uniqueTen = uniqueArr.reduce((acc, value) => {
    const countInFiles = value.reduce((acc, e) => (e ? acc + 1 : acc), 0);
    if (countInFiles >= ten) return acc + 1;
    return acc;
  }, 0);

  return `Exist in all files: ${uniqueTen}`;
}
