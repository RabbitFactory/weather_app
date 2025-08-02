import { useEffect, useState } from "react"

const App = () => {

  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.70&longitude=90.38&current_weather=true')
    .then(res => res.json())
    .then((data) => {
      setWeather(data.current_weather)
      setLoading(false);
    })
    .catch(err => console.log(err));
  },[])

  return (
    <>
      <h1>Weather app</h1>
      {loading ? "Loading" : weather.temperature}
    </>
  )
}

export default App;