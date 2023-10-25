import { parseArgv, readFiles, uniqueValues } from "./utils.js";

async function invokeAction(argv) {
  const timeStamps = [];
  timeStamps.push(Date.now());
  const [isDir, paths] = parseArgv(argv);
  const files = await readFiles(paths);
  timeStamps.push(Date.now());
  const result = uniqueValues(files);
  printResults(result, timeStamps);
}
try {
  invokeAction(process.argv);
} catch (error) {
  console.log(error);
}

// uniqueValues(); // returns 1234
// existInAllFiles(); // returns 42
// existInAtleastTen(); // returns 50

function printResults(results, times) {
  const { unique, uniqueAll, uniqueTen, timeStamps: funcTimes } = results;
  const timeStamps = [...times, ...funcTimes];
  console.log("Time to load file:", timeStamps[1] - timeStamps[0], "ms");
  console.log("Time to find unique:", timeStamps[2] - timeStamps[1], "ms");
  console.log("Time to count result:", timeStamps[3] - timeStamps[2], "ms");
  console.log("Total time:", timeStamps[3] - timeStamps[0], "ms\n");
  console.log("Total unique count:", unique);
  console.log("At list ten files count:", uniqueTen);
  console.log("Each file count:", uniqueAll);
}
// =================================================================
// node app.js ./path_to_folder
// node app.js path_tofile_1 path_tofile_2 path_tofile_3
// =================================================================

// Time to load file: 18 ms
// Time to find unique: 909 ms
// Time to count result: 74 ms
// Total time: 1001 ms

// Total unique count: 129240
// At list ten files count: 73245
// Each file count: 441
