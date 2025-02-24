import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Current from './components/Current';
import Forecaste from './components/Forecaste';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [city, setCity] = useState('');
  const [clickedCity, setclickedCity] = useState('');
  const [citysuggesion, setcitysuggesion] = useState([]);
  const [currentwheather, setCurrent] = useState(null);
  const [forecastwheather, setforecast] = useState(null);
  const [location, setlocation] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState('');
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(true);

  const API_KEY = "cd8a745de9514efd91d64806252302";

  const WheatherURL = (city) =>
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

  const autocomURL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const fetchData = useCallback(async () => {
    if (!city || city.length <= 3) return;
    try {
      const response = await axios.get(autocomURL + city);
      const citydata = response.data.map((data) => `${data.name}, ${data.region}, ${data.country}`);
      setcitysuggesion(citydata);
    } catch (err) {
      console.error('Error fetching city suggestions:', err);
    }
  }, [city,autocomURL]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(debounceFetch);
  }, [city, fetchData]);

  const updateBackground = useCallback((currentWeather) => {
    if (!currentWeather) return;

    const condition = currentWeather.condition.text.toLowerCase();
    const isDay = currentWeather.is_day === 1;
    let newBackgroundClass = '';

    if (isDay) {
      if (condition.includes('sunny') || condition.includes('clear')) {
        newBackgroundClass = 'sunny';
      } else if (condition.includes('partly cloudy')) {
        newBackgroundClass = 'partly-cloudy';
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        newBackgroundClass = 'rainy';
      } else if (condition.includes('cloud') || condition.includes('overcast')) {
        newBackgroundClass = 'overcast';
      } else if (condition.includes('snow')) {
        newBackgroundClass = 'snowy';
      } else if (condition.includes('mist')) {
        newBackgroundClass = 'mist';
      } else {
        newBackgroundClass = 'default-day';
      }
    } else {
      if (condition.includes('clear')) {
        newBackgroundClass = 'clear-night';
      } else if (condition.includes('partly cloudy')) {
        newBackgroundClass = 'partly-cloudy-night';
      } else if (condition.includes('cloud') || condition.includes('overcast')) {
        newBackgroundClass = 'cloudy-night';
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        newBackgroundClass = 'rainy-night';
      } else if (condition.includes('snow')) {
        newBackgroundClass = 'snowy-night';
      } else if (condition.includes('mist')) {
        newBackgroundClass = 'mist-night';
      } else {
        newBackgroundClass = 'default-night';
      }
    }
    setBackgroundClass(newBackgroundClass);
  }, []);

  const fetchWheatherApi = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(WheatherURL(city));
      const resp = response.data;
      console.log("API Response:", resp);

      setCurrent(resp.current);
      setforecast(resp.forecast);
      setlocation(resp.location);
      updateBackground(resp.current);
    } catch (e) {
      console.error("Weather API error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handelSelectedCity = (city) => {
    setclickedCity(city);
    fetchWheatherApi(city);
    setcitysuggesion([]);
    setIsCitySelected(true);
    setShowFavorites(false);
  };

  const addToFavorites = () => {
    if (!clickedCity || favorites.includes(clickedCity)) return;

    const updatedFavorites = [...favorites, clickedCity];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (cityToRemove) => {
    const updatedFavorites = favorites.filter((city) => city !== cityToRemove);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    document.body.className = isCitySelected ? backgroundClass : 'default-background';
  }, [isCitySelected, backgroundClass]);

  useEffect(() => {
    if (!clickedCity.trim()) {
      setIsCitySelected(false);
      setShowFavorites(true);
    }
  }, [clickedCity]);

  return (
    <div className='container bg-transparent p-3 mb-5 text-black rounded'>
      <div className='text-center'><h4>Weather Checker</h4></div>

      {/* Input Field */}
      <div className="input-group input-group-sm mb-3">
        <input
          type="text"
          value={clickedCity}
          className="form-control"
          placeholder="Enter the city"
          onChange={(e) => {
            const inputValue = e.target.value;
            setCity(inputValue);
            setclickedCity(inputValue);

            if (!inputValue.trim()) {
              setCurrent(null);
              setforecast(null);
              setlocation(null);
              setcitysuggesion([]);
            }
          }}
        />
        <button className="btn btn-success bg-transparent btn-opacity-25 text-bold text-black" onClick={addToFavorites}>⭐ Save to Favorites</button>
      </div>

      {/* City Suggestions */}
      {citysuggesion.length > 0 && citysuggesion.map((city, index) => (
        <div
          key={index}
          className='container text-center text-black text-bold rounded bg-transparent p-2 bg-opacity-5 border border-light-subtle border-opacity-25'
          style={{ cursor: "pointer" }}
          onClick={() => handelSelectedCity(city)}
        >
          {city}
        </div>
      ))}

      {/* Favorite Cities */}
      {showFavorites && favorites.length > 0 && (
        <div className="favorites-section text-center">
          <h5>Your Favorite Cities</h5>
          {favorites.map((favCity, index) => (
            <button key={index} className="btn btn-transparent m-2 text-bold text-black bg-opacity-5" onClick={() => handelSelectedCity(favCity)}>
              {favCity}
              <span
                className="text-danger text-bold ms-4 text-size-2"
                style={{ cursor: "pointer" }}
                onClick={() => removeFavorite(favCity)}
              >
                Ⲭ
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <h5 className="text-center text-info"> Weather checker...</h5>}

      {/* Weather Components */}
      {currentwheather && <Current currentwheather={currentwheather} location={location} />}
      {forecastwheather && <Forecaste forecastwheather={forecastwheather} location={location} />}
    </div>
  );
}

export default App;
