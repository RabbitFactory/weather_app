import { useEffect, useState } from "react";
import Loader from './Loader/Loader';
import { Player } from "@lottiefiles/react-lottie-player";
import './App.css'

// Lottie animation imports
import sunAnimation from './assets/Sun burst weather icon.json';
import snowAnimation from './assets/Let it snow.json';
import rainAnimation from './assets/Weather-storm.json';
import thunderAnimation from './assets/Weather-thunder.json';
import windAnimation from './assets/Wind.json';
import cloudAnimation from './assets/Weather-mist.json'; // <-- Add a cloudy animation if you have one

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.70&longitude=90.38&current_weather=true&hourly=weathercode,windspeed_10m')
      .then(res => res.json())
      .then((data) => {
        setWeather({
          ...data.current_weather,
          weathercode: data.hourly.weathercode[0],
          windspeed: data.hourly.windspeed_10m[0]
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getWeatherCondition = () => {
    if (!weather) return "";

    const { weathercode, windspeed } = weather;
    const isWindy = windspeed > 20;
    let condition = "";

    if (weathercode === 0) condition = "Sunny";
    else if (weathercode <= 3) condition = "Cloudy";
    else if (weathercode >= 45 && weathercode <= 48) condition = "Foggy";
    else if (weathercode >= 51 && weathercode <= 67) condition = "Rainy";
    else if (weathercode >= 71 && weathercode <= 77) condition = "Snowy";
    else if (weathercode >= 80 && weathercode <= 82) condition = "Rain Showers";
    else if (weathercode >= 95) condition = "Thunderstorm";
    else condition = "Unknown";

    if (isWindy) {
      return `${condition} and Windy`;
    }

    return condition;
  };

  const condition = getWeatherCondition();

  const getAnimation = () => {
    if (!weather) return;

    const { weathercode, windspeed } = weather;
    const isWindy = windspeed > 20;

    if (weathercode === 0) return isWindy ? windAnimation : sunAnimation;
    if (weathercode <= 3) return isWindy ? windAnimation : cloudAnimation;
    if (weathercode >= 45 && weathercode <= 48) return cloudAnimation;
    if (weathercode >= 51 && weathercode <= 67) return rainAnimation;
    if (weathercode >= 71 && weathercode <= 77) return snowAnimation;
    if (weathercode >= 80 && weathercode <= 82) return rainAnimation;
    if (weathercode >= 95) return thunderAnimation;

    return;
  };

  return (
    <>
      <h1>Rabbit's Weather App</h1>
      {loading ? (
        <div className="loader-container"><Loader /></div>
      ) : (
        <div className="weather-container">
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Condition: {condition}</p>
          <div className="weather-animation">
            <Player
              autoplay
              loop
              src={getAnimation()}
              style={{ height: 200, width: 200 }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
