import NodeCache from "node-cache";

const urls = [
  "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11",
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
  "https://api.monobank.ua/bank/currency",
];

const weatherURL = "https://api.openweathermap.org/data/2.5/forecast?";

const CACHE_KEY = "currency";

const cache = new NodeCache();

export async function getExchangeRate() {
  if (!cache.has(CACHE_KEY)) {
    const responces = await Promise.allSettled(
      urls.map((url) => fetch(url, { method: "GET" }))
    );
    const data = await Promise.all(
      responces.map((r) => (r.status === "fulfilled" ? r.value.json() : null))
    );
    const [privat, privatCash, mono] = data;
    cache.set(
      CACHE_KEY,
      {
        privat,
        privatCash,
        mono: formatMono(mono),
      },
      60
    );
  }
  return cache.get(CACHE_KEY);
}

function formatMono(data) {
  const currency = { 840: "USD", 980: "UAH", 978: "EUR" };

  if (!Array.isArray(data)) return [];

  return data.slice(0, 2).map((rate) => ({
    ccy: currency[rate.currencyCodeA],
    base_ccy: currency[rate.currencyCodeB],
    buy: String(rate.rateBuy),
    sale: String(rate.rateSell),
  }));
}

export async function getWeather(q = "Kyiv") {
  if (!cache.has(q)) {
    const params = new URLSearchParams({
      appid: process.env.OPEN_WEATHER_API_KEY,
      units: "metric",
      q,
    });
    const res = await fetch(weatherURL + params, { method: "GET" });
    if (res.status === 200) {
      const data = await res.json();
      const key = data.city.name;
      cache.set(key, data, 600);
    } else {
      return;
    }
  }
  return cache.get(q);
}
