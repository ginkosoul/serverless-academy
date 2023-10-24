const formatTime = (date) =>
  `${date.getHours().toString().padStart(2, 0)}:${date
    .getMinutes()
    .toString()
    .padStart(2, 0)}`;

const formatDate = (date) =>
  date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

export const formatData = (data, all = false) => {
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

  const weatherList = all
    ? data?.list.map(formatLine).join("\n")
    : data?.list
        .filter((_, i) => i % 2)
        .map(formatLine)
        .join("\n");

  return `${data.city.name}, ${data.city.country}
    ${weatherList}`;
};
