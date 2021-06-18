import React from 'react';
import Country from './Country';

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

export default CountryList