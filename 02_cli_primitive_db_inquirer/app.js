import inquirer from "inquirer";
import { addUser, getUsersByName, listUsers } from "./users.js";

const users = [];

const questions = [
  {
    type: "input",
    name: "name",
    message: "Enter the user's name. To cancel, press Enter:",
  },
  {
    type: "list",
    name: "gender",
    message: "Choose a gender:",
    choices: ["male", "female"],
    default: "male",
  },
  {
    type: "input",
    name: "age",
    message: "Enter the user's age:",
    validate(value) {
      const age = Number(value);
      const valid = Number.isInteger(age) && age > 0 && age <= 100;
      return valid || "Please enter correct age(1 - 100)";
    },
    filter: Number,
  },
  {
    type: "list",
    name: "action",
    message: "Choose action:",
    choices: ["List All user", "Search for users", "Add users", "Exit"],
    default: "Add user",
  },
  {
    type: "input",
    name: "search",
    message: "Enter the user's name. To cancel, press Enter:",
  },
];

async function ask(callback) {
  return inquirer.prompt(questions.slice(0, 1)).then(({ name }) => {
    const username = name.trim();
    if (username) {
      return callback(username);
    } else {
      return askSearchDetails();
    }
  });
}

function askUsersDetails(name) {
  inquirer
    .prompt(questions.slice(1, -2))
    .then((answers) => {
      answers.name = name;
      console.log("Type of age", typeof answers.age);
      return addUser(answers);
    })
    .then(() => {
      ask(askUsersDetails);
    });
}

function askSearchDetails() {
  const q = questions[3];
  inquirer.prompt(q).then((answers) => {
    if (answers.action === q.choices[0]) {
      listUsers().then((users) => {
        console.table(users);
        askSearchDetails();
      });
    } else if (answers.action === q.choices[1]) {
      ask(getUsersByName).then((users) => {
        console.table(users);
        askSearchDetails();
      });
    } else if (answers.action === q.choices[2]) {
      ask(askUsersDetails);
    } else {
      return;
    }
  });
}

ask(askUsersDetails);
