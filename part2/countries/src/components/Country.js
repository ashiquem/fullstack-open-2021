import React, { useState, useEffect } from 'react';
import Weather from './Weather'
import axios from 'axios'

const Country = (props) => {
  const country = props.country
  const api_key = process.env.REACT_APP_WEATHER_KEY

  const [weather,setWeather] = useState({})
  const [weatherIcon,setWeatherIcon] = useState('')

  useEffect(()=>{
    console.log(api_key);
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
    .then(response=>{
      console.log(response);
      setWeather(response.data.main)
      setWeatherIcon(response.data.weather[0].icon)
    })
    .catch((error)=>{
      console.log(`Failed to fetch weather data for ${country.capital}`,error);
    })
  },[country])

  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={`Flag for ${country.name}`} width="120px" ></img>
      <Weather weather={weather} city={country.capital} icon={weatherIcon}></Weather>
    </div>
  )
}

export default Country