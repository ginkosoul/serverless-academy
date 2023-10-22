#!usr/bin/env node
const readline = require("readline");

const state = Object.freeze({
  data: "DATA",
  options: "OPTIONS",
  next: "NEXT",
  exit: "EXIT",
  clear: "CLEAR",
});

let currentState = state.data;

const data = [];
const options = ["exit", "1", "2", "3", "4", "5", "6"];

const messages = {
  greatings: `Hello. `,
  readData: "Enter ten words or digits separated by spaces:\n",
  options: [
    "1 - Sort words alphabetically",
    "2 - Show numbers from lesser to greater",
    "3 - Show numbers from bigger to smaller",
    "4 - Display words in ascending order by number of letters in the word",
    "5 - Show only unique words",
    "6 - Display only unique values from the set of words and numbers entered by the user",
  ],
  exit: "exit - To exit the program, the user need to enter exit",
  incorect: "Incorect choice. Try again.",
  next: ["1 - Show options", "2 - Add data"],
  dataExists: ["1 - Append data", "2 - Overwrite data"],
  goodBye: "Goodbye. Come back later.",
  choose: "Choose an option and press enter:",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(messages.greatings + messages.readData);
rl.on("line", readData);

function readData(input) {
  switch (currentState) {
    case state.data:
      currentState = collectData(input);
      break;
    case state.options:
      currentState = runProgram(options.indexOf(input.trim().toLowerCase()));
      break;
    case state.next:
      currentState = playAgain(options.indexOf(input.trim().toLowerCase()));
      break;
    case state.clear:
      currentState = clearData(options.indexOf(input.trim().toLowerCase()));
      break;

    default:
      console.log("something went wrong");
      break;
  }
  printNextMessage(currentState, rl);
}

function collectData(input) {
  data.push(...input.split(/\s+/));
  return state.options;
}

function runProgram(options) {
  switch (options) {
    case 0:
      console.log(messages.goodBye);
      return state.exit;

    case 1:
      console.log("You choose", messages.options[0].slice(3));
      console.log(
        data
          .map((el) => (Number.isNaN(Number(el)) ? el : Number(el)))
          .filter((el) => typeof el === "string")
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      );
      return state.next;

    case 2:
      console.log("You choose", messages.options[1].slice(3));
      console.log(
        data
          .map((el) => (Number.isNaN(Number(el)) ? el : Number(el)))
          .filter((el) => typeof el === "number")
          .sort((a, b) => a - b)
      );
      return state.next;

    case 3:
      console.log("You choose", messages.options[2].slice(3));
      console.log(
        data
          .map((el) => (Number.isNaN(Number(el)) ? el : Number(el)))
          .filter((el) => typeof el === "number")
          .sort((a, b) => b - a)
      );
      return state.next;

    case 4:
      console.log("You choose", messages.options[3].slice(3));
      console.log(
        data
          .map((el) => (Number.isNaN(Number(el)) ? el : Number(el)))
          .filter((el) => typeof el === "string")
          .sort((a, b) => a.length - b.length)
      );
      return state.next;

    case 5:
      console.log("You choose", messages.options[4].slice(3));
      console.log([
        ...new Set(
          data
            .map((el) => (Number.isNaN(Number(el)) ? el : Number(el)))
            .filter((el) => typeof el === "string")
        ),
      ]);
      return state.next;

    case 6:
      console.log("You choose", messages.options[4].slice(3));
      console.log([...new Set(data)]);
      return state.next;

    default:
      console.log(messages.incorect);
      return state.options;
  }
}

function clearData(options) {
  switch (options) {
    case 0:
      console.log(messages.goodBye);
      return state.exit;
    case 1:
      console.log("You choose", messages.options[0]);
      return state.data;
    case 2:
      console.log("You choose", messages.options[1]);
      return state.data;
    default:
      console.log(messages.incorect);
      return state.clear;
  }
}

function playAgain(options) {
  switch (options) {
    case 0:
      console.log(messages.goodBye);
      return state.exit;
    case 1:
      console.log("You choose", messages.next[0].slice(3));
      return state.options;
    case 2:
      console.log("You choose", messages.next[1].slice(3));
      return state.clear;
    default:
      console.log(messages.incorect);
      return state.next;
  }
}

function printNextMessage(currentState, rl) {
  console.log();
  switch (currentState) {
    case state.data:
      [messages.readData].forEach((e) => console.log(e));
      break;
    case state.options:
      [messages.choose, ...messages.options, messages.exit].forEach((e) =>
        console.log(e)
      );
      break;
    case state.next:
      [messages.choose, ...messages.next, messages.exit].forEach((e) =>
        console.log(e)
      );
      break;
    case state.clear:
      [messages.choose, ...messages.dataExists, messages.exit].forEach((e) =>
        console.log(e)
      );
      break;
    case state.exit:
      [messages.goodBye].forEach(console.log);
      rl.close();
      process.exit(0);
    default:
      console.log("Something went wrong");
      break;
  }
}
