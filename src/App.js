import React, { useState, useEffect } from "react";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              setError("Error getting geolocation: " + error.message);
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        setError("Error fetching data: " + error.message);
      }
    };

    fetchData();
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Weather data not found.");
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError("Error fetching weather: " + error.message);
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          {location.latitude && location.longitude ? (
            <div>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          ) : (
            <p>Getting your location...</p>
          )}
          {weather && (
            <div>
              <h2>Weather</h2>
              <p>Description: {weather.weather[0].description}</p>
              <p>Temperature: {weather.main.temp} °C</p>
              {/* You can display more weather data as needed */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
