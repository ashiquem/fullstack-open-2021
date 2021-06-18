import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Country from './components/Country';
import CountryList from './components/CountryList';
import CountryQuery from './components/CountryQuery';

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
        setCountries(allCountries)
      })
  }, [])

  useEffect(() => {
    const country = queryResult.length === 1 ? queryResult[0] : {}
    setCountryDetail(country)
  }, [queryResult])

  const handleShowOnClick = (country) => {
    setCountryView(country);
  }

  const handleQueryOnchange = (event) => {
    const queryValue = event.target.value
    setQuery(queryValue);

    setQueryResult(queryValue ? countries.filter(country =>
      country.name.toLowerCase().search(queryValue.toLowerCase()) !== -1) : [])
  }

  const excessResultsRender = queryResult.length > 10 ? <div>Too many results, specify another filter</div> : null

  const countryListRender = queryResult.length < 10 && !countryDetail.name ?
    <CountryList countryView={countryView} onClick={handleShowOnClick} countries={queryResult}></CountryList> : null

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
