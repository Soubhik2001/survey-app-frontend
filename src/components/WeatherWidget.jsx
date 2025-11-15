import { useState } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const response = await axios.get(`http://localhost:5001/api/weather?city=${city}`);
      setWeather(response.data);
    } catch (err) {
      setError('Failed to get weather. City may not be found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Implements the "Ride or Not" logic
  const getRideRecommendation = (forecast) => {
    if (!forecast) return '';
    const maxTemp = forecast.temperature_2m_max[0];
    const weatherCode = forecast.weathercode[0];
    if (maxTemp < 5) return "Don't Ride (Too Cold)";
    if (weatherCode >= 60) return "Don't Ride (Rain/Snow/Thunder)";
    return "It's a Good Day for a Ride!";
  };

  return (
    <div className="card">
      <h4>Weather & Ride Forecast</h4>
      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? '...' : 'Get Forecast'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      {weather && (
        <div style={{ marginTop: '15px' }}>
          <h3>3-Day Forecast for {weather.city}</h3>
          <h4 style={{ color: getRideRecommendation(weather.forecast).includes("Don't") ? 'var(--red)' : 'green' }}>
            Recommendation: {getRideRecommendation(weather.forecast)}
          </h4>
          <ul className="forecast-container">
            {weather.forecast.time.map((day, index) => (
              <li key={day} className="forecast-card">
                <strong>{new Date(day).toLocaleString(undefined, { weekday: 'short' })}</strong><br />
                <div className="temps">
                  Max: {weather.forecast.temperature_2m_max[index]}°C<br />
                  Min: {weather.forecast.temperature_2m_min[index]}°C
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;