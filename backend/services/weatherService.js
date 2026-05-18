import fetch from "node-fetch";
import { config } from "../config/config.js";

export async function getWeather(city, options = {}) {

  const targetCity = city || config.defaultCity;
  const apiKey = config.apiKey;

  if (options.mock) {
    return getMockWeather(targetCity, options.mockWeather);
  }

  if (!apiKey) {
    const err = new Error("OPENWEATHER_API is required");
    err.status = 500;
    throw err;
  }

  const url =
    `${config.weatherApi}?q=${encodeURIComponent(targetCity)}&units=metric&appid=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Failed to fetch weather data");
    err.status = res.status;
    throw err;
  }

  return {
    city: data.name,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    rain: data.weather[0].main === "Rain"
  };
}

function getMockWeather(city, scenario = "clouds") {
  const scenarios = {
    rain: {
      temp: 16,
      feelsLike: 15.2,
      humidity: 83,
      windSpeed: 3.4,
      condition: "Rain",
      description: "light rain",
      rain: true
    },
    hot: {
      temp: 31,
      feelsLike: 34.1,
      humidity: 68,
      windSpeed: 1.8,
      condition: "Clear",
      description: "clear sky",
      rain: false
    },
    cold: {
      temp: 2,
      feelsLike: -2.5,
      humidity: 48,
      windSpeed: 4.5,
      condition: "Snow",
      description: "light snow",
      rain: false
    },
    wind: {
      temp: 13,
      feelsLike: 10.4,
      humidity: 50,
      windSpeed: 7.2,
      condition: "Clouds",
      description: "windy clouds",
      rain: false
    },
    humid: {
      temp: 27,
      feelsLike: 30.3,
      humidity: 82,
      windSpeed: 1.2,
      condition: "Clouds",
      description: "humid clouds",
      rain: false
    }
  };

  const selected = scenarios[scenario] || {
    temp: 18,
    feelsLike: 17.4,
    humidity: 62,
    windSpeed: 2.1,
    condition: "Clouds",
    description: "few clouds",
    rain: false
  };

  return {
    city,
    ...selected
  };
}
