// function formatMessage(data) {
//   const banks = {
//     privat: "Приват24",
//     privatCash: "Приват24 готівка",
//     mono: "Монобанк",
//   };
//   console.log(Object.entries(data));

//   return Object.entries(data)
//     .map(
//       ([key, value]) =>
//         `${banks[key]}:\n${value
//           ?.map(
//             (rate) =>
//               `${rate.ccy}:${rate.base_ccy} - ${rate.buy.padStart(8, " ")} | ${
//                 rate.sale
//               }`
//           )
//           .join("\n")}\n`
//     )
//     .join("\n");
// }

const banks = {
  privat: "Приват24",
  privatCash: "Приват24 готівка",
  mono: "Монобанк",
};

export function formatBy(data, currency) {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${banks[key]}:\n${value
          ?.filter(({ ccy }) => ccy === currency)
          .map(
            (rate) =>
              `${rate.buy.slice(0, 5).padStart(8, " ")}   |   ${rate.sale}`
          )
          .join("\n")}\n`
    )
    .join("\n");
}

function formatTime(date) {
  return `${date.getHours().toString().padStart(2, 0)}:${date
    .getMinutes()
    .toString()
    .padStart(2, 0)}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}

export function formatWeatherBy(data, format = "3") {
  let currentDate = null;

  const formatLine = (weather) => {
    const date = new Date(weather.dt * 1000);
    if (currentDate === date.getDate()) {
      return `${formatTime(date)} - ${weather.main.temp}° ${
        weather.weather[0].description
      }`;
    } else {
      currentDate = date.getDate();
      return `${formatDate(date)}\n${formatTime(date)} - ${
        weather.main.temp
      }° ${weather.weather[0].description}`;
    }
  };

  const weatherList =
    format === "3"
      ? data?.list.map(formatLine).join("\n")
      : data?.list
          .filter((_, i) => i % 2)
          .map(formatLine)
          .join("\n");

  return `${data.city.name}, ${data.city.country}
      ${weatherList}`;
}
