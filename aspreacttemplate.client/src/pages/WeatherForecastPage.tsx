// src/pages/WeatherForecastPage.tsx

import React, { useEffect, useState } from "react";
import { getWeatherForecast } from "../api/weather";
import type { WeatherForecast } from "../api/weather";


const WeatherForecastPage = () => {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getWeatherForecast();
                setForecasts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="container p-4">
            <h1>Weather forecast</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">Error: {error}</p>}
            {!loading && !error && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp (C)</th>
                            <th>Temp (F)</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecasts.map((forecast, i) => (
                            <tr key={i}>
                                <td>{new Date(forecast.date).toLocaleDateString()}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WeatherForecastPage;
