// src/api/weather.ts

import { http } from "./http";

export interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export const getWeatherForecast = () => http.get<WeatherForecast[]>("/weatherforecast");

export const getWeatherForecastAdmin = () =>
    http.get<WeatherForecast[]>("/weatherforecast/admin"); // match route if needed
