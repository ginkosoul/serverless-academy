import { parseArgv, readFiles } from "./utils.js";

async function invokeAction(argv) {
  const timeStamps = [];
  timeStamps.push(Date.now());
  const [funcs, paths] = parseArgv(argv);
  const data = await readFiles(paths);
  timeStamps.push(Date.now());
  console.log(
    "Time to load file:",
    timeStamps[timeStamps.length - 1] - timeStamps[timeStamps.length - 2],
    "ms"
  );
  const files = data.map((file) => file.split("\n"));
  funcs.forEach((callback) => {
    const result = callback(files);
    timeStamps.push(Date.now());
    const time =
      timeStamps[timeStamps.length - 1] - timeStamps[timeStamps.length - 2];
    console.log(`${result} in ${time} ms`);
  });
}
try {
  invokeAction(process.argv);
} catch (error) {
  console.log(error);
}

// =================================================================
// node app.js -u -t -a ./data
// -u, --unique - uniqueValues(); // returns 1234
// -a, --all - existInAllFiles(); // returns 42
// -t, --ten - existInAtleastTen(); // returns 50
// =================================================================

// Time to load file: 37 ms
// Total unique count: 129240 in 1031 ms
// At list ten files count: 73245 in 97 ms
// Exist in all files count: 441 in 101 ms
