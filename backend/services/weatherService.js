import fetch from "node-fetch";
import { config } from "../config/config.js";

export async function getWeather(city) {

  const targetCity = city || config.defaultCity;

  const url =
    `${config.weatherApi}?q=${targetCity}&units=metric&appid=${config.apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    city: data.name,
    temp: data.main.temp,
    condition: data.weather[0].main,
    rain: data.weather[0].main === "Rain"
  };
}