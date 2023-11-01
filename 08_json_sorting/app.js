const baseUrl = "https://jsonbase.com/sls-team/";
const endPoints = [
  "json-793",
  "json-955",
  "json-231",
  "json-931",
  "json-93",
  "json-342",
  "json-770",
  "json-491",
  "json-281",
  "json-718",
  "json-310",
  "json-806",
  "json-469",
  "json-258",
  "json-516",
  "json-79",
  "json-706",
  "json-521",
  "json-350",
  "json-64",
];

const totalCount = { True: 0, False: 0 };

const constructor = (count, endPoint) =>
  fetch(baseUrl + endPoint)
    .catch((rej) => (count < 0 ? rej : constructor(count - 1, endPoint)))
    .then((res) =>
      res.status === 200 || count < 0 ? res : constructor(count - 1, endPoint)
    );
const responses = await Promise.allSettled(
  endPoints.map((endPoint) => constructor(3, endPoint))
);

responses.forEach((response, index) => {
  if (response.status === 200) {
    response.json().then((json) => {
      JSON.stringify(json)
        .match(
          /[\'\"]?isDone[\'\"]?\s*:\s*[\'\"]?(([Tt]rue)|([Ff]alse))[\'\"]?/gi
        )
        .forEach((result) => {
          if (result.match(/[Tt]rue/)) {
            totalCount.True += 1;
            console.log(
              "response",
              `[Success] ${baseUrl}${endPoints[index]}: isDone - True`
            );
          } else {
            totalCount.False += 1;
            console.log(
              "response",
              `[Success] ${baseUrl}${endPoints[index]}: isDone - False`
            );
          }
        });
    });
  } else {
    console.log(
      `[Fail] ${baseUrl}${endPoints[index]}: The endpoint is unavailable`
    );
  }
});

console.log("Found True values: ", totalCount.True);
console.log("Found False values: ", totalCount.False);
