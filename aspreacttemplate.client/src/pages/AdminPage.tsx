import React, { useEffect, useState } from "react";
import { getWeatherForecastAdmin } from "../api/weather";
import type { WeatherForecast } from "../api/weather";

const AdminPage = () => {
    const [data, setData] = useState<WeatherForecast[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const forecasts = await getWeatherForecastAdmin();
                setData(forecasts);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container p-4">
            <h1>Admin ahoj</h1>
            <p className="lead">Jen adminům jde zobrazit</p>
            
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">Error: {error}</p>}

            {data && (
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp (C)</th>
                            <th>Temp (F)</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((f, i) => (
                            <tr key={i}>
                                <td>{new Date(f.date).toLocaleDateString()}</td>
                                <td>{f.temperatureC}</td>
                                <td>{f.temperatureF}</td>
                                <td>{f.summary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPage;
