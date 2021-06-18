import React from 'react'

const Weather = (props) => {
  const weather = props.weather
  const city = props.city
  const weatherIcon = props.icon ? <img width='80' src={`https://openweathermap.org/img/wn/${props.icon}@2x.png`} alt='weather icon'></img>
    : null

  const weatherRender = props.weather.temp ?
    <div>
      <h2>Weather in {city}</h2>
      <p>{weatherIcon} {weather.temp} °C</p>
      <p>Feels like {weather.feels_like} °C</p>
      <p>Humidity: {weather.humidity}%</p>
    </div> : 
    <div>
      <h3>Weather data is unavailable for {city}</h3>
    </div>

  return (
    weatherRender
  )
}

export default Weather