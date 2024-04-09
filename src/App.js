import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [temperatureInCelsius, setTemperatureInCelsius] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              fetchWeather(latitude, longitude);
              fetchPlaces(latitude, longitude);
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
      const temperatureCelsius = data.main.temp - 273.15;
      setTemperatureInCelsius(temperatureCelsius.toFixed(2));
    } catch (error) {
      setError("Error fetching weather: " + error.message);
    }
  };

  const fetchPlaces = async (lat, lon) => {
    try {
      const searchParams = new URLSearchParams({
        query: "temple",
        ll: `${lat},${lon}`,
        open_now: "true",
        sort: "DISTANCE",
      });

      const results = await fetch(
        `https://api.foursquare.com/v3/places/search?${searchParams}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: process.env.REACT_APP_PLACES_API_KEY,
          },
        }
      );
      if (!results.ok) {
        throw new Error("Places data not found.");
      }
      const data = await results.json();
      setPlaces(data.results);
    } catch (error) {
      setError("Error fetching places: " + error.message);
    }
  };

  return (
    <div className="container">
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          {location.latitude && location.longitude ? (
            <div>
              <p className="location">Latitude: {location.latitude}</p>
              <p className="location">Longitude: {location.longitude}</p>
            </div>
          ) : (
            <p className="loading">Getting your location...</p>
          )}
          {weather && (
            <div>
              <h2 className="weather-title">Weather</h2>
              <p className="weather-description">
                Description: {weather.weather[0].description}
              </p>
              <p className="weather-temperature">
                Temperature: {temperatureInCelsius} °C
              </p>
            </div>
          )}
          {places.length > 0 && (
            <div>
              <h2 className="places-title">Nearby Places</h2>
              <ul className="places-list">
                {places.map((place) => (
                  <li key={place.id} className="place-item">
                    {place.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
