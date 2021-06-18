import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

const CountryQuery = (props) => {
  return (
    <div>
      find countries <input onChange={props.onChange} value={props.value}></input>
    </div>
  )
}

const CountryList = (props) => {
  const countries = props.countries;
  const countryView = props.countryView;
  return (
    <div>
      {countries.map(country =>
        countryView && countryView.name === country.name ?
          <Country key={country.name} country={countryView}></Country> :
          <p key={country.name}>{country.name} <button onClick={() => props.onClick(country)}>show</button></p>
      )}
    </div>
  )
}

const Country = (props) => {
  const country = props.country
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
    </div>
  )
}

const App = () => {

  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [queryResult, setQueryResult] = useState([])
  const [countryDetail, setCountryDetail] = useState({})
  const [countryView, setCountryView] = useState({})

  useEffect(() => {
    axios.get(`https://restcountries.eu/rest/v2/all/`)
      .then(response => {
        const allCountries = response.data
        console.log(allCountries)
        setCountries(allCountries)
      })
  }, [])

  useEffect(() => {
    const country = queryResult.length === 1 ? queryResult[0] : {}
    setCountryDetail(country)
  }, [queryResult])

  console.log('current countries:', countries, query);

  const handleShowOnClick = (country) => {
    console.log(`${country.name} clicked`);
    setCountryView(country);
  }

  const handleQueryOnchange = (event) => {
    const queryValue = event.target.value
    setQuery(queryValue);

    const filteredResults = queryValue ? countries.filter(country =>
      country.name.toLowerCase().search(queryValue.toLowerCase()) !== -1) : []
    setQueryResult(filteredResults)
  }

  const excessResultsRender = queryResult.length > 10 ? <div>Too many results, specify another filter</div> : null

  const countryListRender = queryResult.length < 10 && !countryDetail.name ? <CountryList countryView={countryView} onClick={handleShowOnClick} countries={queryResult}></CountryList> : null

  const countryDetailRender = countryDetail.name ? <Country country={countryDetail}></Country> : null

  return (
    <div>
      <CountryQuery onChange={handleQueryOnchange} value={query}></CountryQuery>
      {excessResultsRender}
      {countryListRender}
      {countryDetailRender}
    </div>
  );
}

export default App;
